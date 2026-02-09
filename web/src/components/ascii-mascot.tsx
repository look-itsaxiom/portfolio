"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const frames = {
  idle: [" /\\_/\\ ", "( o.o )", " > ^ <"],
  blink: [" /\\_/\\ ", "( -.- )", " > ^ <"],
  talk1: [" /\\_/\\ ", "( o.o )", " > o <"],
  talk2: [" /\\_/\\ ", "( o.o )", " > ^ <"],
}

type AsciiMascotProps = {
  className?: string
  inline?: boolean
}

export function AsciiMascot({ className, inline = false }: AsciiMascotProps) {
  const [blink, setBlink] = useState(false)
  const [talking, setTalking] = useState(false)
  const [talkFrame, setTalkFrame] = useState(0)

  // Listen for streaming events from the chat dock
  useEffect(() => {
    function onStart() { setTalking(true) }
    function onEnd() { setTalking(false) }
    window.addEventListener("axiom-stream-start", onStart)
    window.addEventListener("axiom-stream-end", onEnd)
    return () => {
      window.removeEventListener("axiom-stream-start", onStart)
      window.removeEventListener("axiom-stream-end", onEnd)
    }
  }, [])

  // Blink on idle
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

  let art: string[]
  if (talking) {
    art = talkFrame === 0 ? frames.talk1 : frames.talk2
  } else {
    art = blink ? frames.blink : frames.idle
  }

  return (
    <div
      className={cn(
        inline
          ? "text-xs text-primary"
          : "absolute right-6 top-6 hidden text-xs text-primary md:block",
        className
      )}
    >
      <pre className="leading-4">{art.join("\n")}</pre>
    </div>
  )
}
