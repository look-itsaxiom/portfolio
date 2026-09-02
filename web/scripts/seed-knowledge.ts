import { readFileSync, readdirSync, statSync } from "fs"
import { join, relative } from "path"
import { getEmbedding } from "../src/lib/embeddings"

const QDRANT_URL = process.env.QDRANT_URL || "http://localhost:6333"
const COLLECTION = process.env.QDRANT_COLLECTION || "ask-axiom-knowledge"

interface KnowledgeChunk {
  text: string
  source: string
  category: string
  metadata: {
    file: string
    tags: string[]
  }
}

function getMarkdownFiles(dir: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    if (statSync(fullPath).isDirectory()) {
      files.push(...getMarkdownFiles(fullPath))
    } else if (entry.endsWith(".md")) {
      files.push(fullPath)
    }
  }
  return files
}

function chunkText(text: string, maxChunkSize = 500): string[] {
  const sections = text.split(/\n## /)
  const chunks: string[] = []

  for (const section of sections) {
    const trimmed = section.trim()
    if (!trimmed) continue

    if (trimmed.length <= maxChunkSize) {
      chunks.push(trimmed)
    } else {
      // Split by paragraphs
      const paragraphs = trimmed.split(/\n\n+/)
      let current = ""
      for (const para of paragraphs) {
        if ((current + "\n\n" + para).length > maxChunkSize && current) {
          chunks.push(current.trim())
          current = para
        } else {
          current = current ? current + "\n\n" + para : para
        }
      }
      if (current.trim()) chunks.push(current.trim())
    }
  }

  return chunks
}

function categorize(filePath: string): string {
  if (filePath.includes("professional")) return "professional"
  if (filePath.includes("labs")) return "labs"
  if (filePath.includes("meta")) return "meta"
  return "general"
}

function sourceFromPath(filePath: string, knowledgeDir: string): string {
  return relative(knowledgeDir, filePath).replace(/\.md$/, "").replace(/\\/g, "/")
}

// The embedder decides the vector width. If the live collection was built with a
// different model (e.g. the old 3072-dim Gemini vectors), it MUST be dropped and
// rebuilt or every upsert fails on a dimension mismatch.
async function ensureCollection(dimension: number) {
  const check = await fetch(`${QDRANT_URL}/collections/${COLLECTION}`)
  if (check.ok) {
    const data = await check.json()
    const existing =
      data.result?.config?.params?.vectors?.size ??
      data.result?.config?.params?.vectors?.[""]?.size ??
      null
    if (existing !== null && existing !== dimension) {
      console.log(
        `Collection "${COLLECTION}" exists with dimension ${existing}, but embeddings are ${dimension}-dim. Recreating...`
      )
    } else {
      console.log(`Collection "${COLLECTION}" already exists, recreating for a clean seed...`)
    }
    const del = await fetch(`${QDRANT_URL}/collections/${COLLECTION}`, { method: "DELETE" })
    if (!del.ok) {
      throw new Error(`Failed to delete collection: ${await del.text()}`)
    }
  }

  // Create collection
  const res = await fetch(`${QDRANT_URL}/collections/${COLLECTION}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      vectors: {
        size: dimension,
        distance: "Cosine",
      },
    }),
  })

  if (!res.ok) {
    throw new Error(`Failed to create collection: ${await res.text()}`)
  }

  console.log(`Collection "${COLLECTION}" created (dimension: ${dimension})`)
}

async function upsertPoints(
  points: { id: number; vector: number[]; payload: Record<string, unknown> }[]
) {
  const res = await fetch(`${QDRANT_URL}/collections/${COLLECTION}/points`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ points }),
  })

  if (!res.ok) {
    throw new Error(`Failed to upsert points: ${await res.text()}`)
  }
}

async function main() {
  const knowledgeDir = join(__dirname, "..", "data", "knowledge")
  const files = getMarkdownFiles(knowledgeDir)

  console.log(`Found ${files.length} knowledge files`)

  // Parse all chunks
  const allChunks: KnowledgeChunk[] = []
  for (const file of files) {
    const content = readFileSync(file, "utf-8")
    const chunks = chunkText(content)
    const source = sourceFromPath(file, knowledgeDir)
    const category = categorize(file)

    for (const text of chunks) {
      allChunks.push({
        text,
        source,
        category,
        metadata: {
          file: source,
          tags: [],
        },
      })
    }
  }

  console.log(`Generated ${allChunks.length} chunks`)

  // Get first embedding to determine dimension
  console.log("Generating embeddings...")
  const firstEmbedding = await getEmbedding(allChunks[0].text)
  const dimension = firstEmbedding.length
  console.log(`Embedding dimension: ${dimension}`)

  // Create collection
  await ensureCollection(dimension)

  // Generate embeddings and upsert in batches
  const batchSize = 10
  let id = 1

  for (let i = 0; i < allChunks.length; i += batchSize) {
    const batch = allChunks.slice(i, i + batchSize)
    const points = await Promise.all(
      batch.map(async (chunk) => {
        const vector =
          i === 0 && batch.indexOf(chunk) === 0
            ? firstEmbedding
            : await getEmbedding(chunk.text)

        return {
          id: id++,
          vector,
          payload: {
            text: chunk.text,
            source: chunk.source,
            category: chunk.category,
            timestamp: new Date().toISOString(),
            ...chunk.metadata,
          },
        }
      })
    )

    await upsertPoints(points)
    console.log(`Upserted batch ${Math.floor(i / batchSize) + 1} (${points.length} points)`)
  }

  console.log(`Done! Seeded ${id - 1} knowledge chunks into "${COLLECTION}"`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
