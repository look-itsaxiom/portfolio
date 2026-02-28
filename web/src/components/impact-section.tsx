import { getImpactProjects } from "@/lib/data"
import { ProjectCard } from "@/components/project-card"

export function ImpactSection() {
  const impactProjects = getImpactProjects()

  return (
    <section id="impact" className="py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Professional Impact
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Product-grade systems that shipped. NDA-safe outcomes only.
        </p>
        <div className="mt-6 grid gap-4 sm:mt-10 sm:gap-6 md:grid-cols-2">
          {impactProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
