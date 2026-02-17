import { notFound } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getAllImpact, getImpactBySlug } from "@/lib/content"
import { ArrowLeft } from "lucide-react"

export function generateStaticParams() {
  return getAllImpact().map((entry) => ({ slug: entry.slug }))
}

export default function ImpactPage({ params }: { params: { slug?: string } }) {
  if (!params?.slug) notFound()

  const entry = getImpactBySlug(params.slug)
  if (!entry) notFound()

  const paragraphs = entry.content.trim().split(/\n\n+/)

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <Link
        href="/impact"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Impact
      </Link>

      <Badge className="mb-4">Professional Impact</Badge>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{entry.title}</h1>
      <p className="mt-3 text-xl text-muted-foreground">{entry.summary}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {entry.stack.map((tech) => (
          <Badge key={tech} variant="secondary">
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

      <Separator className="my-10" />

      <div className="rounded-lg border border-border/30 bg-muted/30 p-6">
        <p className="text-sm font-medium">Impact Highlights</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          {entry.impact.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">Role: {entry.role}</p>
      </div>
    </div>
  )
}
