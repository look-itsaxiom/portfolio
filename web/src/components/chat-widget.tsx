"use client"

import { usePathname } from "next/navigation"
import { ChatDock } from "@/components/chat-dock"

export function ChatWidget({ suggestedPrompts }: { suggestedPrompts?: string[] }) {
  const pathname = usePathname()

  // On homepage, only show the drawer FAB on mobile (inline chat covers desktop)
  if (pathname === "/") {
    return (
      <div className="lg:hidden">
        <ChatDock variant="drawer" suggestedPrompts={suggestedPrompts} />
      </div>
    )
  }

  return <ChatDock variant="drawer" suggestedPrompts={suggestedPrompts} />
}
