import { Client, GatewayIntentBits, Events } from "discord.js"
import express from "express"

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const DISCORD_USER_ID = process.env.DISCORD_USER_ID
const NEXTJS_CALLBACK_URL =
  process.env.NEXTJS_CALLBACK_URL || "http://portfolio-web:3000/api/discord-callback"
const PORT = parseInt(process.env.PORT || "3100", 10)

if (!DISCORD_BOT_TOKEN || !DISCORD_USER_ID) {
  console.error("Missing DISCORD_BOT_TOKEN or DISCORD_USER_ID")
  process.exit(1)
}

// Track active questions waiting for Chase's reply.
// Keyed by Discord message ID so replies are matched via "reply-to".
const pendingQuestions = new Map<
  string,
  { sessionId: string; resolve: (reply: string) => void }
>()

// Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
})

client.once(Events.ClientReady, (c) => {
  console.log(`Discord bot logged in as ${c.user.tag}`)
})

// Listen for DM replies from Chase
client.on(Events.MessageCreate, async (message) => {
  if (message.author.id !== DISCORD_USER_ID) return
  if (!message.channel.isDMBased()) return

  // Check if Chase used "Reply" to a specific question message
  const replyToId = message.reference?.messageId
  if (replyToId && pendingQuestions.has(replyToId)) {
    const pending = pendingQuestions.get(replyToId)!
    pendingQuestions.delete(replyToId)
    pending.resolve(message.content)
    return
  }

  // Fallback: if only one question is pending, assume it's the answer
  if (pendingQuestions.size === 1) {
    const [key, pending] = pendingQuestions.entries().next().value!
    pendingQuestions.delete(key)
    pending.resolve(message.content)
    return
  }

  // Multiple pending questions but no "reply-to" — nudge Chase
  if (pendingQuestions.size > 1) {
    const dmChannel = message.channel
    await dmChannel.send(
      `I have ${pendingQuestions.size} questions waiting — please use Discord's **Reply** feature (swipe or right-click → Reply) on the specific question you're answering so I can route it correctly.`
    )
  }
})

client.login(DISCORD_BOT_TOKEN)

// Express API
const app = express()
app.use(express.json())

app.get("/health", (_req, res) => {
  res.json({
    status: client.isReady() ? "ok" : "connecting",
    pendingQuestions: pendingQuestions.size,
  })
})

app.post("/send-dm", async (req, res) => {
  const { sessionId, question, context, history } = req.body

  if (!sessionId || !question) {
    res.status(400).json({ error: "Missing sessionId or question" })
    return
  }

  try {
    const user = await client.users.fetch(DISCORD_USER_ID!)
    const dmChannel = await user.createDM()

    const formattedMessage = [
      "**Ask Axiom Question**",
      "",
      history ? `**Conversation so far:**\n${history}\n` : null,
      `**Latest question:** "${question}"`,
      context ? `**Page:** ${context}` : null,
      "",
      "_Reply to this message to respond._",
    ]
      .filter(Boolean)
      .join("\n")

    const sentMessage = await dmChannel.send(formattedMessage)

    // Wait for Chase's reply with timeout.
    // Key by Discord message ID so reply-to matching works.
    const replyPromise = new Promise<string>((resolve, reject) => {
      pendingQuestions.set(sentMessage.id, { sessionId, resolve })

      setTimeout(() => {
        if (pendingQuestions.has(sentMessage.id)) {
          pendingQuestions.delete(sentMessage.id)
          reject(new Error("timeout"))
        }
      }, 3 * 60 * 1000)
    })

    // Don't await here — send the DM confirmation immediately
    replyPromise
      .then(async (reply) => {
        // Forward reply to Next.js
        await fetch(NEXTJS_CALLBACK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, reply }),
        })
      })
      .catch((err) => {
        console.log(`Session ${sessionId} timed out or errored: ${err.message}`)
      })

    res.json({ ok: true, message: "DM sent, waiting for reply" })
  } catch (err) {
    console.error("Failed to send DM:", err)
    res.status(500).json({ error: "Failed to send DM" })
  }
})

app.listen(PORT, () => {
  console.log(`Ask Axiom bot API listening on port ${PORT}`)
})
