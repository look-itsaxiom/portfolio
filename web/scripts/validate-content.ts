import { getAllImpact, getAllLabs, getAllDevlog } from "@/lib/content"

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const impact = getAllImpact()
const labs = getAllLabs()
const devlog = getAllDevlog()

assert(impact.length > 0, "Expected at least 1 impact entry")
assert(labs.length > 0, "Expected at least 1 labs entry")
assert(devlog.length > 0, "Expected at least 1 devlog entry")

console.log("Content validation passed")
