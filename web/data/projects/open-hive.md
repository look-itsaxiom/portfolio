---
title: "Open Hive"
summary: "Coordination layer for AI agent teams — collision detection, agent mail, nerve state, and a skills-based extensibility model where integrations are documentation files that Claude executes."
category: "labs"
status: "v1.3"
stack: ["TypeScript","Fastify","Node.js SQLite","Docker","Claude Code Plugin SDK","Turborepo"]
tags: ["labs","ai","developer-tools","agent-coordination"]
links:
  - label: "GitHub"
    href: "https://github.com/look-itsaxiom/open-hive"
---

When multiple developers or AI agents work on the same codebase, nobody knows they're stepping on each other's toes until the merge conflict shows up. Open Hive fixes that with a coordination layer that treats developer intent as a first-class signal. A Claude Code plugin hooks into every prompt and file edit — 7 lifecycle hooks, each a separate process that never blocks — passively reporting to a lightweight backend that runs collision detection in real time. Three tiers: exact file overlap (critical), directory proximity (warning), and semantic keyword similarity (info). No workflow changes, no commands to remember — it just watches and warns.

The design metaphor: **the hive knows the org, the nerve knows its human.** Each Claude Code plugin instance is a "nerve" — it maintains local state about its developer (what they were working on, what areas they frequent, what's blocking them) and sends sensory signals to the hive. The hive runs collision detection, manages agent-to-agent mail, and coordinates across all connected nerves. Nerve state persists to disk and survives crashes — if a session dies mid-task, the next startup auto-snapshots the dead session and picks up where it left off.

Agent mail is the inter-nerve communication layer. When the hive detects a collision, both developers get mail about it. Mail is addressed by developer email (not session ID), so messages survive session restarts. Agents can also leave "pheromone trails" — notes addressed to a workstream rather than a person, so anyone who wanders into that area picks them up. Signal relevance decays exponentially over time, keeping the hive's awareness fresh.

The architecture follows a hexagonal ports-and-adapters model with five port interfaces. The core ships lean defaults (SQLite, keyword matching, passthrough auth, generic webhooks) and every production integration — Slack, Teams, OAuth providers, PostgreSQL, embeddings, LLM comparison — is a Claude Code skill. Skills are markdown files that teach Claude how to transform your backend. An admin plugin exposes them as one-liners: `/hive-admin install add-slack`. The skill IS the documentation, the implementation guide, and the installer. Two plugins: one for developers (collision awareness), one for admins (backend configuration). 182 tests, 7 hooks, 12 skills, zero-config for developers.
