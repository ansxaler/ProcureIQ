import { CLIENTS, getTendersByClient } from "@/lib/crm-data";
import Link from "next/link";

export default function ClientsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Clients</h1>
        <p className="text-text-muted text-sm">{CLIENTS.length} active client accounts</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {CLIENTS.map((c) => {
          const tenders = getTendersByClient(c.id);
          return (
            <Link
              key={c.id}
              href={`/clients/${c.id}`}
              className="bg-navy-800 border border-navy-700 rounded-xl p-5 hover:border-accent-blue/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-steel-500/30 rounded-lg flex items-center justify-center text-sm font-bold text-accent-blue">
                  {c.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-sm">{c.name}</h3>
                  <p className="text-xs text-text-muted">{c.sector}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <p className="text-[10px] text-text-muted uppercase">Total Spend</p>
                  <p className="text-sm font-bold text-accent-blue">{"\u00A3"}{(c.totalSpend / 1000).toFixed(0)}k</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase">Tenders</p>
                  <p className="text-sm font-bold">{tenders.length}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-navy-700">
                <p className="text-xs text-text-muted">{c.contactName} &middot; {c.location}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
