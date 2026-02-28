import { getAllDevlog } from "@/lib/content"
import { DevlogCard } from "@/components/devlog-card"

export default function DevlogIndexPage() {
  const devlog = getAllDevlog().sort((a, b) => b.date.localeCompare(a.date))

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-2xl font-semibold sm:text-3xl md:text-4xl">DevLog</h1>
      <p className="mt-3 text-muted-foreground">
        Shipping notes, experiments, and the story behind the work.
      </p>

      <div className="mt-10 grid gap-6">
        {devlog.map((entry) => (
          <DevlogCard key={entry.slug} entry={entry} />
        ))}
      </div>
    </section>
  )
}
