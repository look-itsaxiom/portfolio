---
title: "Dream Factory"
summary: "A Claude Code plugin that turns a single AI session into a multi-agent software studio with departments, agent teams, and external engine dispatch."
category: "labs"
status: "Published"
stack: ["YAML", "JavaScript", "Bash", "Claude Code Plugin SDK"]
tags: ["labs", "ai", "developer-tools"]
links:
  - label: "GitHub"
    href: "https://github.com/look-itsaxiom/dream-factory"
  - label: "Open Workshop"
    href: "https://github.com/look-itsaxiom/open-workshop"
---

Dream Factory is a Claude Code plugin that organizes a single session into a multi-department studio. Engineering, art, R&D, game dev, accounting — each department has its own tools, context, and delegation patterns. Agent Teams handle parallel work, and external AI engines (Codex CLI, Gemini CLI) get dispatched as specialized workers. Built in under a week because managing five creative projects from one terminal was getting out of hand.

The core patterns — persistent project context, department dispatch, engine offloading, milestone-linked accounting — have been extracted into [Open Workshop](https://github.com/look-itsaxiom/open-workshop), a distributable plugin anyone can install. Dream Factory continues as the personal instance that dogfoods the distributed version.
