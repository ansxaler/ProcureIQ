"use client";

import { ScoredOption } from "@/lib/types";
import { useState, useEffect } from "react";

interface Props {
  option: ScoredOption;
  onComplete: () => void;
}

const CHECKOUT_STAGES = [
  { label: "Generating Purchase Order (PDF)", icon: "\uD83D\uDCC4", duration: 1500 },
  { label: "Creating invoice with VAT breakdown", icon: "\uD83D\uDCB3", duration: 1200 },
  { label: "Drafting service contract", icon: "\u270D\uFE0F", duration: 1800 },
  { label: "Generating SLA agreement", icon: "\uD83D\uDCCB", duration: 1000 },
  { label: "Documents ready for review", icon: "\u2705", duration: 0 },
];

export default function CheckoutStep({ option, onComplete }: Props) {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    if (currentStage < CHECKOUT_STAGES.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStage((c) => c + 1);
      }, CHECKOUT_STAGES[currentStage].duration);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStage, onComplete]);

  return (
    <div className="animate-slide-up space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Closing the Deal</h2>
        <p className="text-text-muted text-sm">
          Automating PO, invoice, and contract for{" "}
          <span className="text-white font-semibold">{option.quote.supplierName}</span>
        </p>
      </div>

      {/* Summary card */}
      <div className="bg-navy-800 border border-navy-700 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-text-muted">Total Order Value</p>
            <p className="text-3xl font-bold text-zinc-50">
              {"\u00A3"}{option.openBookBreakdown.totalCost.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-muted">Savings vs Incumbent</p>
            <p className="text-2xl font-bold text-green-400">
              {"\u00A3"}{option.savingsVsIncumbent.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Progress stages */}
      <div className="space-y-3">
        {CHECKOUT_STAGES.map((stage, i) => {
          const isComplete = i < currentStage;
          const isCurrent = i === currentStage;
          const isPending = i > currentStage;

          return (
            <div
              key={i}
              className={`flex items-center gap-4 p-3 rounded-lg border transition-all duration-500 ${
                isComplete
                  ? "bg-green-500/10 border-green-500/30"
                  : isCurrent
                  ? "bg-zinc-50/5 border-zinc-500/30"
                  : "bg-navy-800/50 border-navy-700/50"
              }`}
            >
              <span className="text-xl">{stage.icon}</span>
              <span
                className={`flex-1 font-medium ${
                  isPending ? "text-text-muted" : "text-white"
                }`}
              >
                {stage.label}
              </span>
              {isComplete && <span className="text-green-400 text-sm font-mono">Done</span>}
              {isCurrent && (
                <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
