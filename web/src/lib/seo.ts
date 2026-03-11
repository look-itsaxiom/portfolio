export const SITE_URL = "https://chase.skibeness.com"
export const SITE_NAME = "Chase Skibeness"
export const SITE_TITLE = "Chase Skibeness — Senior Software Engineer & AI Engineer"
export const SITE_DESCRIPTION =
  "I build product-grade systems that remove operational friction — and I explore AI-native experiences as labs."

export const SOCIAL = {
  linkedin: "https://www.linkedin.com/in/chase-skibeness/",
  github: "https://github.com/look-itsaxiom",
  email: "itsaxiom.dev@proton.me",
}

/** JSON-LD Person schema — injected once in root layout */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Chase Skibeness",
    url: SITE_URL,
    jobTitle: "Senior Software Engineer & AI Engineer",
    description: SITE_DESCRIPTION,
    email: `mailto:${SOCIAL.email}`,
    sameAs: [SOCIAL.linkedin, SOCIAL.github],
    knowsAbout: [
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "AI Agent Coordination",
      "Claude Code Plugins",
      "Fastify",
      "Docker",
      "PostgreSQL",
      "Full-Stack Development",
      "System Architecture",
      "DevOps",
    ],
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Western Governors University",
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: "WA",
      addressCountry: "US",
    },
  }
}

/** JSON-LD for a project page */
export function projectJsonLd(project: {
  title: string
  summary: string
  slug: string
  stack: string[]
  links?: { label: string; href: string }[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.summary,
    url: `${SITE_URL}/projects/${project.slug}`,
    author: {
      "@type": "Person",
      name: "Chase Skibeness",
      url: SITE_URL,
    },
    programmingLanguage: project.stack,
    ...(project.links?.find((l) => l.label === "GitHub")
      ? { codeRepository: project.links.find((l) => l.label === "GitHub")!.href }
      : {}),
  }
}

/** JSON-LD for a devlog entry */
export function devlogJsonLd(entry: {
  title: string
  summary: string
  slug: string
  date: string
  tags: string[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: entry.title,
    description: entry.summary,
    url: `${SITE_URL}/devlog/${entry.slug}`,
    datePublished: entry.date,
    author: {
      "@type": "Person",
      name: "Chase Skibeness",
      url: SITE_URL,
    },
    keywords: entry.tags.join(", "),
    publisher: {
      "@type": "Person",
      name: "Chase Skibeness",
      url: SITE_URL,
    },
  }
}
