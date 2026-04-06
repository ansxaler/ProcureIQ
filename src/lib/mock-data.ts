import { Supplier, SupplierQuote, ScoredOption, Requirement } from "./types";

export const SUPPLIERS: Supplier[] = [
  { id: "td-synnex", name: "TD Synnex", tier: "Tier 1 Distributor", responseTime: 1.2 },
  { id: "ingram", name: "Ingram Micro", tier: "Tier 1 Distributor", responseTime: 0.8 },
  { id: "tech-data", name: "Tech Data", tier: "Tier 1 Distributor", responseTime: 1.5 },
  { id: "westcoast", name: "Westcoast", tier: "UK Distributor", responseTime: 2.1 },
  { id: "exertis", name: "Exertis", tier: "UK Distributor", responseTime: 1.8 },
  { id: "midwich", name: "Midwich", tier: "Specialist", responseTime: 2.4 },
  { id: "dell-direct", name: "Dell Direct", tier: "OEM Direct", responseTime: 3.2 },
  { id: "hp-direct", name: "HP Direct", tier: "OEM Direct", responseTime: 2.8 },
  { id: "lenovo-direct", name: "Lenovo Direct", tier: "OEM Direct", responseTime: 3.5 },
  { id: "ccs-media", name: "CCS Media", tier: "Specialist VAR", responseTime: 4.1 },
];

export const SAMPLE_REQUIREMENTS: { label: string; text: string }[] = [
  {
    label: "Laptop Fleet Refresh",
    text: "We need 150 business laptops for our London office refresh. Requirements: Intel i7 or equivalent, 16GB RAM minimum, 512GB SSD, 14-inch display, Windows 11 Pro. Must include 3-year next-business-day warranty. Budget up to \u00a3180,000. Need delivery within 4 weeks. ISO 27001 compliant supplier preferred.",
  },
  {
    label: "Network Switch Upgrade",
    text: "Upgrading our data centre networking. Need 12x 48-port managed PoE+ switches (Cisco Catalyst or Aruba equivalent), 4x 10GbE spine switches, and associated SFP+ modules. Must support VLAN, QoS, and SNMP monitoring. Budget \u00a395,000. Delivery within 6 weeks. Existing Cisco SmartNet preferred.",
  },
  {
    label: "Microsoft 365 Licensing",
    text: "Annual renewal for Microsoft 365 E5 licences, 800 seats. Need to include Phone System and Audio Conferencing add-ons. Also need 50 additional Power BI Pro licences. Current agreement expires in 45 days. Budget \u00a3420,000. Need CSP or EA pricing comparison.",
  },
];

export function generateMockQuotes(req: Requirement): SupplierQuote[] {
  const basePrice = parseFloat(req.budget.replace(/[^\d.]/g, "")) / req.quantity;

  return [
    {
      supplierId: "td-synnex",
      supplierName: "TD Synnex (Dell Latitude 5450)",
      unitPrice: basePrice * 0.88,
      totalPrice: basePrice * 0.88 * req.quantity,
      deliveryDays: 12,
      warranty: "3-year NBD On-site",
      slaMatch: 97,
      rebatePercent: 4.2,
      inStock: true,
    },
    {
      supplierId: "ingram",
      supplierName: "Ingram Micro (HP EliteBook 845 G11)",
      unitPrice: basePrice * 0.91,
      totalPrice: basePrice * 0.91 * req.quantity,
      deliveryDays: 8,
      warranty: "3-year NBD On-site",
      slaMatch: 95,
      rebatePercent: 3.8,
      inStock: true,
    },
    {
      supplierId: "tech-data",
      supplierName: "Tech Data (Lenovo ThinkPad T16 Gen 3)",
      unitPrice: basePrice * 0.85,
      totalPrice: basePrice * 0.85 * req.quantity,
      deliveryDays: 18,
      warranty: "3-year NBD On-site",
      slaMatch: 92,
      rebatePercent: 5.1,
      inStock: true,
    },
    {
      supplierId: "dell-direct",
      supplierName: "Dell Direct (Latitude 5550)",
      unitPrice: basePrice * 0.95,
      totalPrice: basePrice * 0.95 * req.quantity,
      deliveryDays: 15,
      warranty: "3-year ProSupport NBD",
      slaMatch: 99,
      rebatePercent: 2.0,
      inStock: true,
    },
    {
      supplierId: "westcoast",
      supplierName: "Westcoast (HP EliteBook 640 G11)",
      unitPrice: basePrice * 0.83,
      totalPrice: basePrice * 0.83 * req.quantity,
      deliveryDays: 22,
      warranty: "3-year Return-to-Depot",
      slaMatch: 78,
      rebatePercent: 6.5,
      inStock: false,
    },
  ];
}

export function scoreAndRankQuotes(quotes: SupplierQuote[]): ScoredOption[] {
  const maxPrice = Math.max(...quotes.map((q) => q.totalPrice));
  const minPrice = Math.min(...quotes.map((q) => q.totalPrice));
  const priceRange = maxPrice - minPrice || 1;

  return quotes
    .map((quote) => {
      const priceScore = Math.round(((maxPrice - quote.totalPrice) / priceRange) * 100);
      const deliveryScore = Math.round(Math.max(0, 100 - quote.deliveryDays * 4));
      const slaScore = quote.slaMatch;
      const stockPenalty = quote.inStock ? 0 : 15;
      const valueScore = Math.round(
        priceScore * 0.25 + deliveryScore * 0.25 + slaScore * 0.40 + quote.rebatePercent * 1.5 - stockPenalty
      );

      const incumbentMarkup = 1.12;
      const savingsVsIncumbent = Math.round(quote.totalPrice * incumbentMarkup - quote.totalPrice);

      const platformFee = Math.round(quote.totalPrice * 0.02);
      const rebateCaptured = Math.round(quote.totalPrice * (quote.rebatePercent / 100));
      const rebateSaving = Math.round(rebateCaptured * 0.5);

      return {
        rank: 0,
        quote,
        overallScore: valueScore,
        priceScore,
        deliveryScore,
        slaScore,
        valueScore,
        pros: generatePros(quote),
        cons: generateCons(quote),
        savingsVsIncumbent,
        openBookBreakdown: {
          supplierBase: Math.round(quote.totalPrice),
          platformFee,
          rebateCaptured,
          rebateSaving,
          totalCost: Math.round(quote.totalPrice + platformFee - rebateSaving),
        },
      };
    })
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 3)
    .map((opt, i) => ({ ...opt, rank: i + 1 }));
}

function generatePros(quote: SupplierQuote): string[] {
  const pros: string[] = [];
  if (quote.slaMatch >= 95) pros.push("Excellent SLA match (" + quote.slaMatch + "%)");
  if (quote.deliveryDays <= 10) pros.push("Fast delivery (" + quote.deliveryDays + " days)");
  if (quote.inStock) pros.push("In stock, ready to ship");
  if (quote.rebatePercent >= 4) pros.push("Strong rebate (" + quote.rebatePercent + "%)");
  if (quote.warranty.includes("NBD")) pros.push("Next-business-day warranty included");
  if (pros.length === 0) pros.push("Competitive pricing");
  return pros;
}

function generateCons(quote: SupplierQuote): string[] {
  const cons: string[] = [];
  if (quote.deliveryDays > 15) cons.push("Longer lead time (" + quote.deliveryDays + " days)");
  if (!quote.inStock) cons.push("Not currently in stock \u2014 lead time may extend");
  if (quote.slaMatch < 90) cons.push("Partial SLA match (" + quote.slaMatch + "%)");
  if (quote.warranty.includes("Return")) cons.push("Return-to-depot warranty (not on-site)");
  if (cons.length === 0) cons.push("Higher unit price vs. best option");
  return cons;
}
