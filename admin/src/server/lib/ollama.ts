const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434"
const EMBED_MODEL = process.env.OLLAMA_MODEL || "nomic-embed-text"

export async function getEmbedding(text: string): Promise<number[]> {
  const res = await fetch(`${OLLAMA_URL}/api/embed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: EMBED_MODEL, input: text }),
    signal: AbortSignal.timeout(30000),
  })

  if (!res.ok) {
    throw new Error(`Ollama embedding failed: ${res.status}`)
  }

  const data = await res.json()
  return data.embeddings[0]
}

export async function isOllamaAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`, {
      signal: AbortSignal.timeout(3000),
    })
    return res.ok
  } catch {
    return false
  }
}
