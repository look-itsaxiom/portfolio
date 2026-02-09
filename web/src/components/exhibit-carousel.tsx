"use client"

import { useState, useEffect, useRef } from "react"
import type { Exhibit } from "@/data/exhibits"
import { GlowButton } from "@/components/ui/glow-button"
import {
  Carousel,
  type CarouselApi,
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

const mascotFrames = {
  idle: [" /\\_/\\ ", "( o.o )", " > ^ <"],
  blink: [" /\\_/\\ ", "( -.- )", " > ^ <"],
  talk1: [" /\\_/\\ ", "( o.o )", " > o <"],
  talk2: [" /\\_/\\ ", "( o.o )", " > ^ <"],
}

export function ExhibitCarousel({ exhibits }: { exhibits: Exhibit[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [activeIndex, setActiveIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [blink, setBlink] = useState(false)
  const [talkFrame, setTalkFrame] = useState(0)
  const [streamTalking, setStreamTalking] = useState(false)
  const typingRef = useRef<ReturnType<typeof setInterval>>(undefined)

  const currentNote = exhibits[activeIndex]?.axiomNote || ""
  const talking = isTyping || streamTalking

  // Track active slide
  useEffect(() => {
    if (!api) return
    setActiveIndex(api.selectedScrollSnap())
    const onSelect = () => setActiveIndex(api.selectedScrollSnap())
    api.on("select", onSelect)
    return () => { api.off("select", onSelect) }
  }, [api])

  // Typewriter effect when slide changes
  useEffect(() => {
    if (typingRef.current) clearInterval(typingRef.current)

    if (!currentNote) {
      setDisplayedText("")
      setIsTyping(false)
      return
    }

    setDisplayedText("")
    setIsTyping(true)
    let i = 0
    typingRef.current = setInterval(() => {
      i++
      if (i >= currentNote.length) {
        setDisplayedText(currentNote)
        setIsTyping(false)
        if (typingRef.current) clearInterval(typingRef.current)
      } else {
        setDisplayedText(currentNote.slice(0, i))
      }
    }, 30)

    return () => { if (typingRef.current) clearInterval(typingRef.current) }
  }, [currentNote])

  // Listen for chat streaming events
  useEffect(() => {
    function onStart() { setStreamTalking(true) }
    function onEnd() { setStreamTalking(false) }
    window.addEventListener("axiom-stream-start", onStart)
    window.addEventListener("axiom-stream-end", onEnd)
    return () => {
      window.removeEventListener("axiom-stream-start", onStart)
      window.removeEventListener("axiom-stream-end", onEnd)
    }
  }, [])

  // Blink when idle
  useEffect(() => {
    if (talking) return
    const interval = setInterval(() => {
      setBlink(true)
      setTimeout(() => setBlink(false), 200)
    }, 6000)
    return () => clearInterval(interval)
  }, [talking])

  // Cycle mouth while talking
  useEffect(() => {
    if (!talking) { setTalkFrame(0); return }
    const interval = setInterval(() => {
      setTalkFrame((f) => (f + 1) % 2)
    }, 350)
    return () => clearInterval(interval)
  }, [talking])

  let mascotArt: string[]
  if (talking) {
    mascotArt = talkFrame === 0 ? mascotFrames.talk1 : mascotFrames.talk2
  } else {
    mascotArt = blink ? mascotFrames.blink : mascotFrames.idle
  }

  return (
    <div className="w-full space-y-4">
      <Carousel
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 7000, stopOnInteraction: true })]}
        setApi={setApi}
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
                <p className="mt-1 text-sm text-muted-foreground">
                  {exhibit.description}
                </p>
                <GlowButton
                  className="mt-3"
                  onClick={() => askAxiom(exhibit.title)}
                >
                  Ask Axiom about this
                </GlowButton>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-4 flex items-center justify-center gap-4">
          <CarouselPrevious className="static translate-y-0" />
          <CarouselNext className="static translate-y-0" />
        </div>
      </Carousel>

      {/* Mascot with speech bubble */}
      <div className="flex items-start gap-3">
        <pre className="shrink-0 leading-4 text-xs text-primary">
          {mascotArt.join("\n")}
        </pre>
        <div className="relative mt-1 min-w-0 flex-1 rounded-lg border border-primary/30 bg-card/30 px-3 py-2">
          <div className="absolute left-0 top-3 -translate-x-full border-y-[6px] border-r-[6px] border-y-transparent border-r-primary/30" />
          <p className="min-h-[2.5rem] text-sm italic text-muted-foreground">
            {displayedText}
            {isTyping && (
              <span className="ml-px inline-block h-[0.9em] w-[2px] animate-pulse bg-primary/60 align-text-bottom" />
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
