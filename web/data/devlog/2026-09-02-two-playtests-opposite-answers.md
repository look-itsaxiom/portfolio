---
title: 'Two Playtests, Opposite Answers'
date: '2026-09-02'
summary: >-
  My kids understood GoVert's pad-based UI instantly. A stranger on itch never
  found the game at all. Both playtests were real.
tags:
  - devlog
  - games
  - design
  - godot
related:
  - govert
---

GoVert has no menus. Everything is a place you stand. You change your colour by walking to the colour pads. You queue for a race by standing on the FIND GAME pad. There is no screen anywhere that reduces to *find lobby, create lobby, store*.

The reason is Mario 64. Load it up and the only menu you'll find is save select — an industry standard you can't really avoid. You pick your save and then you're running around Peach's castle, and you don't enter levels from a list, you enter them by jumping into paintings. For a game where the movement engine *is* the game, why should interacting with menus be any different? Want to ready up with your friends? Walk to the ready pad together. It just makes sense to me.

Two playtests this week told me two different things about that.

## The one that said yes

I test with my two kids. They're my perfect little gauges on the intuitiveness of a game — they've played a few, but not enough to have developed the muscle memories involved in setting up multiplayer lobbies or "readying up." When they instantly understood that *step on pad with others = join game together*, that was the green light for the whole pad-based UI. Nobody explained it to them. They just did it.

Then they showed me something I hadn't designed for. Their intuition was that if a player stands on the same pad, they should end up in the same *place* as the others. That is not a thing someone with lobby muscle memory would think — a veteran expects the pad to be a queue, not a door. So I had a choice to make about which player I was building for, and where I needed to stay accessible to the other one.

That became party pads: stand on the pad, type a four-character code, and you're in a private copy of the playground with your friends. A party waits for everyone rather than departing on a timer, because among friends "wait for everyone" is exactly right.

## The one that said no

I have also watched a player arrive from itch, load the game, run around the playground, fail to notice the ready-up pad I was standing next to — I was jumping, trying to get their attention — get bored, and leave. They never played the actual game. Not the race, not the items, none of it. They bounced off the front door because the front door doesn't look like a door.

So I'm not even saying the no-menus choice was the right one. Every friendslop game — Fall Guys, Stumble Guys, PEAK — opens on a menu, and rejecting that means each of those options has to be completely rethought as a physical thing in the world. Sometimes the rethink is better. Sometimes it just hides the game.

## The thing I *didn't* redesign

When it came time to build private lobbies, there was a proposal on the table to use colour-pad sequences as the passcode — you'd walk a pattern across the pads to join a room. It fit the diegetic theme perfectly, and it was immediately obvious to me that it was terrible. When you're trying to join friends who are already waiting for you, the last thing anyone wants is to run to different colour pads in a perfect sequence.

Every console and platform natively supports a keyboard in some fashion, so a four-digit code is really just not a big deal. That kind of interaction doesn't need a full design pass when there's an industry standard, and the deviation would cause more friction without whimsy. Design has diminishing returns in a lot of places, and knowing where they are is most of the job.

The playground also grew a second game while nobody was looking. I added lives so there'd be something to do while waiting to queue for a race — and then my kids basically never wanted to leave the playground. That mini-game is now BRAWL, with its own arena.
