import { NextResponse } from "next/server"

export async function GET() {
  const checks: Record<string, "ok" | "error" | "unconfigured"> = {
    gemini: "unconfigured",
    qdrant: "unconfigured",
    discordBot: "unconfigured",
  }

  // Check Gemini API
  if (process.env.GEMINI_API_KEY) {
    checks.gemini = "ok"
  }

  // Check Qdrant
  const qdrantUrl = process.env.QDRANT_URL
  if (qdrantUrl) {
    try {
      const res = await fetch(`${qdrantUrl}/collections`, {
        signal: AbortSignal.timeout(3000),
      })
      checks.qdrant = res.ok ? "ok" : "error"
    } catch {
      checks.qdrant = "error"
    }
  }

  // Check Discord Bot
  const discordBotUrl = process.env.DISCORD_BOT_URL
  if (discordBotUrl) {
    try {
      const res = await fetch(`${discordBotUrl}/health`, {
        signal: AbortSignal.timeout(3000),
      })
      checks.discordBot = res.ok ? "ok" : "error"
    } catch {
      checks.discordBot = "error"
    }
  }

  const allOk = Object.values(checks).every(
    (v) => v === "ok" || v === "unconfigured"
  )

  return NextResponse.json(checks, { status: allOk ? 200 : 503 })
}
