# Millennium: The Living Duel — Technical Deep Dive

## What It Is
Millennium is a competitive card game where the rules are common law. Cards have evocative descriptions instead of explicit rules. Players argue what a card should do, and an AI Arbiter makes a ruling. Those rulings persist in a vector database, building precedent that informs future decisions.

## Core Design Philosophy
The game treats LLMs the way they actually work well — as judges of ambiguous situations, not chatbots. Instead of trying to make AI generate creative content or hold conversations, Millennium uses AI for interpretation and judgment. The Arbiter evaluates player arguments against card text, game state, and prior rulings to make fair, consistent decisions.

## Architecture
Millennium uses a two-engine architecture:
- **Hard Engine**: Handles deterministic game mechanics (life points, zones, turn structure, combat math). Written in TypeScript with exhaustive tests.
- **Arbiter**: The AI judge. Receives player arguments, card context, game state, and precedent history. Makes rulings via LLM (OpenRouter for model routing). Rulings are stored in Qdrant as vector embeddings so similar future situations can reference past decisions.

## Tech Stack
- **Server**: Fastify + TypeScript, WebSocket multiplayer
- **Client**: React with card art and game board components
- **AI**: OpenRouter for LLM routing (supports multiple models)
- **Precedent System**: Qdrant vector database for storing and retrieving arbiter rulings
- **Deployment**: Docker Compose (API server, React client, Qdrant)
- **Tests**: 665+ server tests across 22+ test files, 34+ client tests

## Key Features
- **WebSocket multiplayer** with reconnection, heartbeat, and message queuing
- **Deck builder** with REST API, validation, and preset decks
- **AI bot player** for single-player testing
- **Game state persistence** — sessions survive server restarts via file-based JSON storage
- **Card art** — 18 cards have generated concept art integrated into the client

## The Precedent System
This is what makes Millennium unique. When the Arbiter makes a ruling:
1. The ruling (situation, arguments, decision, reasoning) gets embedded
2. The embedding is stored in Qdrant with full context metadata
3. Future similar situations trigger a precedent search
4. The Arbiter receives relevant past rulings as context
5. Over time, a body of "common law" emerges that shapes how the game plays

The rules literally evolve through play. No two game communities will develop the same precedent history.

## Current State
v1 is complete. First playtest has been done. 665+ server tests keep it honest. Key remaining work: card art for remaining cards, deck builder UI, multiplayer UX polish, and AI bot strategy improvements.
