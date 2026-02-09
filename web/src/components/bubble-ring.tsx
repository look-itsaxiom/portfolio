const bubbles = [
  { text: "Ask me about the no\u2011code platform.", top: "8%", left: "-3%" },
  { text: "Want the lab notes? I can pull them.", top: "55%", left: "38%" },
]

export function BubbleRing() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      {bubbles.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-primary/20 bg-background/60 px-3 py-1.5 text-xs text-muted-foreground/70"
          style={{ top: b.top, left: b.left }}
        >
          {b.text}
        </div>
      ))}
    </div>
  )
}
