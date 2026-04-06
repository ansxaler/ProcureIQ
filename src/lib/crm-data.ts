import {
  Client,
  Tender,
  VendorResponse,
  EmailThread,
  EmailMessage,
  TenderDocument,
  ActivityEntry,
} from "./crm-types";
import { generateMockQuotes, scoreAndRankQuotes } from "./mock-data";
import { Requirement } from "./types";

// ─── Clients ──────────────────────────────────────────

export const CLIENTS: Client[] = [
  {
    id: "cl-meridian",
    name: "Meridian Financial Group",
    sector: "Financial Services",
    contactName: "Sarah Chen",
    contactEmail: "s.chen@meridianfg.co.uk",
    location: "London, EC2",
    totalSpend: 842000,
    tenderCount: 4,
    joinedDate: "2025-09-15",
  },
  {
    id: "cl-northgate",
    name: "Northgate NHS Trust",
    sector: "Healthcare",
    contactName: "Dr. James Okafor",
    contactEmail: "j.okafor@northgate.nhs.uk",
    location: "Manchester",
    totalSpend: 1250000,
    tenderCount: 3,
    joinedDate: "2025-07-22",
  },
  {
    id: "cl-chambers",
    name: "Chambers & Whitley LLP",
    sector: "Legal",
    contactName: "Rebecca Whitley",
    contactEmail: "r.whitley@cwlaw.co.uk",
    location: "Birmingham",
    totalSpend: 295000,
    tenderCount: 2,
    joinedDate: "2025-11-03",
  },
  {
    id: "cl-uob",
    name: "University of Bristol",
    sector: "Education",
    contactName: "Prof. Alan Davies",
    contactEmail: "a.davies@bristol.ac.uk",
    location: "Bristol",
    totalSpend: 580000,
    tenderCount: 2,
    joinedDate: "2026-01-10",
  },
  {
    id: "cl-hartwell",
    name: "Hartwell Retail Group",
    sector: "Retail",
    contactName: "Mark Thompson",
    contactEmail: "m.thompson@hartwell.co.uk",
    location: "Leeds",
    totalSpend: 410000,
    tenderCount: 1,
    joinedDate: "2026-02-18",
  },
];

// ─── Requirements (for tenders that have been parsed) ──

function makeRequirement(id: string, text: string, category: string, budget: string, qty: number, urgency: "standard" | "urgent" | "critical", slas: string[], compliance: string[]): Requirement {
  return { id, rawText: text, category, budget, quantity: qty, slaRequirements: slas, complianceNeeds: compliance, urgency, parsedAt: 2800 + Math.random() * 2000 };
}

const REQ_LAPTOP = makeRequirement("req-1", "150 business laptops for London office refresh...", "IT Hardware \u2014 Business Laptops", "\u00A3180,000", 150, "standard",
  ["3-year NBD warranty", "4-week delivery", "Intel i7+", "16GB RAM", "512GB SSD", "Windows 11 Pro"],
  ["ISO 27001", "GDPR compliant"]);

const REQ_NETWORK = makeRequirement("req-2", "Data centre networking upgrade...", "Networking \u2014 Managed Switches", "\u00A395,000", 16, "urgent",
  ["Cisco SmartNet", "48-port PoE+", "VLAN/QoS", "SNMP monitoring"],
  ["NHS DSPT", "Cyber Essentials Plus"]);

const REQ_MS365 = makeRequirement("req-3", "Microsoft 365 E5 renewal, 800 seats...", "Software \u2014 SaaS Licensing", "\u00A3420,000", 800, "standard",
  ["Phone System add-on", "Audio Conferencing", "Power BI Pro x50"],
  ["FCA regulated", "Data residency UK"]);

const REQ_MONITORS = makeRequirement("req-4", "200 x 27-inch monitors for hybrid workspace...", "IT Hardware \u2014 Displays", "\u00A370,000", 200, "standard",
  ["USB-C connectivity", "Height adjustable stand", "2-year warranty"],
  ["Energy Star certified"]);

const REQ_FIREWALL = makeRequirement("req-5", "Next-gen firewall cluster for perimeter...", "Security \u2014 Network Firewall", "\u00A3135,000", 4, "critical",
  ["HA failover pair", "SSL inspection", "24/7 support", "Threat intelligence feeds"],
  ["ISO 27001", "PCI DSS", "Cyber Essentials Plus"]);

const REQ_SERVERS = makeRequirement("req-6", "Server refresh for on-prem virtualisation cluster...", "IT Hardware \u2014 Servers", "\u00A3310,000", 6, "urgent",
  ["Dual Xeon", "512GB RAM", "NVMe storage", "3-year ProSupport"],
  ["NHS DSPT", "GDPR"]);

const REQ_TABLETS = makeRequirement("req-7", "iPad fleet for clinical ward rounds...", "IT Hardware \u2014 Tablets", "\u00A345,000", 120, "standard",
  ["iPad Air M2", "MDM compatible", "Protective case", "1-year AppleCare"],
  ["NHS DSPT", "Clinical safety"]);

// ─── Generate quotes for completed/advanced tenders ──

const LAPTOP_QUOTES = generateMockQuotes(REQ_LAPTOP);
const LAPTOP_SCORED = scoreAndRankQuotes(LAPTOP_QUOTES);

const NETWORK_QUOTES = generateMockQuotes(REQ_NETWORK);
const NETWORK_SCORED = scoreAndRankQuotes(NETWORK_QUOTES);

const MS365_QUOTES = generateMockQuotes(REQ_MS365);
const MS365_SCORED = scoreAndRankQuotes(MS365_QUOTES);

const MONITOR_QUOTES = generateMockQuotes(REQ_MONITORS);
const MONITOR_SCORED = scoreAndRankQuotes(MONITOR_QUOTES);

const FIREWALL_QUOTES = generateMockQuotes(REQ_FIREWALL);
const FIREWALL_SCORED = scoreAndRankQuotes(FIREWALL_QUOTES);

const SERVER_QUOTES = generateMockQuotes(REQ_SERVERS);

// ─── Tenders ──────────────────────────────────────────

export const TENDERS: Tender[] = [
  {
    id: "tn-001",
    title: "Laptop Fleet Refresh \u2014 150 Units",
    clientId: "cl-meridian",
    status: "completed",
    category: "IT Hardware \u2014 Business Laptops",
    budget: 180000,
    quantity: 150,
    urgency: "standard",
    requirement: REQ_LAPTOP,
    quotes: LAPTOP_QUOTES,
    scoredOptions: LAPTOP_SCORED,
    selectedOption: LAPTOP_SCORED[0],
    createdAt: "2026-03-12T09:15:00Z",
    updatedAt: "2026-03-12T09:22:00Z",
    description: "Annual laptop refresh for the London trading floor. Replacing aging ThinkPad T480s with modern business laptops meeting updated security requirements.",
  },
  {
    id: "tn-002",
    title: "Data Centre Network Upgrade",
    clientId: "cl-northgate",
    status: "review",
    category: "Networking \u2014 Managed Switches",
    budget: 95000,
    quantity: 16,
    urgency: "urgent",
    requirement: REQ_NETWORK,
    quotes: NETWORK_QUOTES,
    scoredOptions: NETWORK_SCORED,
    selectedOption: NETWORK_SCORED[0],
    createdAt: "2026-03-28T14:30:00Z",
    updatedAt: "2026-04-02T11:45:00Z",
    description: "Critical infrastructure upgrade to support new patient records system. Current switches at end-of-life with no further security patches available.",
  },
  {
    id: "tn-003",
    title: "Microsoft 365 E5 Renewal \u2014 800 Seats",
    clientId: "cl-meridian",
    status: "options_ready",
    category: "Software \u2014 SaaS Licensing",
    budget: 420000,
    quantity: 800,
    urgency: "standard",
    requirement: REQ_MS365,
    quotes: MS365_QUOTES,
    scoredOptions: MS365_SCORED,
    selectedOption: null,
    createdAt: "2026-04-01T10:00:00Z",
    updatedAt: "2026-04-04T16:20:00Z",
    description: "Annual EA renewal with expanded telephony requirements. Current agreement expires May 15th. Need CSP vs EA pricing comparison.",
  },
  {
    id: "tn-004",
    title: "Monitor Rollout \u2014 Hybrid Workspace",
    clientId: "cl-chambers",
    status: "completed",
    category: "IT Hardware \u2014 Displays",
    budget: 70000,
    quantity: 200,
    urgency: "standard",
    requirement: REQ_MONITORS,
    quotes: MONITOR_QUOTES,
    scoredOptions: MONITOR_SCORED,
    selectedOption: MONITOR_SCORED[0],
    createdAt: "2026-02-20T08:45:00Z",
    updatedAt: "2026-02-20T09:12:00Z",
    description: "Standardising display equipment across Birmingham and London offices to support new hybrid working policy.",
  },
  {
    id: "tn-005",
    title: "Perimeter Firewall Cluster",
    clientId: "cl-meridian",
    status: "scoring",
    category: "Security \u2014 Network Firewall",
    budget: 135000,
    quantity: 4,
    urgency: "critical",
    requirement: REQ_FIREWALL,
    quotes: FIREWALL_QUOTES,
    scoredOptions: FIREWALL_SCORED,
    selectedOption: null,
    createdAt: "2026-04-03T07:30:00Z",
    updatedAt: "2026-04-05T14:10:00Z",
    description: "Replacing ageing Cisco ASA pair with next-gen firewalls. Compliance audit in 6 weeks requires updated perimeter security.",
  },
  {
    id: "tn-006",
    title: "Server Refresh \u2014 Virtualisation Cluster",
    clientId: "cl-northgate",
    status: "sourcing",
    category: "IT Hardware \u2014 Servers",
    budget: 310000,
    quantity: 6,
    urgency: "urgent",
    requirement: REQ_SERVERS,
    quotes: SERVER_QUOTES,
    scoredOptions: [],
    selectedOption: null,
    createdAt: "2026-04-04T11:00:00Z",
    updatedAt: "2026-04-05T09:30:00Z",
    description: "VMware cluster at end-of-support. Need HPE or Dell server refresh to maintain NHS DSPT compliance.",
  },
  {
    id: "tn-007",
    title: "iPad Fleet \u2014 Clinical Wards",
    clientId: "cl-northgate",
    status: "draft",
    category: "IT Hardware \u2014 Tablets",
    budget: 45000,
    quantity: 120,
    urgency: "standard",
    requirement: REQ_TABLETS,
    quotes: [],
    scoredOptions: [],
    selectedOption: null,
    createdAt: "2026-04-05T16:00:00Z",
    updatedAt: "2026-04-05T16:00:00Z",
    description: "iPad deployment for ward-based clinical documentation. Replacing paper-based processes in 8 wards.",
  },
  {
    id: "tn-008",
    title: "Lecture Hall AV Upgrade",
    clientId: "cl-uob",
    status: "approved",
    category: "AV \u2014 Presentation Systems",
    budget: 280000,
    quantity: 12,
    urgency: "standard",
    requirement: makeRequirement("req-8", "AV upgrade for 12 lecture halls...", "AV \u2014 Presentation Systems", "\u00A3280,000", 12, "standard",
      ["4K projection", "Wireless casting", "Lecture capture", "2-year on-site support"],
      ["Accessibility standards", "JANET network compatible"]),
    quotes: generateMockQuotes(makeRequirement("req-8", "", "AV", "\u00A3280,000", 12, "standard", [], [])),
    scoredOptions: scoreAndRankQuotes(generateMockQuotes(makeRequirement("req-8", "", "AV", "\u00A3280,000", 12, "standard", [], []))),
    selectedOption: null,
    createdAt: "2026-03-15T13:00:00Z",
    updatedAt: "2026-04-01T10:00:00Z",
    description: "Modernising lecture halls ahead of next academic year. Current projectors are 8+ years old with failing lamps.",
  },
];

// ─── Vendor Responses ──────────────────────────────────

export const VENDOR_RESPONSES: VendorResponse[] = [
  // Tender 1 - Laptop Fleet (completed)
  { tenderId: "tn-001", supplierId: "td-synnex", supplierName: "TD Synnex", status: "quoted", message: "We can fulfil the Dell Latitude 5450 order from UK warehouse stock. 150 units available immediately with 3-year NBD ProSupport. Volume discount applied at tier 3 pricing. Delivery within 12 business days to your London address.", respondedAt: "2026-03-12T09:18:00Z", quote: LAPTOP_QUOTES[0] },
  { tenderId: "tn-001", supplierId: "ingram", supplierName: "Ingram Micro", status: "quoted", message: "HP EliteBook 845 G11 available. Strong AMD Ryzen Pro alternative to Intel spec. All units in stock at Basingstoke DC. Can deliver in 8 business days with white-glove setup if needed.", respondedAt: "2026-03-12T09:17:30Z", quote: LAPTOP_QUOTES[1] },
  { tenderId: "tn-001", supplierId: "tech-data", supplierName: "Tech Data", status: "quoted", message: "Lenovo ThinkPad T16 Gen 3 \u2014 best value option. 18-day lead time due to customs processing but lowest unit cost. Full 3-year NBD warranty included through Lenovo Premier Support.", respondedAt: "2026-03-12T09:19:00Z", quote: LAPTOP_QUOTES[2] },
  { tenderId: "tn-001", supplierId: "dell-direct", supplierName: "Dell Direct", status: "quoted", message: "Direct from Dell UK factory. Latitude 5550 with ProSupport Plus (includes accidental damage). Premium pricing but highest SLA match at 99%.", respondedAt: "2026-03-12T09:20:00Z", quote: LAPTOP_QUOTES[3] },
  { tenderId: "tn-001", supplierId: "westcoast", supplierName: "Westcoast", status: "quoted", message: "HP EliteBook 640 G11 \u2014 lowest unit cost but return-to-depot warranty only. Currently out of stock, expecting replenishment in 2 weeks.", respondedAt: "2026-03-12T09:19:30Z", quote: LAPTOP_QUOTES[4] },
  { tenderId: "tn-001", supplierId: "exertis", supplierName: "Exertis", status: "declined", message: "Unfortunately we cannot compete on this volume for business laptops. Our strength is in AV and peripherals. Happy to quote on any display or conferencing requirements.", respondedAt: "2026-03-12T09:18:30Z", quote: null },
  { tenderId: "tn-001", supplierId: "midwich", supplierName: "Midwich", status: "no_response", message: "", respondedAt: null, quote: null },

  // Tender 2 - Network (review)
  { tenderId: "tn-002", supplierId: "td-synnex", supplierName: "TD Synnex", status: "quoted", message: "Cisco Catalyst 9300 series available. We hold Cisco Gold Partner status and can provide SmartNet directly. Full PoE+ budget on all 48 ports. 10GbE spine switches from the Catalyst 9500 range.", respondedAt: "2026-03-29T10:15:00Z", quote: NETWORK_QUOTES[0] },
  { tenderId: "tn-002", supplierId: "ingram", supplierName: "Ingram Micro", status: "quoted", message: "Aruba CX 6300 series \u2014 strong Cisco alternative at better pricing. HPE/Aruba partnership means we can offer enhanced SLA terms. All units in stock.", respondedAt: "2026-03-29T09:45:00Z", quote: NETWORK_QUOTES[1] },
  { tenderId: "tn-002", supplierId: "tech-data", supplierName: "Tech Data", status: "quoted", message: "Juniper EX4400 series. Excellent for healthcare environments with Mist AI management. Longer lead time but competitive pricing and strong NHS references.", respondedAt: "2026-03-29T11:30:00Z", quote: NETWORK_QUOTES[2] },

  // Tender 3 - MS365 (options_ready)
  { tenderId: "tn-003", supplierId: "td-synnex", supplierName: "TD Synnex", status: "quoted", message: "CSP pricing for M365 E5 with Phone System and Audio Conferencing. Monthly billing available. We can manage the transition from your current EA seamlessly.", respondedAt: "2026-04-02T14:00:00Z", quote: MS365_QUOTES[0] },
  { tenderId: "tn-003", supplierId: "ingram", supplierName: "Ingram Micro", status: "quoted", message: "EA renewal pricing through our Microsoft LSP agreement. Annual commitment with true-up flexibility. Includes migration support for Phone System deployment.", respondedAt: "2026-04-02T13:30:00Z", quote: MS365_QUOTES[1] },
];

// ─── Email Threads ──────────────────────────────────────

function msg(id: string, threadId: string, from: string, fromRole: "agent" | "supplier" | "client", to: string, subject: string, body: string, ts: string): EmailMessage {
  return { id, from, fromRole, to, subject, body, timestamp: ts, threadId };
}

export const EMAIL_THREADS: EmailThread[] = [
  {
    id: "et-001",
    tenderId: "tn-001",
    subject: "RFQ: 150 Business Laptops \u2014 Meridian Financial Group",
    participants: ["ProcureIQ Agent", "TD Synnex", "Ingram Micro", "Tech Data"],
    lastMessageAt: "2026-03-12T09:20:00Z",
    messages: [
      msg("em-001", "et-001", "ProcureIQ Agent", "agent", "supplier-network@procureiq.ai", "RFQ: 150 Business Laptops \u2014 Meridian Financial Group", "Dear Supplier Partners,\n\nWe have a new requirement from a regulated financial services client:\n\n\u2022 150x business laptops (Intel i7+, 16GB, 512GB SSD, 14\")\n\u2022 Windows 11 Pro pre-installed\n\u2022 3-year next-business-day warranty required\n\u2022 Budget: \u00A3180,000 (ex. VAT)\n\u2022 Delivery: within 4 weeks to London EC2\n\u2022 ISO 27001 compliant supply chain preferred\n\nPlease respond with your best pricing within 30 minutes. Open-book terms apply \u2014 all margins disclosed.\n\nBest regards,\nProcureIQ Procurement Agent", "2026-03-12T09:15:30Z"),
      msg("em-002", "et-001", "TD Synnex", "supplier", "procurement@procureiq.ai", "RE: RFQ: 150 Business Laptops", "Hi ProcureIQ,\n\nWe can offer the Dell Latitude 5450 from UK warehouse stock:\n\n\u2022 Unit price: \u00A31,056 (tier 3 volume)\n\u2022 Total: \u00A3158,400\n\u2022 Delivery: 12 business days\n\u2022 Warranty: 3-year NBD ProSupport\n\u2022 Rebate: 4.2% quarterly backend\n\nAll 150 units confirmed in stock at Basingstoke.\n\nRegards,\nTD Synnex UK Sales", "2026-03-12T09:18:00Z"),
      msg("em-003", "et-001", "Ingram Micro", "supplier", "procurement@procureiq.ai", "RE: RFQ: 150 Business Laptops", "ProcureIQ,\n\nHP EliteBook 845 G11 \u2014 AMD Ryzen 7 Pro alternative:\n\n\u2022 Unit price: \u00A31,092\n\u2022 Total: \u00A3163,800\n\u2022 Delivery: 8 business days (fastest)\n\u2022 Warranty: 3-year NBD\n\u2022 Rebate: 3.8%\n\nReady to ship from Basingstoke DC.\n\nBest,\nIngram Micro UK", "2026-03-12T09:17:30Z"),
      msg("em-004", "et-001", "ProcureIQ Agent", "agent", "s.chen@meridianfg.co.uk", "Your Options Are Ready \u2014 150 Laptops", "Dear Sarah,\n\nGreat news \u2014 we've received 5 competitive quotes for your laptop refresh and ranked the top 3:\n\n1. TD Synnex (Dell Latitude 5450) \u2014 \u00A3158,241 total, 12-day delivery, 97% SLA match \u2705\n2. Ingram Micro (HP EliteBook 845 G11) \u2014 \u00A3163,800, 8-day delivery\n3. Tech Data (Lenovo ThinkPad T16) \u2014 \u00A3153,000, 18-day delivery\n\nAll pricing is fully open-book with rebate pass-through. Estimated saving vs. traditional reseller: \u00A319,008.\n\nPlease review at your convenience. Happy to walk through the scoring.\n\nBest regards,\nProcureIQ Agent", "2026-03-12T09:20:00Z"),
    ],
  },
  {
    id: "et-002",
    tenderId: "tn-001",
    subject: "Order Confirmation \u2014 Dell Latitude 5450 x 150",
    participants: ["ProcureIQ Agent", "Sarah Chen (Meridian)", "TD Synnex"],
    lastMessageAt: "2026-03-12T09:25:00Z",
    messages: [
      msg("em-005", "et-002", "Sarah Chen (Meridian)", "client", "procurement@procureiq.ai", "RE: Your Options Are Ready", "Hi ProcureIQ,\n\nImpressive turnaround. Let's go with Option 1 (Dell via TD Synnex). The SLA match and in-stock availability are exactly what we need.\n\nPlease proceed with PO and contract.\n\nThanks,\nSarah", "2026-03-12T09:22:00Z"),
      msg("em-006", "et-002", "ProcureIQ Agent", "agent", "s.chen@meridianfg.co.uk", "Order Confirmed \u2014 Documents Attached", "Dear Sarah,\n\nOrder confirmed. All documents have been generated:\n\n\u2022 Purchase Order (PO-PIQ-A3F2K1)\n\u2022 Invoice with VAT breakdown\n\u2022 Service Contract (open-book terms)\n\u2022 SLA Agreement\n\nTotal cost: \u00A3158,241 (ex. VAT)\nSaving vs incumbent estimate: \u00A319,008\n\nDelivery expected within 12 business days.\n\nBest regards,\nProcureIQ Agent", "2026-03-12T09:25:00Z"),
    ],
  },
  {
    id: "et-003",
    tenderId: "tn-002",
    subject: "RFQ: Data Centre Network Upgrade \u2014 Northgate NHS Trust",
    participants: ["ProcureIQ Agent", "TD Synnex", "Ingram Micro", "Tech Data"],
    lastMessageAt: "2026-03-29T11:30:00Z",
    messages: [
      msg("em-007", "et-003", "ProcureIQ Agent", "agent", "supplier-network@procureiq.ai", "RFQ: Data Centre Network Upgrade \u2014 Northgate NHS Trust", "Dear Supplier Partners,\n\nUrgent requirement from an NHS Trust:\n\n\u2022 12x 48-port managed PoE+ switches\n\u2022 4x 10GbE spine switches\n\u2022 Associated SFP+ modules\n\u2022 Must support VLAN, QoS, SNMP\n\u2022 Budget: \u00A395,000\n\u2022 Delivery: 6 weeks max\n\u2022 NHS DSPT and Cyber Essentials Plus required\n\nPlease respond urgently. This is a critical infrastructure replacement.\n\nBest regards,\nProcureIQ Agent", "2026-03-28T14:35:00Z"),
      msg("em-008", "et-003", "TD Synnex", "supplier", "procurement@procureiq.ai", "RE: RFQ: Network Upgrade", "ProcureIQ,\n\nCisco Catalyst 9300 series available:\n\u2022 12x C9300-48P at \u00A34,200 each\n\u2022 4x C9500-24Y4C at \u00A36,800 each\n\u2022 Full SmartNet included\n\nTotal: \u00A377,600 + modules\nNHS DSPT compliant.\n\nRegards,\nTD Synnex Healthcare Team", "2026-03-29T10:15:00Z"),
    ],
  },
  {
    id: "et-004",
    tenderId: "tn-003",
    subject: "RFQ: Microsoft 365 E5 Renewal \u2014 800 Seats",
    participants: ["ProcureIQ Agent", "TD Synnex", "Ingram Micro"],
    lastMessageAt: "2026-04-02T14:00:00Z",
    messages: [
      msg("em-009", "et-004", "ProcureIQ Agent", "agent", "supplier-network@procureiq.ai", "RFQ: M365 E5 Renewal \u2014 Meridian Financial Group", "Dear Partners,\n\nAnnual renewal required for a regulated financial services client:\n\n\u2022 800x M365 E5 licences\n\u2022 Phone System + Audio Conferencing add-ons\n\u2022 50x Power BI Pro\n\u2022 Current agreement expires: 15 May 2026\n\u2022 Budget: \u00A3420,000\n\u2022 Need CSP vs EA pricing comparison\n\nFCA regulated \u2014 UK data residency required.\n\nBest regards,\nProcureIQ Agent", "2026-04-01T10:05:00Z"),
    ],
  },
];

// ─── Documents ──────────────────────────────────────────

export const TENDER_DOCUMENTS: TenderDocument[] = [
  { id: "doc-001", tenderId: "tn-001", type: "po", label: "Purchase Order", status: "sent", generatedAt: "2026-03-12T09:22:30Z", reviewedAt: "2026-03-12T09:22:00Z" },
  { id: "doc-002", tenderId: "tn-001", type: "invoice", label: "Invoice", status: "sent", generatedAt: "2026-03-12T09:22:35Z", reviewedAt: "2026-03-12T09:22:00Z" },
  { id: "doc-003", tenderId: "tn-001", type: "contract", label: "Service Contract", status: "sent", generatedAt: "2026-03-12T09:22:40Z", reviewedAt: "2026-03-12T09:22:00Z" },
  { id: "doc-004", tenderId: "tn-001", type: "sla", label: "SLA Agreement", status: "sent", generatedAt: "2026-03-12T09:22:45Z", reviewedAt: "2026-03-12T09:22:00Z" },
  { id: "doc-005", tenderId: "tn-002", type: "po", label: "Purchase Order", status: "reviewed", generatedAt: "2026-04-02T11:50:00Z", reviewedAt: "2026-04-02T14:00:00Z" },
  { id: "doc-006", tenderId: "tn-002", type: "invoice", label: "Invoice", status: "draft", generatedAt: "2026-04-02T11:50:05Z", reviewedAt: null },
  { id: "doc-007", tenderId: "tn-002", type: "contract", label: "Service Contract", status: "reviewed", generatedAt: "2026-04-02T11:50:10Z", reviewedAt: "2026-04-02T14:05:00Z" },
  { id: "doc-008", tenderId: "tn-002", type: "sla", label: "SLA Agreement", status: "draft", generatedAt: "2026-04-02T11:50:15Z", reviewedAt: null },
  { id: "doc-009", tenderId: "tn-004", type: "po", label: "Purchase Order", status: "sent", generatedAt: "2026-02-20T09:15:00Z", reviewedAt: "2026-02-20T09:12:00Z" },
  { id: "doc-010", tenderId: "tn-004", type: "invoice", label: "Invoice", status: "sent", generatedAt: "2026-02-20T09:15:05Z", reviewedAt: "2026-02-20T09:12:00Z" },
  { id: "doc-011", tenderId: "tn-004", type: "contract", label: "Service Contract", status: "sent", generatedAt: "2026-02-20T09:15:10Z", reviewedAt: "2026-02-20T09:12:00Z" },
  { id: "doc-012", tenderId: "tn-004", type: "sla", label: "SLA Agreement", status: "sent", generatedAt: "2026-02-20T09:15:15Z", reviewedAt: "2026-02-20T09:12:00Z" },
];

// ─── Activity ──────────────────────────────────────────

export const ACTIVITIES: ActivityEntry[] = [
  { id: "a-001", tenderId: "tn-001", type: "system", message: "Tender created", timestamp: "2026-03-12T09:15:00Z" },
  { id: "a-002", tenderId: "tn-001", type: "agent", message: "AI parsed requirement in 3.2s \u2014 category: IT Hardware, budget: \u00A3180k", timestamp: "2026-03-12T09:15:30Z" },
  { id: "a-003", tenderId: "tn-001", type: "agent", message: "RFQ sent to 10 suppliers", timestamp: "2026-03-12T09:15:35Z" },
  { id: "a-004", tenderId: "tn-001", type: "supplier", message: "Ingram Micro responded with quote (\u00A3163,800)", timestamp: "2026-03-12T09:17:30Z" },
  { id: "a-005", tenderId: "tn-001", type: "supplier", message: "TD Synnex responded with quote (\u00A3158,400)", timestamp: "2026-03-12T09:18:00Z" },
  { id: "a-006", tenderId: "tn-001", type: "supplier", message: "Exertis declined \u2014 outside category focus", timestamp: "2026-03-12T09:18:30Z" },
  { id: "a-007", tenderId: "tn-001", type: "supplier", message: "Tech Data responded with quote (\u00A3153,000)", timestamp: "2026-03-12T09:19:00Z" },
  { id: "a-008", tenderId: "tn-001", type: "agent", message: "5 quotes received, scoring complete. Top option: TD Synnex (73/100)", timestamp: "2026-03-12T09:19:45Z" },
  { id: "a-009", tenderId: "tn-001", type: "agent", message: "Options email sent to Sarah Chen at Meridian", timestamp: "2026-03-12T09:20:00Z" },
  { id: "a-010", tenderId: "tn-001", type: "user", message: "Client selected Option 1: TD Synnex (Dell Latitude 5450)", timestamp: "2026-03-12T09:22:00Z" },
  { id: "a-011", tenderId: "tn-001", type: "document", message: "Purchase Order, Invoice, Contract, and SLA generated", timestamp: "2026-03-12T09:22:30Z" },
  { id: "a-012", tenderId: "tn-001", type: "document", message: "All documents reviewed and approved", timestamp: "2026-03-12T09:22:45Z" },
  { id: "a-013", tenderId: "tn-001", type: "system", message: "Tender completed \u2014 total time: 7 minutes", timestamp: "2026-03-12T09:22:50Z" },

  { id: "a-014", tenderId: "tn-002", type: "system", message: "Tender created (URGENT)", timestamp: "2026-03-28T14:30:00Z" },
  { id: "a-015", tenderId: "tn-002", type: "agent", message: "AI parsed requirement in 2.1s \u2014 category: Networking", timestamp: "2026-03-28T14:31:00Z" },
  { id: "a-016", tenderId: "tn-002", type: "agent", message: "RFQ sent to 10 suppliers \u2014 flagged as urgent", timestamp: "2026-03-28T14:31:30Z" },
  { id: "a-017", tenderId: "tn-002", type: "supplier", message: "TD Synnex quoted Cisco Catalyst 9300 (\u00A377,600+)", timestamp: "2026-03-29T10:15:00Z" },
  { id: "a-018", tenderId: "tn-002", type: "supplier", message: "Ingram Micro quoted Aruba CX 6300", timestamp: "2026-03-29T09:45:00Z" },
  { id: "a-019", tenderId: "tn-002", type: "agent", message: "3 quotes received, scoring complete. Documents generated for review.", timestamp: "2026-04-02T11:45:00Z" },

  { id: "a-020", tenderId: "tn-003", type: "system", message: "Tender created", timestamp: "2026-04-01T10:00:00Z" },
  { id: "a-021", tenderId: "tn-003", type: "agent", message: "M365 licensing requirement parsed \u2014 800 E5 seats + add-ons", timestamp: "2026-04-01T10:01:00Z" },
  { id: "a-022", tenderId: "tn-003", type: "agent", message: "RFQ sent to Microsoft CSP and EA partners", timestamp: "2026-04-01T10:02:00Z" },
  { id: "a-023", tenderId: "tn-003", type: "supplier", message: "TD Synnex quoted CSP pricing", timestamp: "2026-04-02T14:00:00Z" },
  { id: "a-024", tenderId: "tn-003", type: "agent", message: "Options ready for client review", timestamp: "2026-04-04T16:20:00Z" },

  { id: "a-025", tenderId: "tn-005", type: "system", message: "Tender created (CRITICAL)", timestamp: "2026-04-03T07:30:00Z" },
  { id: "a-026", tenderId: "tn-005", type: "agent", message: "Security requirement parsed \u2014 next-gen firewall cluster", timestamp: "2026-04-03T07:31:00Z" },
  { id: "a-027", tenderId: "tn-005", type: "agent", message: "Scoring in progress \u2014 compliance requirements being cross-referenced", timestamp: "2026-04-05T14:10:00Z" },

  { id: "a-028", tenderId: "tn-006", type: "system", message: "Tender created (URGENT)", timestamp: "2026-04-04T11:00:00Z" },
  { id: "a-029", tenderId: "tn-006", type: "agent", message: "Server requirement parsed \u2014 6x dual Xeon, 512GB RAM", timestamp: "2026-04-04T11:02:00Z" },
  { id: "a-030", tenderId: "tn-006", type: "agent", message: "Sourcing from HPE, Dell, and Lenovo server channels", timestamp: "2026-04-05T09:30:00Z" },
];

// ─── Helpers ──────────────────────────────────────────

export function getClient(id: string): Client | undefined {
  return CLIENTS.find((c) => c.id === id);
}

export function getTender(id: string): Tender | undefined {
  return TENDERS.find((t) => t.id === id);
}

export function getTendersByClient(clientId: string): Tender[] {
  return TENDERS.filter((t) => t.clientId === clientId);
}

export function getVendorResponses(tenderId: string): VendorResponse[] {
  return VENDOR_RESPONSES.filter((v) => v.tenderId === tenderId);
}

export function getEmailThreads(tenderId: string): EmailThread[] {
  return EMAIL_THREADS.filter((e) => e.tenderId === tenderId);
}

export function getDocuments(tenderId: string): TenderDocument[] {
  return TENDER_DOCUMENTS.filter((d) => d.tenderId === tenderId);
}

export function getActivities(tenderId: string): ActivityEntry[] {
  return ACTIVITIES.filter((a) => a.tenderId === tenderId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function getAllRecentActivities(limit = 15): (ActivityEntry & { tenderTitle: string })[] {
  return ACTIVITIES
    .map((a) => ({ ...a, tenderTitle: TENDERS.find((t) => t.id === a.tenderId)?.title || "" }))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

export function getDashboardMetrics() {
  const active = TENDERS.filter((t) => !["completed", "cancelled", "draft"].includes(t.status));
  const completed = TENDERS.filter((t) => t.status === "completed");
  const totalPipeline = active.reduce((sum, t) => sum + t.budget, 0);
  const avgSavings = completed.length > 0
    ? completed.reduce((sum, t) => sum + (t.selectedOption?.savingsVsIncumbent || 0), 0) / completed.length
    : 0;

  return {
    activeTenders: active.length,
    totalPipeline,
    avgSavings: Math.round(avgSavings),
    clientCount: CLIENTS.length,
    completed: completed.length,
    totalSavings: completed.reduce((sum, t) => sum + (t.selectedOption?.savingsVsIncumbent || 0), 0),
  };
}
