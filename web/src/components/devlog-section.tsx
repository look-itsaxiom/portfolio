import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const devlogEntries = [
  {
    date: "2026-02-07",
    title: "Portfolio Sprint Begins",
    excerpt:
      "Started the portfolio build. Next.js + shadcn/ui + Tailwind. Ask Axiom design is locked. Time to ship.",
    tags: ["portfolio", "shipping"],
  },
  {
    date: "2026-02-06",
    title: "Ask Axiom Design Complete",
    excerpt:
      "Locked in the full architecture for Ask Axiom — RAG pipeline, Discord fallback, museum guide persona. Design doc committed.",
    tags: ["ask-axiom", "design"],
  },
]

export function DevlogSection() {
  return (
    <section id="devlog" className="py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">DevLog</h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Short updates on what I&apos;m building, learning, and shipping.
        </p>
        <div className="mt-6 space-y-4 sm:mt-10">
          {devlogEntries.map((entry) => (
            <Card key={entry.date}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{entry.title}</CardTitle>
                  <CardDescription className="text-xs tabular-nums">
                    {entry.date}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {entry.excerpt}
                </p>
                <div className="mt-3 flex gap-1.5">
                  {entry.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
