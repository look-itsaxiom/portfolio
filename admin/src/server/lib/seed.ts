import fs from "node:fs"
import path from "node:path"
import { getEmbedding } from "./ollama.js"
import { deleteCollection, createCollection, upsertPointsBatch } from "./qdrant.js"
import type { SeedStatus } from "../../types/index.js"

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data")

export const seedStatus: SeedStatus = {
  running: false,
  progress: 0,
  message: "idle",
}

interface KnowledgeChunk {
  text: string
  source: string
  category: string
  file: string
}

function getMarkdownFiles(dir: string): string[] {
  const files: string[] = []
  if (!fs.existsSync(dir)) return files
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry)
    if (fs.statSync(fullPath).isDirectory()) {
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

export async function runSeed() {
  if (seedStatus.running) {
    throw new Error("Seed already running")
  }

  seedStatus.running = true
  seedStatus.progress = 0
  seedStatus.message = "Starting seed..."
  seedStatus.error = undefined
  seedStatus.startedAt = new Date().toISOString()
  seedStatus.completedAt = undefined

  try {
    const knowledgeDir = path.join(DATA_DIR, "knowledge")
    const files = getMarkdownFiles(knowledgeDir)

    if (files.length === 0) {
      throw new Error("No knowledge files found in " + knowledgeDir)
    }

    seedStatus.message = `Found ${files.length} knowledge files`
    seedStatus.progress = 5

    // Parse all chunks
    const allChunks: KnowledgeChunk[] = []
    for (const file of files) {
      const content = fs.readFileSync(file, "utf-8")
      const chunks = chunkText(content)
      const source = path.relative(knowledgeDir, file).replace(/\.md$/, "").replace(/\\/g, "/")
      const category = categorize(file)

      for (const text of chunks) {
        allChunks.push({ text, source, category, file: source })
      }
    }

    seedStatus.message = `Generated ${allChunks.length} chunks`
    seedStatus.progress = 10

    // Get first embedding to determine dimension
    seedStatus.message = "Generating embeddings..."
    const firstEmbedding = await getEmbedding(allChunks[0].text)
    const dimension = firstEmbedding.length

    seedStatus.message = `Embedding dimension: ${dimension}. Recreating collection...`
    seedStatus.progress = 15

    // Recreate collection
    await deleteCollection()
    await createCollection(dimension)

    seedStatus.progress = 20

    // Generate embeddings and upsert in batches
    const batchSize = 10
    let id = 1
    const totalBatches = Math.ceil(allChunks.length / batchSize)

    for (let i = 0; i < allChunks.length; i += batchSize) {
      const batchNum = Math.floor(i / batchSize) + 1
      seedStatus.message = `Processing batch ${batchNum}/${totalBatches}...`
      seedStatus.progress = 20 + Math.round((batchNum / totalBatches) * 75)

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
              file: chunk.file,
              tags: [] as string[],
            },
          }
        })
      )

      await upsertPointsBatch(points)
    }

    seedStatus.progress = 100
    seedStatus.message = `Done! Seeded ${id - 1} knowledge chunks`
    seedStatus.completedAt = new Date().toISOString()
  } catch (err) {
    seedStatus.error = err instanceof Error ? err.message : String(err)
    seedStatus.message = "Seed failed"
  } finally {
    seedStatus.running = false
  }
}
