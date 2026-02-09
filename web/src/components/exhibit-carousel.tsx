"use client"

import type { Exhibit } from "@/data/exhibits"
import { GlowButton } from "@/components/ui/glow-button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

function askAxiom(title: string) {
  window.dispatchEvent(
    new CustomEvent("open-axiom-chat", {
      detail: { prompt: `Tell me about ${title}` },
    })
  )
}

export function ExhibitCarousel({ exhibits }: { exhibits: Exhibit[] }) {
  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[Autoplay({ delay: 7000, stopOnInteraction: true })]}
      className="w-full"
    >
      <CarouselContent>
        {exhibits.map((exhibit) => (
          <CarouselItem key={exhibit.slug}>
            <div className="border-l-2 border-primary/40 pl-5 py-2">
              <div className="text-sm uppercase tracking-wide text-primary/80">
                {exhibit.category}
              </div>
              <h2 className="mt-1 text-xl font-semibold">{exhibit.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{exhibit.description}</p>
              <GlowButton
                className="mt-3"
                onClick={() => askAxiom(exhibit.title)}
              >
                Ask Axiom about this
              </GlowButton>
              <p className="mt-3 text-sm italic text-muted-foreground">
                &ldquo;{exhibit.axiomNote}&rdquo;
              </p>
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
