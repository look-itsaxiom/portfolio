import { useState } from "react"
import { useApi } from "../hooks/useApi"
import { apiPut, apiDelete } from "../lib/api"
import ConfirmDialog from "../components/ConfirmDialog"

interface Project {
  slug: string
  title: string
  category: "impact" | "labs"
  tagline: string
  description: string
  story: string
  stack: string[]
  status?: string
  links?: { label: string; href: string }[]
  axiomComment: string
}

function emptyProject(): Project {
  return {
    slug: "",
    title: "",
    category: "impact",
    tagline: "",
    description: "",
    story: "",
    stack: [],
    status: "",
    links: [],
    axiomComment: "",
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function ProjectCard({
  project,
  onSave,
  onDelete,
}: {
  project: Project
  onSave: (p: Project) => Promise<void>
  onDelete: (slug: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [draft, setDraft] = useState<Project>({ ...project })
  const [saving, setSaving] = useState(false)
  const [stackInput, setStackInput] = useState("")
  const [linkLabel, setLinkLabel] = useState("")
  const [linkHref, setLinkHref] = useState("")

  function updateDraft(partial: Partial<Project>) {
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
          {draft.status && (
            <span className="ml-2 text-xs text-zinc-500">({draft.status})</span>
          )}
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
                onChange={(e) => updateDraft({ category: e.target.value as "impact" | "labs" })}
                className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="impact">impact</option>
                <option value="labs">labs</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Status</label>
              <input
                value={draft.status ?? ""}
                onChange={(e) => updateDraft({ status: e.target.value })}
                className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1">Tagline</label>
            <input
              value={draft.tagline}
              onChange={(e) => updateDraft({ tagline: e.target.value })}
              className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
            <label className="block text-xs text-zinc-500 mb-1">Story</label>
            <textarea
              value={draft.story}
              onChange={(e) => updateDraft({ story: e.target.value })}
              rows={4}
              className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>

          {/* Stack */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Stack</label>
            <div className="flex gap-2 mb-1">
              <input
                value={stackInput}
                onChange={(e) => setStackInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    const v = stackInput.trim()
                    if (v) {
                      updateDraft({ stack: [...draft.stack, v] })
                      setStackInput("")
                    }
                  }
                }}
                placeholder="Add technology..."
                className="flex-1 px-2 py-1 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => {
                  const v = stackInput.trim()
                  if (v) {
                    updateDraft({ stack: [...draft.stack, v] })
                    setStackInput("")
                  }
                }}
                className="px-2 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {draft.stack.map((s, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-zinc-800 border border-zinc-700 rounded text-zinc-300">
                  {s}
                  <button
                    type="button"
                    onClick={() => updateDraft({ stack: draft.stack.filter((_, idx) => idx !== i) })}
                    className="text-zinc-500 hover:text-zinc-200"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Links</label>
            <div className="flex gap-2 mb-1">
              <input
                value={linkLabel}
                onChange={(e) => setLinkLabel(e.target.value)}
                placeholder="Label"
                className="flex-1 px-2 py-1 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                value={linkHref}
                onChange={(e) => setLinkHref(e.target.value)}
                placeholder="URL"
                className="flex-1 px-2 py-1 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (linkLabel.trim() && linkHref.trim()) {
                    updateDraft({
                      links: [...(draft.links ?? []), { label: linkLabel.trim(), href: linkHref.trim() }],
                    })
                    setLinkLabel("")
                    setLinkHref("")
                  }
                }}
                className="px-2 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded transition-colors"
              >
                Add
              </button>
            </div>
            <div className="space-y-1">
              {(draft.links ?? []).map((link, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                  <span className="bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5">
                    {link.label} &rarr; {link.href}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateDraft({
                        links: (draft.links ?? []).filter((_, idx) => idx !== i),
                      })
                    }
                    className="text-zinc-500 hover:text-zinc-200"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1">Axiom Comment</label>
            <textarea
              value={draft.axiomComment}
              onChange={(e) => updateDraft({ axiomComment: e.target.value })}
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

export default function ProjectsPage() {
  const { data, loading, error, refetch } = useApi<Project[]>("/api/projects")
  const [deleting, setDeleting] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)

  async function handleSave(project: Project) {
    await apiPut(`/api/projects/${project.slug}`, project)
    refetch()
  }

  async function handleDelete() {
    if (!deleting) return
    await apiDelete(`/api/projects/${deleting}`)
    setDeleting(null)
    setAdding(false)
    refetch()
  }

  function handleAdd() {
    setAdding(true)
  }

  async function handleSaveNew(project: Project) {
    await apiPut(`/api/projects/${project.slug}`, project)
    setAdding(false)
    refetch()
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">Projects</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          Add Project
        </button>
      </div>

      {loading && <p className="text-zinc-500 text-sm">Loading...</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      {adding && (
        <ProjectCard
          project={emptyProject()}
          onSave={handleSaveNew}
          onDelete={() => setAdding(false)}
        />
      )}

      <div className="space-y-3">
        {(data ?? []).map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            onSave={handleSave}
            onDelete={(slug) => setDeleting(slug)}
          />
        ))}
      </div>

      {data && data.length === 0 && !adding && (
        <p className="text-zinc-500 text-sm">No projects yet.</p>
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleting}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
