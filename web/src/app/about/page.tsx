import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import Link from "next/link"
import { GraduationCap } from "lucide-react"

type Highlight = { text: string; href?: string }

export default function AboutPage() {
  const aboutPath = path.join(process.cwd(), "data", "about.md")
  const raw = fs.readFileSync(aboutPath, "utf-8")
  const { data, content } = matter(raw)
  const paragraphs = content.trim().split(/\n\n+/)
  const principles = (data.principles ?? []) as string[]
  const highlights = (data.highlights ?? []) as Highlight[]
  const education = data.education as string | undefined

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-2xl font-semibold sm:text-3xl md:text-4xl">About Chase</h1>
      <p className="mt-3 text-muted-foreground">{data.summary}</p>

      <div className="mt-8 space-y-4 text-muted-foreground">
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      {highlights.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold sm:text-2xl">Highlights</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {highlights.map((h) => (
              h.href ? (
                <Link
                  key={h.text}
                  href={h.href}
                  className="rounded-lg border border-border/40 bg-card/50 p-4 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  {h.text}
                </Link>
              ) : (
                <div
                  key={h.text}
                  className="rounded-lg border border-border/40 bg-card/50 p-4 text-sm text-muted-foreground"
                >
                  {h.text}
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {education && (
        <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
          <GraduationCap className="h-4 w-4 shrink-0 text-primary" />
          <span>{education}</span>
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-xl font-semibold sm:text-2xl">Operating Principles</h2>
        <ul className="mt-4 space-y-2 text-muted-foreground list-disc pl-5">
          {principles.map((principle) => (
            <li key={principle}>{principle}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
