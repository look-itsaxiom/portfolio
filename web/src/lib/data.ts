export interface Project {
  slug: string
  title: string
  category: "impact" | "labs"
  tagline: string
  description: string
  story: string
  stack: string[]
  status?: string
  links?: { label: string; href: string }[]
  axiomComment: string
}

export const projects: Project[] = [
  {
    slug: "integration-platform",
    title: "No-Code Integration Platform",
    category: "impact",
    tagline: "I turned weeks of integration work into a few clicks.",
    description:
      "Built a no-code integration system that lets admins define schemas and transformations through UI. Started with file-based inputs, expanded to timeclock and payroll, and laid the foundation for API-based no-code via workflow automation.",
    story:
      "Partner data arrived in every shape imaginable. Instead of burning sprints on one-off mappings, I built a no-code integration system that lets admins define schemas and transformations through UI. We started with file-based inputs, expanded to timeclock and payroll, and laid the foundation for API-based no-code via workflow automation. Result: onboarding went from \"schedule a sprint\" to \"ship it this week.\"",
    stack: ["TypeScript", "Node.js", "React", "AWS", "PostgreSQL"],
    axiomComment:
      "This is where Chase turned weeks of integration work into a few clicks...",
  },
  {
    slug: "platform-modernization",
    title: "Platform Modernization & Internal Tooling",
    category: "impact",
    tagline: "I got hired for IT. I left as an engineer.",
    description:
      "Started in IT, automated everything possible, and got pulled into engineering. Built a one-touch dev environment, pushed internal tooling forward, and helped move a legacy codebase through strangler-pattern modernization.",
    story:
      "I started in IT, automated everything I could, and got pulled into engineering. With a mentor who cared about clean architecture, I learned how to ship in a real product org. I built a one-touch dev environment, pushed internal tooling forward, and helped move a legacy codebase through strangler-pattern modernization.",
    stack: ["TypeScript", "React", "Node.js", "Design Systems", "Accessibility"],
    axiomComment:
      "The classic origin story — from IT to engineering through sheer persistence.",
  },
  {
    slug: "drink-ux",
    title: "Drink-UX",
    category: "labs",
    tagline: "I tried to give indie coffee shops a Starbucks-grade ordering UI.",
    description:
      "Multi-app SaaS platform that lets coffee shops keep their existing POS (Square/Toast/Clover) while offering customers a slick, visual drink builder.",
    story:
      "Most coffee shops are stuck with clunky POS menus. I built Drink-UX so they could keep their existing POS (Square/Toast/Clover) while offering customers a slick, visual drink builder. The front-end drink builder is demo-able; POS integrations are in progress. The biggest missing piece is time — not the core idea.",
    stack: ["TypeScript", "React", "Next.js", "PWA", "POS APIs"],
    status: "Pre-demo (frontend mostly there; integrations WIP)",
    axiomComment:
      "Chase wanted to make ordering coffee feel as good as the coffee itself.",
  },
  {
    slug: "clawcraft",
    title: "ClawCraft.ai",
    category: "labs",
    tagline: "I built a game where your AI plays for you.",
    description:
      "AI-driven MMORPG where AI agents read skill files and interact through a public API instead of a traditional client. Explores skill-file docs as a first-class interface for AI systems.",
    story:
      "I was inspired by agent onboarding flows where an AI reads a skill file to learn how to operate a system. I turned that into ClawCraft.ai — a game where AI agents read skills and interact through a public API instead of a traditional client. The deeper idea: skill-file docs as a first-class interface for AI systems (bigger than games, potentially beyond MCP).",
    stack: ["TypeScript", "Node.js", "Express", "AI Agents", "REST API"],
    status: "Live and public, early-stage, actively evolving",
    links: [{ label: "Live Site", href: "https://clawcraft.ai" }],
    axiomComment:
      "This one's wild — a game designed for AIs, not humans. Chase is onto something here.",
  },
]

export const impactProjects = projects.filter((p) => p.category === "impact")
export const labsProjects = projects.filter((p) => p.category === "labs")

export const heroSlides = projects.map((p) => ({
  slug: p.slug,
  title: p.title,
  tagline: p.tagline,
  category: p.category,
  axiomComment: p.axiomComment,
}))

export const suggestedPrompts = [
  "What does Chase build best?",
  "Tell me about the no-code integration platform.",
  "Why did Chase build an AI-driven MMORPG?",
  "What's Chase's preferred stack?",
  "What is Chase working on next?",
]
