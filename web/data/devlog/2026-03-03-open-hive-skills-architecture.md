---
title: "Open Hive: Skills Instead of Features"
date: "2026-03-03"
summary: "Redesigned Open Hive's extensibility model — integrations are Claude Code skills, not built-in code. Run a skill, transform your instance."
tags: ["devlog", "ai", "developer-tools", "architecture"]
related: ["open-hive", "dream-factory"]
---

Open Hive started as a simple idea: if multiple developers (or AI agents) are working on the same codebase, someone should notice before the merge conflict. A Claude Code plugin passively captures what you're doing and a backend compares it against everyone else in real time. Three levels of detection — same file, same directory, semantic keyword overlap. No commands, no workflow changes.

The MVP worked. 26 tests, 12 API endpoints, Docker deployment. But then came the roadmap problem. Slack webhooks, Teams integration, Discord, GitHub OAuth, GitLab OAuth, Azure DevOps, PostgreSQL adapter, web dashboard, embedding models, LLM comparison. Ten features, each with its own maintenance burden, documentation, and configuration surface. The traditional path: build all of it, support all of it, watch the codebase bloat with integrations most users don't need.

Instead, I stole an idea from a project called nanoclaw: distribute Claude Code skills, not integration code. A skill is a markdown file that teaches Claude how to transform your installation. Want Slack notifications? Run `/hive add-slack` and Claude reads the skill, adds a Slack formatter to your backend, wires it in, adds tests, rebuilds. Want GitHub OAuth? `/hive add-github-oauth`. Want something that doesn't exist yet? `/hive build-skill` and Claude scaffolds a new skill using the documented extension points.

The key architectural work was making this possible: a generic webhook emitter that fires standardized payloads, a notification formatter interface that skills register against, an auth middleware placeholder that OAuth skills replace, and a store adapter interface that lets a PostgreSQL skill swap in without touching core code. Four extension points, 40 tests, zero platform-specific code in the core.

The result is two plugins. A user plugin for the Anthropic marketplace — lightweight, hooks-only, zero backend knowledge. And an admin skills library for whoever runs the backend — each skill a self-contained transformation that Claude applies on request. The skill IS the documentation. The skill IS the implementation guide. The skill IS the installer. One file, three jobs.

What excites me most is the community potential. Contributing an integration to Open Hive doesn't mean writing a PR against core code with all the review overhead that implies. It means writing a markdown file that describes the transformation. The review bar is lower, the surface area is smaller, and anyone who can describe what they want to Claude can build it.

Forty tests pass. Build is green across three packages. Time to write the first skills and see if the architecture holds up under real use.
