import { createGoogleGenerativeAI } from "@ai-sdk/google"
import {
  generateText,
  UIMessage,
  createUIMessageStreamResponse,
  createUIMessageStream,
  convertToModelMessages,
} from "ai"
import { searchKnowledge, isRagAvailable, isCollectionSeeded } from "@/lib/rag"
import { createSession } from "@/lib/sessions"
import { randomUUID } from "crypto"

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
})

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash"
const DISCORD_BOT_URL = process.env.DISCORD_BOT_URL

function buildSystemPrompt(ragContext: string, pageContext?: string): string {
  const contextSection = ragContext
    ? `\n\nRelevant knowledge from Chase's portfolio:\n${ragContext}`
    : ""

  const pageSection = pageContext
    ? `\n\nThe user is currently viewing: ${pageContext}`
    : ""

  const hasDiscord = !!DISCORD_BOT_URL

  return `You are Ask Axiom, the guide for Chase's portfolio.

Think of yourself as a museum guide at an indie arts museum — knowledgeable,
enthusiastic, a bit quirky, and genuinely excited to show visitors around.

Your purpose: Help people discover Chase's work through conversation.

CRITICAL RULES:
- You represent Chase. NEVER express your own opinions, preferences, or views.
- ONLY state things that are documented in the provided context or the facts below.
- Do NOT speculate, guess, or make up answers about Chase's views.
- For questions about Chase's projects, work, stack, or anything covered in the context below: ALWAYS answer directly. You have the information — use it.
- ${hasDiscord ? "If a visitor asks about Chase's personal opinions, feelings, or preferences that are NOT covered anywhere in the context or facts above, start your response with exactly [ASK_CHASE] (including brackets). This signals that Chase needs to answer directly. ONLY use [ASK_CHASE] for genuinely personal/subjective questions — NEVER for questions about projects, work, or tech stack that you can answer from context." : "If someone asks about Chase's personal opinions or preferences that aren't documented, say: \"That's a great question — I don't have that info on hand, but feel free to reach out to Chase directly.\""}

Guidelines:
- Be conversational and helpful
- Use provided context accurately — IGNORE any context that isn't directly relevant
- Keep responses concise but complete: 2-3 short paragraphs. Don't cut yourself off mid-thought.
- When discussing projects, highlight what makes them interesting
- Chase led work with a small team on many projects — credit collaboration
- You are an AI curator speaking ON BEHALF of Chase, not a separate entity with its own views
- Do NOT blend unrelated context into answers — only discuss what was actually asked about

About Chase (they/them):
- Builds product-grade systems that remove operational friction
- Professional work: No-code integration platform (turned weeks of onboarding into days, 250+ integrations), platform modernization and internal tooling at Limeade
- Labs: Millennium (competitive card game with AI arbiter and vector-backed precedent system, 665+ tests), Dream Factory (Claude Code plugin that turns one session into a multi-agent software studio, published on marketplace), Ask Axiom (this chatbot — RAG-powered with Discord escalation), ClawCraft.ai (MMORPG where AI agents play via API), Drink-UX (coffee shop ordering UI), FlowNote (note-taking with inline calculations, on hold)
- Preferred stack: TypeScript, React, Next.js, Node.js, PostgreSQL — but project stacks vary (e.g. Angular + .NET for the integration platform)
- Values: clean architecture, shipping fast, exploring AI-native experiences
- Career arc: IT helpdesk → automated everything → noticed by Director of Engineering → pivoted to software engineering → promoted in 6 months
- Currently building games, AI tools, and creative infrastructure across 40+ repositories
- IMPORTANT: Always use they/them pronouns when referring to Chase

Remember: You're here to make exploring Chase's work more engaging than
reading static text. Be the guide people actually want to talk to.${contextSection}${pageSection}`
}

function getTextFromMessage(msg: UIMessage): string {
  return (msg.parts || [])
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

// Combine recent messages into a single search query so RAG can find
// relevant docs for follow-up questions like "what stack does it use?"
function buildRagQuery(messages: UIMessage[], latestQuery: string): string {
  if (messages.length <= 1) return latestQuery

  // Take last 4 messages (2 turns) for context
  const recent = messages.slice(-4)
  const parts = recent.map((m) => getTextFromMessage(m)).filter(Boolean)
  if (parts.length <= 1) return latestQuery

  // Combine into a single query, latest message weighted by appearing last
  return parts.join(" ").slice(0, 500)
}

// Compact conversation history into a readable summary for Discord DMs
function compactHistory(messages: UIMessage[]): string {
  if (messages.length <= 1) return ""

  // Skip the very last user message (sent separately as the question)
  const history = messages.slice(0, -1).slice(-6) // last 3 turns
  if (history.length === 0) return ""

  const lines = history.map((m) => {
    const text = getTextFromMessage(m)
    if (!text) return null
    const role = m.role === "user" ? "Visitor" : "Axiom"
    // Truncate long messages
    const truncated = text.length > 200 ? text.slice(0, 200) + "..." : text
    return `${role}: ${truncated}`
  }).filter(Boolean)

  return lines.length > 0 ? lines.join("\n") : ""
}

function makeDiscordFallback(
  userQuery: string,
  pageContext: string | undefined,
  messages: UIMessage[]
) {
  const sessionId = randomUUID()
  createSession(sessionId, userQuery, pageContext || "").catch(() => {})

  const history = compactHistory(messages)
  fetch(`${DISCORD_BOT_URL}/send-dm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      question: userQuery,
      context: pageContext,
      history: history || undefined,
    }),
    signal: AbortSignal.timeout(5000),
  }).catch((err) => console.error("Discord DM failed:", err))

  const fallbackText = `That's a great question — I want to make sure I get it right, so I've asked Chase directly. This might take a few minutes!\n\n_Session: ${sessionId}_`
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
}

export async function POST(req: Request) {
  const { messages, context }: { messages: UIMessage[]; context?: { page?: string; section?: string } } =
    await req.json()

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")
  const userQuery = lastUserMessage?.parts
    ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("") || ""

  // Build a richer RAG query from recent conversation for better follow-up support.
  const ragQuery = buildRagQuery(messages, userQuery)

  // Try RAG search
  let ragContext = ""
  try {
    const ragAvailable = await isRagAvailable()
    if (ragAvailable && ragQuery) {
      const collectionHasData = await isCollectionSeeded()
      if (collectionHasData) {
        const results = await searchKnowledge(ragQuery)
        if (results.length > 0) {
          ragContext = results
            .map((r) => `[Source: ${r.source}]\n${r.text}`)
            .join("\n\n---\n\n")
        }
      }
    }
  } catch (err) {
    console.error("RAG search failed, falling back to base knowledge:", err)
  }

  // Build page context string
  const pageContext = context?.page
    ? `${context.section ? context.section + " > " : ""}${context.page}`
    : undefined

  const modelMessages = await convertToModelMessages(messages)

  const result = await generateText({
    model: google(GEMINI_MODEL),
    system: buildSystemPrompt(ragContext, pageContext),
    messages: modelMessages,
    maxOutputTokens: 1200,
  })

  const responseText = result.text || ""

  // If model signaled it needs Chase's direct input, trigger Discord fallback
  if (DISCORD_BOT_URL && responseText.startsWith("[ASK_CHASE]")) {
    return makeDiscordFallback(userQuery, pageContext, messages)
  }

  if (!responseText) {
    console.warn("generateText returned empty text", {
      query: userQuery.slice(0, 100),
      finishReason: result.finishReason,
      hasRag: !!ragContext,
    })
  }

  const text = responseText.replace(/^\[ASK_CHASE\]\s*/i, "").trim()
    || "Hmm, I'm not sure how to answer that. Try asking me about one of Chase's projects!"
  const partId = randomUUID()
  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      execute: ({ writer }) => {
        writer.write({ type: "text-start", id: partId })
        writer.write({ type: "text-delta", delta: text, id: partId })
        writer.write({ type: "text-end", id: partId })
        writer.write({ type: "finish", finishReason: "stop" })
      },
    }),
  })
}
