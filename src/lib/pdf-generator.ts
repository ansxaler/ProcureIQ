import jsPDF from "jspdf";
import { ScoredOption, Requirement } from "./types";

const NAVY = [15, 23, 41] as const;
const STEEL = [61, 90, 128] as const;
const ACCENT = [126, 184, 218] as const;
const WHITE = [255, 255, 255] as const;
const LIGHT_GRAY = [240, 243, 247] as const;
const TEXT_DARK = [30, 41, 59] as const;
const GREEN = [34, 197, 94] as const;

function addHeader(doc: jsPDF, title: string, subtitle: string, refNumber: string) {
  // Navy header bar
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, 210, 38, "F");

  // Logo text
  doc.setTextColor(...WHITE);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("ProcureIQ", 15, 18);

  // Subtitle
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...ACCENT);
  doc.text("AI-Native IT Procurement Platform", 15, 26);

  // Document title
  doc.setFontSize(14);
  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.text(title, 195, 14, { align: "right" });

  // Ref number
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...ACCENT);
  doc.text(refNumber, 195, 22, { align: "right" });

  // Date
  doc.text(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), 195, 30, { align: "right" });

  // Subtitle bar
  doc.setFillColor(...STEEL);
  doc.rect(0, 38, 210, 8, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(8);
  doc.text(subtitle, 105, 43.5, { align: "center" });
}

function addFooter(doc: jsPDF, page: number) {
  const y = 282;
  doc.setDrawColor(200, 210, 220);
  doc.line(15, y, 195, y);
  doc.setFontSize(7);
  doc.setTextColor(140, 150, 165);
  doc.text("ProcureIQ Ltd | AI-Native IT Procurement | Confidential", 15, y + 5);
  doc.text(`Page ${page}`, 195, y + 5, { align: "right" });
  doc.text("Generated automatically by ProcureIQ Agent — all pricing is open-book and auditable", 105, y + 9, { align: "center" });
}

function addSectionTitle(doc: jsPDF, y: number, title: string): number {
  doc.setFillColor(...NAVY);
  doc.rect(15, y, 180, 7, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(title, 19, y + 5);
  return y + 12;
}

function addRow(doc: jsPDF, y: number, label: string, value: string, bold = false, highlight = false): number {
  if (highlight) {
    doc.setFillColor(...LIGHT_GRAY);
    doc.rect(15, y - 4, 180, 7, "F");
  }
  doc.setTextColor(...TEXT_DARK);
  doc.setFontSize(9);
  doc.setFont("helvetica", bold ? "bold" : "normal");
  doc.text(label, 19, y);
  doc.text(value, 191, y, { align: "right" });
  return y + 8;
}

function addPartyBlock(doc: jsPDF, y: number, title: string, lines: string[]): number {
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(15, y, 85, 32, 2, 2, "F");
  doc.setTextColor(...STEEL);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(title, 19, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...TEXT_DARK);
  doc.setFontSize(8);
  lines.forEach((line, i) => {
    doc.text(line, 19, y + 13 + i * 5);
  });
  return y;
}

const refNum = () => `PIQ-${Date.now().toString(36).toUpperCase().slice(-6)}`;

// ─── Purchase Order ──────────────────────────────────────────

export function generatePurchaseOrder(option: ScoredOption, requirement: Requirement): jsPDF {
  const doc = new jsPDF();
  const ref = refNum();

  addHeader(doc, "PURCHASE ORDER", "Open-book procurement — all margins disclosed", ref);

  // Parties
  let y = 54;
  addPartyBlock(doc, y, "BUYER", [
    "Client Organisation",
    "London, United Kingdom",
    "Procurement via ProcureIQ",
  ]);
  addPartyBlock(doc, y, "SUPPLIER", [
    option.quote.supplierName.split("(")[0].trim(),
    "Authorised UK Distributor",
    `Response ID: ${option.quote.supplierId}`,
  ]);
  // Move second block right
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(110, y, 85, 32, 2, 2, "F");
  doc.setTextColor(...STEEL);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("SUPPLIER", 114, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...TEXT_DARK);
  doc.text(option.quote.supplierName.split("(")[0].trim(), 114, y + 13);
  doc.text("Authorised UK Distributor", 114, y + 18);
  doc.text(`Response ID: ${option.quote.supplierId}`, 114, y + 23);

  y = 94;

  // Order details
  y = addSectionTitle(doc, y, "ORDER DETAILS");
  y = addRow(doc, y, "Category", requirement.category);
  y = addRow(doc, y, "Quantity", String(requirement.quantity) + " units", false, true);
  y = addRow(doc, y, "Product", option.quote.supplierName.split("(")[1]?.replace(")", "") || "As specified");
  y = addRow(doc, y, "Warranty", option.quote.warranty, false, true);
  y = addRow(doc, y, "Delivery", `${option.quote.deliveryDays} business days`);
  y = addRow(doc, y, "SLA Match", `${option.quote.slaMatch}%`, false, true);

  y += 4;

  // Open book pricing
  y = addSectionTitle(doc, y, "OPEN BOOK PRICING");
  y = addRow(doc, y, "Unit price (supplier base)", `\u00A3${Math.round(option.quote.unitPrice).toLocaleString()}`);
  y = addRow(doc, y, `Supplier base total (${requirement.quantity} units)`, `\u00A3${option.openBookBreakdown.supplierBase.toLocaleString()}`, false, true);
  y = addRow(doc, y, "ProcureIQ platform fee (2%)", `\u00A3${option.openBookBreakdown.platformFee.toLocaleString()}`);
  y = addRow(doc, y, `Vendor rebate captured (${option.quote.rebatePercent}%)`, `\u00A3${option.openBookBreakdown.rebateCaptured.toLocaleString()}`, false, true);
  y = addRow(doc, y, "Your rebate share (50%)", `-\u00A3${option.openBookBreakdown.rebateSaving.toLocaleString()}`);

  y += 2;
  doc.setFillColor(...NAVY);
  doc.rect(15, y - 4, 180, 9, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL ORDER VALUE", 19, y + 2);
  doc.text(`\u00A3${option.openBookBreakdown.totalCost.toLocaleString()}`, 191, y + 2, { align: "right" });

  y += 14;

  // Savings callout
  doc.setFillColor(34, 197, 94, 0.1);
  doc.setDrawColor(...GREEN);
  doc.roundedRect(15, y, 180, 12, 2, 2, "FD");
  doc.setTextColor(...GREEN);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`Estimated saving vs traditional reseller: \u00A3${option.savingsVsIncumbent.toLocaleString()}`, 105, y + 7.5, { align: "center" });

  y += 20;

  // Terms
  y = addSectionTitle(doc, y, "TERMS & CONDITIONS");
  doc.setTextColor(...TEXT_DARK);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const terms = [
    "1. Payment terms: Net 30 days from invoice date",
    "2. All prices are exclusive of VAT which will be charged at the prevailing rate",
    "3. Delivery to buyer's specified UK address within the stated timeframe",
    "4. Warranty provided directly by the OEM as specified above",
    "5. This PO is subject to ProcureIQ Standard Terms of Business (v2.1)",
    "6. All pricing is open-book: supplier base cost, platform fee, and rebate share are fully disclosed",
  ];
  terms.forEach((term, i) => {
    doc.text(term, 19, y + i * 5);
  });

  addFooter(doc, 1);
  return doc;
}

// ─── Invoice ──────────────────────────────────────────

export function generateInvoice(option: ScoredOption, requirement: Requirement): jsPDF {
  const doc = new jsPDF();
  const ref = refNum();

  addHeader(doc, "INVOICE", "Tax Invoice — all amounts in GBP", `INV-${ref}`);

  let y = 54;

  // Parties
  addPartyBlock(doc, y, "FROM: PROCUREIQ LTD", [
    "Company No: 12345678",
    "VAT No: GB 987 6543 21",
    "London, United Kingdom",
  ]);
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(110, y, 85, 32, 2, 2, "F");
  doc.setTextColor(...STEEL);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("TO: CLIENT", 114, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...TEXT_DARK);
  doc.text("Client Organisation", 114, y + 13);
  doc.text("London, United Kingdom", 114, y + 18);
  doc.text(`PO Ref: PO-${ref}`, 114, y + 23);

  y = 94;

  // Line items table header
  y = addSectionTitle(doc, y, "LINE ITEMS");

  // Table header
  doc.setFillColor(...LIGHT_GRAY);
  doc.rect(15, y - 4, 180, 7, "F");
  doc.setTextColor(...STEEL);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Description", 19, y);
  doc.text("Qty", 110, y);
  doc.text("Unit Price", 135, y);
  doc.text("Amount", 191, y, { align: "right" });
  y += 8;

  // Product line
  doc.setTextColor(...TEXT_DARK);
  doc.setFont("helvetica", "normal");
  const productName = option.quote.supplierName.split("(")[1]?.replace(")", "") || "IT Equipment";
  doc.text(productName, 19, y);
  doc.text(String(requirement.quantity), 110, y);
  doc.text(`\u00A3${Math.round(option.quote.unitPrice).toLocaleString()}`, 135, y);
  doc.text(`\u00A3${option.openBookBreakdown.supplierBase.toLocaleString()}`, 191, y, { align: "right" });
  y += 7;

  // Platform fee line
  doc.text("ProcureIQ Platform Fee (2%)", 19, y);
  doc.text("1", 110, y);
  doc.text(`\u00A3${option.openBookBreakdown.platformFee.toLocaleString()}`, 135, y);
  doc.text(`\u00A3${option.openBookBreakdown.platformFee.toLocaleString()}`, 191, y, { align: "right" });
  y += 7;

  // Rebate credit
  doc.setTextColor(...GREEN);
  doc.text("Rebate Pass-through Credit (50% share)", 19, y);
  doc.text("1", 110, y);
  doc.text(`-\u00A3${option.openBookBreakdown.rebateSaving.toLocaleString()}`, 135, y);
  doc.text(`-\u00A3${option.openBookBreakdown.rebateSaving.toLocaleString()}`, 191, y, { align: "right" });
  y += 10;

  // Totals
  doc.setDrawColor(200, 210, 220);
  doc.line(110, y - 3, 195, y - 3);

  doc.setTextColor(...TEXT_DARK);
  doc.setFont("helvetica", "normal");
  y = addRow(doc, y, "", "");
  y -= 8;
  doc.text("Subtotal (ex. VAT)", 135, y);
  doc.text(`\u00A3${option.openBookBreakdown.totalCost.toLocaleString()}`, 191, y, { align: "right" });
  y += 7;

  const vat = Math.round(option.openBookBreakdown.totalCost * 0.2);
  doc.text("VAT @ 20%", 135, y);
  doc.text(`\u00A3${vat.toLocaleString()}`, 191, y, { align: "right" });
  y += 10;

  // Total with VAT
  doc.setFillColor(...NAVY);
  doc.rect(110, y - 5, 85, 10, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL DUE", 114, y + 1);
  doc.text(`\u00A3${(option.openBookBreakdown.totalCost + vat).toLocaleString()}`, 191, y + 1, { align: "right" });

  y += 20;

  // Payment details
  y = addSectionTitle(doc, y, "PAYMENT DETAILS");
  doc.setTextColor(...TEXT_DARK);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Bank: Barclays Business Banking", 19, y);
  doc.text("Sort Code: 20-00-00 | Account: 12345678", 19, y + 5);
  doc.text("Payment Reference: " + ref, 19, y + 10);
  doc.text("Payment Terms: Net 30 days", 19, y + 15);

  addFooter(doc, 1);
  return doc;
}

// ─── Contract ──────────────────────────────────────────

export function generateContract(option: ScoredOption, requirement: Requirement): jsPDF {
  const doc = new jsPDF();
  const ref = refNum();

  addHeader(doc, "SERVICE CONTRACT", "IT Procurement Agreement — Open Book Terms", `CTR-${ref}`);

  let y = 54;

  // Parties
  addPartyBlock(doc, y, "PARTY A (BUYER)", [
    "Client Organisation",
    "Authorised Representative",
    "London, United Kingdom",
  ]);
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(110, y, 85, 32, 2, 2, "F");
  doc.setTextColor(...STEEL);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("PARTY B (SUPPLIER)", 114, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...TEXT_DARK);
  doc.text(option.quote.supplierName.split("(")[0].trim(), 114, y + 13);
  doc.text("via ProcureIQ Platform", 114, y + 18);
  doc.text(`Contract Ref: CTR-${ref}`, 114, y + 23);

  y = 94;

  // Scope
  y = addSectionTitle(doc, y, "1. SCOPE OF SUPPLY");
  doc.setTextColor(...TEXT_DARK);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const scope = [
    `Supply of ${requirement.quantity}x ${option.quote.supplierName.split("(")[1]?.replace(")", "") || "IT equipment as specified"}`,
    `Category: ${requirement.category}`,
    `Warranty: ${option.quote.warranty}`,
    `Delivery: Within ${option.quote.deliveryDays} business days of contract execution`,
    `SLA Compliance: ${option.quote.slaMatch}% match to stated requirements`,
  ];
  scope.forEach((line, i) => {
    doc.text(line, 19, y + i * 5);
  });
  y += scope.length * 5 + 6;

  // Pricing
  y = addSectionTitle(doc, y, "2. PRICING (OPEN BOOK)");
  y = addRow(doc, y, "Supplier base cost", `\u00A3${option.openBookBreakdown.supplierBase.toLocaleString()}`);
  y = addRow(doc, y, "Platform transaction fee (2%)", `\u00A3${option.openBookBreakdown.platformFee.toLocaleString()}`, false, true);
  y = addRow(doc, y, `Vendor rebate captured (${option.quote.rebatePercent}%)`, `\u00A3${option.openBookBreakdown.rebateCaptured.toLocaleString()}`);
  y = addRow(doc, y, "Buyer rebate share (50%)", `-\u00A3${option.openBookBreakdown.rebateSaving.toLocaleString()}`, false, true);
  y = addRow(doc, y, "Total contract value (ex. VAT)", `\u00A3${option.openBookBreakdown.totalCost.toLocaleString()}`, true);
  y += 4;

  // Key terms
  y = addSectionTitle(doc, y, "3. KEY TERMS");
  const terms = [
    "3.1 All pricing is open-book: no hidden margins, SPIFs, or undisclosed vendor incentives.",
    "3.2 Vendor rebates are captured and split 50/50 between buyer and ProcureIQ.",
    "3.3 Payment terms: Net 30 days from date of invoice.",
    "3.4 Warranty obligations are fulfilled directly by the OEM/manufacturer.",
    "3.5 Either party may terminate with 30 days written notice for cause.",
    "3.6 This contract is governed by the laws of England and Wales.",
    "3.7 Disputes shall be resolved through mediation before litigation.",
  ];
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  terms.forEach((term, i) => {
    doc.text(term, 19, y + i * 5.5);
  });
  y += terms.length * 5.5 + 8;

  // Signatures
  y = addSectionTitle(doc, y, "4. SIGNATURES");
  doc.setDrawColor(200, 210, 220);

  // Buyer signature
  doc.text("For and on behalf of the Buyer:", 19, y + 2);
  doc.line(19, y + 16, 90, y + 16);
  doc.text("Name:", 19, y + 22);
  doc.text("Date:", 19, y + 28);

  // Supplier signature
  doc.text("For and on behalf of the Supplier:", 114, y + 2);
  doc.line(114, y + 16, 191, y + 16);
  doc.text("Name:", 114, y + 22);
  doc.text("Date:", 114, y + 28);

  addFooter(doc, 1);
  return doc;
}

// ─── SLA Agreement ──────────────────────────────────────────

export function generateSLA(option: ScoredOption, requirement: Requirement): jsPDF {
  const doc = new jsPDF();
  const ref = refNum();

  addHeader(doc, "SLA AGREEMENT", "Service Level Agreement — Performance Guarantees", `SLA-${ref}`);

  let y = 54;

  y = addSectionTitle(doc, y, "SERVICE LEVEL COMMITMENTS");
  const slas = [
    ["Delivery Timeframe", `${option.quote.deliveryDays} business days from PO confirmation`, "Critical"],
    ["Warranty Coverage", option.quote.warranty, "High"],
    ["SLA Requirement Match", `${option.quote.slaMatch}%`, "High"],
    ["Pricing Transparency", "100% open-book — all costs disclosed", "Critical"],
    ["Rebate Disclosure", `${option.quote.rebatePercent}% captured, 50% passed to buyer`, "High"],
    ["Defect Rate", "< 2% DOA (Dead on Arrival)", "Medium"],
    ["Response Time", "4-hour acknowledgement for support queries", "High"],
    ["Escalation Path", "Account Manager > ProcureIQ Partner Ops > OEM", "Medium"],
  ];

  // Table header
  doc.setFillColor(...LIGHT_GRAY);
  doc.rect(15, y - 4, 180, 7, "F");
  doc.setTextColor(...STEEL);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Metric", 19, y);
  doc.text("Target", 90, y);
  doc.text("Priority", 175, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...TEXT_DARK);
  slas.forEach(([metric, target, priority], i) => {
    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, y - 4, 180, 7, "F");
    }
    doc.setTextColor(...TEXT_DARK);
    doc.text(metric, 19, y);
    doc.text(target, 90, y);
    const priorityColor = priority === "Critical" ? [220, 38, 38] : priority === "High" ? [245, 158, 11] : [34, 197, 94];
    doc.setTextColor(...(priorityColor as [number, number, number]));
    doc.text(priority, 175, y);
    y += 8;
  });

  y += 6;

  // Compliance
  y = addSectionTitle(doc, y, "COMPLIANCE REQUIREMENTS");
  doc.setTextColor(...TEXT_DARK);
  doc.setFontSize(8);
  requirement.complianceNeeds.forEach((need, i) => {
    doc.text(`\u2022 ${need}`, 19, y + i * 6);
  });
  y += requirement.complianceNeeds.length * 6 + 4;
  requirement.slaRequirements.forEach((sla, i) => {
    doc.text(`\u2022 ${sla}`, 19, y + i * 6);
  });

  y += requirement.slaRequirements.length * 6 + 8;

  // Remedies
  y = addSectionTitle(doc, y, "BREACH & REMEDIES");
  const remedies = [
    "Late delivery beyond 5 days: 1% discount per day, capped at 10%.",
    "DOA rate exceeding 2%: replacement stock within 48 hours at supplier cost.",
    "Failure to disclose rebate or margin: contract voidable at buyer's option.",
    "SLA breach pattern (3+ incidents): automatic escalation review within 7 days.",
  ];
  doc.setTextColor(...TEXT_DARK);
  remedies.forEach((r, i) => {
    doc.text(`${i + 1}. ${r}`, 19, y + i * 6);
  });

  addFooter(doc, 1);
  return doc;
}
