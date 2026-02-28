import { getLabsProjects } from "@/lib/data"
import { ProjectCard } from "@/components/project-card"

export function LabsSection() {
  const labsProjects = getLabsProjects()

  return (
    <section id="labs" className="py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Labs</h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          AI-native experiments and side projects. Work in progress, shipped in
          public.
        </p>
        <div className="mt-6 grid gap-4 sm:mt-10 sm:gap-6 md:grid-cols-2">
          {labsProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
