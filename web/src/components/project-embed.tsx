type EmbedProps = {
  src: string
  title?: string
  width?: number
  height?: number
  fallbackHref?: string
  fallbackLabel?: string
}

/**
 * Playable/interactive project embed (itch.io, CodeSandbox, etc).
 * Responsive: holds the source aspect ratio instead of a fixed pixel height,
 * so it never overflows on mobile.
 */
export function ProjectEmbed({
  src,
  title,
  width = 1280,
  height = 740,
  fallbackHref,
  fallbackLabel,
}: EmbedProps) {
  const ratio = `${width} / ${height}`
  return (
    <div className="mt-8">
      <div
        className="overflow-hidden rounded-lg border border-border/40 bg-muted/20"
        style={{ aspectRatio: ratio }}
      >
        <iframe
          src={src}
          title={title ?? "Interactive embed"}
          allowFullScreen
          loading="lazy"
          className="h-full w-full"
          style={{ border: 0 }}
        />
      </div>
      {fallbackHref && (
        <p className="mt-2 text-xs text-muted-foreground">
          Trouble loading?{" "}
          <a href={fallbackHref} className="text-primary hover:underline">
            {fallbackLabel ?? "Open it directly"}
          </a>
        </p>
      )}
    </div>
  )
}
