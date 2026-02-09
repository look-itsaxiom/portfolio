import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApi } from "../hooks/useApi"
import { apiDelete } from "../lib/api"
import ConfirmDialog from "../components/ConfirmDialog"

interface Entry {
  slug: string
  title: string
  date: string
  summary: string
}

export default function DevlogListPage() {
  const { data, loading, error, refetch } = useApi<Entry[]>("/api/devlog")
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDelete() {
    if (!deleting) return
    await apiDelete(`/api/devlog/${deleting}`)
    setDeleting(null)
    refetch()
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">Devlog</h1>
        <button
          onClick={() => navigate("/devlog/new")}
          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          New Entry
        </button>
      </div>

      {loading && <p className="text-zinc-500 text-sm">Loading...</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      {data && data.length > 0 && (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-zinc-400">
              <th className="pb-2 font-medium">Title</th>
              <th className="pb-2 font-medium">Date</th>
              <th className="pb-2 font-medium">Summary</th>
              <th className="pb-2 font-medium w-20"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => (
              <tr
                key={entry.slug}
                className="border-b border-zinc-800/50 hover:bg-zinc-900/50 cursor-pointer"
                onClick={() => navigate(`/devlog/${entry.slug}`)}
              >
                <td className="py-3 text-zinc-100">{entry.title}</td>
                <td className="py-3 text-zinc-400 whitespace-nowrap">{entry.date}</td>
                <td className="py-3 text-zinc-400">{entry.summary}</td>
                <td className="py-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleting(entry.slug)
                    }}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {data && data.length === 0 && (
        <p className="text-zinc-500 text-sm">No entries yet.</p>
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Delete Entry"
        message={`Are you sure you want to delete "${deleting}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
