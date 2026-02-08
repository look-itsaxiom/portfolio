import { activeSessions } from "@/lib/sessions"

export const dynamic = "force-dynamic"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      const session = activeSessions.get(sessionId)

      if (!session) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ event: "error", message: "Session not found" })}\n\n`)
        )
        controller.close()
        return
      }

      // Send initial waiting event
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ event: "waiting", message: "Asking Chase..." })}\n\n`)
      )

      // Poll for resolution
      const interval = setInterval(() => {
        if (!activeSessions.has(sessionId)) {
          // Session was resolved or timed out
          clearInterval(interval)
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ event: "done" })}\n\n`)
          )
          controller.close()
        }
      }, 1000)

      // Hook into typing notification
      session.onTyping = () => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ event: "typing", message: "Chase is typing..." })}\n\n`)
        )
      }

      // Intercept resolve to send response event
      const originalResolve = session.resolve
      session.resolve = (reply: string) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ event: "response", text: reply })}\n\n`)
        )
        originalResolve(reply)
        clearInterval(interval)
        controller.close()
      }

      // Intercept reject to send timeout event
      const originalReject = session.reject
      session.reject = (reason: string) => {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ event: "timeout", message: "Chase might be away right now — want to leave a message instead?" })}\n\n`
          )
        )
        originalReject(reason)
        clearInterval(interval)
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
