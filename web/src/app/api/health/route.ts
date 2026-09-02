import { NextResponse } from "next/server"
import { isEmbeddingAvailable } from "@/lib/embeddings"

type CheckState = "ok" | "error" | "quota_exceeded" | "unconfigured"

// Probing the provider costs a round-trip (and rate-limit budget), so the
// verdict is cached briefly. A health endpoint that hammers a metered API
// becomes its own outage.
const PROVIDER_CACHE_MS = 60_000
let providerCache: { state: CheckState; detail?: string; at: number } | null = null

async function probeOpenRouter(): Promise<{ state: CheckState; detail?: string }> {
  const key = process.env.OPENROUTER_API_KEY
  if (!key) return { state: "unconfigured" }

  if (providerCache && Date.now() - providerCache.at < PROVIDER_CACHE_MS) {
    return { state: providerCache.state, detail: providerCache.detail }
  }

  let verdict: { state: CheckState; detail?: string }

  try {
    // Authenticated but free call: proves the key is accepted without spending
    // tokens on a generation.
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(8000),
    })

    if (res.ok) {
      verdict = { state: "ok" }
    } else if (res.status === 429 || res.status === 402) {
      verdict = { state: "quota_exceeded", detail: `HTTP ${res.status} from OpenRouter` }
    } else {
      verdict = { state: "error", detail: `HTTP ${res.status} from OpenRouter` }
    }
  } catch (err) {
    verdict = {
      state: "error",
      detail: err instanceof Error ? err.message : "request failed",
    }
  }

  providerCache = { ...verdict, at: Date.now() }
  return verdict
}

async function probeEmbeddings(): Promise<CheckState> {
  return (await isEmbeddingAvailable()) ? "ok" : "error"
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
  const [openrouter, embeddings, qdrant, discordBot] = await Promise.all([
    probeOpenRouter(),
    probeEmbeddings(),
    probeUrl(process.env.QDRANT_URL, "/collections"),
    probeUrl(process.env.DISCORD_BOT_URL, "/health"),
  ])

  const checks: Record<string, CheckState> = {
    openrouter: openrouter.state,
    embeddings,
    qdrant,
    discordBot,
  }

  const allOk = Object.values(checks).every(
    (v) => v === "ok" || v === "unconfigured"
  )

  return NextResponse.json(
    openrouter.detail ? { ...checks, openrouterDetail: openrouter.detail } : checks,
    { status: allOk ? 200 : 503 }
  )
}
