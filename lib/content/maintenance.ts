import { articles } from "./articles";
import { calculators, type CalculatorSlug } from "./calculators";
import type { Article, ArticleSlug } from "./types";
import { financialRuleSets } from "../financial-rules/rule-sets";
import type { FinancialRuleSet, FinancialRuleSource } from "../financial-rules/types";

export type MaintenanceStatus = "current" | "review-due" | "review-overdue" | "period-review-required";
export type MaintenancePriority = "P0" | "P1" | "P2" | "P3";
export type MaintenanceReasonCode = "verified-age" | "overdue-age" | "financial-year-rollover" | "pending-notification";
export type SourceAdvisoryCode = "missing-source-access-date";
export type MaintenanceEventHint = "finance-act-cycle" | "financial-year-rollover" | "annual-interest-notification" | "scheme-amendment" | "rate-or-structure-amendment" | "regulation-amendment" | "statutory-amendment";
export type IncomeTaxIntendedUse = "current-calculation" | "filing-period" | "historical";

export type MaintenanceReason = { code: MaintenanceReasonCode; message: string };
export type SourceAdvisory = { code: SourceAdvisoryCode; message: string; sourceReference: string };

type PeriodPolicy = {
  kind: "financial-and-assessment-year";
  financialYearEndsOn: string;
  assessmentYearEndsOn: string;
  intendedUse: IncomeTaxIntendedUse;
};

export type RuleSetMaintenancePolicy = {
  reviewAfterDays: number;
  overdueAfterDays: number;
  priority: "P1";
  eventHints: readonly MaintenanceEventHint[];
  calculators: readonly CalculatorSlug[];
  period?: PeriodPolicy;
};

// Windows are intentionally rule-specific. They are maintenance cadence, not a
// claim that a rule changed when the window elapses.
export const ruleSetMaintenancePolicies = {
  "income-tax-fy-2025-26-ay-2026-27": {
    reviewAfterDays: 90,
    overdueAfterDays: 120,
    priority: "P1",
    eventHints: ["finance-act-cycle", "financial-year-rollover"],
    calculators: ["income-tax"],
    period: {
      kind: "financial-and-assessment-year",
      financialYearEndsOn: "2026-03-31",
      assessmentYearEndsOn: "2027-03-31",
      // The UI estimates tax for the displayed FY; it is not a return-filing flow.
      intendedUse: "current-calculation",
    },
  },
  "ppf-scheme-2019-amended-2020": {
    reviewAfterDays: 365,
    overdueAfterDays: 455,
    priority: "P1",
    eventHints: ["scheme-amendment"],
    calculators: ["ppf"],
  },
  "gst-generic-arithmetic-2026-08": {
    reviewAfterDays: 180,
    overdueAfterDays: 240,
    priority: "P1",
    eventHints: ["rate-or-structure-amendment"],
    calculators: ["gst"],
  },
  "epf-schemes-contributions-2026-08": {
    reviewAfterDays: 105,
    overdueAfterDays: 135,
    priority: "P1",
    eventHints: ["annual-interest-notification"],
    calculators: ["epf"],
  },
  "nps-all-citizen-exits-2026-07": {
    reviewAfterDays: 180,
    overdueAfterDays: 240,
    priority: "P1",
    eventHints: ["regulation-amendment"],
    calculators: ["nps"],
  },
  "gratuity-social-security-code-2025-11": {
    reviewAfterDays: 180,
    overdueAfterDays: 240,
    priority: "P1",
    eventHints: ["statutory-amendment"],
    calculators: ["gratuity"],
  },
} as const satisfies Record<string, RuleSetMaintenancePolicy>;

export type RuleSetId = keyof typeof ruleSetMaintenancePolicies;

export type RuleSetMaintenanceEvaluation = {
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  lastVerified: string;
  ageDays: number;
  applicablePeriod: string;
  reasons: readonly MaintenanceReason[];
  sourceAdvisories: readonly SourceAdvisory[];
};

export type ArticleMaintenanceEvaluation = RuleSetMaintenanceEvaluation & { ruleSetId: RuleSetId };

export type MaintenanceReportRow = RuleSetMaintenanceEvaluation & {
  ruleSetId: RuleSetId;
  calculators: readonly CalculatorSlug[];
  articleSlugs: readonly ArticleSlug[];
  eventHints: readonly MaintenanceEventHint[];
};

const DAY_MS = 86_400_000;
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

function parseIsoDate(value: string, field: string): number {
  const match = ISO_DATE.exec(value);
  if (!match) throw new Error(`${field} must be a valid ISO calendar date (YYYY-MM-DD): ${value}`);
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const timestamp = Date.UTC(year, month - 1, day);
  const parsed = new Date(timestamp);
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) {
    throw new Error(`${field} must be a valid ISO calendar date (YYYY-MM-DD): ${value}`);
  }
  return timestamp;
}

function getSourceAdvisories(sources: readonly FinancialRuleSource[]): SourceAdvisory[] {
  return sources.flatMap((source) => {
    if (source.accessedAt !== undefined) {
      parseIsoDate(source.accessedAt, "source accessedAt");
      return [];
    }
    return [{
    code: "missing-source-access-date" as const,
    message: `Source “${source.title}” has no access date; record one during a future source review.`,
    sourceReference: source.reference,
    }];
  });
}

function statusPriority(status: MaintenanceStatus, policy: RuleSetMaintenancePolicy): MaintenancePriority {
  if (status === "period-review-required") return "P0";
  if (status === "review-overdue") return policy.priority;
  if (status === "review-due") return "P2";
  return "P3";
}

export function getRuleSetMaintenanceStatus(
  ruleSet: FinancialRuleSet<unknown>,
  policy: RuleSetMaintenancePolicy,
  referenceDate: string,
): RuleSetMaintenanceEvaluation {
  if (policy.overdueAfterDays <= policy.reviewAfterDays) throw new Error("overdueAfterDays must be greater than reviewAfterDays");
  const referenceTimestamp = parseIsoDate(referenceDate, "referenceDate");
  const verifiedTimestamp = parseIsoDate(ruleSet.lastVerified, "lastVerified");
  const ageDays = (referenceTimestamp - verifiedTimestamp) / DAY_MS;
  if (ageDays < 0) throw new Error(`referenceDate precedes lastVerified for ${ruleSet.id}`);

  let status: MaintenanceStatus;
  const reasons: MaintenanceReason[] = [];
  const period = policy.period;
  let periodReviewRequired = false;
  if (period) {
    const financialYearEnd = parseIsoDate(period.financialYearEndsOn, "financialYearEndsOn");
    const assessmentYearEnd = parseIsoDate(period.assessmentYearEndsOn, "assessmentYearEndsOn");
    if (assessmentYearEnd <= financialYearEnd) throw new Error("assessmentYearEndsOn must follow financialYearEndsOn");
    periodReviewRequired = period.intendedUse === "current-calculation" && referenceTimestamp > financialYearEnd;
    if (period.intendedUse === "filing-period") periodReviewRequired = referenceTimestamp > assessmentYearEnd;
    if (periodReviewRequired) reasons.push({
      code: "financial-year-rollover",
      message: `The applicable financial year ended on ${period.financialYearEndsOn}; ${period.intendedUse} requires review after that period.`,
    });
  }

  if (periodReviewRequired) status = "period-review-required";
  else if (ageDays >= policy.overdueAfterDays) status = "review-overdue";
  else if (ageDays >= policy.reviewAfterDays) status = "review-due";
  else status = "current";

  if (ageDays >= policy.overdueAfterDays) reasons.push({
    code: "overdue-age",
    message: `Verified ${ageDays} days ago; review is overdue at ${policy.overdueAfterDays} days under this policy.`,
  });
  else reasons.push({
    code: "verified-age",
    message: `Verified ${ageDays} days ago; review policy recommends review after ${policy.reviewAfterDays} days.`,
  });

  if ("recommendedInterestStatus" in (ruleSet.rules as object)
    && (ruleSet.rules as { recommendedInterestStatus?: string }).recommendedInterestStatus === "cbt-recommendation-pending-government-notification") {
    reasons.push({
      code: "pending-notification",
      message: "The rule set records an annual-interest recommendation pending Government notification at its last verification.",
    });
  }

  const sourceAdvisories = getSourceAdvisories(ruleSet.sources);
  return {
    status,
    priority: statusPriority(status, policy),
    lastVerified: ruleSet.lastVerified,
    ageDays,
    applicablePeriod: ruleSet.effectivePeriod,
    reasons,
    sourceAdvisories,
  };
}

function findRuleSet(ruleSetId: string): FinancialRuleSet<unknown> | undefined {
  return (Object.values(financialRuleSets) as FinancialRuleSet<unknown>[]).find(({ id }) => id === ruleSetId);
}

function isRuleSetId(value: string): value is RuleSetId {
  return value in ruleSetMaintenancePolicies;
}

export function getArticleMaintenanceStatus(article: Article, referenceDate: string): ArticleMaintenanceEvaluation | null {
  if (article.maintenance.kind === "evergreen") return null;
  if (!article.maintenance.ruleSetId) throw new Error(`Article-local maintenance policy is required for ${article.slug}`);
  const ruleSet = findRuleSet(article.maintenance.ruleSetId);
  if (!ruleSet || !isRuleSetId(ruleSet.id)) throw new Error(`Unknown rule set for ${article.slug}: ${article.maintenance.ruleSetId}`);
  const ruleSetId = ruleSet.id;
  return { ruleSetId, ...getRuleSetMaintenanceStatus(ruleSet, ruleSetMaintenancePolicies[ruleSetId], referenceDate) };
}

export function buildMaintenanceReport(referenceDate: string): readonly MaintenanceReportRow[] {
  return Object.values(financialRuleSets).map((ruleSet) => {
    if (!isRuleSetId(ruleSet.id)) throw new Error(`Missing maintenance policy for rule set: ${ruleSet.id}`);
    const ruleSetId = ruleSet.id;
    const policy = ruleSetMaintenancePolicies[ruleSetId];
    const articleSlugs = articles
      .filter((article) => article.maintenance.kind === "rule-sensitive" && article.maintenance.ruleSetId === ruleSetId)
      .map(({ slug }) => slug);
    const dependentCalculators = policy.calculators.filter((slug) => calculators[slug] !== undefined);
    if (dependentCalculators.length !== policy.calculators.length) throw new Error(`Unknown dependent calculator for rule set: ${ruleSet.id}`);
    return {
      ruleSetId,
      ...getRuleSetMaintenanceStatus(ruleSet, policy, referenceDate),
      calculators: dependentCalculators,
      articleSlugs,
      eventHints: policy.eventHints,
    };
  });
}
