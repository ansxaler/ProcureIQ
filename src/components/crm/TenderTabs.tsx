"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { key: "", label: "Overview" },
  { key: "/scoring", label: "Scoring" },
  { key: "/vendors", label: "Vendors" },
  { key: "/emails", label: "Emails" },
  { key: "/documents", label: "Documents" },
  { key: "/activity", label: "Activity" },
];

export default function TenderTabs({ tenderId }: { tenderId: string }) {
  const pathname = usePathname();
  const base = `/tenders/${tenderId}`;

  return (
    <div className="flex gap-0 -mb-px">
      {TABS.map((tab) => {
        const href = `${base}${tab.key}`;
        const isActive = tab.key === ""
          ? pathname === base
          : pathname === href;

        return (
          <Link
            key={tab.key}
            href={href}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              isActive
                ? "border-zinc-50 text-zinc-50"
                : "border-transparent text-text-muted hover:text-zinc-50 hover:border-zinc-700"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
