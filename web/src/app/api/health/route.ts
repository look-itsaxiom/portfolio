import { NextResponse } from "next/server"

type CheckState = "ok" | "error" | "quota_exceeded" | "unconfigured"

// A real Gemini probe costs quota, so the verdict is cached briefly. A health
// endpoint that hammers a metered API becomes its own outage.
const GEMINI_CACHE_MS = 60_000
let geminiCache: { state: CheckState; detail?: string; at: number } | null = null

async function probeGemini(): Promise<{ state: CheckState; detail?: string }> {
  const key = process.env.GEMINI_API_KEY
  if (!key) return { state: "unconfigured" }

  if (geminiCache && Date.now() - geminiCache.at < GEMINI_CACHE_MS) {
    return { state: geminiCache.state, detail: geminiCache.detail }
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash"
  let verdict: { state: CheckState; detail?: string }

  try {
    // Smallest possible real generation. Proves the key is *usable* rather than
    // merely present -- a spend cap returns 429 while the key still authenticates.
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "ping" }] }],
          generationConfig: { maxOutputTokens: 1 },
        }),
        signal: AbortSignal.timeout(8000),
      }
    )

    if (res.ok) {
      verdict = { state: "ok" }
    } else if (res.status === 429) {
      verdict = { state: "quota_exceeded", detail: "HTTP 429 from Gemini" }
    } else {
      verdict = { state: "error", detail: `HTTP ${res.status} from Gemini` }
    }
  } catch (err) {
    verdict = {
      state: "error",
      detail: err instanceof Error ? err.message : "request failed",
    }
  }

  geminiCache = { ...verdict, at: Date.now() }
  return verdict
}

async function probeUrl(url: string | undefined, path: string): Promise<CheckState> {
  if (!url) return "unconfigured"
  try {
    const res = await fetch(`${url}${path}`, { signal: AbortSignal.timeout(3000) })
    return res.ok ? "ok" : "error"
  } catch {
    return "error"
  }
}

export async function GET() {
  const [gemini, qdrant, discordBot] = await Promise.all([
    probeGemini(),
    probeUrl(process.env.QDRANT_URL, "/collections"),
    probeUrl(process.env.DISCORD_BOT_URL, "/health"),
  ])

  const checks: Record<string, CheckState> = {
    gemini: gemini.state,
    qdrant,
    discordBot,
  }

  const allOk = Object.values(checks).every(
    (v) => v === "ok" || v === "unconfigured"
  )

  return NextResponse.json(
    gemini.detail ? { ...checks, geminiDetail: gemini.detail } : checks,
    { status: allOk ? 200 : 503 }
  )
}
