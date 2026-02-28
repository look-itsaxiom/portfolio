"use client"

import { ChatDock } from "@/components/chat-dock"

export function ChatWidget({ suggestedPrompts }: { suggestedPrompts?: string[] }) {
  return <ChatDock variant="drawer" suggestedPrompts={suggestedPrompts} />
}
