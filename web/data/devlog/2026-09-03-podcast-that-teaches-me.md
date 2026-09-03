---
title: A Course That Writes More of Itself
date: '2026-09-03'
summary: >-
  One grounded audio lesson every weekday, rotating across seven subjects — and
  a weekly job that notices what's missing and extends the syllabus.
tags:
  - devlog
  - ai
  - automation
  - learning
related:
  - dream-factory
---

I walk on a treadmill most mornings, which is thirty minutes of hands-free time I was giving to other people's podcasts. Good ones, mostly. But a podcast is written for an audience of everyone, and what I wanted was a lesson written for an audience of me — my subject, my depth, on a schedule that doesn't depend on someone else's release calendar.

So I built the thing that makes them. Every weekday there's a fresh ~30-minute episode waiting, rotating through engineering, the game industry, business, philosophy, game design, a wildcard, and a lighter history brief on Sunday. It shows up in a normal podcast app through a private RSS feed. I press play and walk.

## The part I'd actually show someone

A weekly job walks every subject, measures how much runway is left in its curriculum, asks that subject's source material what's missing from the plan, and writes the additions in.

The course extends itself before I can finish it.

That's the piece that changed the character of the whole thing. A static syllabus is a finite object — you burn it down and then you're back to browsing. This one notices it's being consumed and grows in the direction the material says it should grow, not the direction I'd have guessed while writing the outline in a single sitting. I've watched it add modules I wouldn't have thought to want, because they were obvious gaps to a corpus that knows the subject better than I do.

It also means the plan improves as the sources improve. Add three good books to a notebook and the next extension pass reads them and adjusts. The curriculum is downstream of the library, which is exactly the right dependency direction.

## Grounded, not vibed

Every lesson is generated *from curated sources* — real material I chose per subject — rather than from a model's general recall. That distinction is the whole ballgame. Ungrounded, you get a confident stranger riffing on a topic, and you cannot tell the difference between the parts it knows and the parts it's improvising until you already believe something false.

Grounding also makes the system honest about its own limits. When a subject's library is thin, the episodes are visibly thinner, which is useful information rather than a hidden failure. Thin sources should produce a thin lesson, not a fluent one.

The sourcing rule that follows from that: shadow-library and book-dump URLs never get seeded. When a genuinely useful title turns up on one, it goes on a buy list with a note about which DRM-free seller carries it, gets purchased, and gets added properly. Partly that's staying on the right side of a line. Mostly it's that a system built to teach me things shouldn't rest on a foundation I'd be embarrassed to explain.

## Config, not code

The whole system is one JSON file. Each subject is an entry: display name, its weekday, the notebook it's grounded in, paths to its curriculum and progress files, and the level it should start teaching at. Adding a subject is adding an entry. Retiring one is deleting an entry.

That sounds like a small thing and it is the reason the system has seven subjects instead of two. When adding philosophy to the rotation costs one object in a config file, you add philosophy. When it costs a code change, a test, and a deploy, you keep meaning to and don't. The friction of extension determines whether a personal tool becomes a habit or a graveyard — so I spend the design budget there first, every time.

Progress is checkbox-tracked in markdown, so the morning job reads what's already done, picks the next unchecked lesson, teaches it, generates the audio, and marks it. Nothing repeats. I can steer any subject by editing a file or just replying in a chat thread, which matters more than it sounds like: the steering surface has to be as low-friction as the listening, or you stop steering and start drifting.

One rule earned along the way, from a seeding script that reported complete success while adding nothing: **an exit code is a claim, not evidence.** The scripts now re-count what actually landed and trust only the persisted delta. A process saying it worked and the row count moving are two different facts, and only one of them is a fact.
