"use client";

import { ScoredOption } from "@/lib/types";

interface Props {
  options: ScoredOption[];
  onSelect: (option: ScoredOption) => void;
}

const rankColors = [
  "border-accent-blue bg-accent-blue/5",
  "border-navy-600 bg-navy-800",
  "border-navy-600 bg-navy-800",
];

const rankBadges = [
  "bg-accent-blue text-navy-900",
  "bg-navy-600 text-white",
  "bg-navy-600 text-white",
];

export default function OptionsStep({ options, onSelect }: Props) {
  return (
    <div className="animate-slide-up space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Your 3 Options</h2>
        <p className="text-text-muted text-sm">
          Ranked by multi-factor scoring. Open-book pricing — every penny disclosed.
        </p>
      </div>

      <div className="space-y-4">
        {options.map((opt, i) => (
          <div
            key={opt.quote.supplierId}
            className={`border rounded-xl p-5 transition-all hover:scale-[1.01] ${rankColors[i]}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${rankBadges[i]}`}
                >
                  {opt.rank}
                </span>
                <div>
                  <h3 className="font-bold text-lg">{opt.quote.supplierName}</h3>
                  <p className="text-xs text-text-muted">
                    Score: {opt.overallScore}/100 | Delivery: {opt.quote.deliveryDays} days
                  </p>
                </div>
              </div>
              {i === 0 && (
                <span className="px-3 py-1 bg-accent-blue/20 text-accent-blue rounded-full text-xs font-semibold">
                  RECOMMENDED
                </span>
              )}
            </div>

            {/* Scores */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <ScoreBar label="Price" score={opt.priceScore} />
              <ScoreBar label="Delivery" score={opt.deliveryScore} />
              <ScoreBar label="SLA Match" score={opt.slaScore} />
              <ScoreBar label="Value" score={opt.valueScore} />
            </div>

            {/* Pros/Cons */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-green-400 font-semibold mb-1">Pros</p>
                {opt.pros.map((p, j) => (
                  <p key={j} className="text-xs text-text-muted flex gap-1">
                    <span className="text-green-400 shrink-0">+</span> {p}
                  </p>
                ))}
              </div>
              <div>
                <p className="text-xs text-amber-400 font-semibold mb-1">Cons</p>
                {opt.cons.map((c, j) => (
                  <p key={j} className="text-xs text-text-muted flex gap-1">
                    <span className="text-amber-400 shrink-0">-</span> {c}
                  </p>
                ))}
              </div>
            </div>

            {/* Open Book Pricing */}
            <div className="bg-navy-900/60 rounded-lg p-4 mb-4">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-2 font-semibold">
                Open Book Pricing
              </p>
              <div className="space-y-1 text-sm">
                <PriceLine label="Supplier base price" value={opt.openBookBreakdown.supplierBase} />
                <PriceLine label="Platform fee (2%)" value={opt.openBookBreakdown.platformFee} />
                <PriceLine
                  label={`Rebate captured (${opt.quote.rebatePercent}%)`}
                  value={opt.openBookBreakdown.rebateCaptured}
                  muted
                />
                <PriceLine
                  label="Your rebate saving (50% share)"
                  value={-opt.openBookBreakdown.rebateSaving}
                  green
                />
                <div className="border-t border-navy-700 pt-1 mt-1">
                  <PriceLine
                    label="Total cost to you"
                    value={opt.openBookBreakdown.totalCost}
                    bold
                  />
                </div>
              </div>
              <p className="text-xs text-green-400 mt-2">
                Saving vs incumbent estimate: <span className="font-bold">{"\u00A3"}{opt.savingsVsIncumbent.toLocaleString()}</span>
              </p>
            </div>

            <button
              onClick={() => onSelect(opt)}
              className={`w-full py-2.5 rounded-lg font-semibold transition-all ${
                i === 0
                  ? "bg-accent-blue text-navy-900 hover:bg-accent-light"
                  : "bg-navy-700 text-white hover:bg-navy-600"
              }`}
            >
              Select Option {opt.rank}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color =
    score >= 80 ? "bg-green-400" : score >= 50 ? "bg-amber-400" : "bg-red-400";
  return (
    <div>
      <div className="flex justify-between text-[10px] text-text-muted mb-0.5">
        <span>{label}</span>
        <span>{score}</span>
      </div>
      <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function PriceLine({
  label,
  value,
  bold,
  green,
  muted,
}: {
  label: string;
  value: number;
  bold?: boolean;
  green?: boolean;
  muted?: boolean;
}) {
  const textColor = green
    ? "text-green-400"
    : muted
    ? "text-text-muted/60"
    : "text-white";
  return (
    <div className={`flex justify-between ${bold ? "font-bold" : ""} ${textColor}`}>
      <span>{label}</span>
      <span>
        {value < 0 ? "-" : ""}
        {"\u00A3"}
        {Math.abs(value).toLocaleString()}
      </span>
    </div>
  );
}
