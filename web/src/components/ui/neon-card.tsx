import * as React from "react"

import { cn } from "@/lib/utils"

const NeonCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-2xl border border-primary/30 bg-card/60 p-6 shadow-[0_0_30px_rgba(78,245,255,0.12)] backdrop-blur",
          className
        )}
        {...props}
      />
    )
  }
)

NeonCard.displayName = "NeonCard"

export { NeonCard }
