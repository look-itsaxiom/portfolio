"use client"

import { exhibits } from "@/data/exhibits"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function ExhibitCarousel() {
  return (
    <Carousel opts={{ loop: true }} className="w-full">
      <CarouselContent>
        {exhibits.map((exhibit) => (
          <CarouselItem key={exhibit.slug}>
            <div className="rounded-2xl border border-primary/30 bg-card/60 p-8 shadow-[0_0_30px_rgba(78,245,255,0.12)]">
              <div className="text-sm uppercase tracking-wide text-primary/80">
                {exhibit.category}
              </div>
              <h2 className="mt-2 text-2xl font-semibold">{exhibit.title}</h2>
              <p className="mt-2 text-muted-foreground">{exhibit.description}</p>
              <a
                href={exhibit.href}
                className="mt-4 inline-flex text-sm text-primary hover:underline"
              >
                View exhibit →
              </a>
              <p className="mt-4 text-sm italic text-muted-foreground">
                “{exhibit.axiomNote}”
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
