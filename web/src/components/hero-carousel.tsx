"use client"

import { useEffect, useRef, useState } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { heroSlides } from "@/lib/data"

function openAxiomChat(prompt: string) {
  window.dispatchEvent(
    new CustomEvent("open-axiom-chat", { detail: { prompt } })
  )
}

export function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null)

  useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())
    api.on("select", () => setCurrent(api.selectedScrollSnap()))
  }, [api])

  useEffect(() => {
    if (!api) return

    intervalRef.current = setInterval(() => {
      api.scrollNext()
    }, 6000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [api])

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            I build systems that{" "}
            <span className="text-primary/80">remove friction</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Product-grade platforms at work. AI-native experiments in the lab.
          </p>
        </div>

        <Carousel
          setApi={setApi}
          opts={{ loop: true }}
          className="w-full"
        >
          <CarouselContent>
            {heroSlides.map((slide) => (
              <CarouselItem key={slide.slug}>
                <div className="rounded-xl border border-border/50 bg-card p-8 md:p-12">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Badge
                        variant={
                          slide.category === "impact" ? "default" : "secondary"
                        }
                        className="mb-4"
                      >
                        {slide.category === "impact"
                          ? "Professional Impact"
                          : "Labs"}
                      </Badge>
                      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                        {slide.title}
                      </h2>
                      <p className="mt-3 text-lg text-muted-foreground">
                        {slide.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex items-start gap-3 rounded-lg border border-border/30 bg-muted/30 p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      A
                    </div>
                    <div className="flex-1">
                      <p className="text-sm italic text-muted-foreground">
                        &ldquo;{slide.axiomComment}&rdquo;
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-7 gap-1.5 text-xs"
                        onClick={() =>
                          openAxiomChat(`Tell me about ${slide.title}`)
                        }
                      >
                        <MessageCircle className="h-3 w-3" />
                        Ask Axiom about this
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-6 flex items-center justify-center gap-4">
            <CarouselPrevious className="static translate-y-0" />
            <div className="flex gap-2">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => api?.scrollTo(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === current
                      ? "w-6 bg-primary"
                      : "w-2 bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  )
}
