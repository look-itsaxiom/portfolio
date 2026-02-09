import { Router } from "express"
import { readJsonArray, writeJsonArray } from "../lib/json-file.js"
import { revalidate } from "../lib/revalidate.js"
import type { Exhibit } from "../../types/index.js"

export const exhibitsRouter = Router()

exhibitsRouter.get("/", (_req, res) => {
  res.json(readJsonArray<Exhibit>("exhibits.json"))
})

exhibitsRouter.get("/:slug", (req, res) => {
  const exhibits = readJsonArray<Exhibit>("exhibits.json")
  const exhibit = exhibits.find((e) => e.slug === req.params.slug)
  if (!exhibit) {
    res.status(404).json({ error: "Not found" })
    return
  }
  res.json(exhibit)
})

exhibitsRouter.put("/:slug", (req, res) => {
  const exhibits = readJsonArray<Exhibit>("exhibits.json")
  const idx = exhibits.findIndex((e) => e.slug === req.params.slug)
  const exhibit = { ...req.body, slug: req.params.slug } as Exhibit

  if (idx >= 0) {
    exhibits[idx] = exhibit
  } else {
    exhibits.push(exhibit)
  }

  writeJsonArray("exhibits.json", exhibits)
  revalidate(["/"])
  res.json({ ok: true, slug: req.params.slug })
})

exhibitsRouter.delete("/:slug", (req, res) => {
  const exhibits = readJsonArray<Exhibit>("exhibits.json")
  const filtered = exhibits.filter((e) => e.slug !== req.params.slug)
  writeJsonArray("exhibits.json", filtered)
  revalidate(["/"])
  res.json({ ok: true })
})

exhibitsRouter.patch("/reorder", (req, res) => {
  const { slugs } = req.body
  if (!Array.isArray(slugs)) {
    res.status(400).json({ error: "slugs array is required" })
    return
  }
  const exhibits = readJsonArray<Exhibit>("exhibits.json")
  const reordered = slugs
    .map((slug: string) => exhibits.find((e) => e.slug === slug))
    .filter(Boolean) as Exhibit[]

  for (const e of exhibits) {
    if (!slugs.includes(e.slug)) reordered.push(e)
  }

  writeJsonArray("exhibits.json", reordered)
  revalidate(["/"])
  res.json({ ok: true })
})
