import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { apiGet, apiPut, apiDelete } from "../lib/api"
import ConfirmDialog from "../components/ConfirmDialog"

interface ContentData {
  slug: string
  frontmatter: Record<string, unknown>
  body: string
}

interface Props {
  type: "impact" | "labs" | "devlog"
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function ArrayField({
  label,
  values,
  onChange,
}: {
  label: string
  values: string[]
  onChange: (v: string[]) => void
}) {
  const [input, setInput] = useState("")

  function add() {
    const trimmed = input.trim()
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed])
      setInput("")
    }
  }

  return (
    <div>
      <label className="block text-sm text-zinc-400 mb-1">{label}</label>
      <div className="flex gap-2 mb-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              add()
            }
          }}
          placeholder={`Add ${label.toLowerCase()}...`}
          className="flex-1 px-3 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-1.5 text-sm bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded transition-colors"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {values.map((v, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-zinc-800 border border-zinc-700 rounded text-zinc-300"
          >
            {v}
            <button
              type="button"
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              className="text-zinc-500 hover:text-zinc-200"
            >
              x
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}

function LinksField({
  values,
  onChange,
}: {
  values: { label: string; href: string }[]
  onChange: (v: { label: string; href: string }[]) => void
}) {
  const [label, setLabel] = useState("")
  const [href, setHref] = useState("")

  function add() {
    if (label.trim() && href.trim()) {
      onChange([...values, { label: label.trim(), href: href.trim() }])
      setLabel("")
      setHref("")
    }
  }

  return (
    <div>
      <label className="block text-sm text-zinc-400 mb-1">Links</label>
      <div className="flex gap-2 mb-2">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label"
          className="flex-1 px-3 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          value={href}
          onChange={(e) => setHref(e.target.value)}
          placeholder="URL"
          className="flex-1 px-3 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-1.5 text-sm bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded transition-colors"
        >
          Add
        </button>
      </div>
      <div className="space-y-1">
        {values.map((link, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-xs text-zinc-300"
          >
            <span className="bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5">
              {link.label} &rarr; {link.href}
            </span>
            <button
              type="button"
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              className="text-zinc-500 hover:text-zinc-200"
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ContentEditPage({ type }: Props) {
  const { slug } = useParams()
  const navigate = useNavigate()
  const isNew = !slug

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Common fields
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [body, setBody] = useState("")
  const [tags, setTags] = useState<string[]>([])

  // Impact-specific
  const [role, setRole] = useState("")
  const [impact, setImpact] = useState<string[]>([])
  const [stack, setStack] = useState<string[]>([])

  // Labs-specific
  const [status, setStatus] = useState("")
  const [links, setLinks] = useState<{ label: string; href: string }[]>([])

  // Devlog-specific
  const [date, setDate] = useState("")
  const [related, setRelated] = useState<string[]>([])

  useEffect(() => {
    if (isNew) return
    setLoading(true)
    apiGet<ContentData>(`/api/${type}/${slug}`)
      .then((data) => {
        const fm = data.frontmatter
        setTitle((fm.title as string) ?? "")
        setSummary((fm.summary as string) ?? "")
        setBody(data.body ?? "")
        setTags((fm.tags as string[]) ?? [])

        if (type === "impact") {
          setRole((fm.role as string) ?? "")
          setImpact((fm.impact as string[]) ?? [])
          setStack((fm.stack as string[]) ?? [])
        } else if (type === "labs") {
          setStatus((fm.status as string) ?? "")
          setStack((fm.stack as string[]) ?? [])
          setLinks((fm.links as { label: string; href: string }[]) ?? [])
        } else if (type === "devlog") {
          setDate((fm.date as string) ?? "")
          setRelated((fm.related as string[]) ?? [])
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [type, slug, isNew])

  function buildFrontmatter(): Record<string, unknown> {
    const fm: Record<string, unknown> = { title, summary, tags }

    if (type === "impact") {
      fm.role = role
      fm.impact = impact
      fm.stack = stack
    } else if (type === "labs") {
      fm.status = status
      fm.stack = stack
      fm.links = links
    } else if (type === "devlog") {
      fm.date = date
      fm.related = related
    }

    return fm
  }

  async function handleSave() {
    setSaving(true)
    setError("")
    try {
      const targetSlug = isNew ? slugify(title) : slug
      if (!targetSlug) {
        setError("Title is required to generate a slug.")
        setSaving(false)
        return
      }
      await apiPut(`/api/${type}/${targetSlug}`, {
        frontmatter: buildFrontmatter(),
        body,
      })
      if (isNew) {
        navigate(`/${type}/${targetSlug}`, { replace: true })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    try {
      await apiDelete(`/api/${type}/${slug}`)
      navigate(`/${type}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
    }
    setConfirmDelete(false)
  }

  if (loading) {
    return <div className="p-6 text-zinc-500">Loading...</div>
  }

  return (
    <div className="p-6 space-y-4 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">
          {isNew ? `New ${type}` : `Edit ${type}`}
        </h1>
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

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {isNew && title && (
            <p className="text-xs text-zinc-500 mt-1">
              Slug: {slugify(title)}
            </p>
          )}
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Summary</label>
          <input
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Impact-specific fields */}
        {type === "impact" && (
          <>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Role</label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <ArrayField label="Impact" values={impact} onChange={setImpact} />
            <ArrayField label="Stack" values={stack} onChange={setStack} />
          </>
        )}

        {/* Labs-specific fields */}
        {type === "labs" && (
          <>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Status</label>
              <input
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <ArrayField label="Stack" values={stack} onChange={setStack} />
            <LinksField values={links} onChange={setLinks} />
          </>
        )}

        {/* Devlog-specific fields */}
        {type === "devlog" && (
          <>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <ArrayField label="Related" values={related} onChange={setRelated} />
          </>
        )}

        {/* Tags (all types) */}
        <ArrayField label="Tags" values={tags} onChange={setTags} />

        {/* Body (markdown) */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Body (Markdown)</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={20}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete Entry"
        message={`Are you sure you want to delete "${title || slug}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  )
}
