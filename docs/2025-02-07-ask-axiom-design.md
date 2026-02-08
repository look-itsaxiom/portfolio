# Ask Axiom Design Document

**Date:** February 7, 2025  
**Author:** Chase (with Black Cat)  
**Status:** Design Complete — Ready for Implementation Planning

---

## Overview

**Ask Axiom** is a self-improving, human-augmented chat experience embedded in Chase's portfolio site. It serves dual purposes:

1. **Interactive portfolio feature** — Answers questions about Chase's work, skills, and projects
2. **Hero project demonstration** — Showcases AI-native UX design and RAG implementation

The system acts as a "museum guide" for the portfolio — knowledgeable, enthusiastic, and slightly quirky — welcoming visitors to explore Chase's work through conversation.

---

## Goals

- **Authentic interaction** — Real answers from curated knowledge, not hallucinations
- **Continuous learning** — System improves by escalating unknown questions to Chase
- **Showcase-worthy** — Clean architecture demonstrating modern AI/UX patterns
- **Self-hosted** — Full control, minimal external dependencies (only OpenRouter LLM)

---

## System Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                      Internet (via Cloudflare)               │
└────────────────────────────┬────────────────────────────────┘
                             │
                   ┌─────────▼──────────┐
                   │   cloudflared      │
                   └─────────┬──────────┘
                             │
              ┌──────────────▼──────────────┐
              │   portfolio-web (Next.js)   │
              │  ┌────────────────────────┐ │
              │  │ Frontend (React/shadcn)│ │
              │  │ - Hero Carousel        │ │
              │  │ - Chat Widget          │ │
              │  │ - Case Studies         │ │
              │  │ - Labs & DevLog        │ │
              │  └────────────────────────┘ │
              │  ┌────────────────────────┐ │
              │  │ API Routes             │ │
              │  │ - /api/chat            │ │
              │  │ - /api/status          │ │
              │  │ - /api/discord-callback│ │
              │  │ - /api/health          │ │
              │  └────────────────────────┘ │
              └──┬─────────┬────────┬───────┘
                 │         │        │
        ┌────────▼──┐  ┌───▼────┐  │
        │  Qdrant   │  │ Ollama │  │
        │ (Vector   │  │(Embed) │  │
        │   DB)     │  └────────┘  │
        └───────────┘               │
                            ┌───────▼────────┐
                            │ ask-axiom-bot  │
                            │   (Discord)    │
                            └───────┬────────┘
                                    │
                            ┌───────▼────────┐
                            │  Discord DM    │
                            │  (to Chase)    │
                            └────────────────┘
                                    
┌──────────────────────────────────────────┐
│  External: OpenRouter API (LLM only)     │
└──────────────────────────────────────────┘
```

### Container Breakdown

1. **portfolio-web** (Next.js)
   - Port: 3000
   - Networks: `edge` (shared with cloudflared)
   - Connects to: Qdrant, Ollama (via host), OpenRouter (external), Discord bot

2. **ask-axiom-bot** (Node.js + Discord.js)
   - Port: 3100 (internal API)
   - Networks: `edge`
   - Exposes: `POST /send-dm` endpoint

3. **qdrant** (Vector DB)
   - Port: 6333
   - Networks: `edge`
   - Persistent volume for knowledge storage

4. **ollama** (on Windows host)
   - Port: 11434
   - Accessed via `host.docker.internal:11434` or host IP
   - Model: `nomic-embed-text` or `mxbai-embed-large`

---

## User Experience Flow

### Hero Page Carousel

**Layout:**
- Auto-rotating carousel (shadcn/ui Carousel component)
- Each slide showcases one project (Tapcheck, Drink-UX, ClawCraft, etc.)
- Ask Axiom mascot (200-300px SVG) positioned in front
- Speech bubble with pre-written commentary per slide
- "Ask Axiom about this" button below

**Behavior:**
- Auto-rotates every 5-7 seconds
- Manual controls (prev/next arrows, dot indicators)
- Pauses on hover
- Button click → opens chat with project context pre-loaded

**Example Slide:**

```
┌─────────────────────────────────────────────┐
│                                             │
│     [Project Screenshot/Visual]             │
│                                             │
│        🐱 Ask Axiom                         │
│       ╭───────────────────────────╮         │
│       │ "This is where Chase      │         │
│       │  turned weeks of          │         │
│       │  integration work into    │         │
│       │  a few clicks..."         │         │
│       ╰───────────────────────────╯         │
│                                             │
│        [ Ask Axiom about this ]             │
│                                             │
└─────────────────────────────────────────────┘
```

### Site-wide Chat Widget

**Floating Button (shadcn Sheet):**
- Bottom-right corner, fixed position
- Icon: Ask Axiom mascot (small version)
- Badge: Shows notification if response pending
- Click → expands to chat panel

**Chat Panel:**
- Conversational message history
- Typing indicators (AI responding or Chase via Discord)
- Status messages ("I'm checking with Chase on that...")
- Context-aware (knows what page user is on)

---

## Conversation Flow

### Normal Flow (RAG Success)

1. User sends message
2. Generate embedding (Ollama on host)
3. Semantic search in Qdrant (top 3 results, >0.7 similarity)
4. Build prompt:
   - System instructions (museum guide persona)
   - Retrieved context from RAG
   - Current page/section context (`user is viewing: Labs > ClawCraft.ai`)
   - User question
5. Stream response from OpenRouter LLM
6. Store conversation in Qdrant for future learning

### Fallback Flow (Stumped)

1. RAG search returns no good matches (<0.7 similarity threshold)
2. Ask Axiom responds:
   > "I'm still learning about Chase, so I'm going to ask them directly. This might take 2-3 minutes — hang tight!"
3. Open SSE connection for real-time updates
4. Next.js POSTs to Discord bot `/send-dm` with question + sessionId
5. Discord bot DMs Chase

**If Chase responds within 2-3 minutes:**
- Discord bot receives reply, POSTs to `/api/discord-callback`
- Next.js finds SSE connection by sessionId
- Ask Axiom rewrites Chase's reply with personality/tone
- Streams formatted response to user via SSE
- Stores Q&A pair in Qdrant (embedded for future use)

**If timeout (>3 minutes):**
- SSE sends status update to frontend
- Show message:
   > "Chase might be away right now — want to leave a message instead?"
- Display contact form link

### Error Handling

**Ollama/Qdrant unavailable:**
- Health check fails on app startup
- Disable chat widget, show friendly message
- Display contact form as primary CTA

**Discord bot unavailable:**
- Still attempt RAG
- If stumped, show graceful error:
   > "I can't reach Chase right now, but you can contact them here: [link]"

**OpenRouter API error:**
- Show retry option
- Log error for debugging
- Fallback message if repeated failures

---

## Knowledge Base Structure

### Initial Seed Data (Embedded at Launch)

1. **Bio & Positioning**
   - Name: Chase (aka Axiom)
   - Creative/professional identity
   - General career goals ("always looking for the next challenge")

2. **Professional Impact (NDA-safe)**
   - **Tapcheck:** No-code integration platform, onboarding acceleration story
   - **Limeade/WebMD:** Admin tooling, design systems, accessibility work
   - Tech used: TypeScript, Node.js, React, AWS, etc.

3. **Labs Projects**
   - **Drink-UX:** Coffee shop ordering UI, POS integration concept
   - **ClawCraft.ai:** AI-driven MMORPG, skill-file interface paradigm
   - Tech stacks for each

4. **Tech Stack & Skills**
   - Aggregate of technologies across all projects
   - Preferred frameworks, languages, patterns
   - Sourced from: GitHub repos + case studies + labs + devlog

5. **DevLog Entries**
   - Automatically embedded as they're published
   - Timestamped, categorized

6. **Meta Knowledge** (invisible to users, Ask Axiom only)
   - How Ask Axiom works (transparency)
   - How to contact Chase
   - FAQ handling

### Storage Format (Qdrant)

**Collection:** `ask-axiom-knowledge`

**Vector Configuration:**
- Dimension: 768 (nomic-embed-text) or model-specific
- Distance metric: Cosine similarity

**Payload Schema:**
```json
{
  "text": "Full text of knowledge chunk",
  "source": "case-study/tapcheck" | "labs/clawcraft" | "devlog/2025-02-01" | "bio" | "conversation",
  "category": "professional" | "labs" | "meta" | "learned",
  "timestamp": "2025-02-07T21:00:00Z",
  "metadata": {
    "project": "tapcheck",
    "tech": ["typescript", "node", "react"],
    "tags": ["integration", "no-code"]
  }
}
```

### Learning Flow

When Chase answers via Discord:
1. Q&A pair formatted as new knowledge chunk
2. Generate embedding (Ollama)
3. Store in Qdrant with:
   - `source: "conversation"`
   - `category: "learned"`
   - `timestamp: <now>`
   - Original question + Chase's answer in `text`

---

## Data Flow & Architecture Details

### Communication Patterns

**1. Next.js ↔ Qdrant/Ollama**
- Direct HTTP connection (same Docker network or host)
- Health checks on startup (`/api/health` route)

**2. Next.js ↔ Discord Bot**
- **Next.js → Bot:** `POST http://ask-axiom-bot:3100/send-dm`
  ```json
  {
    "sessionId": "abc123",
    "question": "What's Chase's experience with TypeScript?",
    "context": "User is viewing: Professional Impact > Tapcheck"
  }
  ```
- **Bot → Next.js:** `POST http://portfolio-web:3000/api/discord-callback`
  ```json
  {
    "sessionId": "abc123",
    "reply": "Chase's raw response from Discord"
  }
  ```

**3. Next.js Client ↔ Next.js API**
- **Chat:** `POST /api/chat` (Vercel AI SDK, SSE streaming)
  ```json
  {
    "messages": [...],
    "context": { "page": "/labs/clawcraft", "section": "labs" }
  }
  ```
- **Status:** `GET /api/status/:sessionId` (SSE for real-time updates)
  - Sends events: `waiting`, `typing`, `timeout`, `response`

### Session Management

**In-Memory State (Next.js):**
```typescript
const activeSessions = new Map<string, {
  sseConnection: Response,
  question: string,
  context: object,
  createdAt: Date,
  timeoutId: NodeJS.Timeout
}>()
```

**Lifecycle:**
1. User asks question → create sessionId (UUID)
2. Open SSE connection, store in Map
3. If escalated to Discord → set 3-minute timeout
4. On reply or timeout → send final event, cleanup session
5. Cleanup stale sessions on disconnect

---

## Docker Setup

### Docker Compose Structure

**Main Homelab (`/mnt/c/Users/cskib/Projects/homelab/compose.yml`):**
```yaml
include:
  - portfolio/compose.yml

networks:
  edge:
    name: edge
```

**Portfolio Repo (`portfolio/compose.yml`):**
```yaml
services:
  portfolio-web:
    build: ./web
    container_name: portfolio-web
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
      - QDRANT_URL=http://qdrant:6333
      - OLLAMA_URL=http://host.docker.internal:11434
      - DISCORD_BOT_URL=http://ask-axiom-bot:3100
      - NODE_ENV=production
    networks:
      - edge
    depends_on:
      - qdrant
      - ask-axiom-bot

  ask-axiom-bot:
    build: ./discord-bot
    container_name: ask-axiom-bot
    restart: unless-stopped
    ports:
      - "3100:3100"
    environment:
      - DISCORD_BOT_TOKEN=${DISCORD_BOT_TOKEN}
      - DISCORD_USER_ID=${DISCORD_USER_ID}
      - NEXTJS_CALLBACK_URL=http://portfolio-web:3000/api/discord-callback
    networks:
      - edge

  qdrant:
    image: qdrant/qdrant:latest
    container_name: portfolio-qdrant
    restart: unless-stopped
    ports:
      - "6333:6333"
    volumes:
      - ./qdrant-data:/qdrant/storage
    networks:
      - edge

networks:
  edge:
    external: true
```

### Environment Variables

**`.env` file:**
```bash
# OpenRouter
OPENROUTER_API_KEY=your_key_here

# Discord
DISCORD_BOT_TOKEN=your_bot_token
DISCORD_USER_ID=your_discord_user_id

# Optional
OLLAMA_MODEL=nomic-embed-text
QDRANT_COLLECTION=ask-axiom-knowledge
```

### Cloudflare Tunnel Configuration

In Cloudflare dashboard, add route:
- **Hostname:** `portfolio.yourdomain.com`
- **Service:** `http://portfolio-web:3000`

---

## Technical Implementation Details

### Frontend (Next.js App Router)

**Technology Stack:**
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui (Carousel, Sheet, Button, etc.)
- **AI SDK:** Vercel AI SDK (`ai` package)
- **State:** React hooks + Vercel AI SDK state management

**Key Components:**

1. **`<HeroCarousel>`**
   - shadcn Carousel with auto-rotate
   - Slides defined in config/data file
   - Each slide: visual + mascot + commentary + CTA

2. **`<AskAxiomMascot>`**
   - SVG component (200-300px)
   - Animation: CSS or GSAP
   - States: idle, thinking, speaking

3. **`<ChatWidget>`**
   - Floating button (fixed bottom-right)
   - shadcn Sheet for chat panel
   - Badge for notifications

4. **`<ChatMessage>`**
   - Message bubbles (user vs AI)
   - Typing indicators
   - Timestamp formatting

5. **`<ProjectCard>`**
   - Case study/lab display
   - Tech badges (Tailwind pills)
   - Links to full pages

**Custom Hooks:**

- **`useChat`** (from Vercel AI SDK)
  - Handles message state, streaming, errors
  
- **`usePageContext`**
  ```typescript
  const { section, slug } = usePageContext()
  // Returns: { section: 'labs', slug: 'clawcraft' }
  ```

- **`useAxiomStatus(sessionId)`**
  - Opens SSE connection to `/api/status/:sessionId`
  - Returns: `{ status: 'waiting' | 'typing' | 'timeout', message?: string }`

**Routes:**

```
/                          → Hero + Carousel
/impact/[slug]             → Case study pages
/labs/[slug]               → Labs project pages
/devlog                    → DevLog index
/devlog/[slug]             → Individual devlog entry
/api/chat                  → POST: Chat messages
/api/status/[sessionId]    → GET (SSE): Status updates
/api/discord-callback      → POST: Discord bot replies
/api/health                → GET: System health check
```

### Backend API Routes

**`/api/chat` (POST):**
```typescript
// Request
{
  messages: Message[],
  context: { page: string, section: string }
}

// Response: SSE stream (Vercel AI SDK)
```

**Flow:**
1. Extract last user message
2. Generate embedding (Ollama)
3. Search Qdrant (top 3, >0.7 similarity)
4. **If good matches:**
   - Build prompt with retrieved context + page context
   - Stream LLM response (OpenRouter)
5. **If no matches:**
   - Create session, open SSE connection
   - POST to Discord bot
   - Return session ID in initial response

**`/api/status/:sessionId` (GET SSE):**
```typescript
// Events sent:
{ event: 'waiting', data: { message: 'Asking Chase...' } }
{ event: 'typing', data: { message: 'Chase is responding...' } }
{ event: 'response', data: { text: '...' } }
{ event: 'timeout', data: { message: 'Contact form...' } }
```

**`/api/discord-callback` (POST):**
```typescript
// Request
{
  sessionId: string,
  reply: string
}

// Flow:
1. Find session in activeSessions Map
2. Rewrite reply with Ask Axiom personality (quick LLM call)
3. Send via SSE to client
4. Store Q&A in Qdrant
5. Cleanup session
```

**`/api/health` (GET):**
```typescript
// Returns
{
  ollama: 'ok' | 'error',
  qdrant: 'ok' | 'error',
  discordBot: 'ok' | 'error'
}

// Frontend disables chat if ollama or qdrant are down
```

### Discord Bot Service

**Technology:**
- Node.js + Express
- discord.js library

**Endpoints:**

**`POST /send-dm`:**
```typescript
// Request
{
  sessionId: string,
  question: string,
  context?: string
}

// Flow:
1. Format message for Chase
2. Send DM to DISCORD_USER_ID
3. Listen for next message from that user
4. POST reply to NEXTJS_CALLBACK_URL
```

**Message Format to Chase:**
```
🤔 Ask Axiom Question

User asked: "What's your experience with TypeScript?"
Context: Viewing Labs > ClawCraft

Reply to this message to respond.
```

**Implementation Note:**
- Use `awaitMessages()` or event listener for Chase's reply
- Track active questions (sessionId → Promise)
- Timeout handling (3 minutes)

### Qdrant Setup

**Collection Configuration:**
```typescript
await client.createCollection('ask-axiom-knowledge', {
  vectors: {
    size: 768, // nomic-embed-text dimension
    distance: 'Cosine'
  }
})
```

**Seeding Knowledge Base:**
- Script: `scripts/seed-knowledge.ts`
- Reads from: `data/knowledge/` directory
  - `bio.md`
  - `professional/tapcheck.md`
  - `labs/clawcraft.md`
  - etc.
- Generates embeddings, uploads to Qdrant

**Search Query:**
```typescript
const results = await client.search('ask-axiom-knowledge', {
  vector: questionEmbedding,
  limit: 3,
  score_threshold: 0.7
})
```

### Ask Axiom Personality (System Prompt)

```
You are Ask Axiom, the guide for Chase's portfolio.

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

Current context: {pageContext}

Relevant knowledge:
{ragContext}

Remember: You're here to make exploring Chase's work more engaging than 
reading static text. Be the guide people actually want to talk to.
```

---

## Phased Implementation Plan (High-Level)

### Phase 1: Foundation
- Next.js app setup (shadcn/ui + Tailwind)
- Static portfolio pages (hero, case studies, labs)
- Basic styling and responsive design

### Phase 2: RAG Infrastructure
- Qdrant setup and seeding
- Ollama integration for embeddings
- Knowledge base structure and scripts

### Phase 3: Chat (Basic)
- Chat widget UI
- OpenRouter integration
- RAG search and response flow

### Phase 4: Discord Integration
- Discord bot service
- Fallback flow (escalation to Chase)
- SSE status updates

### Phase 5: Learning & Polish
- Q&A storage in Qdrant
- Hero carousel with mascot
- Context injection
- Performance optimization

### Phase 6: Deployment
- Docker Compose integration
- Cloudflare tunnel configuration
- Monitoring and health checks

---

## Success Criteria

**Functional:**
- ✅ Chat answers 80%+ of questions from curated knowledge
- ✅ Escalation to Chase works reliably (Discord DM → response → user)
- ✅ New Q&A pairs stored and retrievable for future questions
- ✅ System gracefully handles downtime (health checks, fallbacks)

**UX:**
- ✅ Chat feels natural and responsive
- ✅ Carousel engages visitors on hero page
- ✅ Portfolio showcases professional work + labs effectively
- ✅ Mobile-responsive throughout

**Portfolio Value:**
- ✅ Demonstrates AI/RAG implementation
- ✅ Shows full-stack Next.js skills
- ✅ Highlights systems thinking and UX design
- ✅ Serves as conversation starter in interviews

---

## Open Questions / Future Considerations

1. **Analytics:** Track which questions are asked most, refine knowledge base
2. **Mascot Design:** Create/animate the Ask Axiom character (SVG or Lottie)
3. **Voice:** Add TTS option for Ask Axiom responses? (fun experiment)
4. **Multi-language:** Support other languages via embeddings?
5. **Rate Limiting:** Prevent abuse of chat feature
6. **Conversation History:** Should users be able to see past conversations?

---

## Next Steps

1. **Create implementation plan** (detailed task breakdown)
2. **Set up git worktree** for isolated development
3. **Phase 1 implementation** (Next.js foundation + static portfolio)

---

**End of Design Document**
