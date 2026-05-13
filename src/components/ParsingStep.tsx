"use client";

import { Requirement } from "@/lib/types";

interface Props {
  requirement: Requirement | null;
}

export default function ParsingStep({ requirement }: Props) {
  if (!requirement) {
    return (
      <div className="animate-slide-up flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-12 h-12 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin-slow" />
        <p className="text-zinc-300 font-medium">AI is parsing your requirement...</p>
      </div>
    );
  }

  return (
    <div className="animate-slide-up space-y-4">
      <h2 className="text-2xl font-bold">Parsed Requirement</h2>
      <p className="text-text-muted text-sm">
        AI extracted the following from your submission in{" "}
        <span className="text-green-400 font-mono">
          {((requirement.parsedAt || 3200) / 1000).toFixed(1)}s
        </span>
      </p>

      <div className="grid grid-cols-2 gap-3">
        <InfoCard label="Category" value={requirement.category} />
        <InfoCard label="Budget" value={requirement.budget} />
        <InfoCard label="Quantity" value={String(requirement.quantity)} />
        <InfoCard label="Urgency" value={requirement.urgency} badge />
      </div>

      <div className="bg-navy-800 border border-navy-700 rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
          SLA Requirements
        </h3>
        <div className="flex flex-wrap gap-2">
          {requirement.slaRequirements.map((sla, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-navy-700 rounded-full text-xs text-accent-light"
            >
              {sla}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-navy-800 border border-navy-700 rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
          Compliance Needs
        </h3>
        <div className="flex flex-wrap gap-2">
          {requirement.complianceNeeds.map((c, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-steel-500/30 rounded-full text-xs text-accent-blue"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: boolean;
}) {
  const urgencyColors: Record<string, string> = {
    standard: "bg-green-500/20 text-green-400",
    urgent: "bg-amber-500/20 text-amber-400",
    critical: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="bg-navy-800 border border-navy-700 rounded-lg p-4">
      <p className="text-xs text-text-muted uppercase tracking-wider mb-1">{label}</p>
      {badge ? (
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${
            urgencyColors[value] || "bg-navy-700 text-white"
          }`}
        >
          {value}
        </span>
      ) : (
        <p className="text-lg font-bold">{value}</p>
      )}
    </div>
  );
}
