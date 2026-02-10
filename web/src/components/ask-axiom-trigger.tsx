"use client"

import { GlowButton } from "@/components/ui/glow-button"

export function AskAxiomTrigger() {
  return (
    <GlowButton
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent("open-axiom-chat", {
            detail: { prompt: "Tell me about Ask Axiom — how does it work?" },
          })
        )
      }
    >
      Ask Axiom about Ask Axiom
    </GlowButton>
  )
}
