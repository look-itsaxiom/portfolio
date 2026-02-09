"use client"

import { GlowButton } from "@/components/ui/glow-button"

export function AskAxiomTrigger() {
  return (
    <GlowButton
      onClick={() =>
        window.dispatchEvent(new CustomEvent("open-axiom-chat", { detail: {} }))
      }
    >
      Ask Axiom
    </GlowButton>
  )
}
