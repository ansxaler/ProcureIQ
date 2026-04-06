"use client";

import { SUPPLIERS } from "@/lib/mock-data";
import { SupplierQuote } from "@/lib/types";
import { useState, useEffect } from "react";

interface Props {
  quotes: SupplierQuote[];
}

export default function QueryingStep({ quotes }: Props) {
  const [respondedCount, setRespondedCount] = useState(0);

  useEffect(() => {
    if (quotes.length === 0) {
      // Simulate suppliers responding one by one
      const timers: NodeJS.Timeout[] = [];
      SUPPLIERS.forEach((_, i) => {
        timers.push(
          setTimeout(() => setRespondedCount((c) => c + 1), (i + 1) * 600)
        );
      });
      return () => timers.forEach(clearTimeout);
    } else {
      setRespondedCount(SUPPLIERS.length);
    }
  }, [quotes]);

  const hasResults = quotes.length > 0;

  return (
    <div className="animate-slide-up space-y-4">
      <h2 className="text-2xl font-bold">Querying Supplier Network</h2>
      <p className="text-text-muted text-sm">
        Sending parallel requests to {SUPPLIERS.length} suppliers across all tiers
      </p>

      <div className="grid grid-cols-2 gap-2">
        {SUPPLIERS.map((supplier, i) => {
          const responded = i < respondedCount;
          const hasQuote = hasResults && quotes.some((q) => q.supplierId === supplier.id);

          return (
            <div
              key={supplier.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                responded
                  ? hasQuote
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-navy-800 border-navy-700"
                  : "bg-navy-800/50 border-navy-700/50"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full transition-colors ${
                  responded
                    ? hasQuote
                      ? "bg-green-400"
                      : "bg-text-muted"
                    : "bg-amber-400 animate-pulse"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    responded ? "text-white" : "text-text-muted"
                  }`}
                >
                  {supplier.name}
                </p>
                <p className="text-[10px] text-text-muted">{supplier.tier}</p>
              </div>
              {responded && (
                <span
                  className={`text-[10px] font-mono ${
                    hasQuote ? "text-green-400" : "text-text-muted"
                  }`}
                >
                  {hasQuote ? "QUOTED" : "N/A"}
                </span>
              )}
              {!responded && (
                <div className="w-3 h-3 border border-amber-400 border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          );
        })}
      </div>

      {hasResults && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
          <span className="text-green-400 font-semibold">
            {quotes.length} competitive quotes received from {SUPPLIERS.length} suppliers
          </span>
        </div>
      )}
    </div>
  );
}
