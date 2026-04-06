"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../Logo";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/tenders", label: "Tenders", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { href: "/clients", label: "Clients", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { href: "/demo", label: "Live Demo", icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-navy-800 border-r border-navy-700 flex flex-col shrink-0 h-screen sticky top-0">
      {/* Brand */}
      <div className="px-5 py-4 border-b border-navy-700">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <Logo size={26} />
          <span className="text-lg font-bold tracking-tight">ProcureIQ</span>
        </Link>
        <p className="text-[10px] text-text-muted mt-0.5 tracking-wide">AI-NATIVE PROCUREMENT</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent-blue/15 text-accent-blue"
                  : "text-text-muted hover:text-white hover:bg-navy-700"
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-navy-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-xs text-green-400">Agent Online</span>
        </div>
        <p className="text-[10px] text-text-muted mt-1">Prototype v0.1</p>
      </div>
    </aside>
  );
}
