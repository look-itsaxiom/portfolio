---
title: "GoVert"
summary: "A free 3D multiplayer platformer-racer where the movement tech is the whole game — and every menu is a place you stand."
category: "labs"
status: "Live on itch.io — playable in browser"
stack: ["Godot 4.7", "GDScript", "TypeScript", "Node.js", "WebSocket", "Blender"]
tags: ["labs", "games", "multiplayer", "godot"]
embed:
  src: "https://itch.io/embed-upload/18873768?color=ce2ecb"
  title: "Play GoVert in your browser"
  width: 1280
  height: 740
  fallbackHref: "https://look-itsaxiom.itch.io/govert"
  fallbackLabel: "Play GoVert on itch.io"
links:
  - label: "itch.io"
    href: "https://look-itsaxiom.itch.io/govert"
---

GoVert is a free 3D low-poly multiplayer platformer-racer: eighteen hand-tuned movement actions, procedurally assembled tracks, item boxes, and a flag at the end. Long-jump into a wall-jump chain, dive to carry your speed past someone, then eat a homing fireball two metres from the finish. It runs in a browser and as a Windows download.

The design bet is that the movement engine is the entire game, so nothing should ever interrupt it. GoVert has no menus. Everything is a place you stand. Want to change your colour? Walk to the colour pads. Want to race? Everyone steps on the FIND GAME pad together. Want a private lobby with friends? Stand on the party pad and type a four-character code. The reference point is Mario 64, where you don't pick a level from a list — you jump into a painting.

That constraint is not free, and it is worth being honest about the cost. Every friendslop game — Fall Guys, Stumble Guys, PEAK — opens on a menu that reduces to find lobby, create lobby, store. Rejecting that means rebuilding each of those affordances as a physical place in the world. It also means a player can miss one. I have watched someone load the game from itch, run around the playground, fail to notice the ready-up pad I was standing on and jumping next to, get bored, and leave without ever playing the actual game.

Underneath, the movement simulation is deliberately engine-free — a pure `step(state, input, queries, tuning, dt)` function with no renderer in it, guarded by relationship tests that assert things like "triple apex is higher than double, which is higher than single" rather than pinning exact magic numbers. That let the feel be retuned constantly without ever fighting the test suite, and it meant the original Babylon.js web prototype could be ported to Godot as a specification rather than a rewrite. The web build was always a proof of feel; getting real physics and controller response was always going to require a real engine.

Networking is client-authoritative locomotion over an authoritative-lite server, which keeps the movement responsive but creates its own hazards — a claim validated against a stale twenty-hertz snapshot has to retry while the condition holds instead of firing once and silently failing. Tracks are assembled from chunks docked together by entry and exit sockets, so every client can build an identical course from a single server seed.

The playground eventually grew a second game out of it. Lives were added as a small thing to do while waiting to queue for a race; the kids testing it then never wanted to leave the playground at all. That mini-game became BRAWL — its own mode, in its own purpose-built arena.
