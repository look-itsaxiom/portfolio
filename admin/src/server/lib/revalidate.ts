const WEB_URL = process.env.PORTFOLIO_WEB_URL || "http://portfolio-web:3000"
const SECRET = process.env.REVALIDATE_SECRET

export function revalidate(paths: string[]) {
  if (!SECRET) return

  fetch(`${WEB_URL}/api/revalidate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: SECRET, paths }),
    signal: AbortSignal.timeout(5000),
  }).catch((err) => {
    console.error("Revalidation failed:", err)
  })
}
