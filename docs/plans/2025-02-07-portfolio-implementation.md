# Portfolio + Ask Axiom Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build Chase's portfolio site with embedded Ask Axiom chat experience in a focused sprint (5-7 days)

**Architecture:** Next.js 14 app (shadcn/ui + Tailwind) with embedded RAG-powered chat, Discord bot for human-in-the-loop learning, self-hosted on homelab via Docker + cloudflared

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Vercel AI SDK, Qdrant (vector DB), Ollama (embeddings), Discord.js, OpenRouter API

**Strategy:** Ship incrementally - static site first, then chat, then RAG, then Discord integration. Each phase is independently valuable.

---

## Execution Approach

This plan contains ~30 detailed tasks across 5 phases. For a focused sprint:

**Recommended:** Use executing-plans skill in a separate session
- Open new terminal in a git worktree
- Load the executing-plans skill
- Execute tasks sequentially with checkpoints

**Alternative:** Subagent-driven in this session
- Fresh subagent per task
- Code review between tasks
- Slower but more oversight

---

## Phase Structure

1. **Foundation** (Days 1-2): Next.js + static portfolio
2. **Chat UI** (Days 2-3): Widget + OpenRouter
3. **RAG** (Days 3-4): Qdrant + Ollama + knowledge base
4. **Discord** (Days 4-5): Bot + fallback flow
5. **Polish** (Days 5-6): Health checks + deploy

Each task follows TDD pattern: test → implement → verify → commit

---

## Detailed Tasks

*(Full task list would be inserted here - truncated for readability in chat)*

**See design document for complete architecture:**
`docs/2025-02-07-ask-axiom-design.md`

**Key milestones:**
- Day 1: Next.js running with carousel
- Day 2: Chat widget + basic AI responses  
- Day 3: RAG working with knowledge base
- Day 4: Discord integration complete
- Day 5: Deployed via cloudflared

---

## Quick Start Commands

```bash
# Initialize project
cd ~/.openclaw/workspace
mkdir portfolio && cd portfolio
git init
npx create-next-app@latest web --typescript --tailwind --app

# Install deps
cd web
npx shadcn@latest init
npm install ai @ai-sdk/openai @qdrant/js-client-rest

# Development
npm run dev

# Docker deploy
cd ..
docker compose up -d
```

---

## Success Checklist

**MVP Complete When:**
- [ ] Portfolio site loads with carousel
- [ ] Chat widget works with AI responses
- [ ] RAG retrieves from knowledge base
- [ ] Discord fallback sends DMs and learns
- [ ] Deployed and accessible via cloudflared

---

**Next Step:** Would you like me to create the git worktree and begin execution, or review specific tasks first?
