# Portfolio v2 — Design Spec (Ask Axiom Hero)

**Date:** 2026-02-08  
**Status:** Approved direction — ready for implementation planning

## Goals
- Make **Ask Axiom** the “main course” and hero experience.
- Add **playful‑arcade + dark‑mystic** personality.
- Shift to **multi‑page** structure with richer “about me” narrative.
- Improve copy: highlight leadership **without erasing team**.
- Keep DevLog lightweight + sustainable (markdown workflow).

## Brand & Visual System
- **Vibe:** playful‑arcade + dark‑mystic (premium, curious, slightly mischievous).
- **Palette:** noir base (#0b0f14), neon cyan (#4ef5ff), violet (#8b5cf6).
- **Type:** Space Grotesk (headings), Inter/Geist (body), JetBrains Mono (system/ASCII).
- **Surface:** glassy cards, subtle glow borders, soft shadows; CRT/noise texture in hero only.
- **Motion:** low‑frequency float, hover glow, carousel transitions; honor `prefers-reduced-motion`.

## Information Architecture (Multi‑Page)
Top nav:
- **Home** (Ask Axiom stage hero)
- **About** (origin story + operating principles)
- **Impact** (overview + case studies)
- **Labs** (overview + experiments)
- **DevLog** (timeline + filters)
- **Contact / Hire Me** (concise, professional)

**Hybrid model:** Impact/Labs pages are scannable overviews that **pull in DevLog cards** tagged to each area.

## Home Hero — Ask Axiom Stage
- **Curator stage**: central “exhibit” carousel with curated mix (Impact, Labs, DevLog, RAG trivia).
- **Speech‑bubble ring** around stage with Axiom commentary snippets.
- **ASCII mascot (small)** near stage; animations: blink/idle/look‑stage/look‑user.
- **Chat behavior:** inline **below stage** on home; **right‑drawer** on other pages.
- **CTAs:** “Ask Axiom” (primary), “Explore Impact”, “Read DevLog”.

## Disclosure + Attribution
- **Subtle disclosure** wherever Ask Axiom appears (line above input):
  > “Ask Axiom is an AI curator built by Chase to showcase their work. It may ask Chase directly.”
- **Attribution policy:** prefer **“Chase led…”** and **“Chase + team…”** phrasing.
  - Avoid “Chase built everything” unless truly solo.
  - Use “we” when the outcome is clearly collaborative.
- Audit **RAG content**, **Ask Axiom prompt**, and **site copy** to align.

## Content Model + DevLog Workflow
- **Markdown content** in `web/data/`:
  - `impact/*.md`, `labs/*.md`, `devlog/*.md` (frontmatter: title, date, tags, related)
- **Exhibits list** in `web/data/exhibits.ts` for curated hero mix.
- **DevLog**: filterable timeline; tags like `impact`, `labs`, `notes`, `ai`.
- **Workflow:** Black Cat proposes DevLog candidates → drafts markdown → Skibby edits/approves → merge.

## Components / Architecture
- StageHero, ExhibitCarousel, BubbleRing, AsciiMascot, ChatDock, AxiomNote
- Shared primitives: NeonCard, GlowButton, GlassPanel
- Centralized **Axiom voice** module for disclosure + attribution consistency
- Routes: `/`, `/about`, `/impact`, `/impact/[slug]`, `/labs`, `/labs/[slug]`, `/devlog`, `/devlog/[slug]`, `/contact`

## Content Needed (Draftable)
- **Origin story:** 3–5 sentences
- **Operating principles:** 4–6 bullets
- **Impact bullets:** 2–3 case studies (problem → impact → stack)
- **Labs blurbs:** 2 projects, 2–3 sentences each

## Risks / Notes
- Chat overflow bug noted for later investigation.
- Keep hero curated (avoid automatic chaotic feeds).

## Next Step
If approved, move to **implementation plan** + worktrees.
