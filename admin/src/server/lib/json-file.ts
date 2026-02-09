import fs from "node:fs"
import path from "node:path"
import os from "node:os"

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

  const tmp = path.join(os.tmpdir(), `admin-${Date.now()}-${path.basename(filename)}`)
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + "\n", "utf-8")
  fs.renameSync(tmp, filepath)
}
