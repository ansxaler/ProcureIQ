import { TenderStatus, STATUS_CONFIG } from "@/lib/crm-types";

export default function StatusBadge({ status }: { status: TenderStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.color} ${config.bg}`}>
      {config.label}
    </span>
  );
}
