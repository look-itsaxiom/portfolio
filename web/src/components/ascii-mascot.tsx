"use client"

import { useEffect, useState } from "react"

const frames = {
  idle: [" /\\_/\\ ", "( o.o )", " > ^ <"],
  blink: [" /\\_/\\ ", "( -.- )", " > ^ <"],
}

export function AsciiMascot() {
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
    <div className="absolute right-6 top-6 hidden text-xs text-primary md:block">
      <pre className="leading-4">{art.join("\n")}</pre>
    </div>
  )
}
