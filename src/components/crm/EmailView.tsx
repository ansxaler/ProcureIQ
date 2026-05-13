"use client";

import { EmailThread } from "@/lib/crm-types";
import { useState } from "react";

const roleColors = {
  agent: { border: "border-l-accent-blue", bg: "bg-accent-blue/5", label: "bg-accent-blue/20 text-accent-blue", name: "text-accent-blue" },
  supplier: { border: "border-l-amber-400", bg: "bg-amber-400/5", label: "bg-amber-400/20 text-amber-400", name: "text-amber-400" },
  client: { border: "border-l-green-400", bg: "bg-green-400/5", label: "bg-green-400/20 text-green-400", name: "text-green-400" },
};

export default function EmailView({ threads }: { threads: EmailThread[] }) {
  const [selectedId, setSelectedId] = useState(threads[0]?.id || "");
  const selectedThread = threads.find((t) => t.id === selectedId);

  return (
    <div className="flex gap-4 h-[calc(100vh-220px)]">
      {/* Thread list */}
      <div className="w-72 shrink-0 bg-navy-800 border border-navy-700 rounded-xl overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-navy-700">
          <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Threads ({threads.length})</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {threads.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedId(t.id)}
              className={`w-full text-left px-4 py-3 border-b border-navy-700/50 transition-colors ${
                selectedId === t.id ? "bg-zinc-800" : "hover:bg-navy-700/50"
              }`}
            >
              <p className={`text-sm font-medium truncate ${selectedId === t.id ? "text-zinc-50" : "text-zinc-300"}`}>
                {t.subject}
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                {t.messages.length} messages &middot; {new Date(t.lastMessageAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-navy-800 border border-navy-700 rounded-xl overflow-hidden flex flex-col">
        {selectedThread ? (
          <>
            <div className="px-5 py-3 border-b border-navy-700">
              <p className="font-semibold text-sm">{selectedThread.subject}</p>
              <p className="text-xs text-text-muted">{selectedThread.participants.join(", ")}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedThread.messages.map((msg) => {
                const colors = roleColors[msg.fromRole];
                return (
                  <div key={msg.id} className={`border-l-2 ${colors.border} ${colors.bg} rounded-r-lg p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-sm font-semibold ${colors.name}`}>{msg.from}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${colors.label}`}>
                        {msg.fromRole}
                      </span>
                      <span className="text-[10px] text-text-muted ml-auto">
                        {new Date(msg.timestamp).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
                      <span>To: {msg.to}</span>
                    </div>
                    <div className="text-sm leading-relaxed whitespace-pre-line">{msg.body}</div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-text-muted text-sm">
            Select a thread
          </div>
        )}
      </div>
    </div>
  );
}
