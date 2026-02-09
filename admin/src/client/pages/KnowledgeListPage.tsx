import { useNavigate } from "react-router-dom"
import { useApi } from "../hooks/useApi"

interface Entry {
  path: string
  category: string
  size: number
  modified?: string
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export default function KnowledgeListPage() {
  const { data, loading, error } = useApi<Entry[]>("/api/knowledge")
  const navigate = useNavigate()

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">Knowledge</h1>
        <button
          onClick={() => navigate("/knowledge/new")}
          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          New File
        </button>
      </div>

      {loading && <p className="text-zinc-500 text-sm">Loading...</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      {data && data.length > 0 && (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-zinc-400">
              <th className="pb-2 font-medium">Path</th>
              <th className="pb-2 font-medium">Category</th>
              <th className="pb-2 font-medium">Size</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => (
              <tr
                key={entry.path}
                className="border-b border-zinc-800/50 hover:bg-zinc-900/50 cursor-pointer"
                onClick={() => navigate(`/knowledge/${entry.path}`)}
              >
                <td className="py-3 text-zinc-100 font-mono text-xs">{entry.path}</td>
                <td className="py-3 text-zinc-400">{entry.category}</td>
                <td className="py-3 text-zinc-400">{formatBytes(entry.size)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {data && data.length === 0 && (
        <p className="text-zinc-500 text-sm">No knowledge files yet.</p>
      )}
    </div>
  )
}
