import fs from "node:fs"
import path from "node:path"

const DATA_ROOT = path.join(process.cwd(), "data")

export interface Project {
  slug: string
  title: string
  category: "professional" | "labs"
  tagline: string
  description: string
  story: string
  stack: string[]
  status?: string
  links?: { label: string; href: string }[]
  axiomComment: string
}

export function getProjects(): Project[] {
  return JSON.parse(fs.readFileSync(path.join(DATA_ROOT, "projects.json"), "utf-8"))
}

export function getProfessionalProjects(): Project[] {
  return getProjects().filter((p) => p.category === "professional")
}

export function getLabsProjects(): Project[] {
  return getProjects().filter((p) => p.category === "labs")
}

export function getHeroSlides() {
  return getProjects().map((p) => ({
    slug: p.slug,
    title: p.title,
    tagline: p.tagline,
    category: p.category,
    axiomComment: p.axiomComment,
  }))
}

export function getSuggestedPrompts(): string[] {
  return JSON.parse(fs.readFileSync(path.join(DATA_ROOT, "suggested-prompts.json"), "utf-8"))
}
