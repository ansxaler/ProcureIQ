import { Requirement, SupplierQuote, ScoredOption } from "./types";

export type TenderStatus =
  | "draft"
  | "sourcing"
  | "scoring"
  | "options_ready"
  | "review"
  | "approved"
  | "completed"
  | "cancelled";

export interface Client {
  id: string;
  name: string;
  sector: string;
  contactName: string;
  contactEmail: string;
  location: string;
  totalSpend: number;
  tenderCount: number;
  joinedDate: string;
  logo?: string;
}

export interface Tender {
  id: string;
  title: string;
  clientId: string;
  status: TenderStatus;
  category: string;
  budget: number;
  quantity: number;
  urgency: "standard" | "urgent" | "critical";
  requirement: Requirement | null;
  quotes: SupplierQuote[];
  scoredOptions: ScoredOption[];
  selectedOption: ScoredOption | null;
  createdAt: string;
  updatedAt: string;
  description: string;
}

export interface VendorResponse {
  tenderId: string;
  supplierId: string;
  supplierName: string;
  status: "quoted" | "declined" | "no_response" | "pending";
  message: string;
  respondedAt: string | null;
  quote: SupplierQuote | null;
}

export interface EmailMessage {
  id: string;
  from: string;
  fromRole: "agent" | "supplier" | "client";
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  threadId: string;
}

export interface EmailThread {
  id: string;
  tenderId: string;
  subject: string;
  participants: string[];
  messages: EmailMessage[];
  lastMessageAt: string;
}

export interface TenderDocument {
  id: string;
  tenderId: string;
  type: "po" | "invoice" | "contract" | "sla";
  label: string;
  status: "draft" | "reviewed" | "approved" | "sent";
  generatedAt: string;
  reviewedAt: string | null;
}

export interface ActivityEntry {
  id: string;
  tenderId: string;
  type: "system" | "agent" | "user" | "supplier" | "document";
  message: string;
  timestamp: string;
  detail?: string;
}

export const STATUS_CONFIG: Record<TenderStatus, { label: string; color: string; bg: string }> = {
  draft: { label: "Draft", color: "text-text-muted", bg: "bg-navy-700" },
  sourcing: { label: "Sourcing", color: "text-amber-400", bg: "bg-amber-400/15" },
  scoring: { label: "Scoring", color: "text-blue-400", bg: "bg-blue-400/15" },
  options_ready: { label: "Options Ready", color: "text-accent-blue", bg: "bg-accent-blue/15" },
  review: { label: "In Review", color: "text-purple-400", bg: "bg-purple-400/15" },
  approved: { label: "Approved", color: "text-emerald-400", bg: "bg-emerald-400/15" },
  completed: { label: "Completed", color: "text-green-400", bg: "bg-green-400/15" },
  cancelled: { label: "Cancelled", color: "text-red-400", bg: "bg-red-400/15" },
};
