import { notFound } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getAllLabs, getLabBySlug } from "@/lib/content"
import { ArrowLeft } from "lucide-react"

export function generateStaticParams() {
  return getAllLabs().map((entry) => ({ slug: entry.slug }))
}

export default function LabPage({ params }: { params: { slug?: string } }) {
  if (!params?.slug) notFound()

  const entry = getLabBySlug(params.slug)
  if (!entry) notFound()

  const paragraphs = entry.content.trim().split(/\n\n+/)

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <Link
        href="/labs"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Labs
      </Link>

      <Badge variant="secondary" className="mb-4">
        Labs
      </Badge>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{entry.title}</h1>
      <p className="mt-3 text-xl text-muted-foreground">{entry.summary}</p>
      <p className="mt-2 text-sm text-muted-foreground">Status: {entry.status}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {entry.stack.map((tech) => (
          <Badge key={tech} variant="outline">
            {tech}
          </Badge>
        ))}
      </div>

      <Separator className="my-10" />

      <div className="space-y-4 text-muted-foreground">
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      {entry.links?.length ? (
        <div className="mt-8 flex flex-wrap gap-3">
          {entry.links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-primary hover:underline">
              {link.label} →
            </a>
          ))}
        </div>
      ) : null}
    </div>
  )
}
