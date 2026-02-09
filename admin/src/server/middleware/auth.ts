import type { RequestHandler } from "express"

const ADMIN_SECRET = process.env.ADMIN_SECRET

export const authMiddleware: RequestHandler = (req, res, next) => {
  if (!ADMIN_SECRET) {
    res.status(500).json({ error: "ADMIN_SECRET not configured" })
    return
  }

  const header = req.headers.authorization
  if (!header || header !== `Bearer ${ADMIN_SECRET}`) {
    res.status(401).json({ error: "Unauthorized" })
    return
  }

  next()
}
