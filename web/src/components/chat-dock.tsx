"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useState, useRef, useEffect, useCallback } from "react"
import { usePathname } from "next/navigation"
import { MessageCircle, X, Send, Loader2, AlertCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { AXIOM_DISCLOSURE } from "@/lib/axiom-voice"

function getMessageText(message: { parts?: { type: string; text?: string }[] }): string {
  if (!message.parts) return ""
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

function extractSessionId(text: string): string | null {
  const match = text.match(/_Session:\s*([a-f0-9-]+)_/)
  return match ? match[1] : null
}

function getPageSection(pathname: string): { page: string; section: string } {
  if (pathname.startsWith("/impact/")) {
    return { page: pathname.replace("/impact/", ""), section: "Professional Impact" }
  }
  if (pathname.startsWith("/labs/")) {
    return { page: pathname.replace("/labs/", ""), section: "Labs" }
  }
  if (pathname === "/") {
    return { page: "home", section: "Home" }
  }
  return { page: pathname, section: "" }
}

type FallbackStatus = "idle" | "waiting" | "typing" | "timeout"

type ChatDockProps = {
  variant: "inline" | "drawer"
  suggestedPrompts?: string[]
}

export function ChatDock({ variant, suggestedPrompts = [] }: ChatDockProps) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [chatDisabled, setChatDisabled] = useState(false)
  const [fallbackStatus, setFallbackStatus] = useState<FallbackStatus>("idle")
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const pathname = usePathname()

  const pageContext = getPageSection(pathname)

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { context: pageContext },
    }),
  })

  const isLoading = status === "submitted" || status === "streaming"

  // Health check on mount — disable if any core service is down
  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        const coreDown =
          data.openrouter === "error" ||
          (data.qdrant !== "unconfigured" && data.qdrant === "error") ||
          (data.ollama !== "unconfigured" && data.ollama === "error")
        if (coreDown) setChatDisabled(true)
      })
      .catch(() => {
        setChatDisabled(true)
      })
  }, [])

  // Watch for Discord fallback messages and subscribe to SSE
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.role !== "assistant") return

    const text = getMessageText(lastMessage)
    const sessionId = extractSessionId(text)
    if (!sessionId) return

    if (eventSourceRef.current) return

    const es = new EventSource(`/api/status/${sessionId}`)
    eventSourceRef.current = es

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.event === "waiting") {
          setFallbackStatus("waiting")
        } else if (data.event === "typing") {
          setFallbackStatus("typing")
        } else if (data.event === "response") {
          setFallbackStatus("idle")
          setMessages((prev) => {
            const updated = [...prev]
            const idx = updated.findIndex(
              (m) => m.role === "assistant" && extractSessionId(getMessageText(m)) === sessionId
            )
            if (idx !== -1) {
              updated[idx] = {
                ...updated[idx],
                parts: [{ type: "text" as const, text: data.text }],
              }
            }
            return updated
          })
          es.close()
          eventSourceRef.current = null
        } else if (data.event === "timeout") {
          setFallbackStatus("timeout")
          es.close()
          eventSourceRef.current = null
        } else if (data.event === "error" || data.event === "done") {
          es.close()
          eventSourceRef.current = null
          setFallbackStatus("idle")
        }
      } catch {
        // ignore parse errors
      }
    }

    es.onerror = () => {
      es.close()
      eventSourceRef.current = null
      setFallbackStatus("idle")
    }

    return () => {
      es.close()
      eventSourceRef.current = null
    }
  }, [messages, setMessages])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, fallbackStatus])

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!input.trim() || isLoading) return
      setFallbackStatus("idle")
      sendMessage({ text: input })
      setInput("")
    },
    [input, isLoading, sendMessage]
  )

  const handleSuggestedPrompt = useCallback(
    (prompt: string) => {
      setFallbackStatus("idle")
      sendMessage({ text: prompt })
    },
    [sendMessage]
  )

  useEffect(() => {
    function handleOpenChat(e: CustomEvent<{ prompt?: string }>) {
      if (variant === "drawer") setOpen(true)
      if (e.detail?.prompt) {
        setTimeout(() => {
          sendMessage({ text: e.detail.prompt! })
        }, 200)
      }
    }
    window.addEventListener("open-axiom-chat", handleOpenChat as EventListener)
    return () =>
      window.removeEventListener("open-axiom-chat", handleOpenChat as EventListener)
  }, [sendMessage, variant])

  if (chatDisabled && variant === "drawer") {
    return (
      <Button
        size="lg"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg opacity-50 cursor-not-allowed"
        disabled
        title="Chat is currently unavailable"
      >
        <AlertCircle className="h-6 w-6" />
      </Button>
    )
  }

  const ChatPanel = (
    <div className="flex h-full flex-col">
      <div className="border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            A
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold">Ask Axiom</h2>
            <p className="text-xs text-muted-foreground">Your guide to Chase&apos;s work</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        <div className="space-y-4 py-4">
          {messages.length === 0 && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  Hey! I&apos;m Ask Axiom, the guide for Chase&apos;s portfolio. Think of me as the
                  museum guide who&apos;s genuinely excited to show you around. Ask me anything!
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Try asking:</p>
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="block w-full rounded-md border border-border/50 px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => {
            const text = getMessageText(message)
            if (!text) return null

            const sessionId = message.role === "assistant" ? extractSessionId(text) : null
            const isWaitingMessage = sessionId && (fallbackStatus === "waiting" || fallbackStatus === "typing")

            return (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="mb-1 flex items-center gap-1.5">
                      <Badge variant="outline" className="h-4 px-1 text-[10px]">
                        Axiom
                      </Badge>
                    </div>
                  )}
                  {isWaitingMessage ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {fallbackStatus === "typing" ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                        ) : (
                          <Clock className="h-3.5 w-3.5 animate-pulse text-muted-foreground" />
                        )}
                        <p>
                          {fallbackStatus === "typing"
                            ? "Chase is typing…"
                            : "Asking Chase directly…"}
                        </p>
                      </div>
                      {fallbackStatus === "waiting" && (
                        <p className="text-xs text-muted-foreground">
                          This might take 2-3 minutes. Hang tight!
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">
                      {sessionId ? text.replace(/_Session:\s*[a-f0-9-]+_/, "").trim() : text}
                    </p>
                  )}
                </div>
              </div>
            )
          })}

          {fallbackStatus === "timeout" && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-lg bg-muted px-3 py-2 text-sm space-y-2">
                <p>Chase might be away right now.</p>
                <a
                  href="/contact"
                  onClick={() => variant === "drawer" && setOpen(false)}
                  className="inline-block text-xs text-primary hover:underline"
                >
                  Leave a message instead →
                </a>
              </div>
            </div>
          )}

          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="rounded-lg bg-muted px-3 py-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="border-t px-4 py-3 space-y-2">
        <p className="text-[11px] text-muted-foreground">{AXIOM_DISCLOSURE}</p>
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about Chase..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )

  if (variant === "inline") {
    return (
      <div className="flex h-full flex-col rounded-2xl border border-primary/20 bg-card/50 shadow-[0_0_30px_rgba(139,92,246,0.12)]">
        <div className="flex min-h-0 flex-1 flex-col">{ChatPanel}</div>
      </div>
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="lg" className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg">
          {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="sr-only">
          <SheetTitle>Ask Axiom</SheetTitle>
        </SheetHeader>
        {ChatPanel}
      </SheetContent>
    </Sheet>
  )
}
