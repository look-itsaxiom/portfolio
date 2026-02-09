import { Router } from "express"
import {
  listMarkdownFiles,
  readMarkdownWithFrontmatter,
  writeMarkdownWithFrontmatter,
  deleteMarkdownFile,
} from "../lib/markdown.js"

export const labsRouter = Router()

labsRouter.get("/", (_req, res) => {
  const files = listMarkdownFiles("labs")
  const entries = files.map((file) => {
    const slug = file.replace(/\.md$/, "")
    const { frontmatter } = readMarkdownWithFrontmatter("labs", file)
    return { slug, title: frontmatter.title, summary: frontmatter.summary }
  })
  res.json(entries)
})

labsRouter.get("/:slug", (req, res) => {
  try {
    const { frontmatter, body, raw } = readMarkdownWithFrontmatter("labs", `${req.params.slug}.md`)
    res.json({ slug: req.params.slug, frontmatter, body, raw })
  } catch {
    res.status(404).json({ error: "Not found" })
  }
})

labsRouter.put("/:slug", (req, res) => {
  const { frontmatter, body } = req.body
  if (!frontmatter || body === undefined) {
    res.status(400).json({ error: "frontmatter and body are required" })
    return
  }
  writeMarkdownWithFrontmatter("labs", `${req.params.slug}.md`, frontmatter, body)
  res.json({ ok: true, slug: req.params.slug })
})

labsRouter.delete("/:slug", (req, res) => {
  deleteMarkdownFile("labs", `${req.params.slug}.md`)
  res.json({ ok: true })
})
