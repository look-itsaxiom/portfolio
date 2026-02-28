import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ProjectEntry } from "@/lib/content"
import type { Project } from "@/lib/data"

type ProjectCardProps = {
  entry?: ProjectEntry
  project?: Project
}

export function ProjectCard({ entry, project }: ProjectCardProps) {
  if (entry) {
    const isProfessional = entry.category === "professional"
    return (
      <Link href={`/projects/${entry.slug}`} className="group block">
        <Card className="h-full transition-colors hover:border-primary/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant={isProfessional ? "default" : "secondary"} className="text-xs">
                {isProfessional ? "Professional" : "Labs"}
              </Badge>
              {entry.status && (
                <Badge variant="outline" className="text-xs">
                  {entry.status}
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl group-hover:text-primary/80 transition-colors">
              {entry.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              {entry.summary}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {entry.stack.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  if (project) {
    return (
      <Link href={`/projects/${project.slug}`} className="group block">
        <Card className="h-full transition-colors hover:border-primary/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              {project.status && (
                <Badge variant="outline" className="text-xs">
                  {project.status.split("(")[0].trim()}
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl group-hover:text-primary/80 transition-colors">
              {project.title}
            </CardTitle>
            <CardDescription className="text-base">
              {project.tagline}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return null
}
