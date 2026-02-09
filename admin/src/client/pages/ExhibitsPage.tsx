import { useState } from "react"
import { useApi } from "../hooks/useApi"
import { apiPut, apiDelete } from "../lib/api"
import ConfirmDialog from "../components/ConfirmDialog"

interface Exhibit {
  slug: string
  title: string
  category: "impact" | "labs" | "devlog" | "trivia"
  description: string
  axiomNote: string
  href: string
}

function emptyExhibit(): Exhibit {
  return {
    slug: "",
    title: "",
    category: "impact",
    description: "",
    axiomNote: "",
    href: "",
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function ExhibitCard({
  exhibit,
  onSave,
  onDelete,
}: {
  exhibit: Exhibit
  onSave: (e: Exhibit) => Promise<void>
  onDelete: (slug: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [draft, setDraft] = useState<Exhibit>({ ...exhibit })
  const [saving, setSaving] = useState(false)

  function updateDraft(partial: Partial<Exhibit>) {
    setDraft((d) => ({ ...d, ...partial }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const slug = draft.slug || slugify(draft.title)
      await onSave({ ...draft, slug })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <span className="text-zinc-100 font-medium">{draft.title || "Untitled"}</span>
          <span className="ml-2 text-xs text-zinc-500">{draft.category}</span>
        </div>
        <span className="text-zinc-500 text-sm">{expanded ? "Collapse" : "Expand"}</span>
      </div>

      {expanded && (
        <div className="border-t border-zinc-800 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Slug</label>
              <input
                value={draft.slug}
                onChange={(e) => updateDraft({ slug: e.target.value })}
                className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Title</label>
              <input
                value={draft.title}
                onChange={(e) => updateDraft({ title: e.target.value })}
                className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Category</label>
              <select
                value={draft.category}
                onChange={(e) =>
                  updateDraft({
                    category: e.target.value as "impact" | "labs" | "devlog" | "trivia",
                  })
                }
                className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="impact">impact</option>
                <option value="labs">labs</option>
                <option value="devlog">devlog</option>
                <option value="trivia">trivia</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Href</label>
              <input
                value={draft.href}
                onChange={(e) => updateDraft({ href: e.target.value })}
                className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1">Description</label>
            <textarea
              value={draft.description}
              onChange={(e) => updateDraft({ description: e.target.value })}
              rows={3}
              className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1">Axiom Note</label>
            <textarea
              value={draft.axiomNote}
              onChange={(e) => updateDraft({ axiomNote: e.target.value })}
              rows={2}
              className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded transition-colors"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => onDelete(draft.slug)}
              className="px-4 py-2 text-sm bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ExhibitsPage() {
  const { data, loading, error, refetch } = useApi<Exhibit[]>("/api/exhibits")
  const [deleting, setDeleting] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)

  async function handleSave(exhibit: Exhibit) {
    await apiPut(`/api/exhibits/${exhibit.slug}`, exhibit)
    refetch()
  }

  async function handleDelete() {
    if (!deleting) return
    await apiDelete(`/api/exhibits/${deleting}`)
    setDeleting(null)
    setAdding(false)
    refetch()
  }

  async function handleSaveNew(exhibit: Exhibit) {
    await apiPut(`/api/exhibits/${exhibit.slug}`, exhibit)
    setAdding(false)
    refetch()
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">Exhibits</h1>
        <button
          onClick={() => setAdding(true)}
          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          Add Exhibit
        </button>
      </div>

      {loading && <p className="text-zinc-500 text-sm">Loading...</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      {adding && (
        <ExhibitCard
          exhibit={emptyExhibit()}
          onSave={handleSaveNew}
          onDelete={() => setAdding(false)}
        />
      )}

      <div className="space-y-3">
        {(data ?? []).map((exhibit) => (
          <ExhibitCard
            key={exhibit.slug}
            exhibit={exhibit}
            onSave={handleSave}
            onDelete={(slug) => setDeleting(slug)}
          />
        ))}
      </div>

      {data && data.length === 0 && !adding && (
        <p className="text-zinc-500 text-sm">No exhibits yet.</p>
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Delete Exhibit"
        message={`Are you sure you want to delete "${deleting}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
