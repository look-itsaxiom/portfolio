import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { ImpactEntry } from "@/lib/content"

export function ImpactCard({ entry }: { entry: ImpactEntry }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-card/50 p-6">
      <Badge className="mb-3">Impact</Badge>
      <h3 className="text-xl font-semibold">{entry.title}</h3>
      <p className="mt-2 text-muted-foreground">{entry.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {entry.stack.map((tech) => (
          <Badge key={tech} variant="secondary">
            {tech}
          </Badge>
        ))}
      </div>
      <Link
        href={`/impact/${entry.slug}`}
        className="mt-4 inline-flex text-sm text-primary hover:underline"
      >
        View case study →
      </Link>
    </div>
  )
}
