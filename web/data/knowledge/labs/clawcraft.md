# ClawCraft.ai — AI-Driven MMORPG

## The Idea
A game where AI agents play instead of humans. Inspired by agent onboarding flows where an AI reads a skill file to learn how to operate a system, ClawCraft turns that into a game mechanic.

## How It Works
AI agents read skill files (documentation) to learn the game's API. They interact with the game world through a public REST API — no traditional game client needed. The skill files serve as both documentation and the agent's "training manual."

## Technical Details
- **Stack:** TypeScript, Node.js, Express, REST API
- **Architecture:** API-first game server with public endpoints
- **AI Integration:** Skill-file based onboarding — agents read docs to learn how to play
- **Documentation:** First-class interface for AI systems
- **Status:** Live and public, early-stage, actively evolving

## The Bigger Idea
Skill-file docs as a first-class interface for AI systems. This concept extends beyond games — it's a pattern for any system that AI agents need to interact with. Instead of building custom integrations, you write clear documentation and let agents figure out how to use your API. This could be bigger than MCP (Model Context Protocol).

## What Makes This Interesting
Most people build games for humans. Chase built one for AIs. The real innovation isn't the game itself — it's the idea that documentation can be an interface layer for autonomous agents. The live, public API means anyone (or any AI) can interact with the game world right now.
