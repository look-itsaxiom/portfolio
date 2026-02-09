import { Router } from "express"
import { readJsonArray, writeJsonArray } from "../lib/json-file.js"

export const promptsRouter = Router()

promptsRouter.get("/", (_req, res) => {
  res.json(readJsonArray<string>("suggested-prompts.json"))
})

promptsRouter.put("/", (req, res) => {
  const { prompts } = req.body
  if (!Array.isArray(prompts)) {
    res.status(400).json({ error: "prompts array is required" })
    return
  }
  writeJsonArray("suggested-prompts.json", prompts)
  res.json({ ok: true })
})
