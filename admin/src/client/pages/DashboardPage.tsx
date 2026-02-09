import { useApi } from "../hooks/useApi"

interface HealthData {
  status: string
  qdrant: string
  ollama: string
}

interface RagStats {
  vectors_count?: number
  points_count?: number
}

interface ListItem {
  slug?: string
  path?: string
}

function StatCard({ label, value, loading }: { label: string; value: string | number; loading: boolean }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-semibold text-zinc-100">
        {loading ? "..." : value}
      </p>
    </div>
  )
}

function StatusBadge({ label, status, loading }: { label: string; status: string; loading: boolean }) {
  const isOk = status === "ok"
  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-2 h-2 rounded-full ${
          loading ? "bg-zinc-600" : isOk ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span className="text-sm text-zinc-300">{label}</span>
      <span className="text-xs text-zinc-500">
        {loading ? "checking..." : status}
      </span>
    </div>
  )
}

export default function DashboardPage() {
  const health = useApi<HealthData>("/api/health")
  const impact = useApi<ListItem[]>("/api/impact")
  const labs = useApi<ListItem[]>("/api/labs")
  const devlog = useApi<ListItem[]>("/api/devlog")
  const knowledge = useApi<ListItem[]>("/api/knowledge")
  const ragStats = useApi<RagStats>("/api/rag/stats")
  const projects = useApi<ListItem[]>("/api/projects")

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Impact" value={impact.data?.length ?? 0} loading={impact.loading} />
        <StatCard label="Labs" value={labs.data?.length ?? 0} loading={labs.loading} />
        <StatCard label="Devlog" value={devlog.data?.length ?? 0} loading={devlog.loading} />
        <StatCard label="Knowledge" value={knowledge.data?.length ?? 0} loading={knowledge.loading} />
        <StatCard
          label="RAG Vectors"
          value={ragStats.data?.vectors_count ?? ragStats.data?.points_count ?? 0}
          loading={ragStats.loading}
        />
        <StatCard label="Projects" value={projects.data?.length ?? 0} loading={projects.loading} />
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
          Service Status
        </h2>
        <StatusBadge label="Qdrant" status={health.data?.qdrant ?? ""} loading={health.loading} />
        <StatusBadge label="Ollama" status={health.data?.ollama ?? ""} loading={health.loading} />
      </div>

      {(impact.error || labs.error || devlog.error || knowledge.error || ragStats.error || projects.error) && (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-300">
            Some data failed to load. Check that all services are running.
          </p>
        </div>
      )}
    </div>
  )
}
