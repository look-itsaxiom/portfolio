export interface ActiveSession {
  question: string
  context: string
  createdAt: Date
  resolve: (reply: string) => void
  reject: (reason: string) => void
  onTyping?: () => void
}

export const activeSessions = new Map<string, ActiveSession>()

export function createSession(
  sessionId: string,
  question: string,
  context: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    activeSessions.set(sessionId, {
      question,
      context,
      createdAt: new Date(),
      resolve,
      reject,
    })

    // Auto-cleanup after 3 minutes
    setTimeout(() => {
      if (activeSessions.has(sessionId)) {
        activeSessions.delete(sessionId)
        reject("timeout")
      }
    }, 3 * 60 * 1000)
  })
}
