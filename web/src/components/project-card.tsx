import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Project } from "@/lib/data"

export function ProjectCard({ project }: { project: Project }) {
  const href =
    project.category === "impact"
      ? `/impact/${project.slug}`
      : `/labs/${project.slug}`

  return (
    <Link href={href} className="group block">
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
