---
title: "Open Hive"
summary: "Developer collision detection for AI-assisted teams — passive tracking that catches overlapping work before it becomes a merge conflict."
category: "labs"
status: "MVP Complete"
stack: ["TypeScript","Fastify","SQLite","Docker","Claude Code Plugin SDK","Turborepo"]
tags: ["labs","ai","developer-tools"]
links:
  - label: "GitHub"
    href: "https://github.com/look-itsaxiom/open-hive"
---

When multiple developers or AI agents work on the same codebase, nobody knows they're stepping on each other's toes until the merge conflict shows up. Open Hive fixes that by treating developer intent as a first-class signal. A Claude Code plugin hooks into every prompt and file edit, passively reporting to a lightweight backend that runs collision detection in real time. Three levels: exact file overlap (zero false positives), directory proximity, and semantic keyword similarity across developer prompts. No workflow changes, no commands to remember — it just watches and warns. Built because coordinating AI agent teams across a codebase made the problem obvious.
