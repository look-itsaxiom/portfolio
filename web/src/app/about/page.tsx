import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

export default function AboutPage() {
  const aboutPath = path.join(process.cwd(), "data", "about.md")
  const raw = fs.readFileSync(aboutPath, "utf-8")
  const { data, content } = matter(raw)
  const paragraphs = content.trim().split(/\n\n+/)
  const principles = (data.principles ?? []) as string[]

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-semibold">About Chase</h1>
      <p className="mt-3 text-muted-foreground">{data.summary}</p>

      <div className="mt-8 space-y-4 text-muted-foreground">
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold">Operating Principles</h2>
        <ul className="mt-4 space-y-2 text-muted-foreground list-disc pl-5">
          {principles.map((principle) => (
            <li key={principle}>{principle}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
