import fs from "node:fs"
import path from "node:path"

const DATA_ROOT = path.join(process.cwd(), "data")

export type Exhibit = {
  slug: string
  title: string
  category: "about" | "impact" | "labs" | "devlog" | "trivia"
  description: string
  axiomNote: string
  href: string
}

export function getExhibits(): Exhibit[] {
  return JSON.parse(fs.readFileSync(path.join(DATA_ROOT, "exhibits.json"), "utf-8"))
}
