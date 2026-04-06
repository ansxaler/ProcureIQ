export interface Requirement {
  id: string;
  rawText: string;
  category: string;
  budget: string;
  quantity: number;
  slaRequirements: string[];
  complianceNeeds: string[];
  urgency: "standard" | "urgent" | "critical";
  parsedAt?: number;
}

export interface Supplier {
  id: string;
  name: string;
  tier: string;
  responseTime: number;
  logo?: string;
}

export interface SupplierQuote {
  supplierId: string;
  supplierName: string;
  unitPrice: number;
  totalPrice: number;
  deliveryDays: number;
  warranty: string;
  slaMatch: number;
  rebatePercent: number;
  inStock: boolean;
}

export interface ScoredOption {
  rank: number;
  quote: SupplierQuote;
  overallScore: number;
  priceScore: number;
  deliveryScore: number;
  slaScore: number;
  valueScore: number;
  pros: string[];
  cons: string[];
  savingsVsIncumbent: number;
  openBookBreakdown: {
    supplierBase: number;
    platformFee: number;
    rebateCaptured: number;
    rebateSaving: number;
    totalCost: number;
  };
}

export interface ProcurementFlow {
  step: FlowStep;
  requirement: Requirement | null;
  quotes: SupplierQuote[];
  scoredOptions: ScoredOption[];
  selectedOption: ScoredOption | null;
  logs: AgentLog[];
}

export type FlowStep =
  | "submit"
  | "parsing"
  | "querying"
  | "scoring"
  | "options"
  | "checkout"
  | "complete";

export interface AgentLog {
  timestamp: number;
  step: FlowStep;
  message: string;
  type: "info" | "success" | "warning" | "action";
}
