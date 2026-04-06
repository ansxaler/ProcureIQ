"use client";

import { SAMPLE_REQUIREMENTS } from "@/lib/mock-data";
import { useState } from "react";

interface Props {
  onSubmit: (text: string) => void;
}

export default function SubmitStep({ onSubmit }: Props) {
  const [text, setText] = useState("");
  const [selectedSample, setSelectedSample] = useState<number | null>(null);

  const handleSample = (idx: number) => {
    setSelectedSample(idx);
    setText(SAMPLE_REQUIREMENTS[idx].text);
  };

  return (
    <div className="animate-slide-up space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Submit a Requirement</h2>
        <p className="text-text-muted">
          Paste your RFP, fill in details, or pick a sample below. Our AI agent handles the rest.
        </p>
      </div>

      {/* Sample buttons */}
      <div className="flex flex-wrap gap-2">
        {SAMPLE_REQUIREMENTS.map((sample, i) => (
          <button
            key={i}
            onClick={() => handleSample(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedSample === i
                ? "bg-accent-blue text-navy-900"
                : "bg-navy-700 text-text-muted hover:bg-navy-600 hover:text-white"
            }`}
          >
            {sample.label}
          </button>
        ))}
      </div>

      {/* Text area */}
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setSelectedSample(null);
        }}
        placeholder="Describe what you need to procure... Include quantities, specifications, budget, timeline, and any compliance requirements."
        className="w-full h-48 bg-navy-800 border border-navy-600 rounded-lg p-4 text-white placeholder:text-text-muted/50 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue resize-none"
      />

      {/* Submit */}
      <button
        onClick={() => text.trim() && onSubmit(text)}
        disabled={!text.trim()}
        className="w-full py-3 rounded-lg font-semibold text-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-accent-blue text-navy-900 hover:bg-accent-light active:scale-[0.98]"
      >
        Submit to ProcureIQ Agent
      </button>
    </div>
  );
}
