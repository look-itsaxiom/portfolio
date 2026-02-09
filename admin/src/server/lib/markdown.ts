import fs from "node:fs"
import path from "node:path"
import os from "node:os"
import matter from "gray-matter"

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data")

function safePath(subdir: string, filename: string): string {
  const resolved = path.resolve(DATA_DIR, subdir, filename)
  if (!resolved.startsWith(path.resolve(DATA_DIR))) {
    throw new Error("Path traversal detected")
  }
  return resolved
}

export function listMarkdownFiles(subdir: string): string[] {
  const dir = path.join(DATA_DIR, subdir)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md"))
}

export function listMarkdownFilesRecursive(subdir: string): string[] {
  const dir = path.join(DATA_DIR, subdir)
  if (!fs.existsSync(dir)) return []

  const results: string[] = []
  function walk(current: string, prefix: string) {
    for (const entry of fs.readdirSync(current)) {
      const fullPath = path.join(current, entry)
      const relPath = prefix ? `${prefix}/${entry}` : entry
      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath, relPath)
      } else if (entry.endsWith(".md")) {
        results.push(relPath)
      }
    }
  }
  walk(dir, "")
  return results
}

export function readMarkdownWithFrontmatter(subdir: string, filename: string) {
  const filepath = safePath(subdir, filename)
  const raw = fs.readFileSync(filepath, "utf-8")
  const { data, content } = matter(raw)
  return { frontmatter: data, body: content.trim(), raw }
}

export function writeMarkdownWithFrontmatter(
  subdir: string,
  filename: string,
  frontmatter: Record<string, unknown>,
  body: string
) {
  const filepath = safePath(subdir, filename)
  const dir = path.dirname(filepath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  const raw = matter.stringify("\n" + body, frontmatter)
  // Atomic write: temp file then rename
  const tmp = path.join(os.tmpdir(), `admin-${Date.now()}-${path.basename(filename)}`)
  fs.writeFileSync(tmp, raw, "utf-8")
  fs.renameSync(tmp, filepath)
}

export function readPlainMarkdown(subdir: string, relativePath: string): string {
  const filepath = safePath(subdir, relativePath + ".md")
  return fs.readFileSync(filepath, "utf-8")
}

export function writePlainMarkdown(subdir: string, relativePath: string, content: string) {
  const filepath = safePath(subdir, relativePath + ".md")
  const dir = path.dirname(filepath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  const tmp = path.join(os.tmpdir(), `admin-${Date.now()}-${path.basename(filepath)}`)
  fs.writeFileSync(tmp, content, "utf-8")
  fs.renameSync(tmp, filepath)
}

export function deleteMarkdownFile(subdir: string, filename: string) {
  const filepath = safePath(subdir, filename)
  if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
}

export function getFileStats(subdir: string, filename: string) {
  const filepath = safePath(subdir, filename)
  if (!fs.existsSync(filepath)) return null
  const stat = fs.statSync(filepath)
  return { size: stat.size, modified: stat.mtime.toISOString() }
}
