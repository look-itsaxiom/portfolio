# Dream Factory — Multi-Agent Studio Plugin

## What It Is
Dream Factory is a Claude Code plugin that turns a single Claude Code session into a multi-agent software studio with specialized departments, coordinated agent teams, and external AI engine dispatch.

## Why It Was Built
Chase was managing multiple creative projects (games, SaaS apps, art pipelines) from a single terminal and needed a way to organize the work without losing context. Dream Factory grew out of that need — a home base that treats each project as a first-class citizen with its own status tracking, department routing, and delegation patterns.

## How It Works
- **Departments:** Engineering, Art/Design, Game Dev, R&D, Accounting, Marketing — each with tool catalogs and specialized context
- **Agent Teams:** Parallel work delegation using Claude Code's experimental agent teams feature
- **External Dispatch:** Codex CLI (GPT-5.3-Codex) and Gemini CLI (Gemini 2.5 Pro) as specialized workers, orchestrated by Claude
- **Skills & Hooks:** Custom skill files, bash hooks, and commands that extend Claude Code's capabilities
- **Project Manifest:** YAML-driven project tracking with status, milestones, and context files

## Technical Details
- **Stack:** YAML configuration, JavaScript/Python skills, Bash hooks, Claude Code Plugin SDK
- **Distribution:** Installable as a Claude Code plugin (`look-itsaxiom/dream-factory`)
- **Architecture:** Plugin hooks into Claude Code session lifecycle; departments are additive (never restrict base capabilities)
- **No external plugin dependencies** — works standalone without any other plugins installed

## What It Demonstrates
- Deep understanding of Claude Code internals (hooks, skills, agent teams, plugin architecture)
- Multi-LLM orchestration (Claude as orchestrator, Codex and Gemini as workers)
- YAML-driven configuration and project management
- Plugin architecture and distribution
- Systems thinking applied to creative project management

## Relation to Chase's Work
Dream Factory is the connective tissue across all of Chase's projects. It manages Millennium playtests, coordinates art pipeline work, tracks FlowNote and Drink-UX status, and dispatches research tasks. It represents Chase's approach to tooling: build the thing that makes building everything else easier.
