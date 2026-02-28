const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""
const EMBED_MODEL = process.env.EMBED_MODEL || "gemini-embedding-001"

export async function getEmbedding(text: string): Promise<number[]> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: { parts: [{ text }] } }),
      signal: AbortSignal.timeout(30000),
    }
  )

  if (!res.ok) {
    throw new Error(`Gemini embedding failed: ${res.status}`)
  }

  const data = await res.json()
  return data.embedding.values
}

export async function isEmbeddingAvailable(): Promise<boolean> {
  return !!GEMINI_API_KEY
}
