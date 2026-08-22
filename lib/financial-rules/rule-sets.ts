import type { FinancialRuleSet } from "./types";

export type TaxSlab = { upTo: number | null; rate: number };
export type IncomeTaxRules = {
  maximumSupportedIncome: number;
  cessRate: number;
  newRegime: { slabs: TaxSlab[]; rebateIncomeLimit: number; maximumRebate: number; marginalReliefAboveRebateLimit: boolean };
  oldRegime: {
    slabsByAge: Record<"below-60" | "60-to-below-80" | "80-or-above", TaxSlab[]>;
    rebateIncomeLimit: number;
    maximumRebate: number;
  };
};

export const incomeTaxRuleSet: FinancialRuleSet<IncomeTaxRules> = {
  id: "income-tax-fy-2025-26-ay-2026-27",
  label: "Income Tax — FY 2025–26 / AY 2026–27",
  effectivePeriod: "FY 2025–26 / AY 2026–27",
  periodLabels: [{ label: "Applicable Financial Year", value: "FY 2025–26" }, { label: "Applicable Assessment Year", value: "AY 2026–27" }],
  lastVerified: "2026-08-18",
  rules: {
    maximumSupportedIncome: 5_000_000,
    cessRate: 4,
    newRegime: {
      slabs: [{ upTo: 400_000, rate: 0 }, { upTo: 800_000, rate: 5 }, { upTo: 1_200_000, rate: 10 }, { upTo: 1_600_000, rate: 15 }, { upTo: 2_000_000, rate: 20 }, { upTo: 2_400_000, rate: 25 }, { upTo: null, rate: 30 }],
      rebateIncomeLimit: 1_200_000,
      maximumRebate: 60_000,
      marginalReliefAboveRebateLimit: true,
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
    { title: "Finance Act 2025 — amendment of section 87A", authority: "Income Tax Department", effectiveFrom: "2026-04-01", reference: "https://www.incometaxindia.gov.in/w/section-20-111", sourceType: "official", accessedAt: "2026-08-18" },
    { title: "Salaried Individuals for AY 2026–27", authority: "Income Tax Department", reference: "https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1", sourceType: "official", accessedAt: "2026-08-18" },
    { title: "Memorandum explaining the provisions of the Finance Bill, 2025", authority: "Ministry of Finance", reference: "https://www.indiabudget.gov.in/budget2025-26/doc/memo.pdf", sourceType: "official", accessedAt: "2026-08-18" },
  ],
};

export type GstRules = { minimumRate: number; maximumRate: number; presets: number[] };

export type PpfRules = {
  schemeName: string;
  minimumAnnualContribution: number;
  maximumAnnualContribution: number;
  maturityYearsFromEndOfOpeningYear: number;
  extensionBlockYears: number;
  extensionOptionDeadlineYears: number;
  interestEligibleBalanceFromDay: number;
  interestCreditedAnnually: boolean;
};

export const ppfRuleSet: FinancialRuleSet<PpfRules> = {
  id: "ppf-scheme-2019-amended-2020",
  label: "Public Provident Fund Scheme, 2019 (as amended in 2020)",
  effectivePeriod: "Public Provident Fund Scheme, 2019, as amended by G.S.R. 290(E) dated 5 May 2020",
  periodLabels: [{ label: "Applicable scheme", value: "Public Provident Fund Scheme, 2019 (as amended in 2020)" }],
  lastVerified: "2026-08-20",
  rules: {
    schemeName: "Public Provident Fund Scheme, 2019",
    minimumAnnualContribution: 500,
    maximumAnnualContribution: 150_000,
    maturityYearsFromEndOfOpeningYear: 15,
    extensionBlockYears: 5,
    extensionOptionDeadlineYears: 1,
    interestEligibleBalanceFromDay: 5,
    interestCreditedAnnually: true,
  },
  sources: [
    { title: "Public Provident Fund Scheme, 2019", authority: "National Savings Institute, Ministry of Finance", reference: "https://www.nsiindia.gov.in/InternalPage.aspx?Id_Pk=169", sourceType: "official", accessedAt: "2026-08-20" },
    { title: "Public Provident Fund Scheme, 2019 — scheme text", authority: "National Savings Institute, Ministry of Finance", reference: "https://www.nsiindia.gov.in/writereaddata/SchemeRules/PublicProvidentFundSchemeRule.pdf", sourceType: "official", accessedAt: "2026-08-20" },
    { title: "Acts and Rules Governing Small Savings Schemes", authority: "Department of Economic Affairs, Ministry of Finance", reference: "https://dea.gov.in/budget-division/477", sourceType: "official", accessedAt: "2026-08-20" },
    { title: "Government Savings Promotion General Rules, 2018", authority: "Department of Economic Affairs, Ministry of Finance", reference: "https://dea.gov.in/budget-division/government-savings-promotion-general-rules-2018", sourceType: "official", accessedAt: "2026-08-20" },
  ],
};

export const gstRuleSet: FinancialRuleSet<GstRules> = {
  id: "gst-generic-arithmetic-2026-08",
  label: "GST generic arithmetic rules",
  effectivePeriod: "Rules verified 16 August 2026",
  lastVerified: "2026-08-16",
  rules: { minimumRate: 0, maximumRate: 100, presets: [0, 3, 5, 12, 18, 28] },
  sources: [{ title: "GST goods and services rates", authority: "Central Board of Indirect Taxes and Customs", reference: "https://cbic-gst.gov.in/gst-goods-services-rates.html" }],
};

export type EpfRules = {
  schemeIdentity: string;
  pensionSchemeIdentity: string;
  standardEmployeeRate: number;
  standardEmployerRate: number;
  qualifyingReducedRate: number;
  epsDiversionRate: number;
  epsWageCeiling: number;
  higherWageContributionRequiresJointRequest: boolean;
  employerNeedNotMatchVoluntaryExcess: boolean;
  ordinaryWageCeilingAppliesToInternationalWorkers: boolean;
  defaultInterestRate: number;
  approvedInterestPeriod: string;
  approvedInterestRate: number;
  recommendedInterestPeriod: string;
  recommendedInterestRate: number;
  recommendedInterestStatus: "cbt-recommendation-pending-government-notification";
};
export const epfRuleSet: FinancialRuleSet<EpfRules> = {
  id: "epf-schemes-contributions-2026-08",
  label: "EPF Scheme, 1952 and EPS, 1995 contribution context",
  effectivePeriod: "EPF/EPS rules and interest status verified 22 August 2026",
  periodLabels: [
    { label: "Government-approved EPF interest", value: "8.25% for FY 2024–25" },
    { label: "FY 2025–26 status", value: "CBT recommended 8.25%; Government notification not located as of verification" },
  ],
  lastVerified: "2026-08-22",
  rules: {
    schemeIdentity: "Employees' Provident Funds Scheme, 1952",
    pensionSchemeIdentity: "Employees' Pension Scheme, 1995",
    standardEmployeeRate: 12,
    standardEmployerRate: 12,
    qualifyingReducedRate: 10,
    epsDiversionRate: 8.33,
    epsWageCeiling: 15_000,
    higherWageContributionRequiresJointRequest: true,
    employerNeedNotMatchVoluntaryExcess: true,
    ordinaryWageCeilingAppliesToInternationalWorkers: false,
    defaultInterestRate: 8.25,
    approvedInterestPeriod: "FY 2024–25",
    approvedInterestRate: 8.25,
    recommendedInterestPeriod: "FY 2025–26",
    recommendedInterestRate: 8.25,
    recommendedInterestStatus: "cbt-recommendation-pending-government-notification",
  },
  sources: [
    { title: "Present Rates of Contribution", authority: "Employees' Provident Fund Organisation", reference: "https://www.epfindia.gov.in/site_docs/PDFs/MiscPDFs/ContributionRate.pdf", sourceType: "official", accessedAt: "2026-08-22" },
    { title: "EPFO Frequently Asked Questions", authority: "Employees' Provident Fund Organisation", reference: "https://www.epfindia.gov.in/site_en/FAQ.php", sourceType: "official", accessedAt: "2026-08-22" },
    { title: "Employees' Provident Funds Scheme, 1952", authority: "Employees' Provident Fund Organisation", reference: "https://www.epfindia.gov.in/site_en/Downloads.php", sourceType: "official", accessedAt: "2026-08-22" },
    { title: "Employees' Pension Scheme, 1995", authority: "Employees' Provident Fund Organisation", reference: "https://www.epfindia.gov.in/site_docs/PDFs/Downloads_PDFs/EPS95_update102008.pdf", sourceType: "official", accessedAt: "2026-08-22" },
    { title: "Declaration of Rate of Interest for EPF Members' Accounts for FY 2024–25", authority: "Employees' Provident Fund Organisation", reference: "https://www.epfindia.gov.in/site_docs/PDFs/Circulars/Y2025-2026/DeclarationOfROI_2024_25.pdf", sourceType: "official", accessedAt: "2026-08-22", effectiveFrom: "2024-04-01", effectiveTo: "2025-03-31" },
    { title: "Central Board recommends 8.25% EPF interest for FY 2025–26", authority: "Ministry of Labour & Employment, Press Information Bureau", reference: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2234502&lang=1&reg=3", sourceType: "official", accessedAt: "2026-08-22" },
  ],
};

export type NpsRules = {
  subscriberModel: "all-citizen";
  regulationTitle: string;
  minimumCurrentAge: number;
  maximumRetirementAge: number;
  minimumAnnuityAllocation: number;
  maximumAnnuityAllocation: number;
  normalExit: { fullWithdrawalThreshold: number; intermediateCorpusThreshold: number; maximumDirectLumpSumInIntermediateBand: number; maximumLumpSumAllocation: number; minimumAnnuityAllocation: number };
  prematureExit: { fullWithdrawalThreshold: number; maximumLumpSumAllocation: number; minimumAnnuityAllocation: number };
};
export const npsRuleSet: FinancialRuleSet<NpsRules> = {
  id: "nps-all-citizen-exits-2026-07",
  label: "NPS All Citizen Model under current exit regulations",
  effectivePeriod: "PFRDA Exits and Withdrawals Regulations, 2015, last amended 20 July 2026",
  periodLabels: [{ label: "Applicable regulation", value: "PFRDA Exits and Withdrawals Regulations, 2015 (last amended 20 July 2026)" }],
  lastVerified: "2026-08-22",
  rules: {
    subscriberModel: "all-citizen",
    regulationTitle: "PFRDA Exits and Withdrawals Regulations, 2015, last amended 20 July 2026",
    minimumCurrentAge: 18,
    maximumRetirementAge: 85,
    minimumAnnuityAllocation: 20,
    maximumAnnuityAllocation: 100,
    normalExit: { fullWithdrawalThreshold: 800_000, intermediateCorpusThreshold: 1_200_000, maximumDirectLumpSumInIntermediateBand: 600_000, maximumLumpSumAllocation: 80, minimumAnnuityAllocation: 20 },
    prematureExit: { fullWithdrawalThreshold: 500_000, maximumLumpSumAllocation: 20, minimumAnnuityAllocation: 80 },
  },
  sources: [
    { title: "NPS All Citizen Model", authority: "Pension Fund Regulatory and Development Authority", reference: "https://www.pfrda.org.in/en/schemes/national-pension-system/nps-for-all-citizen-models", sourceType: "official", accessedAt: "2026-08-22" },
    { title: "PFRDA Exits and Withdrawals Regulations, 2015, last amended 20 July 2026", authority: "Pension Fund Regulatory and Development Authority", reference: "https://www.pfrda.org.in/w/pension-fund-regulatory-and-development-authority-exits-and-withdrawals-under-the-national-pension-system-regulations-2015-last-amended-on-20th-july-2026-.", sourceType: "official", accessedAt: "2026-08-22", effectiveFrom: "2026-07-20" },
    { title: "All Citizen Model exits and withdrawals FAQ, updated March 2026", authority: "Pension Fund Regulatory and Development Authority", reference: "https://www.pfrda.org.in/documents/33652/676426/Exits%2Band%2BWithdrawals%2Bunder%2BNPS%2Bfor%2BAll%2BCitizen%2BModel%2B%281%29.pdf", sourceType: "official", accessedAt: "2026-08-22" },
  ],
};

export type GratuityRules = {
  framework: string;
  commencementDate: string;
  ordinaryMonthlyRatedNumerator: number;
  ordinaryMonthlyRatedDenominator: number;
  additionalMonthsMustExceed: number;
  generalContinuousServiceYears: number;
  deathException: boolean;
  disablementException: boolean;
  fixedTermContext: string;
  statutoryCeiling: number;
  wageDefinitionContext: string;
  specialCasesExcludedFromCalculator: readonly string[];
  betterTermsMayApply: boolean;
};

export const gratuityRuleSet: FinancialRuleSet<GratuityRules> = {
  id: "gratuity-social-security-code-2025-11",
  label: "Code on Social Security, 2020 — gratuity framework",
  effectivePeriod: "Gratuity provisions operative from 21 November 2025",
  periodLabels: [{ label: "Operative framework", value: "Code on Social Security, 2020, effective for gratuity from 21 November 2025" }],
  lastVerified: "2026-08-22",
  rules: {
    framework: "Code on Social Security, 2020",
    commencementDate: "2025-11-21",
    ordinaryMonthlyRatedNumerator: 15,
    ordinaryMonthlyRatedDenominator: 26,
    additionalMonthsMustExceed: 6,
    generalContinuousServiceYears: 5,
    deathException: true,
    disablementException: true,
    fixedTermContext: "Special eligibility and pro-rata treatment apply; current Ministry guidance identifies one year under the fixed-term contract.",
    statutoryCeiling: 2_000_000,
    wageDefinitionContext: "Use wages under the operative Code and applicable employment context; the amount is not universally identical to basic salary, gross salary, CTC or take-home pay.",
    specialCasesExcludedFromCalculator: ["piece-rated", "seasonal", "fixed-term-pro-rata", "death-or-disablement-specific", "forfeiture", "enhanced-employer-terms", "tax"],
    betterTermsMayApply: true,
  },
  sources: [
    { title: "Code on Social Security, 2020 — section 53", authority: "India Code, Government of India", reference: "https://www.indiacode.nic.in/show-data?actid=AC_CEN_6_0_00036_202036_1623221080799&orderno=53&sectionId=54077&sectionno=53", sourceType: "official", accessedAt: "2026-08-22", effectiveFrom: "2025-11-21" },
    { title: "Key provisions under the Code on Social Security, 2020", authority: "Ministry of Labour & Employment", reference: "https://www.labour.gov.in/static/uploads/2026/03/d70bb9f7e87ec48bd64fde40329f9c09.pdf", sourceType: "official", accessedAt: "2026-08-22", effectiveFrom: "2025-11-21" },
    { title: "FAQs on Labour Codes", authority: "Ministry of Labour & Employment", reference: "https://labour.gov.in/sites/default/files/faqs_on_labour_codes.pdf", sourceType: "official", accessedAt: "2026-08-22" },
    { title: "Additional FAQs on Labour Codes", authority: "Ministry of Labour & Employment", reference: "https://www.labour.gov.in/static/uploads/2026/03/a4ccf4c6d97c4f1f36a6d83f8c64213d.pdf", sourceType: "official", accessedAt: "2026-08-22" },
    { title: "Gratuity exemption ceiling notification context", authority: "Income Tax Department", reference: "https://www.incometaxindia.gov.in/w/what-is-the-effective-date-of-enhancement-of-limit-of-gratuity-from-rs-10-lakh-to-20-lakh-for-purpose-of-tax-exemption-computation-under-section-10-10-ii-", sourceType: "official", accessedAt: "2026-08-22", effectiveFrom: "2018-03-29" },
  ],
};

export const financialRuleSets = { incomeTax: incomeTaxRuleSet, ppf: ppfRuleSet, gst: gstRuleSet, epf: epfRuleSet, nps: npsRuleSet, gratuity: gratuityRuleSet } as const;
