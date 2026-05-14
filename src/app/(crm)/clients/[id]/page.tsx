import { getClient, getTendersByClient } from "@/lib/crm-data";
import StatusBadge from "@/components/crm/StatusBadge";
import Link from "next/link";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = getClient(id);
  if (!client) return <div className="p-6 text-text-muted">Client not found</div>;

  const tenders = getTendersByClient(id);
  const totalSavings = tenders.reduce((s, t) => s + (t.selectedOption?.savingsVsIncumbent || 0), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Back link */}
      <Link href="/clients" className="text-xs text-text-muted hover:text-white transition-colors">&larr; Clients</Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-zinc-800 rounded-xl flex items-center justify-center text-lg font-bold text-zinc-50">
          {client.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{client.name}</h1>
          <p className="text-text-muted text-sm">{client.sector} &middot; {client.location}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Total Spend" value={`\u00A3${client.totalSpend.toLocaleString()}`} />
        <MetricCard label="Tenders" value={String(tenders.length)} />
        <MetricCard label="Total Savings" value={`\u00A3${totalSavings.toLocaleString()}`} />
        <MetricCard label="Contact" value={client.contactName} />
      </div>

      {/* Contact Details */}
      <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Contact Details</h2>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-xs text-text-muted">Name</p>
            <p>{client.contactName}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Email</p>
            <p className="text-zinc-300">{client.contactEmail}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Client Since</p>
            <p>{new Date(client.joinedDate).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</p>
          </div>
        </div>
      </div>

      {/* Tenders */}
      <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Tenders</h2>
        <div className="space-y-2">
          {tenders.map((t) => (
            <Link
              key={t.id}
              href={`/tenders/${t.id}`}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-navy-700 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{t.title}</p>
                <p className="text-xs text-text-muted">{t.category}</p>
              </div>
              <p className="text-sm font-mono text-accent-blue">{"\u00A3"}{t.budget.toLocaleString()}</p>
              <StatusBadge status={t.status} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-4">
      <p className="text-xs text-text-muted uppercase tracking-wider">{label}</p>
      <p className="text-lg font-bold mt-1">{value}</p>
    </div>
  );
}
