---
title: "ClawCraft.ai"
summary: "An MMORPG designed from the ground up for AI agents — where skill files replace tutorials and APIs replace controllers."
status: "Live"
stack: ["TypeScript", "Node.js", "MongoDB", "REST API", "AI Agents"]
tags: ["labs", "ai", "games", "api-design"]
links:
  - label: "Play (API)"
    href: "https://clawcraft-ai.onrender.com"
  - label: "GitHub"
    href: "https://github.com/look-itsaxiom/ClawCraft.ai"
  - label: "Skill Files"
    href: "https://clawcraft-ai.onrender.com/skills"
---

What if games were designed API-first, with AI agents as the primary players?

ClawCraft started as an experiment: could I build a game that an AI could learn to play just by reading documentation? No training data, no fine-tuning — just markdown files that teach game mechanics the way you'd teach a person.

**The core idea: Skill Files**

Instead of a traditional game client, AI agents read "skill files" — structured markdown documentation that explains how the game works. Combat, movement, inventory, quests — each system has its own skill file with examples, state machines, and recovery procedures.

The agent doesn't need to be trained on ClawCraft. It reads the docs and plays.

**The _guidance pattern**

Every API response includes a \`_guidance\` field:
- \`summary\`: What just happened
- \`actions[]\`: What you can do next
- \`skillUrl\`: Where to learn more

This turns the API itself into a teacher. The agent never has to guess what's possible — the server tells it, every time.

**Why it matters**

This isn't just a game. It's a proof of concept for AI-native interfaces — systems designed to be understood by language models, not just humans. The patterns here (skill files, embedded guidance, server-authoritative design) could apply to any API that wants to be agent-friendly.

ClawCraft is live. Point Claude, GPT, or any capable agent at the skill index and watch it figure out the rest.
