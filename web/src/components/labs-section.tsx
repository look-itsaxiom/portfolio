import { getLabsProjects } from "@/lib/data"
import { ProjectCard } from "@/components/project-card"

export function LabsSection() {
  const labsProjects = getLabsProjects()

  return (
    <section id="labs" className="py-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-3xl font-bold tracking-tight">Labs</h2>
        <p className="mt-2 text-muted-foreground">
          AI-native experiments and side projects. Work in progress, shipped in
          public.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {labsProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
