import { impactProjects } from "@/lib/data"
import { ProjectCard } from "@/components/project-card"

export function ImpactSection() {
  return (
    <section id="impact" className="py-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Professional Impact
        </h2>
        <p className="mt-2 text-muted-foreground">
          Product-grade systems that shipped. NDA-safe outcomes only.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {impactProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
