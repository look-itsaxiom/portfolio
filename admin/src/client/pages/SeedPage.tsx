import { useState, useEffect, useRef } from "react"
import { apiGet, apiPost } from "../lib/api"

interface SeedStatus {
  running: boolean
  progress: number
  message: string
  error?: string
  startedAt?: string
  completedAt?: string
}

export default function SeedPage() {
  const [status, setStatus] = useState<SeedStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState("")
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  async function fetchStatus() {
    try {
      const s = await apiGet<SeedStatus>("/api/rag/seed/status")
      setStatus(s)
      return s
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch status")
      return null
    }
  }

  useEffect(() => {
    fetchStatus().then(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (status?.running) {
      pollRef.current = setInterval(fetchStatus, 2000)
    } else if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current)
      }
    }
  }, [status?.running])

  async function handleStart() {
    setStarting(true)
    setError("")
    try {
      await apiPost("/api/rag/seed")
      await fetchStatus()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start seed")
    } finally {
      setStarting(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-zinc-500">Loading...</div>
  }

  const progressPercent = Math.min(100, Math.round(status?.progress ?? 0))

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-zinc-100">RAG Seed</h1>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
        {/* Status display */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                status?.running
                  ? "bg-yellow-500 animate-pulse"
                  : status?.error
                    ? "bg-red-500"
                    : status?.completedAt
                      ? "bg-green-500"
                      : "bg-zinc-600"
              }`}
            />
            <span className="text-sm text-zinc-300">
              {status?.running
                ? "Running"
                : status?.error
                  ? "Error"
                  : status?.completedAt
                    ? "Completed"
                    : "Idle"}
            </span>
          </div>

          {status?.message && (
            <p className="text-sm text-zinc-400">{status.message}</p>
          )}

          {status?.error && (
            <p className="text-sm text-red-400">{status.error}</p>
          )}
        </div>

        {/* Progress bar */}
        {(status?.running || status?.completedAt) && (
          <div>
            <div className="flex justify-between text-xs text-zinc-500 mb-1">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Timestamps */}
        {status?.startedAt && (
          <div className="text-xs text-zinc-500 space-y-1">
            <p>Started: {new Date(status.startedAt).toLocaleString()}</p>
            {status.completedAt && (
              <p>Completed: {new Date(status.completedAt).toLocaleString()}</p>
            )}
          </div>
        )}

        {/* Start button */}
        <button
          onClick={handleStart}
          disabled={starting || status?.running}
          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded transition-colors"
        >
          {starting ? "Starting..." : status?.running ? "Seed Running..." : "Start Seed"}
        </button>
      </div>
    </div>
  )
}
