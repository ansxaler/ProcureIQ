"use client";

import { FlowStep } from "@/lib/types";

const STEPS: { key: FlowStep; label: string; time: string }[] = [
  { key: "submit", label: "Submit", time: "0 sec" },
  { key: "parsing", label: "Parse & Classify", time: "< 5 sec" },
  { key: "querying", label: "Network Query", time: "< 30 sec" },
  { key: "scoring", label: "Score & Rank", time: "< 60 sec" },
  { key: "options", label: "3 Options", time: "< 2 min" },
  { key: "checkout", label: "Buy & Close", time: "< 5 min" },
];

const stepOrder: FlowStep[] = ["submit", "parsing", "querying", "scoring", "options", "checkout", "complete"];

function getStepIndex(step: FlowStep) {
  return stepOrder.indexOf(step);
}

export default function StepIndicator({ currentStep }: { currentStep: FlowStep }) {
  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="flex items-center gap-1 w-full">
      {STEPS.map((step, i) => {
        const stepIdx = getStepIndex(step.key);
        const isActive = stepIdx === currentIndex;
        const isComplete = stepIdx < currentIndex;
        const isPending = stepIdx > currentIndex;

        return (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500
                  ${isComplete ? "bg-green-500 text-white" : ""}
                  ${isActive ? "bg-accent-blue text-navy-900 animate-pulse-glow" : ""}
                  ${isPending ? "bg-navy-700 text-text-muted" : ""}
                `}
              >
                {isComplete ? "\u2713" : i + 1}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium transition-colors ${
                  isActive ? "text-accent-blue" : isComplete ? "text-green-400" : "text-text-muted"
                }`}
              >
                {step.label}
              </span>
              <span
                className={`text-[9px] ${
                  isActive ? "text-accent-light" : "text-text-muted/50"
                }`}
              >
                {step.time}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-full transition-colors duration-500 ${
                  stepIdx < currentIndex ? "bg-green-500" : "bg-navy-700"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
