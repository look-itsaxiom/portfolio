import { getAllImpact } from "@/lib/content"
import { ImpactCard } from "@/components/impact-card"

export default function ImpactIndexPage() {
  const impact = getAllImpact()

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold sm:text-4xl">Impact</h1>
      <p className="mt-3 text-muted-foreground">
        Case studies that show how Chase led product-grade systems with a small team.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {impact.map((entry) => (
          <ImpactCard key={entry.slug} entry={entry} />
        ))}
      </div>
    </section>
  )
}
