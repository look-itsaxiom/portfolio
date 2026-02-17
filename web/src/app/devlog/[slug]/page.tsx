import { notFound } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getAllDevlog, getDevlogBySlug } from "@/lib/content"
import { ArrowLeft } from "lucide-react"

export function generateStaticParams() {
  return getAllDevlog().map((entry) => ({ slug: entry.slug }))
}

export default function DevlogDetailPage({ params }: { params: { slug?: string } }) {
  if (!params?.slug) notFound()

  const entry = getDevlogBySlug(params.slug)
  if (!entry) notFound()

  const paragraphs = entry.content.trim().split(/\n\n+/)

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <Link
        href="/devlog"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to DevLog
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="outline">DevLog</Badge>
        <span className="text-xs text-muted-foreground">{entry.date}</span>
      </div>

      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{entry.title}</h1>
      <p className="mt-3 text-xl text-muted-foreground">{entry.summary}</p>

      {entry.tags?.length ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}

      <Separator className="my-10" />

      <div className="space-y-4 text-muted-foreground">
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      {entry.related?.length ? (
        <div className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Related Topics
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {entry.related.map((item) => (
              <Badge key={item} variant="outline">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
