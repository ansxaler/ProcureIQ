import { getDashboardMetrics, getAllRecentActivities, TENDERS, CLIENTS } from "@/lib/crm-data";
import { STATUS_CONFIG } from "@/lib/crm-types";
import StatusBadge from "@/components/crm/StatusBadge";
import Link from "next/link";

export default function DashboardPage() {
  const metrics = getDashboardMetrics();
  const recentActivity = getAllRecentActivities(12);

  const statusCounts = Object.keys(STATUS_CONFIG).map((s) => ({
    status: s,
    ...STATUS_CONFIG[s as keyof typeof STATUS_CONFIG],
    count: TENDERS.filter((t) => t.status === s).length,
  })).filter((s) => s.count > 0);

  const activeTenders = TENDERS.filter((t) => !["completed", "cancelled"].includes(t.status));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-text-muted text-sm">Real-time procurement pipeline overview</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Active Tenders" value={String(metrics.activeTenders)} sub="In progress" accent="text-accent-blue" />
        <MetricCard label="Pipeline Value" value={`\u00A3${(metrics.totalPipeline / 1000).toFixed(0)}k`} sub={`${TENDERS.length} total tenders`} accent="text-accent-blue" />
        <MetricCard label="Avg. Savings" value={`\u00A3${metrics.avgSavings.toLocaleString()}`} sub={`\u00A3${metrics.totalSavings.toLocaleString()} total saved`} accent="text-green-400" />
        <MetricCard label="Clients" value={String(metrics.clientCount)} sub={`${metrics.completed} deals completed`} accent="text-accent-light" />
      </div>

      {/* Pipeline + Activity */}
      <div className="grid grid-cols-3 gap-4">
        {/* Pipeline */}
        <div className="col-span-2 bg-navy-800 border border-navy-700 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Pipeline by Status</h2>
          <div className="space-y-2.5">
            {statusCounts.map((s) => (
              <div key={s.status} className="flex items-center gap-3">
                <span className={`text-xs font-medium w-24 ${s.color}`}>{s.label}</span>
                <div className="flex-1 h-6 bg-navy-900 rounded overflow-hidden">
                  <div
                    className={`h-full rounded ${s.bg} flex items-center px-2`}
                    style={{ width: `${Math.max(s.count / TENDERS.length * 100, 12)}%` }}
                  >
                    <span className={`text-xs font-bold ${s.color}`}>{s.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Recent Activity</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentActivity.map((a) => {
              const typeColors = { system: "text-text-muted", agent: "text-accent-blue", user: "text-white", supplier: "text-amber-400", document: "text-green-400" };
              return (
                <div key={a.id} className="text-xs">
                  <p className={typeColors[a.type]}>{a.message}</p>
                  <p className="text-text-muted/50 mt-0.5">
                    {a.tenderTitle} &middot; {new Date(a.timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Tenders */}
      <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Active Tenders</h2>
          <Link href="/tenders" className="text-xs text-zinc-400 hover:text-zinc-50">View all &rarr;</Link>
        </div>
        <div className="space-y-2">
          {activeTenders.map((t) => {
            const client = CLIENTS.find((c) => c.id === t.clientId);
            return (
              <Link
                key={t.id}
                href={`/tenders/${t.id}`}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-navy-700 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{t.title}</p>
                  <p className="text-xs text-text-muted">{client?.name} &middot; {t.category}</p>
                </div>
                <p className="text-sm font-mono text-accent-blue shrink-0">{"\u00A3"}{(t.budget / 1000).toFixed(0)}k</p>
                <StatusBadge status={t.status} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: string }) {
  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-4">
      <p className="text-xs text-text-muted uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p>
      <p className="text-xs text-text-muted mt-1">{sub}</p>
    </div>
  );
}
