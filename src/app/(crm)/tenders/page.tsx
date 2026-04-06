import { TENDERS, CLIENTS } from "@/lib/crm-data";
import StatusBadge from "@/components/crm/StatusBadge";
import Link from "next/link";

export default function TendersPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tenders</h1>
          <p className="text-text-muted text-sm">{TENDERS.length} total procurement requests</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-navy-800 border border-navy-700 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-navy-700">
              <th className="text-left px-4 py-3 text-xs text-text-muted uppercase tracking-wider font-semibold">Tender</th>
              <th className="text-left px-4 py-3 text-xs text-text-muted uppercase tracking-wider font-semibold">Client</th>
              <th className="text-left px-4 py-3 text-xs text-text-muted uppercase tracking-wider font-semibold">Category</th>
              <th className="text-right px-4 py-3 text-xs text-text-muted uppercase tracking-wider font-semibold">Budget</th>
              <th className="text-left px-4 py-3 text-xs text-text-muted uppercase tracking-wider font-semibold">Status</th>
              <th className="text-left px-4 py-3 text-xs text-text-muted uppercase tracking-wider font-semibold">Updated</th>
            </tr>
          </thead>
          <tbody>
            {TENDERS.map((t) => {
              const client = CLIENTS.find((c) => c.id === t.clientId);
              return (
                <tr key={t.id} className="border-b border-navy-700/50 hover:bg-navy-700/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/tenders/${t.id}`} className="hover:text-accent-blue transition-colors">
                      <p className="font-medium text-sm">{t.title}</p>
                      <p className="text-xs text-text-muted mt-0.5">Qty: {t.quantity}</p>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/clients/${t.clientId}`} className="text-sm text-text-muted hover:text-white transition-colors">
                      {client?.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-muted">{t.category}</td>
                  <td className="px-4 py-3 text-sm font-mono text-accent-blue text-right">{"\u00A3"}{t.budget.toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3 text-xs text-text-muted">
                    {new Date(t.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
