import * as React from "react"

import { cn } from "@/lib/utils"

const GlowButton = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button">>(
  ({ className, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-5 py-2 text-sm font-semibold text-foreground shadow-[0_0_18px_rgba(78,245,255,0.25)] transition hover:bg-primary/25 hover:shadow-[0_0_26px_rgba(78,245,255,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          className
        )}
        {...props}
      />
    )
  }
)

GlowButton.displayName = "GlowButton"

export { GlowButton }
