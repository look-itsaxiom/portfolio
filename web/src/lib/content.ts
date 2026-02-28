import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

const DATA_ROOT = path.join(process.cwd(), "data")

type Link = { label: string; href: string }

export type ProjectEntry = {
  slug: string
  title: string
  summary: string
  category: "professional" | "labs"
  role?: string
  impact?: string[]
  status?: string
  stack: string[]
  tags: string[]
  links?: Link[]
}

export type DevlogEntry = {
  slug: string
  title: string
  date: string
  summary: string
  tags: string[]
  related: string[]
}

function readDir(dir: string) {
  const full = path.join(DATA_ROOT, dir)
  return fs.readdirSync(full).filter((f) => f.endsWith(".md"))
}

function readMarkdown(dir: string, filename: string) {
  const full = path.join(DATA_ROOT, dir, filename)
  const raw = fs.readFileSync(full, "utf-8")
  const { data, content } = matter(raw)
  return { data, content }
}

export function getAllProjects(): ProjectEntry[] {
  return readDir("projects").map((file) => {
    const slug = file.replace(/\.md$/, "")
    const { data } = readMarkdown("projects", file)
    return {
      slug,
      title: data.title,
      summary: data.summary,
      category: data.category ?? "labs",
      role: data.role,
      impact: data.impact,
      status: data.status,
      stack: data.stack ?? [],
      tags: data.tags ?? [],
      links: data.links,
    }
  })
}

export function getProjectBySlug(slug: string) {
  const { data, content } = readMarkdown("projects", `${slug}.md`)
  return {
    slug,
    content,
    title: data.title,
    summary: data.summary,
    category: data.category ?? "labs",
    role: data.role,
    impact: data.impact,
    status: data.status,
    stack: data.stack ?? [],
    tags: data.tags ?? [],
    links: data.links,
  } as ProjectEntry & { content: string }
}

export function getAllDevlog(): DevlogEntry[] {
  return readDir("devlog").map((file) => {
    const slug = file.replace(/\.md$/, "")
    const { data } = readMarkdown("devlog", file)
    return {
      slug,
      title: data.title,
      date: data.date,
      summary: data.summary,
      tags: data.tags ?? [],
      related: data.related ?? [],
    }
  })
}

export function getDevlogBySlug(slug: string) {
  const { data, content } = readMarkdown("devlog", `${slug}.md`)
  return { slug, content, ...data } as DevlogEntry & { content: string }
}
