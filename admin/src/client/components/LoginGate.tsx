import { useState, type ReactNode, type FormEvent } from "react"

interface Props {
  children: ReactNode
}

export default function LoginGate({ children }: Props) {
  const [authenticated, setAuthenticated] = useState(
    () => !!sessionStorage.getItem("admin-secret"),
  )
  const [secret, setSecret] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/health", {
        headers: { Authorization: `Bearer ${secret}` },
      })

      if (res.ok) {
        sessionStorage.setItem("admin-secret", secret)
        setAuthenticated(true)
      } else {
        setError("Invalid secret. Check your credentials.")
      }
    } catch {
      setError("Could not reach server.")
    } finally {
      setLoading(false)
    }
  }

  if (authenticated) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-8 space-y-4"
      >
        <h1 className="text-xl font-semibold text-zinc-100">
          Portfolio Admin
        </h1>
        <p className="text-sm text-zinc-400">Enter your admin secret to continue.</p>

        <input
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="Admin secret"
          autoFocus
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !secret}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded font-medium transition-colors"
        >
          {loading ? "Checking..." : "Sign In"}
        </button>
      </form>
    </div>
  )
}
