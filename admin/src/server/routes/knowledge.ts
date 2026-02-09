import { Router } from "express"
import {
  listMarkdownFilesRecursive,
  readPlainMarkdown,
  writePlainMarkdown,
  deleteMarkdownFile,
  getFileStats,
} from "../lib/markdown.js"

export const knowledgeRouter = Router()

knowledgeRouter.get("/", (_req, res) => {
  const files = listMarkdownFilesRecursive("knowledge")
  const entries = files.map((relPath) => {
    const pathNoExt = relPath.replace(/\.md$/, "")
    const category = relPath.includes("professional/")
      ? "professional"
      : relPath.includes("labs/")
        ? "labs"
        : relPath.includes("meta")
          ? "meta"
          : "general"
    const stats = getFileStats("knowledge", relPath)
    return { path: pathNoExt, category, size: stats?.size ?? 0, modified: stats?.modified }
  })
  res.json(entries)
})

// Use wildcard to support nested paths like professional/integration-platform
// Express 4 uses req.params[0] for wildcard matches
knowledgeRouter.get("/*", (req, res) => {
  const filePath = (req.params as unknown as Record<number, string>)[0]
  if (!filePath) { res.status(400).json({ error: "path required" }); return }
  try {
    const content = readPlainMarkdown("knowledge", filePath)
    res.json({ path: filePath, content })
  } catch {
    res.status(404).json({ error: "Not found" })
  }
})

knowledgeRouter.put("/*", (req, res) => {
  const filePath = (req.params as unknown as Record<number, string>)[0]
  if (!filePath) { res.status(400).json({ error: "path required" }); return }
  const { content } = req.body
  if (content === undefined) {
    res.status(400).json({ error: "content is required" })
    return
  }
  writePlainMarkdown("knowledge", filePath, content)
  res.json({ ok: true, path: filePath })
})

knowledgeRouter.delete("/*", (req, res) => {
  const filePath = (req.params as unknown as Record<number, string>)[0]
  if (!filePath) { res.status(400).json({ error: "path required" }); return }
  deleteMarkdownFile("knowledge", filePath + ".md")
  res.json({ ok: true })
})
