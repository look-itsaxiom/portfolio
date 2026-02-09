import { ExhibitCarousel } from "@/components/exhibit-carousel"
import { AsciiMascot } from "@/components/ascii-mascot"
import { ChatDock } from "@/components/chat-dock"

export function StageHero() {
  return (
    <section className="relative flex flex-1 items-center overflow-hidden px-6 py-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="relative rounded-3xl border border-primary/30 bg-card/40 p-6 md:p-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div className="relative z-10 flex flex-col justify-center">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-wide text-primary/80">Ask Axiom</p>
                <h1 className="text-4xl font-semibold md:text-5xl">
                  A curated stage for my work
                </h1>
                <p className="text-muted-foreground">
                  Ask Axiom — an AI curator I built — to guide you through impact, labs, and the
                  story behind them.
                </p>
              </div>
              <AsciiMascot inline className="mt-6 text-sm text-primary/80" />
              <div className="mt-8">
                <ExhibitCarousel />
              </div>
            </div>
            <div className="relative z-10 flex flex-col">
              <ChatDock variant="inline" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
