# Portfolio v2 (Ask Axiom Hero) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship the v2 multi‑page redesign with Ask Axiom as the hero, a playful‑mystic visual system, richer narrative copy, and consistent AI disclosure/attribution.

**Architecture:** Next.js App Router with markdown‑based content loaders, curated hero “exhibits,” and shared Axiom voice utilities. Home uses inline chat; other pages use a drawer chat.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, shadcn/ui, TypeScript, gray‑matter.

---

### Task 1: Add content parsing + validation harness

**Files:**
- Modify: `web/package.json`
- Create: `web/src/lib/content.ts`
- Create: `web/scripts/validate-content.ts`

**Step 1: Write failing validation script**

Create `web/scripts/validate-content.ts`:
```ts
import { getAllImpact, getAllLabs, getAllDevlog } from "@/lib/content"

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const impact = getAllImpact()
const labs = getAllLabs()
const devlog = getAllDevlog()

assert(impact.length > 0, "Expected at least 1 impact entry")
assert(labs.length > 0, "Expected at least 1 labs entry")
assert(devlog.length > 0, "Expected at least 1 devlog entry")

console.log("Content validation passed")
```

**Step 2: Run validation (expect FAIL)**

Run:
```bash
cd web
npx tsx scripts/validate-content.ts
```
Expected: FAIL (content loaders not implemented yet).

**Step 3: Add gray‑matter dependency**

Update `web/package.json`:
```json
"dependencies": {
  "gray-matter": "^4.0.3",
  ...
}
```

**Step 4: Implement content loader**

Create `web/src/lib/content.ts`:
```ts
import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

const DATA_ROOT = path.join(process.cwd(), "data")

type Link = { label: string; href: string }

export type ImpactEntry = {
  slug: string
  title: string
  summary: string
  role: string
  impact: string[]
  stack: string[]
  tags: string[]
}

export type LabEntry = {
  slug: string
  title: string
  summary: string
  status: string
  stack: string[]
  tags: string[]
  links: Link[]
}

export type DevlogEntry = {
  slug: string
  title: string
  date: string
  summary: string
  tags: string[]
  related: string[]
}

function readDir(dir: string) {
  const full = path.join(DATA_ROOT, dir)
  return fs.readdirSync(full).filter((f) => f.endsWith(".md"))
}

function readMarkdown(dir: string, filename: string) {
  const full = path.join(DATA_ROOT, dir, filename)
  const raw = fs.readFileSync(full, "utf-8")
  const { data, content } = matter(raw)
  return { data, content }
}

export function getAllImpact(): ImpactEntry[] {
  return readDir("impact").map((file) => {
    const slug = file.replace(/\.md$/, "")
    const { data } = readMarkdown("impact", file)
    return {
      slug,
      title: data.title,
      summary: data.summary,
      role: data.role,
      impact: data.impact ?? [],
      stack: data.stack ?? [],
      tags: data.tags ?? [],
    }
  })
}

export function getImpactBySlug(slug: string) {
  const { data, content } = readMarkdown("impact", `${slug}.md`)
  return { slug, content, ...data } as ImpactEntry & { content: string }
}

export function getAllLabs(): LabEntry[] {
  return readDir("labs").map((file) => {
    const slug = file.replace(/\.md$/, "")
    const { data } = readMarkdown("labs", file)
    return {
      slug,
      title: data.title,
      summary: data.summary,
      status: data.status,
      stack: data.stack ?? [],
      tags: data.tags ?? [],
      links: data.links ?? [],
    }
  })
}

export function getLabBySlug(slug: string) {
  const { data, content } = readMarkdown("labs", `${slug}.md`)
  return { slug, content, ...data } as LabEntry & { content: string }
}

export function getAllDevlog(): DevlogEntry[] {
  return readDir("devlog").map((file) => {
    const slug = file.replace(/\.md$/, "")
    const { data } = readMarkdown("devlog", file)
    return {
      slug,
      title: data.title,
      date: data.date,
      summary: data.summary,
      tags: data.tags ?? [],
      related: data.related ?? [],
    }
  })
}

export function getDevlogBySlug(slug: string) {
  const { data, content } = readMarkdown("devlog", `${slug}.md`)
  return { slug, content, ...data } as DevlogEntry & { content: string }
}
```

**Step 5: Re‑run validation (expect FAIL until content exists)**
```bash
npx tsx scripts/validate-content.ts
```
Expected: FAIL (no content files yet).

**Step 6: Commit**
```bash
git add package.json package-lock.json src/lib/content.ts scripts/validate-content.ts
git commit -m "feat: add content loader and validation script"
```

---

### Task 2: Add v2 content files (full copy pass)

**Files:**
- Create: `web/data/about.md`
- Create: `web/data/impact/tapcheck.md`
- Create: `web/data/impact/limeade.md`
- Create: `web/data/labs/drink-ux.md`
- Create: `web/data/labs/clawcraft.md`
- Create: `web/data/devlog/2026-02-09-axiom-stage.md`
- Create: `web/data/devlog/2026-02-08-ask-axiom-fallback.md`
- Create: `web/data/devlog/2026-02-07-portfolio-v2-direction.md`
- Create: `web/data/exhibits.ts`

**Step 1: Add About narrative + principles**

Create `web/data/about.md`:
```md
---
title: "About Chase"
summary: "I build systems that remove operational friction and explore AI-native experiences."
principles:
  - "Lead with clarity: define the problem before writing code."
  - "Design for operators, not just for happy-path users."
  - "Ship small, learn fast, iterate with intent."
  - "Automate the boring parts so humans can focus on the creative ones."
  - "Treat documentation as product UX, not an afterthought."
---

I’m Chase — a systems‑minded engineer who loves making complex things feel simple.
My professional work focuses on product‑grade platforms that reduce operational friction. In the lab, I explore AI‑native interfaces and playful experiments that hint at what software feels like when agents are first‑class users.

I’m most at home when I can connect product, design, and engineering into one coherent system. If there’s a bottleneck, I want to unstick it. If there’s a repetitive workflow, I want to eliminate it. If there’s a new interface frontier, I want to prototype it.
```

**Step 2: Add Impact entries**

Create `web/data/impact/tapcheck.md`:
```md
---
title: "No‑Code Integration Platform"
summary: "Chase led design and development of a no‑code integration platform with a small team, reducing partner onboarding from weeks to days."
role: "Lead developer + designer (with a small team)"
impact:
  - "Cut onboarding timelines from weeks to days."
  - "Enabled admins to configure schemas + transformations without engineering."
  - "Established foundation for API‑driven workflows."
stack: ["TypeScript", "Node.js", "React", "AWS", "PostgreSQL"]
tags: ["impact", "integrations", "platform"]
---

Partner data arrived in every shape imaginable. Instead of burning sprints on one‑off mappings, Chase and team built a no‑code integration system that let admins define schemas and transformations through UI. The work started with file‑based inputs, expanded into timeclock and payroll integrations, and paved the path for API‑driven workflows. The result: onboarding went from “schedule a sprint” to “ship it this week.”
```

Create `web/data/impact/limeade.md`:
```md
---
title: "Platform Modernization + Internal Tooling"
summary: "Chase led modernization efforts and internal tooling that improved delivery speed, accessibility, and developer experience."
role: "Lead engineer with cross‑functional partners"
impact:
  - "Created a one‑touch dev environment to reduce onboarding time."
  - "Modernized legacy systems via strangler‑pattern migration."
  - "Improved accessibility + performance in admin tooling."
stack: ["TypeScript", "React", "Node.js", "Design Systems", "Accessibility"]
tags: ["impact", "modernization", "tooling"]
---

Chase started in IT, automated everything possible, and got pulled into engineering. With strong cross‑functional partners, they modernized legacy systems using strangler‑pattern migration, built internal tooling that removed friction, and improved accessibility and performance in the admin experience.
```

**Step 3: Add Labs entries**

Create `web/data/labs/drink-ux.md`:
```md
---
title: "Drink‑UX"
summary: "A multi‑app SaaS concept that gives indie coffee shops a Starbucks‑grade ordering UI without replacing their POS."
status: "Pre‑demo (frontend mostly there; integrations WIP)"
stack: ["TypeScript", "React", "Next.js", "PWA", "POS APIs"]
tags: ["labs", "saas", "pwa"]
links:
  - label: "Demo"
    href: "#"
---

Most coffee shops are stuck with clunky POS menus. Drink‑UX lets shops keep Square/Toast/Clover while giving customers a visual drink‑builder experience. The front‑end is demo‑ready; integrations are in progress.
```

Create `web/data/labs/clawcraft.md`:
```md
---
title: "ClawCraft.ai"
summary: "An AI‑driven MMORPG where agents play via API, exploring skill files as a first‑class interface."
status: "Live and evolving"
stack: ["TypeScript", "Node.js", "Express", "AI Agents", "REST API"]
tags: ["labs", "ai", "games"]
links:
  - label: "Live Site"
    href: "https://clawcraft.ai"
---

ClawCraft.ai treats AI agents as the primary players. Agents read skill files to learn the world and interact through a public API instead of a traditional client. It’s an exploration of AI‑native interfaces — beyond games.
```

**Step 4: Add DevLog entries**

Create `web/data/devlog/2026-02-09-axiom-stage.md`:
```md
---
title: "Ask Axiom as a Curator Stage"
date: "2026-02-09"
summary: "Framed Ask Axiom as the hero experience with a curated carousel stage and commentary bubbles."
tags: ["devlog", "design", "ai"]
related: ["tapcheck", "drink-ux", "clawcraft"]
---

I reframed the homepage around Ask Axiom as a curator. Instead of a generic hero, the site now has a stage where Axiom highlights my work like exhibits in a museum. The chat becomes the main course rather than an add‑on.
```

Create `web/data/devlog/2026-02-08-ask-axiom-fallback.md`:
```md
---
title: "Discord‑Backed Ask Axiom"
date: "2026-02-08"
summary: "Wired Ask Axiom to ask me directly via Discord when it can’t answer from the knowledge base."
tags: ["devlog", "ai", "systems"]
related: ["tapcheck"]
---

Ask Axiom now escalates to me when it doesn’t know the answer. The chat asks for permission, pings me in Discord, and streams the response back to the visitor. It’s a low‑friction human‑in‑the‑loop interface.
```

Create `web/data/devlog/2026-02-07-portfolio-v2-direction.md`:
```md
---
title: "V2 Direction: Playful‑Mystic Portfolio"
date: "2026-02-07"
summary: "Locked a playful‑arcade + dark‑mystic aesthetic and multi‑page structure for the portfolio v2 redesign."
tags: ["devlog", "design"]
related: ["tapcheck", "drink-ux", "clawcraft"]
---

V2 is a shift from a single‑page layout to a multi‑page story. Ask Axiom becomes the hero, the site gains an About narrative + principles section, and Impact/Labs link into DevLog entries for a richer story trail.
```

**Step 5: Create curated exhibits list**

Create `web/data/exhibits.ts`:
```ts
export type Exhibit = {
  slug: string
  title: string
  category: "impact" | "labs" | "devlog" | "trivia"
  description: string
  axiomNote: string
  href: string
}

export const exhibits: Exhibit[] = [
  {
    slug: "tapcheck",
    title: "No‑Code Integration Platform",
    category: "impact",
    description: "Onboarding in days, not weeks.",
    axiomNote: "Chase led this with a small team — the impact is very real.",
    href: "/impact/tapcheck",
  },
  {
    slug: "drink-ux",
    title: "Drink‑UX",
    category: "labs",
    description: "A better coffee ordering UI.",
    axiomNote: "A playful interface with serious UX intent.",
    href: "/labs/drink-ux",
  },
  {
    slug: "clawcraft",
    title: "ClawCraft.ai",
    category: "labs",
    description: "A game built for AI agents.",
    axiomNote: "This is what happens when APIs become the game client.",
    href: "/labs/clawcraft",
  },
  {
    slug: "axiom-stage",
    title: "Ask Axiom Stage",
    category: "devlog",
    description: "Ask Axiom becomes the hero experience.",
    axiomNote: "A curator should have a stage.",
    href: "/devlog/2026-02-09-axiom-stage",
  },
  {
    slug: "trivia-1",
    title: "RAG Trivia",
    category: "trivia",
    description: "Chase likes building AI interfaces where docs are the UI.",
    axiomNote: "Docs as interface is a recurring theme.",
    href: "/about",
  },
]
```

**Step 6: Re‑run validation (expect PASS)**
```bash
npx tsx scripts/validate-content.ts
```
Expected: PASS.

**Step 7: Commit**
```bash
git add data/about.md data/impact data/labs data/devlog data/exhibits.ts
git commit -m "feat: add v2 content and curated exhibits"
```

---

### Task 3: Add Axiom voice utilities + update chat prompt

**Files:**
- Create: `web/src/lib/axiom-voice.ts`
- Modify: `web/src/app/api/chat/route.ts`
- Modify: `web/src/lib/rag.ts` (if needed for attribution/notes)

**Step 1: Add Axiom voice constants**

Create `web/src/lib/axiom-voice.ts`:
```ts
export const AXIOM_DISCLOSURE =
  "Ask Axiom is an AI curator built by Chase to showcase their work. It may ask Chase directly."

export const AXIOM_ATTRIBUTION_GUIDE = `
Attribution rules:
- Prefer “Chase led…” or “Chase and a small team…”
- Use “we” for clearly collaborative outcomes
- Avoid implying Chase did everything solo unless explicitly true
`
```

**Step 2: Update Ask Axiom system prompt**

In `web/src/app/api/chat/route.ts`, update the system prompt block to include:
```ts
Guidelines:
- Be conversational and helpful
- Use provided context accurately
- If unsure, say so
- Chase led work with a small team on many projects — credit collaboration
- You are an AI curator, not Chase
```

**Step 3: Run lint**
```bash
npm run lint
```
Expected: PASS.

**Step 4: Commit**
```bash
git add src/lib/axiom-voice.ts src/app/api/chat/route.ts
git commit -m "feat: add Axiom disclosure and attribution guidance"
```

---

### Task 4: Rebuild navigation + multi‑page routes (skeletons)

**Files:**
- Modify: `web/src/components/site-header.tsx`
- Modify: `web/src/components/site-footer.tsx`
- Modify: `web/src/app/layout.tsx`
- Modify: `web/src/app/page.tsx`
- Create: `web/src/app/about/page.tsx`
- Create: `web/src/app/impact/page.tsx`
- Create: `web/src/app/impact/[slug]/page.tsx`
- Create: `web/src/app/labs/page.tsx`
- Create: `web/src/app/labs/[slug]/page.tsx`
- Create: `web/src/app/devlog/page.tsx`
- Create: `web/src/app/devlog/[slug]/page.tsx`
- Create: `web/src/app/contact/page.tsx`

**Step 1: Update SiteHeader nav links**

`web/src/components/site-header.tsx` should link to pages (no hash anchors):
```tsx
<nav className="flex items-center gap-6 text-sm">
  <Link href="/">Home</Link>
  <Link href="/about">About</Link>
  <Link href="/impact">Impact</Link>
  <Link href="/labs">Labs</Link>
  <Link href="/devlog">DevLog</Link>
  <Link href="/contact">Contact</Link>
</nav>
```

**Step 2: Create page skeletons**

Example `web/src/app/about/page.tsx`:
```tsx
import { readFileSync } from "node:fs"
import path from "node:path"

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-semibold">About Chase</h1>
      <p className="mt-4 text-muted-foreground">Story + principles live here.</p>
    </section>
  )
}
```
Repeat for other pages (placeholders for now).

**Step 3: Update `web/src/app/page.tsx`**

Replace sections with only the new hero:
```tsx
import { StageHero } from "@/components/stage-hero"

export default function Home() {
  return <StageHero />
}
```

**Step 4: Run lint**
```bash
npm run lint
```
Expected: PASS.

**Step 5: Commit**
```bash
git add src/components/site-header.tsx src/app

git commit -m "feat: add multi-page routes and update navigation"
```

---

### Task 5: Build Stage Hero + exhibit carousel

**Files:**
- Create: `web/src/components/stage-hero.tsx`
- Create: `web/src/components/exhibit-carousel.tsx`
- Modify: `web/src/components/hero-carousel.tsx` (delete or deprecate)

**Step 1: Create `ExhibitCarousel`**

`web/src/components/exhibit-carousel.tsx`:
```tsx
"use client"

import { exhibits } from "@/data/exhibits"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

export function ExhibitCarousel() {
  return (
    <Carousel opts={{ loop: true }} className="w-full">
      <CarouselContent>
        {exhibits.map((exhibit) => (
          <CarouselItem key={exhibit.slug}>
            <div className="rounded-2xl border border-primary/30 bg-card/60 p-8 shadow-[0_0_30px_rgba(78,245,255,0.12)]">
              <div className="text-sm uppercase tracking-wide text-primary/80">{exhibit.category}</div>
              <h2 className="mt-2 text-2xl font-semibold">{exhibit.title}</h2>
              <p className="mt-2 text-muted-foreground">{exhibit.description}</p>
              <a href={exhibit.href} className="mt-4 inline-flex text-sm text-primary hover:underline">
                View exhibit →
              </a>
              <p className="mt-4 text-sm italic text-muted-foreground">“{exhibit.axiomNote}”</p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-4 flex items-center justify-center gap-4">
        <CarouselPrevious className="static translate-y-0" />
        <CarouselNext className="static translate-y-0" />
      </div>
    </Carousel>
  )
}
```

**Step 2: Create `StageHero`**

`web/src/components/stage-hero.tsx`:
```tsx
import { ExhibitCarousel } from "@/components/exhibit-carousel"
import { BubbleRing } from "@/components/bubble-ring"
import { AsciiMascot } from "@/components/ascii-mascot"
import { ChatDock } from "@/components/chat-dock"

export function StageHero() {
  return (
    <section className="relative overflow-hidden px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm uppercase tracking-wide text-primary/80">Ask Axiom</p>
          <h1 className="mt-2 text-4xl font-semibold md:text-5xl">
            A curated stage for my work
          </h1>
          <p className="mt-4 text-muted-foreground">
            Ask Axiom — an AI curator I built — to guide you through impact, labs, and the story behind them.
          </p>
        </div>
        <div className="relative rounded-3xl border border-primary/30 bg-card/40 p-6 md:p-10">
          <BubbleRing />
          <AsciiMascot />
          <ExhibitCarousel />
        </div>
        <div className="mt-10">
          <ChatDock variant="inline" />
        </div>
      </div>
    </section>
  )
}
```

**Step 3: Run lint**
```bash
npm run lint
```
Expected: PASS.

**Step 4: Commit**
```bash
git add src/components/stage-hero.tsx src/components/exhibit-carousel.tsx

git commit -m "feat: add Ask Axiom stage hero and exhibit carousel"
```

---

### Task 6: Add BubbleRing + ASCII mascot + ChatDock variants

**Files:**
- Create: `web/src/components/bubble-ring.tsx`
- Create: `web/src/components/ascii-mascot.tsx`
- Create: `web/src/components/chat-dock.tsx`
- Modify: `web/src/components/chat-widget.tsx`

**Step 1: Create BubbleRing**

`web/src/components/bubble-ring.tsx`:
```tsx
const bubbles = [
  "Chase led this with a small team.",
  "Ask me about the no‑code platform.",
  "Want the lab notes? I can pull them.",
]

export function BubbleRing() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block">
      {bubbles.map((text, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-primary/30 bg-background/70 px-4 py-2 text-xs text-muted-foreground shadow-lg"
          style={{
            top: `${10 + i * 25}%`,
            left: i % 2 === 0 ? "-4%" : "78%",
          }}
        >
          {text}
        </div>
      ))}
    </div>
  )
}
```

**Step 2: Create AsciiMascot**

`web/src/components/ascii-mascot.tsx`:
```tsx
"use client"

import { useEffect, useState } from "react"

const frames = {
  idle: [" /\\_/\\ ", "( o.o )", " > ^ <"],
  blink: [" /\\_/\\ ", "( -.- )", " > ^ <"],
}

export function AsciiMascot() {
  const [blink, setBlink] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true)
      setTimeout(() => setBlink(false), 200)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const art = blink ? frames.blink : frames.idle
  return (
    <div className="absolute right-6 top-6 hidden text-xs text-primary md:block">
      <pre className="leading-4">{art.join("\n")}</pre>
    </div>
  )
}
```

**Step 3: Create ChatDock**

`web/src/components/chat-dock.tsx` should wrap existing chat UI with a `variant` prop (`inline` vs `drawer`) and include disclosure above the input. Move common chat logic from `chat-widget.tsx` into `chat-dock.tsx`.

**Step 4: Update `chat-widget.tsx`**

Have it render:
```tsx
export function ChatWidget() {
  const pathname = usePathname()
  if (pathname === "/") return null
  return <ChatDock variant="drawer" />
}
```

**Step 5: Lint + commit**
```bash
npm run lint

git add src/components/bubble-ring.tsx src/components/ascii-mascot.tsx src/components/chat-dock.tsx src/components/chat-widget.tsx

git commit -m "feat: add Axiom bubbles, ASCII mascot, and chat dock variants"
```

---

### Task 7: Build About / Impact / Labs / DevLog pages with content

**Files:**
- Modify: `web/src/app/about/page.tsx`
- Modify: `web/src/app/impact/page.tsx`
- Modify: `web/src/app/impact/[slug]/page.tsx`
- Modify: `web/src/app/labs/page.tsx`
- Modify: `web/src/app/labs/[slug]/page.tsx`
- Modify: `web/src/app/devlog/page.tsx`
- Modify: `web/src/app/devlog/[slug]/page.tsx`
- Create: `web/src/components/impact-card.tsx`
- Create: `web/src/components/lab-card.tsx`
- Create: `web/src/components/devlog-card.tsx`

**Step 1: Implement list pages** using `getAllImpact`, `getAllLabs`, `getAllDevlog` and card components.

**Step 2: Implement detail pages** using `getImpactBySlug`, `getLabBySlug`, `getDevlogBySlug`.

**Step 3: Run lint**
```bash
npm run lint
```

**Step 4: Commit**
```bash
git add src/app src/components/*-card.tsx

git commit -m "feat: build v2 pages for impact, labs, devlog"
```

---

### Task 8: Update visual system (globals + primitives)

**Files:**
- Modify: `web/src/app/globals.css`
- Create: `web/src/components/ui/glow-button.tsx`
- Create: `web/src/components/ui/neon-card.tsx`

**Step 1: Update theme tokens** in `globals.css` to use noir + neon palette, plus subtle background texture in hero section.

**Step 2: Add `GlowButton` / `NeonCard` primitives** for consistent styling.

**Step 3: Run lint**

**Step 4: Commit**
```bash
git add src/app/globals.css src/components/ui/glow-button.tsx src/components/ui/neon-card.tsx

git commit -m "feat: add v2 neon visual system"
```

---

### Task 9: Update RAG knowledge + disclosure language

**Files:**
- Modify: `web/data/knowledge/*.md`
- Modify: `web/src/lib/rag.ts` (if needed)

**Step 1: Adjust wording** in knowledge files to use “Chase led…” / “Chase + team…” phrasing.

**Step 2: Re‑seed knowledge**
```bash
npm run seed
```

**Step 3: Commit**
```bash
git add data/knowledge

git commit -m "chore: update RAG language for attribution + disclosure"
```

---

### Task 10: Verify build + content validation

**Step 1: Run validation**
```bash
npx tsx scripts/validate-content.ts
```

**Step 2: Lint + build**
```bash
npm run lint
npm run build
```

**Step 3: Commit any fixes**

---

Plan complete. After approval, choose execution approach:
1) **Subagent‑Driven (this session)**
2) **Parallel Session (executing‑plans)**
