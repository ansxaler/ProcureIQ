"use client";

import { ScoredOption, Requirement } from "@/lib/types";
import { useState } from "react";
import {
  generatePurchaseOrder,
  generateInvoice,
  generateContract,
  generateSLA,
} from "@/lib/pdf-generator";

interface Props {
  option: ScoredOption;
  requirement: Requirement;
  totalTime: number;
  onReset: () => void;
}

interface DocState {
  reviewed: boolean;
  downloading: boolean;
}

const DOCUMENTS = [
  { key: "po", label: "Purchase Order", icon: "\uD83D\uDCC4", description: "Formal order to supplier with open-book pricing" },
  { key: "invoice", label: "Invoice", icon: "\uD83D\uDCB3", description: "Tax invoice with VAT breakdown and rebate credit" },
  { key: "contract", label: "Service Contract", icon: "\uD83D\uDCDD", description: "Full supply agreement with open-book terms" },
  { key: "sla", label: "SLA Agreement", icon: "\uD83D\uDCCB", description: "Service levels, compliance, and breach remedies" },
] as const;

type DocKey = (typeof DOCUMENTS)[number]["key"];

export default function CompleteStep({ option, requirement, totalTime, onReset }: Props) {
  const [docStates, setDocStates] = useState<Record<DocKey, DocState>>({
    po: { reviewed: false, downloading: false },
    invoice: { reviewed: false, downloading: false },
    contract: { reviewed: false, downloading: false },
    sla: { reviewed: false, downloading: false },
  });
  const [previewDoc, setPreviewDoc] = useState<DocKey | null>(null);
  const [allApproved, setAllApproved] = useState(false);

  const allReviewed = DOCUMENTS.every((d) => docStates[d.key].reviewed);

  const handlePreview = (key: DocKey) => {
    const doc = generateDoc(key, option, requirement);
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setPreviewDoc(key);
  };

  const handleDownload = (key: DocKey) => {
    setDocStates((prev) => ({
      ...prev,
      [key]: { ...prev[key], downloading: true },
    }));

    const doc = generateDoc(key, option, requirement);
    doc.save(`ProcureIQ_${key.toUpperCase()}_${Date.now()}.pdf`);

    setTimeout(() => {
      setDocStates((prev) => ({
        ...prev,
        [key]: { ...prev[key], downloading: false },
      }));
    }, 1000);
  };

  const handleMarkReviewed = (key: DocKey) => {
    setDocStates((prev) => ({
      ...prev,
      [key]: { ...prev[key], reviewed: !prev[key].reviewed },
    }));
  };

  const handleApproveAll = () => {
    setAllApproved(true);
  };

  return (
    <div className="animate-slide-up space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
          <span className="text-2xl text-green-400">&#x2713;</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Documents Ready for Review</h2>
          <p className="text-text-muted text-sm">
            Completed in{" "}
            <span className="text-zinc-50 font-mono font-bold">
              {(totalTime / 1000).toFixed(0)}s
            </span>
            {" "}&mdash; review each document before forwarding to the supplier
          </p>
        </div>
      </div>

      {/* Order summary bar */}
      <div className="bg-navy-800 border border-navy-700 rounded-lg p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-text-muted uppercase">Supplier</p>
          <p className="font-semibold">{option.quote.supplierName}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-text-muted uppercase">Total Cost</p>
          <p className="font-bold text-xl text-zinc-50">
            {"\u00A3"}{option.openBookBreakdown.totalCost.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-muted uppercase">Saving</p>
          <p className="font-bold text-xl text-green-400">
            {"\u00A3"}{option.savingsVsIncumbent.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Document cards */}
      <div className="space-y-3">
        {DOCUMENTS.map((doc) => {
          const state = docStates[doc.key];
          return (
            <div
              key={doc.key}
              className={`border rounded-xl p-4 transition-all ${
                state.reviewed
                  ? "border-green-500/40 bg-green-500/5"
                  : "border-navy-600 bg-navy-800"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Icon + info */}
                <span className="text-2xl">{doc.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{doc.label}</h3>
                    {state.reviewed && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-medium">
                        Reviewed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted">{doc.description}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handlePreview(doc.key)}
                    className="px-3 py-1.5 text-xs font-medium bg-navy-700 hover:bg-navy-600 text-white rounded-lg transition-colors"
                  >
                    Preview PDF
                  </button>
                  <button
                    onClick={() => handleDownload(doc.key)}
                    disabled={state.downloading}
                    className="px-3 py-1.5 text-xs font-medium bg-zinc-50/10 hover:bg-zinc-50/15 text-zinc-300 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {state.downloading ? "..." : "Download"}
                  </button>
                  <button
                    onClick={() => handleMarkReviewed(doc.key)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all text-sm ${
                      state.reviewed
                        ? "bg-green-500 text-white"
                        : "bg-navy-700 text-text-muted hover:bg-navy-600"
                    }`}
                    title={state.reviewed ? "Mark as not reviewed" : "Mark as reviewed"}
                  >
                    {state.reviewed ? "\u2713" : "\u25CB"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Review status + approve */}
      {!allApproved ? (
        <div
          className={`border rounded-xl p-4 transition-all ${
            allReviewed
              ? "border-zinc-500/40 bg-zinc-50/[0.03]"
              : "border-navy-700 bg-navy-800/50"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold">
                {allReviewed
                  ? "All documents reviewed"
                  : `${DOCUMENTS.filter((d) => docStates[d.key].reviewed).length} of ${DOCUMENTS.length} reviewed`}
              </p>
              <p className="text-xs text-text-muted">
                {allReviewed
                  ? "Ready to approve and forward to supplier"
                  : "Review each document before approving"}
              </p>
            </div>
            {/* Progress dots */}
            <div className="flex gap-1.5">
              {DOCUMENTS.map((d) => (
                <div
                  key={d.key}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    docStates[d.key].reviewed ? "bg-green-400" : "bg-navy-700"
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleApproveAll}
            disabled={!allReviewed}
            className="w-full py-3 rounded-lg font-semibold text-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-zinc-50 text-zinc-950 hover:bg-zinc-200 active:scale-[0.98]"
          >
            {allReviewed ? "Approve & Forward to Supplier" : "Review All Documents First"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Success state */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 text-center">
            <p className="text-green-400 text-lg font-bold mb-1">
              Documents Approved & Forwarded
            </p>
            <p className="text-text-muted text-sm">
              PO, invoice, contract, and SLA sent to{" "}
              <span className="text-white">{option.quote.supplierName.split("(")[0].trim()}</span>
              {" "}for confirmation
            </p>
          </div>

          {/* Comparison callout */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
            <p className="text-sm text-red-300">
              A traditional reseller would have taken{" "}
              <span className="font-bold">2-5 business days</span> for the same result, with{" "}
              <span className="font-bold">hidden margins of up to 30%</span>.
            </p>
          </div>

          <button
            onClick={onReset}
            className="w-full py-3 rounded-lg font-semibold bg-zinc-800 text-zinc-50 hover:bg-zinc-700 transition-all"
          >
            Start New Procurement
          </button>
        </div>
      )}
    </div>
  );
}

function generateDoc(key: DocKey, option: ScoredOption, requirement: Requirement) {
  switch (key) {
    case "po":
      return generatePurchaseOrder(option, requirement);
    case "invoice":
      return generateInvoice(option, requirement);
    case "contract":
      return generateContract(option, requirement);
    case "sla":
      return generateSLA(option, requirement);
  }
}
