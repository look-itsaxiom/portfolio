import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { apiGet, apiPut, apiDelete } from "../lib/api"
import ConfirmDialog from "../components/ConfirmDialog"

interface RagPoint {
  id: number
  payload?: {
    text?: string
    source?: string
    category?: string
    timestamp?: string
    tags?: string[]
  }
}

const CATEGORIES = ["professional", "labs", "meta", "general", "devlog"]

export default function RagDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [point, setPoint] = useState<RagPoint | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const [text, setText] = useState("")
  const [source, setSource] = useState("")
  const [category, setCategory] = useState("general")

  useEffect(() => {
    if (!id) return
    setLoading(true)
    apiGet<RagPoint>(`/api/rag/entries/${id}`)
      .then((pt) => {
        setPoint(pt)
        setText(pt.payload?.text ?? "")
        setSource(pt.payload?.source ?? "")
        setCategory(pt.payload?.category ?? "general")
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSave() {
    if (!id || !text.trim()) return
    setSaving(true)
    setError("")
    try {
      await apiPut(`/api/rag/entries/${id}`, {
        text: text.trim(),
        source: source.trim(),
        category,
      })
      navigate("/rag")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!id) return
    try {
      await apiDelete(`/api/rag/entries/${id}`)
      navigate("/rag")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-zinc-500 text-sm">Loading...</p>
      </div>
    )
  }

  if (!point) {
    return (
      <div className="p-6 space-y-4">
        <p className="text-red-400 text-sm">{error || "Entry not found"}</p>
        <button
          onClick={() => navigate("/rag")}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          Back to RAG Entries
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/rag")}
          className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          &larr; Back
        </button>
        <h1 className="text-2xl font-bold text-zinc-100">
          RAG Entry{" "}
          <span className="font-mono text-zinc-400 text-lg">{point.id}</span>
        </h1>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {point.payload?.timestamp && (
        <p className="text-xs text-zinc-500">
          Last updated: {new Date(point.payload.timestamp).toLocaleString()}
        </p>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Source
            </label>
            <input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-40">
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {point.payload?.tags && point.payload.tags.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Tags
            </label>
            <div className="flex gap-1">
              {point.payload.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-zinc-800 border border-zinc-700 rounded text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving || !text.trim()}
          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded transition-colors"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={() => setConfirmDelete(true)}
          className="px-4 py-2 text-sm bg-zinc-800 hover:bg-red-900/50 text-red-400 rounded transition-colors"
        >
          Delete
        </button>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete RAG Entry"
        message={`Are you sure you want to delete entry ${point.id}? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  )
}
