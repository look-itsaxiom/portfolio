import { Router } from "express"
import {
  listMarkdownFiles,
  readMarkdownWithFrontmatter,
  writeMarkdownWithFrontmatter,
  deleteMarkdownFile,
} from "../lib/markdown.js"
import { revalidate } from "../lib/revalidate.js"

export const devlogRouter = Router()

devlogRouter.get("/", (_req, res) => {
  const files = listMarkdownFiles("devlog")
  const entries = files.map((file) => {
    const slug = file.replace(/\.md$/, "")
    const { frontmatter } = readMarkdownWithFrontmatter("devlog", file)
    return { slug, title: frontmatter.title, date: frontmatter.date, summary: frontmatter.summary }
  })
  res.json(entries)
})

devlogRouter.get("/:slug", (req, res) => {
  try {
    const { frontmatter, body, raw } = readMarkdownWithFrontmatter("devlog", `${req.params.slug}.md`)
    res.json({ slug: req.params.slug, frontmatter, body, raw })
  } catch {
    res.status(404).json({ error: "Not found" })
  }
})

devlogRouter.put("/:slug", (req, res) => {
  const { frontmatter, body } = req.body
  if (!frontmatter || body === undefined) {
    res.status(400).json({ error: "frontmatter and body are required" })
    return
  }
  writeMarkdownWithFrontmatter("devlog", `${req.params.slug}.md`, frontmatter, body)
  revalidate(["/devlog", `/devlog/${req.params.slug}`])
  res.json({ ok: true, slug: req.params.slug })
})

devlogRouter.delete("/:slug", (req, res) => {
  deleteMarkdownFile("devlog", `${req.params.slug}.md`)
  revalidate(["/devlog", `/devlog/${req.params.slug}`])
  res.json({ ok: true })
})
