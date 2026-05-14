"use client";

import { TenderDocument, Tender } from "@/lib/crm-types";
import { generatePurchaseOrder, generateInvoice, generateContract, generateSLA } from "@/lib/pdf-generator";

const DOC_ICONS: Record<string, string> = { po: "\uD83D\uDCC4", invoice: "\uD83D\uDCB3", contract: "\uD83D\uDCDD", sla: "\uD83D\uDCCB" };
const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  draft: { color: "text-text-muted", bg: "bg-navy-700" },
  reviewed: { color: "text-accent-blue", bg: "bg-accent-blue/15" },
  approved: { color: "text-emerald-400", bg: "bg-emerald-400/15" },
  sent: { color: "text-green-400", bg: "bg-green-400/15" },
};

export default function DocumentCards({ docs, tender }: { docs: TenderDocument[]; tender: Tender }) {
  const handlePreview = (type: string) => {
    if (!tender.selectedOption || !tender.requirement) return;
    const doc = type === "po" ? generatePurchaseOrder(tender.selectedOption, tender.requirement)
      : type === "invoice" ? generateInvoice(tender.selectedOption, tender.requirement)
      : type === "contract" ? generateContract(tender.selectedOption, tender.requirement)
      : generateSLA(tender.selectedOption, tender.requirement);
    window.open(URL.createObjectURL(doc.output("blob")), "_blank");
  };

  const handleDownload = (type: string) => {
    if (!tender.selectedOption || !tender.requirement) return;
    const doc = type === "po" ? generatePurchaseOrder(tender.selectedOption, tender.requirement)
      : type === "invoice" ? generateInvoice(tender.selectedOption, tender.requirement)
      : type === "contract" ? generateContract(tender.selectedOption, tender.requirement)
      : generateSLA(tender.selectedOption, tender.requirement);
    doc.save(`ProcureIQ_${type.toUpperCase()}_${tender.id}.pdf`);
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h2 className="text-lg font-bold">Documents</h2>
        <p className="text-text-muted text-sm">Generated procurement documents with review status</p>
      </div>

      {docs.map((d) => {
        const styles = STATUS_STYLES[d.status];
        return (
          <div key={d.id} className={`border rounded-xl p-5 transition-all ${d.status === "sent" ? "border-green-500/20 bg-navy-800" : "border-navy-700 bg-navy-800"}`}>
            <div className="flex items-center gap-4">
              <span className="text-2xl">{DOC_ICONS[d.type]}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{d.label}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${styles.color} ${styles.bg}`}>{d.status}</span>
                </div>
                <p className="text-xs text-text-muted">
                  Generated {new Date(d.generatedAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  {d.reviewedAt && ` \u2022 Reviewed ${new Date(d.reviewedAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {tender.selectedOption && tender.requirement && (
                  <>
                    <button onClick={() => handlePreview(d.type)} className="px-3 py-1.5 text-xs font-medium bg-navy-700 hover:bg-navy-600 rounded-lg transition-colors">
                      Preview PDF
                    </button>
                    <button onClick={() => handleDownload(d.type)} className="px-3 py-1.5 text-xs font-medium bg-zinc-50/10 hover:bg-zinc-50/15 text-zinc-300 rounded-lg transition-colors">
                      Download
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
