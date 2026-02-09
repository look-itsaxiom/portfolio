import { Router } from "express"
import { isQdrantAvailable } from "../lib/qdrant.js"
import { isOllamaAvailable } from "../lib/ollama.js"

export const healthRouter = Router()

healthRouter.get("/", async (_req, res) => {
  const [qdrant, ollama] = await Promise.all([isQdrantAvailable(), isOllamaAvailable()])

  res.json({
    status: "ok",
    qdrant: qdrant ? "ok" : "error",
    ollama: ollama ? "ok" : "error",
    adminSecret: process.env.ADMIN_SECRET ? "configured" : "missing",
  })
})
