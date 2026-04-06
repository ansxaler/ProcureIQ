import { getTender, getClient } from "@/lib/crm-data";
import StatusBadge from "@/components/crm/StatusBadge";
import Link from "next/link";
import TenderTabs from "@/components/crm/TenderTabs";

export default async function TenderDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tender = getTender(id);
  if (!tender) return <div className="p-6 text-text-muted">Tender not found</div>;

  const client = getClient(tender.clientId);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-5 pb-0 border-b border-navy-700 bg-navy-800/50">
        <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
          <Link href="/tenders" className="hover:text-white transition-colors">&larr; Tenders</Link>
          <span>/</span>
          <span>{tender.id.toUpperCase()}</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold">{tender.title}</h1>
              <StatusBadge status={tender.status} />
              {tender.urgency !== "standard" && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tender.urgency === "critical" ? "bg-red-400/15 text-red-400" : "bg-amber-400/15 text-amber-400"}`}>
                  {tender.urgency.toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-sm text-text-muted mt-1">
              <Link href={`/clients/${tender.clientId}`} className="hover:text-white transition-colors">
                {client?.name}
              </Link>
              {" "}&middot; {tender.category} &middot; Budget: <span className="text-accent-blue font-mono">{"\u00A3"}{tender.budget.toLocaleString()}</span>
            </p>
          </div>
        </div>
        <TenderTabs tenderId={id} />
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-6">
        {children}
      </div>
    </div>
  );
}
