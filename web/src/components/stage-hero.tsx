import { ExhibitCarousel } from "@/components/exhibit-carousel"
import { AskAxiomTrigger } from "@/components/ask-axiom-trigger"
import { ChatDock } from "@/components/chat-dock"
import { getExhibits } from "@/data/exhibits"
import { getSuggestedPrompts } from "@/lib/data"

export function StageHero() {
  const exhibits = getExhibits()
  const suggestedPrompts = getSuggestedPrompts()

  return (
    <section className="relative flex flex-1 items-center overflow-hidden px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="relative rounded-2xl border border-primary/30 bg-card/40 p-4 sm:rounded-3xl sm:p-6 md:p-10">
          <div className="grid gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div className="relative z-10 flex flex-col justify-center">
              <div className="space-y-3 sm:space-y-4">
                <p className="text-xs uppercase tracking-wide text-primary/80 sm:text-sm">Ask Axiom</p>
                <h1 className="text-2xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl">
                  A curated stage for my work
                </h1>
                <p className="text-sm text-muted-foreground sm:text-base">
                  I&apos;m Chase — I build product-grade systems that remove operational friction.
                  Ask Axiom, an AI curator I built, to guide you through my work.
                </p>
                <AskAxiomTrigger />
              </div>
              <div className="mt-6 sm:mt-8">
                <ExhibitCarousel exhibits={exhibits} />
              </div>
            </div>
            <div className="relative z-10 flex flex-col">
              <ChatDock variant="inline" suggestedPrompts={suggestedPrompts} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
