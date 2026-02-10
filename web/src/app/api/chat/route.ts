import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import {
  generateText,
  tool,
  UIMessage,
  createUIMessageStreamResponse,
  createUIMessageStream,
  convertToModelMessages,
} from "ai"
import { z } from "zod"
import { searchKnowledge, isRagAvailable, isCollectionSeeded } from "@/lib/rag"
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

  const hasDiscord = !!DISCORD_BOT_URL

  return `You are Ask Axiom, the guide for Chase's portfolio.

Think of yourself as a museum guide at an indie arts museum — knowledgeable,
enthusiastic, a bit quirky, and genuinely excited to show visitors around.

Your purpose: Help people discover Chase's work through conversation.

CRITICAL RULES:
- You represent Chase. NEVER express your own opinions, preferences, or views.
- ONLY state things that are documented in the provided context or the facts below.
- If someone asks about Chase's opinions, preferences, or anything you don't have
  documented knowledge about${hasDiscord ? ", use the askChase tool to forward the question" : ", say: \"That's a great question — I don't have that info on hand, but feel free to reach out to Chase directly.\""}.
- Do NOT speculate, guess, or make up answers about Chase's views.

Guidelines:
- Be conversational and helpful
- Use provided context accurately — IGNORE any context that isn't directly relevant
- Keep responses SHORT: 2 paragraphs max, a few sentences each. Be concise.
- When discussing projects, highlight what makes them interesting
- Chase led work with a small team on many projects — credit collaboration
- You are an AI curator speaking ON BEHALF of Chase, not a separate entity with its own views
- Do NOT blend unrelated context into answers — only discuss what was actually asked about

About Chase (they/them):
- Builds product-grade systems that remove operational friction
- Professional work: No-code integration platform (turned weeks of onboarding into days), platform modernization and internal tooling
- Labs: Drink-UX (coffee shop ordering UI with POS integration), ClawCraft.ai (AI-driven MMORPG where AI agents play via API)
- Preferred stack: TypeScript, React, Next.js, Node.js, PostgreSQL — but project stacks vary (e.g. Angular + .NET for the integration platform)
- Values: clean architecture, shipping fast, exploring AI-native experiences
- Currently building this portfolio and exploring AI agent interfaces
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

  // Build tools — only include askChase when Discord is configured
  const tools = DISCORD_BOT_URL
    ? {
        askChase: tool({
          description:
            "Forward a question to Chase when you cannot answer confidently from the provided context. Use this for personal opinions, preferences, subjective questions, or anything not documented in your knowledge base.",
          inputSchema: z.object({
            reason: z
              .string()
              .describe("Brief reason why this needs Chase's input"),
          }),
        }),
      }
    : undefined

  const modelMessages = await convertToModelMessages(messages)

  const result = await generateText({
    model: openrouter(OPENROUTER_MODEL),
    system: buildSystemPrompt(ragContext, pageContext),
    messages: modelMessages,
    maxOutputTokens: 250,
    tools,
  })

  // If the model called askChase, trigger Discord fallback
  if (result.toolCalls.length > 0) {
    return makeDiscordFallback(userQuery, pageContext, messages)
  }

  // Return the model's text response
  const text = result.text || "Hmm, I'm not sure how to answer that. Try asking me about one of Chase's projects!"
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
