import express from "express"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { authMiddleware } from "./middleware/auth.js"
import { healthRouter } from "./routes/health.js"
import { impactRouter } from "./routes/impact.js"
import { labsRouter } from "./routes/labs.js"
import { devlogRouter } from "./routes/devlog.js"
import { knowledgeRouter } from "./routes/knowledge.js"
import { ragRouter } from "./routes/rag.js"
import { projectsRouter } from "./routes/projects.js"
import { exhibitsRouter } from "./routes/exhibits.js"
import { promptsRouter } from "./routes/prompts.js"

const PORT = parseInt(process.env.PORT || "3200", 10)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()

app.use(express.json({ limit: "1mb" }))

// Serve Vite-built frontend in production
app.use(express.static(path.join(__dirname, "../client")))

// Health endpoint is public (used by login gate to validate secret)
app.use("/api/health", healthRouter)

// All other API routes require auth
app.use("/api", authMiddleware)
app.use("/api/impact", impactRouter)
app.use("/api/labs", labsRouter)
app.use("/api/devlog", devlogRouter)
app.use("/api/knowledge", knowledgeRouter)
app.use("/api/rag", ragRouter)
app.use("/api/projects", projectsRouter)
app.use("/api/exhibits", exhibitsRouter)
app.use("/api/prompts", promptsRouter)

// SPA fallback — serve index.html for all non-API routes
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"))
})

app.listen(PORT, () => {
  console.log(`Portfolio admin dashboard listening on port ${PORT}`)
})
