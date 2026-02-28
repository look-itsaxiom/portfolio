---
title: "Dream Factory: A Studio in a Terminal"
date: "2026-02-28"
summary: "Built a Claude Code plugin that turns one session into a multi-agent studio — because five projects from one terminal needed some structure."
tags: ["devlog", "ai", "developer-tools"]
related: ["dream-factory", "millennium", "clawcraft"]
---

I have a problem where I start projects faster than I finish them. Millennium, ClawCraft, FlowNote, Drink-UX, a pixel art pipeline — all of these live in my head and compete for the same Claude Code terminal. Switching between them meant losing context, re-explaining things, and generally feeling like I was fighting the tool instead of using it.

So I built Dream Factory. It's a Claude Code plugin that organizes a session into departments — engineering, art, R&D, game dev — each with their own tools and context. Projects get tracked in a YAML manifest. Agent Teams handle parallel work so I'm not the bottleneck processing every result. And when a task fits better in Codex or Gemini, the plugin dispatches it there instead.

The whole thing came together in under a week. That's partly because Claude Code plugins are surprisingly capable once you understand the hooks and skills system, and partly because I was desperate enough to stay focused.

What surprised me most is how much the structure changed the way I work. Before, I'd start a session and immediately get pulled into whatever felt urgent. Now there's a manifest, there's status tracking, there's department routing. It's not project management software — it's more like a home base that keeps the creative chaos from becoming actual chaos.

I built it for myself, but the architecture is general enough that anyone juggling multiple projects from Claude Code could get something out of it. We'll see where it goes.
