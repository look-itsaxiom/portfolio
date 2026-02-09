const bubbles = [
  "Chase led this with a small team.",
  "Ask me about the no‑code platform.",
  "Want the lab notes? I can pull them.",
]

export function BubbleRing() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block">
      {bubbles.map((text, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-primary/30 bg-background/70 px-4 py-2 text-xs text-muted-foreground shadow-lg"
          style={{
            top: `${10 + i * 25}%`,
            left: i % 2 === 0 ? "-4%" : "78%",
          }}
        >
          {text}
        </div>
      ))}
    </div>
  )
}
