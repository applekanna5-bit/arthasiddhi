import type { FinancialRuleSet } from "./types";

export type TaxSlab = { upTo: number | null; rate: number };
export type IncomeTaxRules = {
  maximumSupportedIncome: number;
  cessRate: number;
  newRegime: { slabs: TaxSlab[]; rebateIncomeLimit: number; maximumRebate: number };
  oldRegime: {
    slabsByAge: Record<"below-60" | "60-to-below-80" | "80-or-above", TaxSlab[]>;
    rebateIncomeLimit: number;
    maximumRebate: number;
  };
};

export const incomeTaxRuleSet: FinancialRuleSet<IncomeTaxRules> = {
  id: "income-tax-ty-2026-27",
  label: "Income Tax — Tax Year 2026–27",
  effectivePeriod: "Tax Year 2026–27",
  lastVerified: "2026-08-16",
  rules: {
    maximumSupportedIncome: 5_000_000,
    cessRate: 4,
    newRegime: {
      slabs: [{ upTo: 400_000, rate: 0 }, { upTo: 800_000, rate: 5 }, { upTo: 1_200_000, rate: 10 }, { upTo: 1_600_000, rate: 15 }, { upTo: 2_000_000, rate: 20 }, { upTo: 2_400_000, rate: 25 }, { upTo: null, rate: 30 }],
      rebateIncomeLimit: 1_200_000,
      maximumRebate: 60_000,
    },
    oldRegime: {
      slabsByAge: {
        "below-60": [{ upTo: 250_000, rate: 0 }, { upTo: 500_000, rate: 5 }, { upTo: 1_000_000, rate: 20 }, { upTo: null, rate: 30 }],
        "60-to-below-80": [{ upTo: 300_000, rate: 0 }, { upTo: 500_000, rate: 5 }, { upTo: 1_000_000, rate: 20 }, { upTo: null, rate: 30 }],
        "80-or-above": [{ upTo: 500_000, rate: 0 }, { upTo: 1_000_000, rate: 20 }, { upTo: null, rate: 30 }],
      },
      rebateIncomeLimit: 500_000,
      maximumRebate: 12_500,
    },
  },
  sources: [
    { title: "Objective and scope of the Income-tax Act, 2025", authority: "Income Tax Department", effectiveFrom: "2026-04-01", reference: "https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/objective-and-scope-new-act" },
    { title: "Income-tax slabs and section 87A rebate guidance", authority: "Income Tax Department", reference: "https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/file-itr-2-online" },
    { title: "Union Budget 2025–26 speech", authority: "Ministry of Finance", reference: "https://www.indiabudget.gov.in/doc/bspeech/bs2025_26.pdf" },
  ],
};

export type GstRules = { minimumRate: number; maximumRate: number; presets: number[] };
export const gstRuleSet: FinancialRuleSet<GstRules> = {
  id: "gst-generic-arithmetic-2026-08",
  label: "GST generic arithmetic rules",
  effectivePeriod: "Rules verified 16 August 2026",
  lastVerified: "2026-08-16",
  rules: { minimumRate: 0, maximumRate: 100, presets: [0, 3, 5, 12, 18, 28] },
  sources: [{ title: "GST goods and services rates", authority: "Central Board of Indirect Taxes and Customs", reference: "https://cbic-gst.gov.in/gst-goods-services-rates.html" }],
};

export type EpfRules = { standardEmployeeRate: number; standardEmployerRate: number; epsDiversionRate: number; epsWageCeiling: number; defaultInterestRate: number };
export const epfRuleSet: FinancialRuleSet<EpfRules> = {
  id: "epf-standard-contributions-2026-08",
  label: "EPF/EPS standard contribution context",
  effectivePeriod: "Rules verified 16 August 2026",
  lastVerified: "2026-08-16",
  rules: { standardEmployeeRate: 12, standardEmployerRate: 12, epsDiversionRate: 8.33, epsWageCeiling: 15_000, defaultInterestRate: 8.25 },
  sources: [
    { title: "Present rates of contribution", authority: "Employees' Provident Fund Organisation", reference: "https://www.epfindia.gov.in/site_docs/PDFs/MiscPDFs/ContributionRate.pdf" },
    { title: "EPFO frequently asked questions", authority: "Employees' Provident Fund Organisation", reference: "https://www.epfindia.gov.in/site_en/FAQ.php" },
  ],
};

export type NpsRules = { minimumCurrentAge: number; maximumRetirementAge: number; minimumAnnuityAllocation: number; maximumAnnuityAllocation: number };
export const npsRuleSet: FinancialRuleSet<NpsRules> = {
  id: "nps-normal-exit-illustration-2026-08",
  label: "NPS All Citizen Model normal-exit illustration",
  effectivePeriod: "Rules verified 16 August 2026",
  lastVerified: "2026-08-16",
  rules: { minimumCurrentAge: 18, maximumRetirementAge: 75, minimumAnnuityAllocation: 20, maximumAnnuityAllocation: 100 },
  sources: [
    { title: "NPS All Citizen Model", authority: "Pension Fund Regulatory and Development Authority", reference: "https://www.pfrda.org.in/en/schemes/national-pension-system/nps-for-all-citizen-models" },
    { title: "Current NPS Exits and Withdrawals Regulations", authority: "Pension Fund Regulatory and Development Authority", reference: "https://www.pfrda.org.in/w/pension-fund-regulatory-and-development-authority-exits-and-withdrawals-under-the-national-pension-system-regulations-2015-last-amended-on-20th-july-2026-." },
    { title: "All Citizen Model exits and withdrawals FAQ", authority: "Pension Fund Regulatory and Development Authority", reference: "https://pfrda.org.in/w/faqs/exits-and-withdrawals-from-national-pension-system-nps-for-all-citizen-model" },
  ],
};

export const financialRuleSets = { incomeTax: incomeTaxRuleSet, gst: gstRuleSet, epf: epfRuleSet, nps: npsRuleSet } as const;
