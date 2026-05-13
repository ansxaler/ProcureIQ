import { getTender } from "@/lib/crm-data";

export default async function ScoringPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tender = getTender(id);
  if (!tender) return null;

  if (tender.scoredOptions.length === 0) {
    return (
      <div className="text-center py-16 text-text-muted">
        <p className="text-lg font-medium">Scoring not yet available</p>
        <p className="text-sm mt-1">This tender is still in the {tender.status} stage</p>
      </div>
    );
  }

  const rankColors = ["border-zinc-600 bg-zinc-50/[0.03]", "border-navy-700 bg-navy-800", "border-navy-700 bg-navy-800"];
  const rankBadges = ["bg-zinc-50 text-zinc-950", "bg-navy-600 text-white", "bg-navy-600 text-white"];

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h2 className="text-lg font-bold">Scored Options</h2>
        <p className="text-text-muted text-sm">Ranked by multi-factor scoring &mdash; open-book pricing on all options</p>
      </div>

      {tender.scoredOptions.map((opt, i) => (
        <div key={opt.quote.supplierId} className={`border rounded-xl p-5 ${rankColors[i]}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${rankBadges[i]}`}>
                {opt.rank}
              </span>
              <div>
                <h3 className="font-bold">{opt.quote.supplierName}</h3>
                <p className="text-xs text-text-muted">Score: {opt.overallScore}/100 | Delivery: {opt.quote.deliveryDays} days</p>
              </div>
            </div>
            {i === 0 && <span className="px-3 py-1 bg-zinc-50/10 text-zinc-300 rounded-full text-xs font-semibold">RECOMMENDED</span>}
            {tender.selectedOption?.quote.supplierId === opt.quote.supplierId && (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">SELECTED</span>
            )}
          </div>

          {/* Score bars */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: "Price", score: opt.priceScore },
              { label: "Delivery", score: opt.deliveryScore },
              { label: "SLA Match", score: opt.slaScore },
              { label: "Value", score: opt.valueScore },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-[10px] text-text-muted mb-0.5">
                  <span>{s.label}</span><span>{s.score}</span>
                </div>
                <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${s.score >= 80 ? "bg-green-400" : s.score >= 50 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${s.score}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Pros/Cons */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-green-400 font-semibold mb-1">Pros</p>
              {opt.pros.map((p, j) => <p key={j} className="text-xs text-text-muted"><span className="text-green-400">+</span> {p}</p>)}
            </div>
            <div>
              <p className="text-xs text-amber-400 font-semibold mb-1">Cons</p>
              {opt.cons.map((c, j) => <p key={j} className="text-xs text-text-muted"><span className="text-amber-400">-</span> {c}</p>)}
            </div>
          </div>

          {/* Open Book Pricing */}
          <div className="bg-navy-900/60 rounded-lg p-4">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-2 font-semibold">Open Book Pricing</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>Supplier base price</span><span>{"\u00A3"}{opt.openBookBreakdown.supplierBase.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Platform fee (2%)</span><span>{"\u00A3"}{opt.openBookBreakdown.platformFee.toLocaleString()}</span></div>
              <div className="flex justify-between text-text-muted/60"><span>Rebate captured ({opt.quote.rebatePercent}%)</span><span>{"\u00A3"}{opt.openBookBreakdown.rebateCaptured.toLocaleString()}</span></div>
              <div className="flex justify-between text-green-400"><span>Your rebate saving (50%)</span><span>-{"\u00A3"}{opt.openBookBreakdown.rebateSaving.toLocaleString()}</span></div>
              <div className="border-t border-navy-700 pt-1 mt-1 flex justify-between font-bold"><span>Total cost to you</span><span>{"\u00A3"}{opt.openBookBreakdown.totalCost.toLocaleString()}</span></div>
            </div>
            <p className="text-xs text-green-400 mt-2">Saving vs incumbent: <span className="font-bold">{"\u00A3"}{opt.savingsVsIncumbent.toLocaleString()}</span></p>
          </div>
        </div>
      ))}
    </div>
  );
}
