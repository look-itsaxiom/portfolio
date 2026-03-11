import { ImageResponse } from "next/og"

export const runtime = "nodejs"
export const alt = "Chase Skibeness — Senior Software Engineer & AI Engineer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Chase Skibeness
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#a78bfa",
            marginTop: 16,
            fontWeight: 500,
          }}
        >
          Senior Software Engineer & AI Engineer
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#94a3b8",
            marginTop: 32,
            maxWidth: 800,
            lineHeight: 1.5,
          }}
        >
          Product-grade systems, AI-native experiments, and tools that make building things easier.
        </div>
        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: 48,
            fontSize: 18,
            color: "#64748b",
          }}
        >
          <span>TypeScript</span>
          <span>·</span>
          <span>React</span>
          <span>·</span>
          <span>Node.js</span>
          <span>·</span>
          <span>AI Agents</span>
          <span>·</span>
          <span>Seattle, WA</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
