import { Router } from "express"
import { readJsonArray, writeJsonArray } from "../lib/json-file.js"
import { revalidate } from "../lib/revalidate.js"
import type { Project } from "../../types/index.js"

export const projectsRouter = Router()

projectsRouter.get("/", (_req, res) => {
  res.json(readJsonArray<Project>("projects.json"))
})

projectsRouter.get("/:slug", (req, res) => {
  const projects = readJsonArray<Project>("projects.json")
  const project = projects.find((p) => p.slug === req.params.slug)
  if (!project) {
    res.status(404).json({ error: "Not found" })
    return
  }
  res.json(project)
})

projectsRouter.put("/:slug", (req, res) => {
  const projects = readJsonArray<Project>("projects.json")
  const idx = projects.findIndex((p) => p.slug === req.params.slug)
  const project = { ...req.body, slug: req.params.slug } as Project

  if (idx >= 0) {
    projects[idx] = project
  } else {
    projects.push(project)
  }

  writeJsonArray("projects.json", projects)
  revalidate(["/", "/impact", "/labs"])
  res.json({ ok: true, slug: req.params.slug })
})

projectsRouter.delete("/:slug", (req, res) => {
  const projects = readJsonArray<Project>("projects.json")
  const filtered = projects.filter((p) => p.slug !== req.params.slug)
  writeJsonArray("projects.json", filtered)
  revalidate(["/", "/impact", "/labs"])
  res.json({ ok: true })
})

projectsRouter.patch("/reorder", (req, res) => {
  const { slugs } = req.body
  if (!Array.isArray(slugs)) {
    res.status(400).json({ error: "slugs array is required" })
    return
  }
  const projects = readJsonArray<Project>("projects.json")
  const reordered = slugs
    .map((slug: string) => projects.find((p) => p.slug === slug))
    .filter(Boolean) as Project[]

  // Append any projects not in the slugs array
  for (const p of projects) {
    if (!slugs.includes(p.slug)) reordered.push(p)
  }

  writeJsonArray("projects.json", reordered)
  revalidate(["/", "/impact", "/labs"])
  res.json({ ok: true })
})
