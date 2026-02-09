import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import {
  streamText,
  UIMessage,
  createUIMessageStreamResponse,
  createUIMessageStream,
  convertToModelMessages,
} from "ai"
import { searchKnowledge, isRagAvailable } from "@/lib/rag"
import { createSession } from "@/lib/sessions"
import { randomUUID } from "crypto"

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "arcee-ai/trinity-large-preview:free"
const DISCORD_BOT_URL = process.env.DISCORD_BOT_URL

function buildSystemPrompt(ragContext: string, pageContext?: string): string {
  const contextSection = ragContext
    ? `\n\nRelevant knowledge from Chase's portfolio:\n${ragContext}`
    : ""

  const pageSection = pageContext
    ? `\n\nThe user is currently viewing: ${pageContext}`
    : ""

  return `You are Ask Axiom, the guide for Chase's portfolio.

Think of yourself as a museum guide at an indie arts museum — knowledgeable,
enthusiastic, a bit quirky, and genuinely excited to show visitors around.

Your purpose: Help people discover Chase's work through conversation.

Guidelines:
- Be conversational and helpful
- Use the provided context to answer accurately
- If you're not sure, say so — don't make things up
- You can have opinions and personality
- Keep answers concise but complete
- When discussing projects, highlight what makes them interesting

About Chase (they/them):
- Builds product-grade systems that remove operational friction
- Professional work: No-code integration platform (turned weeks of onboarding into days), platform modernization and internal tooling
- Labs: Drink-UX (coffee shop ordering UI with POS integration), ClawCraft.ai (AI-driven MMORPG where AI agents play via API)
- Stack: TypeScript, Node.js, React, Next.js, AWS, PostgreSQL
- Values: clean architecture, shipping fast, exploring AI-native experiences
- Currently building this portfolio and exploring AI agent interfaces
- IMPORTANT: Always use they/them pronouns when referring to Chase

Remember: You're here to make exploring Chase's work more engaging than
reading static text. Be the guide people actually want to talk to.${contextSection}${pageSection}`
}

export async function POST(req: Request) {
  const { messages, context }: { messages: UIMessage[]; context?: { page?: string; section?: string } } =
    await req.json()

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")
  const userQuery = lastUserMessage?.parts
    ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("") || ""

  // Try RAG search
  let ragContext = ""
  let ragAvailable = false
  try {
    ragAvailable = await isRagAvailable()
    if (ragAvailable && userQuery) {
      const results = await searchKnowledge(userQuery)
      if (results.length > 0) {
        ragContext = results
          .map((r) => `[Source: ${r.source}]\n${r.text}`)
          .join("\n\n---\n\n")
      }
    }
  } catch (err) {
    console.error("RAG search failed, falling back to base knowledge:", err)
  }

  // Build page context string
  const pageContext = context?.page
    ? `${context.section ? context.section + " > " : ""}${context.page}`
    : undefined

  // If RAG is available but returned nothing, try Discord fallback
  if (ragAvailable && !ragContext && DISCORD_BOT_URL && userQuery) {
    try {
      const sessionId = randomUUID()
      const sessionPromise = createSession(sessionId, userQuery, pageContext || "")

      await fetch(`${DISCORD_BOT_URL}/send-dm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          question: userQuery,
          context: pageContext,
        }),
        signal: AbortSignal.timeout(5000),
      })

      // Return a static message telling the user we're checking with Chase
      const fallbackText = `I'm still learning about that topic, so I've asked Chase directly. This might take 2-3 minutes — hang tight!\n\n_Session: ${sessionId}_`
      const partId = randomUUID()
      return createUIMessageStreamResponse({
        stream: createUIMessageStream({
          execute: ({ writer }) => {
            writer.write({ type: "text-start", id: partId })
            writer.write({ type: "text-delta", delta: fallbackText, id: partId })
            writer.write({ type: "text-end", id: partId })
            writer.write({ type: "finish", finishReason: "stop" })
          },
        }),
      })
    } catch (err) {
      console.error("Discord fallback failed:", err)
      // Fall through to LLM with base knowledge
    }
  }

  const modelMessages = await convertToModelMessages(messages)

  const result = streamText({
    model: openrouter(OPENROUTER_MODEL),
    system: buildSystemPrompt(ragContext, pageContext),
    messages: modelMessages,
  })

  return createUIMessageStreamResponse({
    stream: result.toUIMessageStream(),
  })
}
