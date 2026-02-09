"use client"

import { usePathname } from "next/navigation"
import { ChatDock } from "@/components/chat-dock"

export function ChatWidget({ suggestedPrompts }: { suggestedPrompts?: string[] }) {
  const pathname = usePathname()
  if (pathname === "/") return null
  return <ChatDock variant="drawer" suggestedPrompts={suggestedPrompts} />
}
