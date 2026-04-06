"use client";

import { useState, useCallback, useRef } from "react";
import {
  FlowStep,
  Requirement,
  SupplierQuote,
  ScoredOption,
  AgentLog as AgentLogType,
} from "@/lib/types";
import { generateMockQuotes, scoreAndRankQuotes, SUPPLIERS } from "@/lib/mock-data";
import StepIndicator from "./StepIndicator";
import AgentLogPanel from "./AgentLog";
import SubmitStep from "./SubmitStep";
import ParsingStep from "./ParsingStep";
import QueryingStep from "./QueryingStep";
import OptionsStep from "./OptionsStep";
import CheckoutStep from "./CheckoutStep";
import CompleteStep from "./CompleteStep";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function ProcurementFlow() {
  const [step, setStep] = useState<FlowStep>("submit");
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [quotes, setQuotes] = useState<SupplierQuote[]>([]);
  const [options, setOptions] = useState<ScoredOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<ScoredOption | null>(null);
  const [logs, setLogs] = useState<AgentLogType[]>([]);
  const startTime = useRef<number>(0);

  const addLog = useCallback(
    (step: FlowStep, message: string, type: AgentLogType["type"] = "info") => {
      setLogs((prev) => [...prev, { timestamp: Date.now(), step, message, type }]);
    },
    []
  );

  const handleSubmit = useCallback(
    async (text: string) => {
      startTime.current = Date.now();
      setStep("parsing");

      addLog("submit", "Requirement received — initiating agent pipeline", "action");
      addLog("parsing", "NLP engine activated — extracting structured data", "info");

      // Simulate parsing delay
      await delay(1500);
      addLog("parsing", "Identified category: IT Hardware — Laptops", "info");
      await delay(800);
      addLog("parsing", "Budget extracted: \u00A3180,000", "info");
      await delay(600);
      addLog("parsing", "Quantity: 150 units", "info");
      await delay(500);
      addLog("parsing", "SLA requirements: 3-year NBD warranty, 4-week delivery", "info");
      await delay(400);
      addLog("parsing", "Compliance: ISO 27001 preferred", "info");
      await delay(500);

      const req: Requirement = {
        id: uid(),
        rawText: text,
        category: "IT Hardware — Business Laptops",
        budget: "\u00A3180,000",
        quantity: 150,
        slaRequirements: [
          "3-year NBD warranty",
          "4-week delivery window",
          "Intel i7 or equivalent",
          "16GB RAM minimum",
          "512GB SSD",
          "Windows 11 Pro",
        ],
        complianceNeeds: ["ISO 27001", "GDPR compliant supply chain"],
        urgency: "standard",
        parsedAt: 3200,
      };

      setRequirement(req);
      addLog("parsing", "Requirement parsed successfully in 3.2s", "success");

      // Move to querying
      await delay(1500);
      setStep("querying");
      addLog("querying", `Initiating parallel queries to ${SUPPLIERS.length} suppliers`, "action");

      for (let i = 0; i < SUPPLIERS.length; i++) {
        await delay(500 + Math.random() * 300);
        addLog(
          "querying",
          `${SUPPLIERS[i].name} (${SUPPLIERS[i].tier}) — ${
            i < 5 ? "quote received" : "no match for this category"
          }`,
          i < 5 ? "success" : "info"
        );
      }

      const mockQuotes = generateMockQuotes(req);
      setQuotes(mockQuotes);
      addLog("querying", `${mockQuotes.length} competitive quotes collected`, "success");

      // Move to scoring
      await delay(1500);
      setStep("scoring");
      addLog("scoring", "Scoring engine activated — no SPIFs, no partner tiers", "action");
      await delay(800);
      addLog("scoring", "Applying multi-factor analysis: price (35%), delivery (25%), SLA (30%), rebate (10%)", "info");
      await delay(1000);
      addLog("scoring", "Cross-referencing SLA requirements against supplier capabilities", "info");
      await delay(800);
      addLog("scoring", "Calculating open-book pricing with rebate pass-through", "info");
      await delay(600);

      const scored = scoreAndRankQuotes(mockQuotes);
      setOptions(scored);
      addLog(
        "scoring",
        `Top 3 options ranked — best score: ${scored[0].overallScore}/100 (${scored[0].quote.supplierName})`,
        "success"
      );

      // Move to options
      await delay(1000);
      setStep("options");
      addLog("options", "Presenting 3 open-book options to client", "action");
      addLog("options", "AI-generated pros/cons and savings analysis attached", "info");
    },
    [addLog]
  );

  const handleSelect = useCallback(
    (option: ScoredOption) => {
      setSelectedOption(option);
      setStep("checkout");
      addLog("checkout", `Client selected Option ${option.rank}: ${option.quote.supplierName}`, "action");
      addLog("checkout", "Generating purchase order...", "info");
    },
    [addLog]
  );

  const handleCheckoutComplete = useCallback(() => {
    setStep("complete");
    const elapsed = Date.now() - startTime.current;
    addLog("checkout", "Purchase order confirmed by supplier", "success");
    addLog("checkout", "Invoice generated and sent to client", "success");
    addLog("checkout", "Contract e-signed automatically", "success");
    addLog(
      "complete",
      `Procurement complete in ${(elapsed / 1000).toFixed(0)}s — from requirement to signed contract`,
      "success"
    );
  }, [addLog]);

  const handleReset = useCallback(() => {
    setStep("submit");
    setRequirement(null);
    setQuotes([]);
    setOptions([]);
    setSelectedOption(null);
    setLogs([]);
  }, []);

  return (
    <div className="flex flex-1 h-full">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Step indicator */}
        <div className="px-6 py-4 border-b border-navy-700 bg-navy-800/50">
          <StepIndicator currentStep={step} />
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            {step === "submit" && <SubmitStep onSubmit={handleSubmit} />}
            {step === "parsing" && <ParsingStep requirement={requirement} />}
            {step === "querying" && <QueryingStep quotes={quotes} />}
            {step === "scoring" && (
              <div className="animate-slide-up flex flex-col items-center justify-center py-16 gap-4">
                <div className="w-12 h-12 border-2 border-accent-blue border-t-transparent rounded-full animate-spin-slow" />
                <p className="text-accent-blue font-medium">Scoring & ranking options...</p>
                <p className="text-text-muted text-sm">
                  Multi-factor analysis with zero SPIF bias
                </p>
              </div>
            )}
            {step === "options" && (
              <OptionsStep options={options} onSelect={handleSelect} />
            )}
            {step === "checkout" && selectedOption && (
              <CheckoutStep option={selectedOption} onComplete={handleCheckoutComplete} />
            )}
            {step === "complete" && selectedOption && requirement && (
              <CompleteStep
                option={selectedOption}
                requirement={requirement}
                totalTime={Date.now() - startTime.current}
                onReset={handleReset}
              />
            )}
          </div>
        </div>
      </div>

      {/* Agent log sidebar */}
      <div className="w-80 border-l border-navy-700 hidden lg:flex flex-col">
        <AgentLogPanel logs={logs} />
      </div>
    </div>
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
