import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { DevlogEntry } from "@/lib/content"

export function DevlogCard({ entry }: { entry: DevlogEntry }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-card/50 p-6">
      <div className="flex items-center justify-between">
        <Badge variant="outline">DevLog</Badge>
        <span className="text-xs text-muted-foreground">{entry.date}</span>
      </div>
      <h3 className="mt-3 text-xl font-semibold">{entry.title}</h3>
      <p className="mt-2 text-muted-foreground">{entry.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {entry.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
      <Link
        href={`/devlog/${entry.slug}`}
        className="mt-4 inline-flex text-sm text-primary hover:underline"
      >
        Read entry →
      </Link>
    </div>
  )
}
