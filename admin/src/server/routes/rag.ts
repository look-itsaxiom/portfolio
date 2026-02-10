import { Router } from "express"
import { listPoints, getPoint, upsertPoint, deletePoint, searchPoints, getCollectionStats } from "../lib/qdrant.js"
import { getEmbedding } from "../lib/ollama.js"
import { runSeed, seedStatus } from "../lib/seed.js"

export const ragRouter = Router()

ragRouter.get("/stats", async (_req, res) => {
  try {
    const stats = await getCollectionStats()
    res.json(stats)
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" })
  }
})

ragRouter.get("/entries", async (req, res) => {
  try {
    const offsetRaw = req.query.offset
    const offset = offsetRaw ? parseInt(String(offsetRaw), 10) : null
    const limit = Math.min(parseInt(String(req.query.limit || "20"), 10), 100)
    const result = await listPoints(offset, limit)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" })
  }
})

ragRouter.get("/entries/:id", async (req, res) => {
  try {
    const point = await getPoint(parseInt(req.params.id, 10))
    if (!point) {
      res.status(404).json({ error: "Not found" })
      return
    }
    res.json(point)
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" })
  }
})

ragRouter.post("/entries", async (req, res) => {
  try {
    const { text, source, category } = req.body
    if (!text || !source || !category) {
      res.status(400).json({ error: "text, source, and category are required" })
      return
    }

    const vector = await getEmbedding(text)
    const id = Math.floor(Math.random() * 2_000_000_000)

    await upsertPoint(id, vector, {
      text,
      source,
      category,
      timestamp: new Date().toISOString(),
      tags: [],
    })

    res.json({ ok: true, id })
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" })
  }
})

ragRouter.put("/entries/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    const { text, source, category } = req.body
    if (!text) {
      res.status(400).json({ error: "text is required" })
      return
    }

    const vector = await getEmbedding(text)
    const existing = await getPoint(id)
    const payload = {
      ...existing?.payload,
      text,
      source: source || existing?.payload?.source,
      category: category || existing?.payload?.category,
      timestamp: new Date().toISOString(),
    }

    await upsertPoint(id, vector, payload)
    res.json({ ok: true, id })
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" })
  }
})

ragRouter.delete("/entries/:id", async (req, res) => {
  try {
    await deletePoint(parseInt(req.params.id, 10))
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" })
  }
})

ragRouter.post("/search", async (req, res) => {
  try {
    const { query, limit } = req.body
    if (!query) {
      res.status(400).json({ error: "query is required" })
      return
    }

    const vector = await getEmbedding(query)
    const results = await searchPoints(vector, limit || 5)
    res.json(results)
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" })
  }
})

ragRouter.post("/seed", async (_req, res) => {
  if (seedStatus.running) {
    res.status(409).json({ error: "Seed already running" })
    return
  }

  // Start seed in background
  runSeed().catch(() => {})
  res.json({ ok: true, message: "Seed started" })
})

ragRouter.get("/seed/status", (_req, res) => {
  res.json(seedStatus)
})
