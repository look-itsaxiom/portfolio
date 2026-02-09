import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { LabEntry } from "@/lib/content"

export function LabCard({ entry }: { entry: LabEntry }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-card/50 p-6">
      <Badge variant="secondary" className="mb-3">
        Labs
      </Badge>
      <h3 className="text-xl font-semibold">{entry.title}</h3>
      <p className="mt-2 text-muted-foreground">{entry.summary}</p>
      <div className="mt-3 text-xs text-muted-foreground">{entry.status}</div>
      <div className="mt-4 flex flex-wrap gap-2">
        {entry.stack.map((tech) => (
          <Badge key={tech} variant="outline">
            {tech}
          </Badge>
        ))}
      </div>
      <Link
        href={`/labs/${entry.slug}`}
        className="mt-4 inline-flex text-sm text-primary hover:underline"
      >
        View lab →
      </Link>
    </div>
  )
}
