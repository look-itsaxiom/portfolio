import { notFound } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { projects } from "@/lib/data"
import { ArrowLeft, ExternalLink } from "lucide-react"

export function generateStaticParams() {
  return projects
    .filter((p) => p.category === "labs")
    .map((p) => ({ slug: p.slug }))
}

export default async function LabsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = projects.find(
    (p) => p.slug === slug && p.category === "labs"
  )

  if (!project) notFound()

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <Link
        href="/#labs"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Labs
      </Link>

      <div className="flex items-center gap-3 mb-4">
        <Badge variant="secondary">Labs</Badge>
        {project.status && (
          <Badge variant="outline" className="text-xs">
            {project.status}
          </Badge>
        )}
      </div>

      <h1 className="text-4xl font-bold tracking-tight">{project.title}</h1>
      <p className="mt-3 text-xl text-muted-foreground">{project.tagline}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <Badge key={tech} variant="secondary">
            {tech}
          </Badge>
        ))}
      </div>

      {project.links && project.links.length > 0 && (
        <div className="mt-6 flex gap-3">
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              {link.label}
              <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      )}

      <Separator className="my-10" />

      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-semibold">The Story</h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          {project.story}
        </p>
      </div>

      <Separator className="my-10" />

      <div className="rounded-lg border border-border/30 bg-muted/30 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            A
          </div>
          <div>
            <p className="text-sm font-medium">Ask Axiom says:</p>
            <p className="mt-1 text-sm italic text-muted-foreground">
              &ldquo;{project.axiomComment}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
