import { Router } from "express"
import {
  listMarkdownFiles,
  readMarkdownWithFrontmatter,
  writeMarkdownWithFrontmatter,
  deleteMarkdownFile,
} from "../lib/markdown.js"

export const impactRouter = Router()

impactRouter.get("/", (_req, res) => {
  const files = listMarkdownFiles("impact")
  const entries = files.map((file) => {
    const slug = file.replace(/\.md$/, "")
    const { frontmatter } = readMarkdownWithFrontmatter("impact", file)
    return { slug, title: frontmatter.title, summary: frontmatter.summary }
  })
  res.json(entries)
})

impactRouter.get("/:slug", (req, res) => {
  try {
    const { frontmatter, body, raw } = readMarkdownWithFrontmatter("impact", `${req.params.slug}.md`)
    res.json({ slug: req.params.slug, frontmatter, body, raw })
  } catch {
    res.status(404).json({ error: "Not found" })
  }
})

impactRouter.put("/:slug", (req, res) => {
  const { frontmatter, body } = req.body
  if (!frontmatter || body === undefined) {
    res.status(400).json({ error: "frontmatter and body are required" })
    return
  }
  writeMarkdownWithFrontmatter("impact", `${req.params.slug}.md`, frontmatter, body)
  res.json({ ok: true, slug: req.params.slug })
})

impactRouter.delete("/:slug", (req, res) => {
  deleteMarkdownFile("impact", `${req.params.slug}.md`)
  res.json({ ok: true })
})
