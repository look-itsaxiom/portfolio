import { Router } from "express"
import { isQdrantAvailable } from "../lib/qdrant.js"
import { isEmbeddingAvailable } from "../lib/ollama.js"

export const healthRouter = Router()

healthRouter.get("/", async (_req, res) => {
  const [qdrant, embedding] = await Promise.all([isQdrantAvailable(), isEmbeddingAvailable()])

  res.json({
    status: "ok",
    qdrant: qdrant ? "ok" : "error",
    gemini: embedding ? "ok" : "unconfigured",
    adminSecret: process.env.ADMIN_SECRET ? "configured" : "missing",
  })
})
