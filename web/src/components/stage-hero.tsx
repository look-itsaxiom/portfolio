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
            Ask Axiom — an AI curator I built — to guide you through impact,
            labs, and the story behind them.
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
