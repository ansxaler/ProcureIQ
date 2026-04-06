import { getTender, getClient, getVendorResponses, getActivities } from "@/lib/crm-data";
import StatusBadge from "@/components/crm/StatusBadge";

export default async function TenderOverview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tender = getTender(id);
  if (!tender) return null;

  const client = getClient(tender.clientId);
  const vendorCount = getVendorResponses(id).filter((v) => v.status === "quoted").length;
  const activities = getActivities(id).slice(0, 5);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Description */}
      <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">Description</h2>
        <p className="text-sm leading-relaxed">{tender.description}</p>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard label="Budget" value={`\u00A3${tender.budget.toLocaleString()}`} />
        <SummaryCard label="Quantity" value={`${tender.quantity} units`} />
        <SummaryCard label="Quotes Received" value={`${vendorCount} suppliers`} />
        <SummaryCard label="Client" value={client?.name || "Unknown"} />
      </div>

      {/* Requirement (if parsed) */}
      {tender.requirement && (
        <div className="bg-navy-800 border border-navy-700 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Parsed Requirement</h2>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-text-muted">Category</p>
              <p className="text-sm font-medium">{tender.requirement.category}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Budget</p>
              <p className="text-sm font-medium">{tender.requirement.budget}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Urgency</p>
              <p className={`text-sm font-medium capitalize ${tender.urgency === "critical" ? "text-red-400" : tender.urgency === "urgent" ? "text-amber-400" : "text-green-400"}`}>
                {tender.urgency}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-2">SLA Requirements</p>
            <div className="flex flex-wrap gap-1.5">
              {tender.requirement.slaRequirements.map((s, i) => (
                <span key={i} className="px-2.5 py-1 bg-navy-700 rounded-full text-xs text-accent-light">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-2">Compliance</p>
            <div className="flex flex-wrap gap-1.5">
              {tender.requirement.complianceNeeds.map((c, i) => (
                <span key={i} className="px-2.5 py-1 bg-steel-500/20 rounded-full text-xs text-accent-blue">{c}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Selected Option (if any) */}
      {tender.selectedOption && (
        <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">Selected Option</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-lg">{tender.selectedOption.quote.supplierName}</p>
              <p className="text-sm text-text-muted">Score: {tender.selectedOption.overallScore}/100 &middot; Delivery: {tender.selectedOption.quote.deliveryDays} days</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-accent-blue">{"\u00A3"}{tender.selectedOption.openBookBreakdown.totalCost.toLocaleString()}</p>
              <p className="text-sm text-green-400">Saving: {"\u00A3"}{tender.selectedOption.savingsVsIncumbent.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Latest Activity</h2>
        <div className="space-y-2">
          {activities.map((a) => {
            const colors = { system: "text-text-muted", agent: "text-accent-blue", user: "text-white", supplier: "text-amber-400", document: "text-green-400" };
            return (
              <div key={a.id} className="flex gap-3 text-xs">
                <span className="text-text-muted/50 w-20 shrink-0">
                  {new Date(a.timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </span>
                <span className={colors[a.type]}>{a.message}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-4">
      <p className="text-xs text-text-muted uppercase tracking-wider">{label}</p>
      <p className="text-lg font-bold mt-1">{value}</p>
    </div>
  );
}
