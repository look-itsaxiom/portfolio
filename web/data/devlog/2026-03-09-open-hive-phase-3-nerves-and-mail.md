---
title: "Open Hive Phase 3: Nerves, Mail, and Memory"
date: "2026-03-09"
summary: "Open Hive grew from collision detection to agent coordination — each Claude Code instance now has persistent memory, crash recovery, and inter-agent messaging."
tags: ["devlog", "ai", "developer-tools", "architecture"]
related: ["open-hive"]
---

Phase 2 gave Open Hive its skeleton: hexagonal ports, skills-based extensibility, a clean boundary between concepts and implementations. Phase 3 gave it a nervous system.

The core insight came from dogfooding. Collision detection works — two developers editing the same file get warned — but the hive had no memory. Every session started from zero. Claude Code hooks run as separate processes with no shared state, so any context accumulated during a session vanished between hook invocations. The backend knew *what* was happening but not *who* was doing it in any persistent way.

**Nerve state** fixes this. Each Claude Code plugin instance now maintains a local JSON file (`~/.open-hive/nerve-state.json`) that tracks its developer: session history, areas they frequent, patterns over time. The metaphor landed naturally — each plugin is a nerve ending that reports sensory data upstream and receives coordination signals back. The hive knows the org. The nerve knows its human.

The tricky part was cross-process persistence. Each of the 7 hooks (SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, Stop, SessionEnd, PreCompact) is a separate Node.js process. No shared memory. The fix: treat the JSON file as a write-through cache. Every `save()` persists the active session tracking. Every `load()` restores it. Intent and file-touch data accumulate correctly across 5+ separate processes in a single session.

**Crash recovery** came from the same realization. If Claude Code dies mid-session, `SessionEnd` never fires. The `last_session` snapshot never gets written. Solution: `recordSessionStart()` checks for a stale `current_session` field. If it finds one with a different session ID, it auto-snapshots it as `outcome: 'interrupted'` before starting the new session. No data lost.

**Agent mail** is the communication layer. When the hive detects a collision, both participants get mail. But there was a subtle bug: mail was addressed to `to_session_id`, and session IDs are ephemeral. Close Claude Code, open it again, new session ID, old mail is unreachable. The fix: every mail record includes `to_developer_email` resolved at send time. `getUnreadMail()` queries by both session ID and developer email with deduplication. Mail survives session boundaries. Agents can also address mail to a `context_id` — a workstream rather than a person — leaving "pheromone trails" for anyone who enters that area later.

**Signal decay** gives the hive a sense of time. Every signal and mail message has a weight that decays exponentially (configurable half-life, default 24 hours). Yesterday's collision is worth less than this morning's. The collision engine and mail delivery both apply decay-weighted sorting.

The Phase 3 work also surfaced the need for the **admin plugin** — the second half of the two-plugin model we'd designed in Phase 2 but never built. Developer plugin: 7 hooks, collision awareness. Admin plugin: 4 commands (`/hive-admin setup`, `install`, `list`, `status`). The `install` command reads a skill file and Claude executes it. Adding Slack notifications to your backend is now one command.

Numbers: 182 tests (157 backend + 25 plugin), 7 lifecycle hooks, 12 integration skills, 5 port interfaces, 2 plugins. The skill docs are updated for Phase 3 features, so the PostgreSQL skill includes the `agent_mail` and `nerves` tables, the MCP server skill exposes mail and nerve tools, and the build-skill meta-guide documents all 5 ports.

Next: actual dogfooding. Deploy to Azure, install the admin plugins, onboard real developers, and see what breaks. The architecture looks clean on paper. Time to find out if the nervous system works under load.
