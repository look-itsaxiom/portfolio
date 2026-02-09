import { useState, useEffect } from "react"
import { apiGet, apiPut } from "../lib/api"

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    apiGet<string[]>("/api/prompts")
      .then(setPrompts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  function updatePrompt(index: number, value: string) {
    setPrompts((prev) => prev.map((p, i) => (i === index ? value : p)))
  }

  function removePrompt(index: number) {
    setPrompts((prev) => prev.filter((_, i) => i !== index))
  }

  function addPrompt() {
    setPrompts((prev) => [...prev, ""])
  }

  async function handleSave() {
    setSaving(true)
    setError("")
    setSuccess("")
    try {
      const filtered = prompts.filter((p) => p.trim() !== "")
      await apiPut("/api/prompts", { prompts: filtered })
      setPrompts(filtered)
      setSuccess("Prompts saved.")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-zinc-500">Loading...</div>
  }

  return (
    <div className="p-6 space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">Suggested Prompts</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded transition-colors"
        >
          {saving ? "Saving..." : "Save All"}
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {success && <p className="text-sm text-green-400">{success}</p>}

      <div className="space-y-2">
        {prompts.map((prompt, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={prompt}
              onChange={(e) => updatePrompt(i, e.target.value)}
              placeholder="Enter a suggested prompt..."
              className="flex-1 px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => removePrompt(i)}
              className="px-3 py-2 text-sm text-red-400 hover:text-red-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addPrompt}
        className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded transition-colors"
      >
        + Add Prompt
      </button>
    </div>
  )
}
