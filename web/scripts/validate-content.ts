import { getAllProjects, getAllDevlog } from "@/lib/content"

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const projects = getAllProjects()
const devlog = getAllDevlog()

assert(projects.length > 0, "Expected at least 1 project entry")
assert(projects.some((p) => p.category === "professional"), "Expected at least 1 professional project")
assert(projects.some((p) => p.category === "labs"), "Expected at least 1 labs project")
assert(devlog.length > 0, "Expected at least 1 devlog entry")

console.log("Content validation passed")
