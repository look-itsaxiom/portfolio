import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { apiGet, apiPut, apiDelete } from "../lib/api"
import ConfirmDialog from "../components/ConfirmDialog"

interface KnowledgeData {
  path: string
  content: string
}

export default function KnowledgeEditPage() {
  const location = useLocation()
  const navigate = useNavigate()

  // Extract the path after /knowledge/
  const filePath = location.pathname.replace(/^\/knowledge\//, "")
  const isNew = filePath === "new"

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [content, setContent] = useState("")
  const [newPath, setNewPath] = useState("")

  useEffect(() => {
    if (isNew) return
    setLoading(true)
    apiGet<KnowledgeData>(`/api/knowledge/${filePath}`)
      .then((data) => {
        setContent(data.content)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [filePath, isNew])

  async function handleSave() {
    setSaving(true)
    setError("")
    try {
      const targetPath = isNew ? newPath.trim() : filePath
      if (!targetPath) {
        setError("Path is required.")
        setSaving(false)
        return
      }
      await apiPut(`/api/knowledge/${targetPath}`, { content })
      if (isNew) {
        navigate(`/knowledge/${targetPath}`, { replace: true })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    try {
      await apiDelete(`/api/knowledge/${filePath}`)
      navigate("/knowledge")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
    }
    setConfirmDelete(false)
  }

  if (loading) {
    return <div className="p-6 text-zinc-500">Loading...</div>
  }

  return (
    <div className="p-6 flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/knowledge")}
            className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            &larr; Back
          </button>
          <h1 className="text-lg font-bold text-zinc-100 font-mono">
            {isNew ? "New File" : filePath}
          </h1>
        </div>
        <div className="flex gap-2">
          {!isNew && (
            <button
              onClick={() => setConfirmDelete(true)}
              className="px-4 py-2 text-sm bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded transition-colors"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded transition-colors"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {isNew && (
        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            File Path (e.g. professional/my-project)
          </label>
          <input
            value={newPath}
            onChange={(e) => setNewPath(e.target.value)}
            placeholder="category/filename"
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-100 font-mono text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 min-h-[500px] w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
      />

      <ConfirmDialog
        open={confirmDelete}
        title="Delete File"
        message={`Are you sure you want to delete "${filePath}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  )
}
