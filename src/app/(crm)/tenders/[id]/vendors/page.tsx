import { getTender, getVendorResponses } from "@/lib/crm-data";

const statusConfig = {
  quoted: { label: "Quoted", color: "text-green-400", bg: "bg-green-400/15" },
  declined: { label: "Declined", color: "text-red-400", bg: "bg-red-400/15" },
  no_response: { label: "No Response", color: "text-text-muted", bg: "bg-navy-700" },
  pending: { label: "Pending", color: "text-amber-400", bg: "bg-amber-400/15" },
};

export default async function VendorsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tender = getTender(id);
  if (!tender) return null;

  const responses = getVendorResponses(id);

  if (responses.length === 0) {
    return (
      <div className="text-center py-16 text-text-muted">
        <p className="text-lg font-medium">No vendor responses yet</p>
        <p className="text-sm mt-1">RFQs will be sent when the tender moves to sourcing</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h2 className="text-lg font-bold">Vendor Responses</h2>
        <p className="text-text-muted text-sm">{responses.filter((r) => r.status === "quoted").length} quotes received from {responses.length} contacted suppliers</p>
      </div>

      {responses.map((r) => {
        const cfg = statusConfig[r.status];
        return (
          <div key={r.supplierId} className={`border rounded-xl p-5 ${r.status === "quoted" ? "border-green-500/20 bg-navy-800" : "border-navy-700 bg-navy-800"}`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold">{r.supplierName}</h3>
                {r.respondedAt && (
                  <p className="text-xs text-text-muted">
                    Responded {new Date(r.respondedAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                )}
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.color} ${cfg.bg}`}>
                {cfg.label}
              </span>
            </div>

            {r.message && (
              <div className={`rounded-lg p-3 text-sm leading-relaxed whitespace-pre-line ${r.status === "quoted" ? "bg-navy-900/60" : "bg-navy-900/30 text-text-muted"}`}>
                {r.message}
              </div>
            )}

            {r.quote && (
              <div className="mt-3 grid grid-cols-4 gap-3">
                <QuoteStat label="Unit Price" value={`\u00A3${Math.round(r.quote.unitPrice).toLocaleString()}`} />
                <QuoteStat label="Total" value={`\u00A3${Math.round(r.quote.totalPrice).toLocaleString()}`} />
                <QuoteStat label="Delivery" value={`${r.quote.deliveryDays} days`} />
                <QuoteStat label="SLA Match" value={`${r.quote.slaMatch}%`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function QuoteStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-navy-900/40 rounded-lg p-2.5 text-center">
      <p className="text-[10px] text-text-muted uppercase">{label}</p>
      <p className="text-sm font-bold text-zinc-50">{value}</p>
    </div>
  );
}
