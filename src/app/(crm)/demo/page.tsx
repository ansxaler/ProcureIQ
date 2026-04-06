import ProcurementFlow from "@/components/ProcurementFlow";

export default function DemoPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-3 border-b border-navy-700 bg-navy-800/50">
        <h1 className="text-lg font-bold">Live Demo</h1>
        <p className="text-xs text-text-muted">Interactive walkthrough of the full procurement flow</p>
      </div>
      <div className="flex-1 overflow-hidden">
        <ProcurementFlow />
      </div>
    </div>
  );
}
