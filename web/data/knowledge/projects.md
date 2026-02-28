# Chase's Personal Projects

## Overview
Chase is a prolific builder with 43 GitHub repositories and 65 local projects. The work spans games, SaaS platforms, AI tools, developer infrastructure, and creative pipelines. A recurring pattern: he builds tools that make building other things easier.

## Dream Factory
A Claude Code plugin that turns a single Claude Code session into a multi-agent software studio. It has specialized departments (Engineering, Art/Design, Game Dev, R&D, Accounting, Marketing), agent team delegation, and external AI engine dispatch (Codex CLI, Gemini CLI). Chase built it to manage his own tendency to start too many projects — it enforces a 5-project active limit and gives each project its own status tracking, context, and department routing. See the dedicated Dream Factory knowledge entry for full details.

## Millennium: The Living Duel
A competitive card game where the rules are "common law" — players argue interpretations and an AI arbiter judges based on logic, not prose. The AI uses LLMs for what they're actually good at: judgment and interpretation of ambiguous situations. The game has a Qdrant-backed precedent system where arbiter rulings persist and inform future decisions. 665 server tests, Docker deployment (API, client, Qdrant), OpenRouter for LLM routing. This is Chase's most actively developed personal project.

## ClawCraft.ai
An MMORPG where AI agents are the players. Agents learn the game by reading discoverable skill files (documentation as interface) and interact through a public REST API. The thesis: skill files delivered via curl are more effective than MCP servers for teaching agents to interact with unfamiliar systems. Built with TypeScript, Node.js, Express, and MongoDB. Live at clawcraft.world. See the dedicated ClawCraft knowledge entry for full details.

## FlowNote
A note-taking and workflow application built with React/Vite on the frontend and Express/Firebase on the backend. 222 tests, green build. Currently on hold while other projects are active.

## PCMM (Pocket Creature Monster Mania)
A monster collection game with a completed Game Design Document covering 152 species, 36 traits, energy cards, and a full damage formula. Has a designer tool with validated schemas matching the GDD. Content generation (moves, abilities, species) hasn't started yet. The GDD is the sole source of truth.

## ChronicleVTT
A virtual tabletop tool with an AI Dungeon Master powered by a RAG pipeline for Pathfinder 2e rules validation. Uses Qdrant + Ollama embeddings to give the AI accurate rules knowledge.

## Drink-UX
A coffee shop SaaS platform that gives independent shops a modern visual ordering experience while keeping their existing POS system (Square, Toast, Clover). Multi-app architecture with customer ordering, shop admin, and POS sync. Built with React, Next.js, and Ionic/Capacitor for mobile. Currently on hold.

## Homelab
Chase self-hosts 15+ services on his home network, exposed through Cloudflare tunnels. This includes development infrastructure, media services, and the backing services for his projects (Qdrant, Ollama, etc.). The homelab is where the portfolio's Ask Axiom RAG pipeline runs — Qdrant for vector storage, Ollama for embeddings, all self-hosted.

## Open Source Contributions
- **comfyui-mcp-server**: Contributed bug fixes (5 server bugs + 4 Windows test failures) and CI improvements to the open source MCP server for ComfyUI
- **layer-ai-mcp**: Built from scratch — a 10-tool MCP server wrapping the Layer.ai GraphQL API for cloud-based AI image/video/3D generation
- **super-productivity**: Contributed to the open source productivity tool

## AI Art Pipeline
An end-to-end local AI art generation pipeline running on Windows with an RTX 4070:
- FLUX.1 Schnell + custom LoRA for pixel art generation
- Palette locking (endesga-32) for cross-frame color consistency
- rembg for background removal
- Aseprite CLI (compiled from source) for sprite sheet assembly
- ComfyUI as the orchestration layer
- FLUX Kontext Dev for style-consistent character variations
This pipeline produces game-ready pixel art assets without cloud services.

## Game Development Breadth
Chase works across multiple game engines and genres:
- **Unity**: C#, ShaderLab, HLSL — 3D and 2D game prototypes
- **Godot**: C#, GDShader — actively exploring as a Unity alternative
- **Phaser 3**: TypeScript — browser-based games (pixel-dungeon-runner)
- **Ren'Py**: Narrative/visual novel games
The game dev work isn't just hobby projects — it drives the AI art pipeline, the Dream Factory plugin, and systems like Millennium's AI arbiter.

## The Pattern
Chase builds tools that make building things easier. Dream Factory manages projects. The AI art pipeline produces game assets. ClawCraft explores how AI agents learn systems. Millennium explores how AI judges ambiguity. The homelab provides infrastructure. Each project feeds the others.
