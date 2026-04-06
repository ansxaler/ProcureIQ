import { getActivities } from "@/lib/crm-data";

const typeConfig = {
  system: { color: "text-text-muted", dot: "bg-text-muted", icon: "\u25CB" },
  agent: { color: "text-accent-blue", dot: "bg-accent-blue", icon: "\u25B6" },
  user: { color: "text-white", dot: "bg-white", icon: "\u25CF" },
  supplier: { color: "text-amber-400", dot: "bg-amber-400", icon: "\u25B2" },
  document: { color: "text-green-400", dot: "bg-green-400", icon: "\u2713" },
};

export default async function ActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const activities = getActivities(id);

  if (activities.length === 0) {
    return (
      <div className="text-center py-16 text-text-muted">
        <p className="text-lg font-medium">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-4">
      <div>
        <h2 className="text-lg font-bold">Activity Timeline</h2>
        <p className="text-text-muted text-sm">{activities.length} events</p>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-2 bottom-2 w-px bg-navy-700" />

        <div className="space-y-0">
          {activities.map((a) => {
            const cfg = typeConfig[a.type];
            return (
              <div key={a.id} className="flex gap-4 py-2.5 relative">
                <div className={`w-8 h-8 rounded-full border-2 border-navy-700 flex items-center justify-center text-xs shrink-0 z-10 bg-navy-900 ${cfg.color}`}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className={`text-sm ${cfg.color}`}>{a.message}</p>
                  <p className="text-[10px] text-text-muted/50 mt-0.5">
                    {new Date(a.timestamp).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    {" "}&middot; {a.type}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
