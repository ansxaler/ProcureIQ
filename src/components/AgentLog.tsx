"use client";

import { AgentLog as AgentLogType } from "@/lib/types";
import { useEffect, useRef } from "react";

const typeColors = {
  info: "text-text-muted",
  success: "text-green-400",
  warning: "text-amber-400",
  action: "text-accent-blue",
};

const typeIcons = {
  info: "\u25CB",
  success: "\u2713",
  warning: "\u26A0",
  action: "\u25B6",
};

export default function AgentLogPanel({ logs }: { logs: AgentLogType[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="bg-navy-900 border border-navy-700 rounded-lg overflow-hidden flex flex-col h-full">
      <div className="px-4 py-3 border-b border-navy-700 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-sm font-mono text-text-muted uppercase tracking-wider">
          Agent Activity
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1 font-mono text-xs">
        {logs.map((log, i) => (
          <div
            key={i}
            className={`flex gap-2 animate-fade-in ${typeColors[log.type]}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <span className="opacity-40 shrink-0 w-16">
              {new Date(log.timestamp).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
            <span className="shrink-0">{typeIcons[log.type]}</span>
            <span>{log.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
