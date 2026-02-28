# AI & Developer Tools Expertise

## Overview
Chase builds infrastructure for AI-powered workflows — not just applications that use AI, but the orchestration layers, tooling, and interfaces that make AI agents productive. This spans Claude Code plugin development, MCP server authoring, multi-agent coordination, RAG systems, and prompt engineering.

## Claude Code
Chase uses Claude Code as a daily driver for virtually all development work — feature implementation, bug fixes, architecture planning, and creative project management. This led to building Dream Factory, a Claude Code plugin that turns a single session into a multi-department studio. Chase has working knowledge of Claude Code internals: hooks (PreToolUse, PostToolUse, SessionStart, etc.), skill files, agent teams, plugin architecture, and CLAUDE.md configuration.

## MCP Server Development
- **Layer.ai MCP:** Built from scratch — 10 tools wrapping the Layer.ai GraphQL API for cloud-based AI image/video/3D generation
- **ComfyUI MCP:** Contributed bug fixes (5 server bugs + 4 Windows test failures) and CI improvements to an open source MCP server for local image generation
- **Perspective:** MCP servers work well for tool integration, but Chase believes discoverable skill files (documentation as interface) can be more effective for teaching agents to interact with unfamiliar systems

## Multi-Agent Orchestration
Chase has built three distinct multi-agent systems, each exploring a different approach:
- **Dream Factory:** Claude Code plugin with department-based delegation and external engine dispatch (Codex CLI, Gemini CLI)
- **Coder Taskforce:** Specialized AI agents (PM, Developer, QA) collaborating via MCP in isolated Coder workspaces
- **Flight Crew:** GitHub Actions + Copilot automation for issue-to-PR-to-merge workflows

The architecture pattern across all three: Claude serves as orchestrator/planner, with specialized engines handling execution.

## RAG Systems
- **Portfolio (Ask Axiom):** Qdrant vector database with curated knowledge base, OpenRouter AI SDK for generation, Discord bot escalation for low-confidence answers
- **Millennium:** Qdrant-backed precedent system where AI Arbiter rulings persist and inform future game decisions
- **ChronicleVTT:** RAG pipeline for PF2e rules validation (Qdrant + Ollama embeddings) powering an AI Dungeon Master

## AI Art Pipeline
Chase built an end-to-end local AI art generation pipeline on Windows (RTX 4070):
- FLUX.1 Schnell + custom LoRA for pixel art generation
- Palette locking for cross-frame color consistency
- rembg background removal
- Aseprite CLI for sprite sheet assembly
- ComfyUI as the orchestration layer
- FLUX Kontext Dev for style-consistent character variations

## Prompt Engineering
- Department-specific prompt templates for art asset generation (characters, tilesets, UI elements, items, environments)
- Spawn prompts for agent team delegation with role context and tool awareness
- Game design prompts for AI Arbiter adjudication (judging logic, not prose)

## What This Means
Chase doesn't just use AI tools — he builds the tooling that makes AI agents more capable. The common thread is removing friction: between humans and AI systems, between multiple AI engines, and between creative intent and shipped output.
