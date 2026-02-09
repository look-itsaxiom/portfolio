import fs from "node:fs"
import path from "node:path"

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data")

export function readJsonArray<T>(filename: string): T[] {
  const filepath = path.join(DATA_DIR, filename)
  if (!fs.existsSync(filepath)) return []
  return JSON.parse(fs.readFileSync(filepath, "utf-8"))
}

export function writeJsonArray<T>(filename: string, data: T[]) {
  const filepath = path.join(DATA_DIR, filename)
  const dir = path.dirname(filepath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  const tmp = filepath + `.tmp.${Date.now()}`
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + "\n", "utf-8")
  fs.renameSync(tmp, filepath)
}
