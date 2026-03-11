import type { MetadataRoute } from "next"
import { getAllProjects, getAllDevlog } from "@/lib/content"
import { SITE_URL } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getAllProjects()
  const devlog = getAllDevlog()

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/devlog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ]

  const projectPages: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const devlogPages: MetadataRoute.Sitemap = devlog
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((d, i) => ({
      url: `${SITE_URL}/devlog/${d.slug}`,
      lastModified: new Date(d.date),
      changeFrequency: "monthly" as const,
      priority: i === 0 ? 0.8 : 0.6,
    }))

  return [...staticPages, ...projectPages, ...devlogPages]
}
