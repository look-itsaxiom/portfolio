// Local embeddings via Ollama (CPU) — no external API key, no metered quota.
// Shared by the RAG search path and the seed script.
const OLLAMA_URL = process.env.OLLAMA_URL || "http://ollama:11434"
const EMBED_MODEL = process.env.EMBED_MODEL || "nomic-embed-text"

export async function getEmbedding(text: string): Promise<number[]> {
  const res = await fetch(`${OLLAMA_URL}/api/embed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: EMBED_MODEL, input: text }),
    signal: AbortSignal.timeout(30000),
  })

  if (!res.ok) {
    throw new Error(`Embedding failed: ${res.status} ${await res.text()}`)
  }

  const data = await res.json()
  const vector = data?.embeddings?.[0]
  if (!Array.isArray(vector) || vector.length === 0) {
    throw new Error("Embedding failed: empty vector in response")
  }
  return vector as number[]
}

// Cheap liveness probe: the model list is served from disk, costs nothing.
export async function isEmbeddingAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`, {
      signal: AbortSignal.timeout(2000),
    })
    return res.ok
  } catch {
    return false
  }
}
