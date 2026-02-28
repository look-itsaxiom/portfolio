const QDRANT_URL = process.env.QDRANT_URL || "http://localhost:6333"
const COLLECTION = process.env.QDRANT_COLLECTION || "ask-axiom-knowledge"
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""
const EMBED_MODEL = process.env.EMBED_MODEL || "gemini-embedding-001"
const SIMILARITY_THRESHOLD = 0.65

export interface RagResult {
  text: string
  source: string
  score: number
}

export async function getEmbedding(text: string): Promise<number[]> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: { parts: [{ text }] } }),
      signal: AbortSignal.timeout(10000),
    }
  )

  if (!res.ok) {
    throw new Error(`Gemini embedding failed: ${res.status} ${await res.text()}`)
  }

  const data = await res.json()
  return data.embedding.values
}

export async function searchKnowledge(
  query: string,
  limit = 3
): Promise<RagResult[]> {
  const embedding = await getEmbedding(query)

  const res = await fetch(`${QDRANT_URL}/collections/${COLLECTION}/points/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      vector: embedding,
      limit,
      score_threshold: SIMILARITY_THRESHOLD,
      with_payload: true,
    }),
    signal: AbortSignal.timeout(5000),
  })

  if (!res.ok) {
    throw new Error(`Qdrant search failed: ${res.status}`)
  }

  const data = await res.json()
  return (data.result || []).map(
    (hit: { payload: { text: string; source: string }; score: number }) => ({
      text: hit.payload.text,
      source: hit.payload.source,
      score: hit.score,
    })
  )
}

export async function storeKnowledge(
  text: string,
  source: string,
  category: string
): Promise<void> {
  const embedding = await getEmbedding(text)

  // Generate a random ID
  const id = Math.floor(Math.random() * 2_000_000_000)

  const res = await fetch(`${QDRANT_URL}/collections/${COLLECTION}/points`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      points: [
        {
          id,
          vector: embedding,
          payload: {
            text,
            source,
            category,
            timestamp: new Date().toISOString(),
          },
        },
      ],
    }),
    signal: AbortSignal.timeout(10000),
  })

  if (!res.ok) {
    console.error(`Failed to store knowledge: ${res.status}`)
  }
}

export async function isCollectionSeeded(): Promise<boolean> {
  try {
    const res = await fetch(
      `${QDRANT_URL}/collections/${COLLECTION}`,
      { signal: AbortSignal.timeout(3000) }
    )
    if (!res.ok) return false
    const data = await res.json()
    return (data.result?.points_count ?? 0) > 0
  } catch {
    return false
  }
}

export async function isRagAvailable(): Promise<boolean> {
  try {
    if (!GEMINI_API_KEY) return false
    const qdrant = await fetch(`${QDRANT_URL}/collections`, {
      signal: AbortSignal.timeout(3000),
    })
    return qdrant.ok
  } catch {
    return false
  }
}
