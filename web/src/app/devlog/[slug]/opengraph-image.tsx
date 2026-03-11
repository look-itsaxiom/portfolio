import { ImageResponse } from "next/og"
import { getAllDevlog, getDevlogBySlug } from "@/lib/content"

export const runtime = "nodejs"
export const alt = "DevLog by Chase Skibeness"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export function generateStaticParams() {
  return getAllDevlog().map((entry) => ({ slug: entry.slug }))
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let title = "DevLog"
  let summary = ""
  let date = ""
  let tags: string[] = []

  try {
    const entry = getDevlogBySlug(slug)
    title = entry.title
    summary = entry.summary.length > 160 ? entry.summary.slice(0, 157) + "..." : entry.summary
    date = entry.date
    tags = entry.tags.slice(0, 5)
  } catch {
    // fallback to defaults
  }

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
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div
              style={{
                fontSize: 16,
                color: "#a78bfa",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              DevLog
            </div>
            {date && (
              <div style={{ fontSize: 16, color: "#64748b" }}>{date}</div>
            )}
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              marginTop: 20,
              maxWidth: 950,
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
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  fontSize: 15,
                  color: "#cbd5e1",
                  background: "rgba(255,255,255,0.06)",
                  padding: "5px 14px",
                  borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {tag}
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
