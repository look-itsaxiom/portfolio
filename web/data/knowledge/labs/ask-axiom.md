# Ask Axiom — Technical Deep Dive

## What It Is
Ask Axiom is the AI chatbot embedded in Chase's portfolio. It serves as a conversational guide to Chase's work, answering questions about projects, career history, technical philosophy, and anything else documented in the knowledge base.

## Why It Exists
Chase is bad at self-promotion. Talking positively about your own work feels like bragging. So they built an AI to do it — a working example of their philosophy that AI should handle things humans find difficult, so humans can focus on what they're good at.

## How It Works (RAG Pipeline)
1. **Visitor asks a question** via the chat interface (inline on desktop, drawer on mobile)
2. **Query embedding**: The question gets embedded via Gemini's embedding API (`gemini-embedding-001`)
3. **Vector search**: The embedding is matched against a Qdrant collection (`ask-axiom-knowledge`) with a similarity threshold of 0.65
4. **Context injection**: Top matching knowledge documents are injected into the system prompt alongside the visitor's conversation history
5. **Generation**: Gemini 2.5 Flash generates a response in the "museum guide" persona
6. **Discord fallback**: If the question is too personal/subjective for the knowledge base, the model signals `[ASK_CHASE]` and the system sends a Discord DM to Chase. The visitor waits via SSE (Server-Sent Events) for Chase's direct response.

## Knowledge Base
The knowledge base lives in `data/knowledge/` as markdown files organized by category:
- `bio.md` — Background, identity, personal info
- `career.md` — Full career history (HD Fowler → Groupon → Limeade IT → Limeade Engineering → Tapcheck)
- `projects.md` — Overview of all personal projects
- `stack.md` — Languages, frameworks, tools
- `ai-tools.md` — AI tools and philosophy
- `professional/` — Detailed knowledge about professional work
- `labs/` — Detailed knowledge about lab projects

Documents are seeded into Qdrant via embedding scripts. The collection needs re-seeding when knowledge base content changes.

## Tech Stack
- **Frontend**: Next.js 16, React 19, Vercel AI SDK 6
- **LLM**: Gemini 2.5 Flash (configurable via GEMINI_MODEL env var)
- **Embeddings**: Gemini embedding-001
- **Vector DB**: Qdrant (self-hosted)
- **Fallback**: Discord.js bot for async human-in-the-loop responses
- **Streaming**: UIMessageStream for real-time response delivery

## Persona
Ask Axiom uses a "museum guide at an indie arts museum" persona — knowledgeable, enthusiastic, a bit quirky, and genuinely excited to show visitors around. It speaks on behalf of Chase using they/them pronouns, never expresses its own opinions, and only states things documented in the knowledge base.
