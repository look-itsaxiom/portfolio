---
title: "Ask Axiom"
summary: "A RAG-powered portfolio chatbot that guides visitors through Chase's work — because talking positively about yourself is harder than building an AI to do it."
category: labs
status: "Live"
stack: ["TypeScript", "Next.js", "Vercel AI SDK", "Qdrant", "Gemini", "Discord.js"]
tags: ["labs", "ai", "portfolio"]
links: []
---

Chase is bad at talking about themselves. Talking positively about your own work feels like bragging, so they built an AI to do it instead. Ask Axiom is the chatbot embedded in this portfolio — it answers questions about Chase's projects, career, and philosophy using a curated knowledge base.

Under the hood, it's a RAG pipeline: visitor questions get embedded via Gemini, matched against a Qdrant vector database of knowledge documents, and the relevant context gets injected into the system prompt. When Axiom doesn't know something personal enough to require Chase's direct input, it escalates to Discord — Chase gets a DM, types a response, and the visitor sees it in real time via SSE.

It's a working example of Chase's philosophy on AI: handle the thing the human finds difficult (self-promotion), so the human can focus on what they're good at (building things).
