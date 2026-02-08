import { NextResponse } from "next/server"

export async function GET() {
  const checks: Record<string, "ok" | "error" | "unconfigured"> = {
    openrouter: "unconfigured",
    qdrant: "unconfigured",
    ollama: "unconfigured",
    discordBot: "unconfigured",
  }

  // Check OpenRouter
  if (process.env.OPENROUTER_API_KEY) {
    checks.openrouter = "ok"
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

  // Check Ollama
  const ollamaUrl = process.env.OLLAMA_URL
  if (ollamaUrl) {
    try {
      const res = await fetch(`${ollamaUrl}/api/tags`, {
        signal: AbortSignal.timeout(3000),
      })
      checks.ollama = res.ok ? "ok" : "error"
    } catch {
      checks.ollama = "error"
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
