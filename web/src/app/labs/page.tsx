import { getAllLabs } from "@/lib/content"
import { LabCard } from "@/components/lab-card"

export default function LabsIndexPage() {
  const labs = getAllLabs()

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-2xl font-semibold sm:text-3xl md:text-4xl">Labs</h1>
      <p className="mt-3 text-muted-foreground">
        Experiments, playful prototypes, and AI-native interfaces in progress.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {labs.map((entry) => (
          <LabCard key={entry.slug} entry={entry} />
        ))}
      </div>
    </section>
  )
}
