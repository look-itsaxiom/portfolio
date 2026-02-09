"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const frames = {
  idle: [" /\\_/\\ ", "( o.o )", " > ^ <"],
  blink: [" /\\_/\\ ", "( -.- )", " > ^ <"],
}

type AsciiMascotProps = {
  className?: string
  inline?: boolean
}

export function AsciiMascot({ className, inline = false }: AsciiMascotProps) {
  const [blink, setBlink] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true)
      setTimeout(() => setBlink(false), 200)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const art = blink ? frames.blink : frames.idle

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
