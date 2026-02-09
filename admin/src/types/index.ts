export interface Project {
  slug: string
  title: string
  category: "impact" | "labs"
  tagline: string
  description: string
  story: string
  stack: string[]
  status?: string
  links?: { label: string; href: string }[]
  axiomComment: string
}

export interface Exhibit {
  slug: string
  title: string
  category: "impact" | "labs" | "devlog" | "trivia"
  description: string
  axiomNote: string
  href: string
}

export interface RagEntry {
  id: number
  text: string
  source: string
  category: string
  score?: number
  timestamp?: string
  file?: string
  tags?: string[]
}

export interface ContentEntry {
  slug: string
  frontmatter: Record<string, unknown>
  body: string
  raw?: string
}

export interface SeedStatus {
  running: boolean
  progress: number
  message: string
  error?: string
  startedAt?: string
  completedAt?: string
}
