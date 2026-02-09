import { useState, useEffect, useCallback } from "react"
import { apiGet, apiPost, apiDelete } from "../lib/api"
import ConfirmDialog from "../components/ConfirmDialog"

interface RagPoint {
  id: number
  payload?: {
    text?: string
    source?: string
    category?: string
  }
}

interface ListResult {
  points: RagPoint[]
  next_page_offset?: number | null
}

interface SearchResult {
  id: number
  score: number
  payload?: {
    text?: string
    source?: string
    category?: string
  }
}

const PAGE_SIZE = 20
const CATEGORIES = ["professional", "labs", "meta", "general", "devlog"]

export default function RagEntriesPage() {
  const [points, setPoints] = useState<RagPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState("")
  const [deleting, setDeleting] = useState<number | null>(null)

  // Add entry form
  const [newText, setNewText] = useState("")
  const [newSource, setNewSource] = useState("")
  const [newCategory, setNewCategory] = useState("general")
  const [adding, setAdding] = useState(false)

  // Search
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null)
  const [searching, setSearching] = useState(false)

  const fetchPoints = useCallback(async (off: number) => {
    setLoading(true)
    try {
      const result = await apiGet<ListResult>(`/api/rag/entries?offset=${off}&limit=${PAGE_SIZE}`)
      setPoints(result.points ?? [])
      setHasMore(result.next_page_offset != null)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPoints(offset)
  }, [offset, fetchPoints])

  async function handleDelete() {
    if (deleting === null) return
    try {
      await apiDelete(`/api/rag/entries/${deleting}`)
      setDeleting(null)
      fetchPoints(offset)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
    }
  }

  async function handleAdd() {
    if (!newText.trim() || !newSource.trim()) return
    setAdding(true)
    try {
      await apiPost("/api/rag/entries", {
        text: newText.trim(),
        source: newSource.trim(),
        category: newCategory,
      })
      setNewText("")
      setNewSource("")
      setNewCategory("general")
      fetchPoints(offset)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Add failed")
    } finally {
      setAdding(false)
    }
  }

  async function handleSearch() {
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const results = await apiPost<SearchResult[]>("/api/rag/search", {
        query: searchQuery.trim(),
        limit: 5,
      })
      setSearchResults(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed")
    } finally {
      setSearching(false)
    }
  }

  function truncate(text: string, len: number): string {
    return text.length > len ? text.slice(0, len) + "..." : text
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-zinc-100">RAG Entries</h1>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* Add Entry Form */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
          Add Entry
        </h2>
        <textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Text content..."
          rows={3}
          className="w-full px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
        <div className="flex gap-2">
          <input
            value={newSource}
            onChange={(e) => setNewSource(e.target.value)}
            placeholder="Source"
            className="flex-1 px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={adding || !newText.trim() || !newSource.trim()}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded transition-colors"
          >
            {adding ? "Adding..." : "Add"}
          </button>
        </div>
      </div>

      {/* Test Search */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
          Test Search
        </h2>
        <div className="flex gap-2">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch()
            }}
            placeholder="Search query..."
            className="flex-1 px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={searching || !searchQuery.trim()}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded transition-colors"
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </div>
        {searchResults && (
          <div className="space-y-2 mt-2">
            {searchResults.length === 0 && (
              <p className="text-sm text-zinc-500">No results.</p>
            )}
            {searchResults.map((r) => (
              <div
                key={r.id}
                className="border border-zinc-700 rounded p-3 text-sm"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-zinc-400 text-xs">
                    ID: {r.id} | Score: {r.score.toFixed(4)}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {r.payload?.source} / {r.payload?.category}
                  </span>
                </div>
                <p className="text-zinc-200">{r.payload?.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Entries Table */}
      {loading ? (
        <p className="text-zinc-500 text-sm">Loading...</p>
      ) : (
        <>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-left text-zinc-400">
                <th className="pb-2 font-medium w-24">ID</th>
                <th className="pb-2 font-medium">Text</th>
                <th className="pb-2 font-medium w-28">Source</th>
                <th className="pb-2 font-medium w-24">Category</th>
                <th className="pb-2 font-medium w-16"></th>
              </tr>
            </thead>
            <tbody>
              {points.map((pt) => (
                <tr key={pt.id} className="border-b border-zinc-800/50">
                  <td className="py-3 text-zinc-400 font-mono text-xs">{pt.id}</td>
                  <td className="py-3 text-zinc-200">
                    {truncate(pt.payload?.text ?? "", 80)}
                  </td>
                  <td className="py-3 text-zinc-400 text-xs">{pt.payload?.source}</td>
                  <td className="py-3 text-zinc-400 text-xs">{pt.payload?.category}</td>
                  <td className="py-3">
                    <button
                      onClick={() => setDeleting(pt.id)}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {points.length === 0 && (
            <p className="text-zinc-500 text-sm">No entries.</p>
          )}

          {/* Pagination */}
          <div className="flex gap-2">
            <button
              disabled={offset === 0}
              onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
              className="px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-300 rounded transition-colors"
            >
              Previous
            </button>
            <button
              disabled={!hasMore}
              onClick={() => setOffset(offset + PAGE_SIZE)}
              className="px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-300 rounded transition-colors"
            >
              Next
            </button>
            <span className="text-xs text-zinc-500 self-center">
              Offset: {offset}
            </span>
          </div>
        </>
      )}

      <ConfirmDialog
        open={deleting !== null}
        title="Delete RAG Entry"
        message={`Are you sure you want to delete entry ${deleting}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
