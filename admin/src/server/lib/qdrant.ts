const QDRANT_URL = process.env.QDRANT_URL || "http://localhost:6333"
const COLLECTION = process.env.QDRANT_COLLECTION || "ask-axiom-knowledge"

export interface QdrantPoint {
  id: number
  vector?: number[]
  payload: Record<string, unknown>
  score?: number
}

export async function getCollectionStats() {
  const res = await fetch(`${QDRANT_URL}/collections/${COLLECTION}`, {
    signal: AbortSignal.timeout(5000),
  })
  if (!res.ok) throw new Error(`Qdrant error: ${res.status}`)
  const data = await res.json()
  return {
    pointsCount: data.result?.points_count ?? 0,
    status: data.result?.status ?? "unknown",
  }
}

export async function listPoints(offset: number | null = null, limit = 20): Promise<{ points: QdrantPoint[]; total: number; next_page_offset: number | null }> {
  const stats = await getCollectionStats()

  const res = await fetch(`${QDRANT_URL}/collections/${COLLECTION}/points/scroll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      offset,
      limit,
      with_payload: true,
      with_vector: false,
    }),
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`Qdrant scroll error: ${res.status}`)
  const data = await res.json()

  return {
    points: (data.result?.points || []).map((p: { id: number; payload: Record<string, unknown> }) => ({
      id: p.id,
      payload: p.payload,
    })),
    total: stats.pointsCount,
    next_page_offset: data.result?.next_page_offset ?? null,
  }
}

export async function getPoint(id: number): Promise<QdrantPoint | null> {
  const res = await fetch(`${QDRANT_URL}/collections/${COLLECTION}/points/${id}`, {
    signal: AbortSignal.timeout(5000),
  })
  if (!res.ok) {
    if (res.status === 404) return null
    throw new Error(`Qdrant error: ${res.status}`)
  }
  const data = await res.json()
  return { id: data.result.id, payload: data.result.payload }
}

export async function upsertPoint(id: number, vector: number[], payload: Record<string, unknown>) {
  const res = await fetch(`${QDRANT_URL}/collections/${COLLECTION}/points`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      points: [{ id, vector, payload }],
    }),
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`Qdrant upsert error: ${res.status}`)
}

export async function deletePoint(id: number) {
  const res = await fetch(`${QDRANT_URL}/collections/${COLLECTION}/points/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ points: [id] }),
    signal: AbortSignal.timeout(5000),
  })
  if (!res.ok) throw new Error(`Qdrant delete error: ${res.status}`)
}

export async function searchPoints(vector: number[], limit = 5): Promise<QdrantPoint[]> {
  const res = await fetch(`${QDRANT_URL}/collections/${COLLECTION}/points/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      vector,
      limit,
      with_payload: true,
    }),
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`Qdrant search error: ${res.status}`)
  const data = await res.json()
  return (data.result || []).map((hit: { id: number; payload: Record<string, unknown>; score: number }) => ({
    id: hit.id,
    payload: hit.payload,
    score: hit.score,
  }))
}

export async function deleteCollection() {
  const res = await fetch(`${QDRANT_URL}/collections/${COLLECTION}`, {
    method: "DELETE",
    signal: AbortSignal.timeout(5000),
  })
  if (!res.ok && res.status !== 404) throw new Error(`Qdrant delete collection error: ${res.status}`)
}

export async function createCollection(dimension: number) {
  const res = await fetch(`${QDRANT_URL}/collections/${COLLECTION}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      vectors: { size: dimension, distance: "Cosine" },
    }),
    signal: AbortSignal.timeout(5000),
  })
  if (!res.ok) throw new Error(`Qdrant create collection error: ${res.status}`)
}

export async function upsertPointsBatch(
  points: { id: number; vector: number[]; payload: Record<string, unknown> }[]
) {
  const res = await fetch(`${QDRANT_URL}/collections/${COLLECTION}/points`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ points }),
    signal: AbortSignal.timeout(30000),
  })
  if (!res.ok) throw new Error(`Qdrant batch upsert error: ${res.status}`)
}

export async function isQdrantAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${QDRANT_URL}/collections`, {
      signal: AbortSignal.timeout(3000),
    })
    return res.ok
  } catch {
    return false
  }
}
