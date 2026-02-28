---
title: "Millennium: The Living Duel"
summary: "A competitive card game where rules are common law — players argue interpretations and an AI Arbiter adjudicates."
status: "v1 Complete"
stack: ["TypeScript", "Node.js", "Express", "WebSocket", "React", "Qdrant", "Docker", "OpenRouter"]
tags: ["labs", "ai", "games"]
links: []
---

Millennium treats LLMs the way they actually work well — as judges of ambiguous situations, not chatbots. Cards have evocative descriptions instead of explicit rules. Players argue what a card should do, and an AI Arbiter makes a ruling. Those rulings persist in a Qdrant vector database, building precedent that informs future decisions. The rules are literally common law that emerges through play. v1 is done, first playtest is in the books, and 665+ server tests keep it honest.
