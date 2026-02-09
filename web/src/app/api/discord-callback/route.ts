import { NextResponse } from "next/server"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { generateText } from "ai"
import { activeSessions } from "@/lib/sessions"
import { storeKnowledge, isRagAvailable } from "@/lib/rag"

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "arcee-ai/trinity-large-preview:free"

export async function POST(req: Request) {
  const { sessionId, reply } = await req.json()

  if (!sessionId || !reply) {
    return NextResponse.json(
      { error: "Missing sessionId or reply" },
      { status: 400 }
    )
  }

  const session = activeSessions.get(sessionId)
  if (!session) {
    return NextResponse.json(
      { error: "Session not found or expired" },
      { status: 404 }
    )
  }

  // Notify SSE listeners that Chase is typing / reply is being processed
  session.onTyping?.()

  // Rewrite Chase's raw reply in Ask Axiom's voice
  let formattedReply = reply
  try {
    const { text } = await generateText({
      model: openrouter(OPENROUTER_MODEL),
      prompt: `You are Ask Axiom, an enthusiastic museum-guide persona for Chase's portfolio.
A visitor asked: "${session.question}"
Chase (they/them) replied via Discord: "${reply}"

Rewrite Chase's reply in your own voice — keep it conversational, enthusiastic, and concise. Preserve all factual content. Do not add information Chase didn't provide. Use they/them pronouns for Chase. Output only the rewritten reply, nothing else.`,
    })
    formattedReply = text
  } catch (err) {
    console.error("Personality rewrite failed, using raw reply:", err)
  }

  // Store the Q&A pair in Qdrant for future retrieval (learning loop)
  try {
    if (await isRagAvailable()) {
      const knowledgeText = `Question: ${session.question}\nAnswer: ${reply}`
      await storeKnowledge(knowledgeText, "conversation", "learned")
    }
  } catch (err) {
    console.error("Failed to store learned knowledge:", err)
  }

  // Resolve the session with the personality-rewritten reply
  session.resolve(formattedReply)
  activeSessions.delete(sessionId)

  return NextResponse.json({ ok: true })
}
