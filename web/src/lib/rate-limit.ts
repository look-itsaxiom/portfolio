// Tiny in-memory fixed-window rate limiter. /api/chat now spends real money on a
// public endpoint, so a single abusive IP must not be able to drain the budget.
// Per-process only (fine for a single container); resets on restart.

const WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS = 20

const hits = new Map<string, { count: number; resetAt: number }>()

function sweep(now: number) {
  for (const [key, entry] of hits) {
    if (entry.resetAt <= now) hits.delete(key)
  }
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0].trim()
  return req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "unknown"
}

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now()
  if (hits.size > 5000) sweep(now)

  const entry = hits.get(ip)
  if (!entry || entry.resetAt <= now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, retryAfter: 0 }
  }

  entry.count += 1
  if (entry.count > MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }
  return { allowed: true, retryAfter: 0 }
}

export const RATE_LIMIT = { WINDOW_MS, MAX_REQUESTS }
