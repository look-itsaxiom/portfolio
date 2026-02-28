import { getAllProjects } from "@/lib/content"
import { ProjectCard } from "@/components/project-card"

export default function ProjectsPage() {
  const projects = getAllProjects()
  const professional = projects.filter((p) => p.category === "professional")
  const labs = projects.filter((p) => p.category === "labs")

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-2xl font-semibold sm:text-3xl md:text-4xl">Projects</h1>
      <p className="mt-3 text-muted-foreground">
        Professional work and personal experiments — everything Chase builds.
      </p>

      <h2 className="mt-10 text-xl font-semibold sm:text-2xl">Professional</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Product-grade systems that shipped. NDA-safe outcomes only.
      </p>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {professional.map((entry) => (
          <ProjectCard key={entry.slug} entry={entry} />
        ))}
      </div>

      <h2 className="mt-12 text-xl font-semibold sm:text-2xl">Labs</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        AI-native experiments and side projects. Work in progress, shipped in public.
      </p>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {labs.map((entry) => (
          <ProjectCard key={entry.slug} entry={entry} />
        ))}
      </div>
    </section>
  )
}
