import { notFound } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getAllProjects, getProjectBySlug } from "@/lib/content"
import { ArrowLeft } from "lucide-react"

export function generateStaticParams() {
  return getAllProjects().map((entry) => ({ slug: entry.slug }))
}

export default function ProjectDetailPage({ params }: { params: { slug?: string } }) {
  if (!params?.slug) notFound()

  let entry: ReturnType<typeof getProjectBySlug>
  try {
    entry = getProjectBySlug(params.slug)
  } catch {
    notFound()
  }
  if (!entry) notFound()

  const paragraphs = entry.content.trim().split(/\n\n+/)
  const isProfessional = entry.category === "professional"

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-20">
      <Link
        href="/projects"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground sm:mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      <Badge className={isProfessional ? "mb-4" : "mb-4"} variant={isProfessional ? "default" : "secondary"}>
        {isProfessional ? "Professional" : "Labs"}
      </Badge>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">{entry.title}</h1>
      <p className="mt-2 text-base text-muted-foreground sm:mt-3 sm:text-xl">{entry.summary}</p>

      {entry.status && (
        <p className="mt-2 text-sm text-muted-foreground">Status: {entry.status}</p>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {entry.stack.map((tech) => (
          <Badge key={tech} variant={isProfessional ? "secondary" : "outline"}>
            {tech}
          </Badge>
        ))}
      </div>

      <Separator className="my-6 sm:my-10" />

      <div className="space-y-4 text-muted-foreground">
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      {isProfessional && entry.impact?.length ? (
        <>
          <Separator className="my-6 sm:my-10" />
          <div className="rounded-lg border border-border/30 bg-muted/30 p-4 sm:p-6">
            <p className="text-sm font-medium">Impact Highlights</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {entry.impact.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {entry.role && (
              <p className="mt-4 text-xs text-muted-foreground">Role: {entry.role}</p>
            )}
          </div>
        </>
      ) : null}

      {entry.links?.length ? (
        <div className="mt-8 flex flex-wrap gap-3">
          {entry.links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-primary hover:underline">
              {link.label} &rarr;
            </a>
          ))}
        </div>
      ) : null}
    </div>
  )
}
