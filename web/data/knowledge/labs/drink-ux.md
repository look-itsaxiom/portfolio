# Drink-UX — Coffee Shop Ordering UI

## The Idea
Most coffee shops are stuck with clunky POS menus. Drink-UX gives them a Starbucks-grade visual ordering experience while keeping their existing POS system (Square, Toast, Clover).

## What It Is
A multi-app SaaS platform with a visual drink builder that customers interact with. The drink builder provides a modern, visual menu experience while the POS integration handles the backend order flow.

## Technical Details
- **Stack:** TypeScript, React, Next.js, PWA
- **Architecture:** Multi-app SaaS — separate apps for customer ordering, shop admin, and POS sync
- **Frontend:** Visual drink builder with ingredient customization, real-time pricing
- **POS Integration:** Adapters for Square, Toast, and Clover (in progress)
- **PWA:** Installable progressive web app for mobile ordering

## Current Status
Actively in development. The frontend drink builder is demo-able and POS integrations are being built out.

## What Makes This Interesting
The insight is that coffee shops want modern ordering UX but can't afford to switch POS systems. Drink-UX bridges that gap — it's an adapter pattern applied to the real world. The multi-app architecture shows systems thinking beyond a single user interface.
