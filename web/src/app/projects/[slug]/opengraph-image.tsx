import { ImageResponse } from "next/og"
import { getAllProjects, getProjectBySlug } from "@/lib/content"

export const runtime = "nodejs"
export const alt = "Project by Chase Skibeness"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export function generateStaticParams() {
  return getAllProjects().map((entry) => ({ slug: entry.slug }))
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let title = "Project"
  let summary = ""
  let stack: string[] = []
  let category = "labs"

  try {
    const entry = getProjectBySlug(slug)
    title = entry.title
    summary = entry.summary.length > 140 ? entry.summary.slice(0, 137) + "..." : entry.summary
    stack = entry.stack.slice(0, 6)
    category = entry.category
  } catch {
    // fallback to defaults
  }

  const accentColor = category === "professional" ? "#60a5fa" : "#a78bfa"

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 18,
              color: accentColor,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {category === "professional" ? "Professional" : "Labs"}
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginTop: 16,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#94a3b8",
              marginTop: 20,
              maxWidth: 900,
              lineHeight: 1.5,
            }}
          >
            {summary}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {stack.map((tech) => (
              <div
                key={tech}
                style={{
                  fontSize: 16,
                  color: "#e2e8f0",
                  background: "rgba(255,255,255,0.08)",
                  padding: "6px 16px",
                  borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                {tech}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 18, color: "#64748b" }}>chase.skibeness.com</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
