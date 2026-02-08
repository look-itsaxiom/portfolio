# Ask Axiom — Experience Spec

## Purpose
A memorable, safe “chat” experience that answers questions about Chase using curated, verified info. It should feel clever and polished without implying full AI memory or private data access.

## Core Rules
- Only answer from a **curated knowledge base** (no hallucinations)
- If missing: respond with “I can ask Chase” + trigger a prompt (optional)
- No confidential/PII info

## Knowledge Base Sources (curated)
- Bio + positioning
- Skills + stack
- Case study summaries (NDA‑safe)
- Labs (Drink‑UX, ClawCraft)
- Working style + values

## Example Questions
- “What do you build best?”
- “Tell me about the no‑code integration platform.”
- “Why build an AI‑driven MMORPG?”
- “What stack do you prefer?”
- “What’s the next thing you want to ship?”

## UX
- Inline chat widget on site
- Suggested prompts
- Fallback: “Ask Chase” button (sends prompt via chosen channel)

## Safety + Trust
- All answers cite their source (e.g., “From Chase’s case study”)
- “Not sure” responses are allowed and preferred over guessing
