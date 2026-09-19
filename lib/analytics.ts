const GA4_MEASUREMENT_ID = /^G-[A-Z0-9]+$/;

export type HomeLoanPrimaryArticleSlug =
  | "home-loan-guide"
  | "home-loan-emi-calculation"
  | "home-loan-tenure-comparison"
  | "when-home-loan-emi-starts"
  | "home-loan-prepayment";

export type HomeLoanGuideCardSlug =
  | "home-loan-guide"
  | "home-loan-emi-calculation"
  | "home-loan-tenure-comparison"
  | "when-home-loan-emi-starts";

const TAX_ARTICLE_SLUGS = [
  "new-tax-regime-slab-calculation",
  "section-87a-rebate",
  "gross-income-vs-taxable-income",
  "health-education-cess-calculation",
  "income-tax-calculator-vs-payroll-tds",
] as const;
export type TaxArticleSlug = typeof TAX_ARTICLE_SLUGS[number];

const BANKING_GUIDE_TUPLES = [
  { article_slug: "fixed-deposit-explained", calculator_slug: "fd", placement: "primary_callout" },
  { article_slug: "fixed-deposit-explained", calculator_slug: "fd", placement: "article_callout" },
  { article_slug: "fd-interest-calculation", calculator_slug: "fd", placement: "primary_callout" },
  { article_slug: "fd-interest-calculation", calculator_slug: "fd", placement: "article_callout" },
  { article_slug: "fd-vs-rd", calculator_slug: "fd", placement: "primary_callout" },
  { article_slug: "fd-vs-rd", calculator_slug: "fd", placement: "article_callout" },
  { article_slug: "fd-vs-rd", calculator_slug: "rd", placement: "article_callout" },
  { article_slug: "fd-vs-rd", calculator_slug: "rd", placement: "related_calculator_card" },
  { article_slug: "premature-fd-withdrawal", calculator_slug: "fd", placement: "primary_callout" },
  { article_slug: "premature-fd-withdrawal", calculator_slug: "fd", placement: "article_callout" },
  { article_slug: "rd-explained", calculator_slug: "rd", placement: "primary_callout" },
  { article_slug: "rd-explained", calculator_slug: "rd", placement: "article_body" },
  { article_slug: "rd-interest-calculation", calculator_slug: "rd", placement: "primary_callout" },
  { article_slug: "rd-interest-calculation", calculator_slug: "rd", placement: "article_body" },
  { article_slug: "rd-calculator-projection-vs-actual-maturity", calculator_slug: "rd", placement: "primary_callout" },
  { article_slug: "rd-calculator-projection-vs-actual-maturity", calculator_slug: "rd", placement: "article_body" },
] as const;

const BANKING_CALCULATOR_TUPLES = [
  { article_slug: "fixed-deposit-explained", calculator_slug: "fd", placement: "guide_card" },
  { article_slug: "fd-interest-calculation", calculator_slug: "fd", placement: "guide_card" },
  { article_slug: "fd-vs-rd", calculator_slug: "fd", placement: "guide_card" },
  { article_slug: "rd-explained", calculator_slug: "rd", placement: "guide_card" },
  { article_slug: "rd-interest-calculation", calculator_slug: "rd", placement: "guide_card" },
  { article_slug: "rd-calculator-projection-vs-actual-maturity", calculator_slug: "rd", placement: "guide_card" },
] as const;

type BankingGuideParameters = typeof BANKING_GUIDE_TUPLES[number];
type BankingCalculatorParameters = typeof BANKING_CALCULATOR_TUPLES[number];
export type BankingArticleSlug = BankingGuideParameters["article_slug"];
type BankingGuidePlacement = BankingGuideParameters["placement"];

export function isBankingArticleSlug(value: string): value is BankingArticleSlug {
  return BANKING_GUIDE_TUPLES.some((tuple) => tuple.article_slug === value);
}

// Validate complete tuples, never the independent article/calculator cross-product.
// Banking rejects the entire payload on any missing or unexpected own key.
function isBankingParameters<T extends BankingGuideParameters | BankingCalculatorParameters>(
  parameters: unknown,
  tuples: readonly T[],
): parameters is T {
  if (!parameters || typeof parameters !== "object") return false;
  const keys = Reflect.ownKeys(parameters);
  const source = parameters as Record<string, unknown>;
  const required = ["article_slug", "calculator_slug", "placement"] as const;
  if (keys.length !== required.length || !required.every((key) => Object.hasOwn(source, key) && typeof source[key] === "string")) return false;
  return tuples.some((tuple) => required.every((key) => source[key] === tuple[key]));
}

export function getBankingGuideLink(articleSlug: BankingArticleSlug | undefined, calculatorSlug: string, placement: BankingGuidePlacement) {
  const parameters = { article_slug: articleSlug, calculator_slug: calculatorSlug, placement };
  return isBankingParameters(parameters, BANKING_GUIDE_TUPLES)
    ? { eventName: "banking_guide_calculator_click" as const, parameters }
    : undefined;
}

export function getBankingCalculatorLink(calculatorSlug: string, articleSlug: string) {
  const parameters = { article_slug: articleSlug, calculator_slug: calculatorSlug, placement: "guide_card" };
  return isBankingParameters(parameters, BANKING_CALCULATOR_TUPLES)
    ? { eventName: "banking_calculator_guide_click" as const, parameters }
    : undefined;
}

export type AnalyticsEventParameters = {
  banking_guide_calculator_click: BankingGuideParameters;
  banking_calculator_guide_click: BankingCalculatorParameters;
  tax_guide_calculator_click: {
    article_slug: TaxArticleSlug;
    calculator_slug: "income-tax";
    placement: "primary_callout";
  };
  tax_calculator_guide_click: {
    calculator_slug: "income-tax";
    article_slug: TaxArticleSlug;
    placement: "guide_card" | "comparison_context";
  };
  tax_comparison_open: {
    calculator_slug: "income-tax";
    comparison_mode: "regime";
  };
  tax_comparison_used: {
    calculator_slug: "income-tax";
    comparison_mode: "regime";
  };
  guide_calculator_click: {
    article_slug: HomeLoanPrimaryArticleSlug;
    calculator_slug: "home-loan";
    placement: "primary_callout";
  };
  calculator_guide_click: {
    calculator_slug: "home-loan";
    article_slug: HomeLoanGuideCardSlug;
    placement: "guide_card";
  };
  loan_comparison_open: {
    calculator_slug: "home-loan";
    comparison_mode: "tenure_rate";
  };
  loan_comparison_used: {
    calculator_slug: "home-loan";
    comparison_mode: "tenure_rate";
  };
};

export type AnalyticsEventName = keyof AnalyticsEventParameters;

export type TrackedLinkMetadata =
  | { eventName: "banking_guide_calculator_click"; parameters: BankingGuideParameters }
  | { eventName: "banking_calculator_guide_click"; parameters: BankingCalculatorParameters }
  | { eventName: "tax_guide_calculator_click"; parameters: AnalyticsEventParameters["tax_guide_calculator_click"] }
  | { eventName: "tax_calculator_guide_click"; parameters: AnalyticsEventParameters["tax_calculator_guide_click"] }
  | { eventName: "guide_calculator_click"; parameters: AnalyticsEventParameters["guide_calculator_click"] }
  | { eventName: "calculator_guide_click"; parameters: AnalyticsEventParameters["calculator_guide_click"] };

type AnalyticsEnvironment = {
  NODE_ENV?: string;
  NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;
};

export function getGoogleAnalyticsMeasurementId(
  environment: AnalyticsEnvironment = process.env,
) {
  if (environment.NODE_ENV !== "production") return null;

  const measurementId = environment.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  return measurementId && GA4_MEASUREMENT_ID.test(measurementId)
    ? measurementId
    : null;
}

const EVENT_PARAMETER_KEYS: { [Name in AnalyticsEventName]: readonly (keyof AnalyticsEventParameters[Name])[] } = {
  banking_guide_calculator_click: ["article_slug", "calculator_slug", "placement"],
  banking_calculator_guide_click: ["article_slug", "calculator_slug", "placement"],
  tax_guide_calculator_click: ["article_slug", "calculator_slug", "placement"],
  tax_calculator_guide_click: ["calculator_slug", "article_slug", "placement"],
  tax_comparison_open: ["calculator_slug", "comparison_mode"],
  tax_comparison_used: ["calculator_slug", "comparison_mode"],
  guide_calculator_click: ["article_slug", "calculator_slug", "placement"],
  calculator_guide_click: ["calculator_slug", "article_slug", "placement"],
  loan_comparison_open: ["calculator_slug", "comparison_mode"],
  loan_comparison_used: ["calculator_slug", "comparison_mode"],
};

const ALLOWED_EVENT_VALUES = {
  calculator_slug: new Set(["home-loan"]),
  placement: new Set(["primary_callout", "guide_card"]),
  comparison_mode: new Set(["tenure_rate"]),
  article_slug: new Set([
    "home-loan-guide",
    "home-loan-emi-calculation",
    "home-loan-tenure-comparison",
    "when-home-loan-emi-starts",
    "home-loan-prepayment",
  ]),
} as const;

function isAllowedValue(key: string, value: unknown): value is string {
  const allowed = ALLOWED_EVENT_VALUES[key as keyof typeof ALLOWED_EVENT_VALUES];
  return typeof value === "string" && Boolean(allowed?.has(value as never));
}

function isAllowedEventParameter(eventName: AnalyticsEventName, key: string, value: unknown) {
  if (eventName === "tax_guide_calculator_click" || eventName === "tax_calculator_guide_click" || eventName === "tax_comparison_open" || eventName === "tax_comparison_used") {
    if (key === "calculator_slug") return value === "income-tax";
    if (key === "comparison_mode") return value === "regime";
    if (key === "article_slug") return typeof value === "string" && isTaxArticleSlug(value);
    if (key === "placement") return eventName === "tax_guide_calculator_click" ? value === "primary_callout" : value === "guide_card" || value === "comparison_context";
    return false;
  }
  if (key === "article_slug") {
    return eventName === "guide_calculator_click"
      ? isHomeLoanPrimaryArticleSlug(String(value))
      : isHomeLoanGuideCardSlug(String(value));
  }
  return isAllowedValue(key, value);
}

function isAllowedEventParameters(eventName: AnalyticsEventName, parameters: Record<string, unknown>) {
  if (!Object.hasOwn(EVENT_PARAMETER_KEYS, eventName)) return false;
  if (eventName === "banking_guide_calculator_click") return isBankingParameters(parameters, BANKING_GUIDE_TUPLES);
  if (eventName === "banking_calculator_guide_click") return isBankingParameters(parameters, BANKING_CALCULATOR_TUPLES);
  // Tax events reject extra keys entirely, including accidental financial data.
  // The established Home Loan filtering behavior stays unchanged.
  if (eventName.startsWith("tax_") && Object.keys(parameters).some((key) => !(EVENT_PARAMETER_KEYS[eventName] as readonly string[]).includes(key))) return false;
  return EVENT_PARAMETER_KEYS[eventName].every((key) => isAllowedEventParameter(eventName, String(key), parameters[String(key)]));
}

function getClientGoogleAnalyticsMeasurementId() {
  if (process.env.NODE_ENV !== "production") return null;

  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  return measurementId && GA4_MEASUREMENT_ID.test(measurementId)
    ? measurementId
    : null;
}

declare global {
  interface Window {
    gtag?: (command: "event", eventName: AnalyticsEventName, parameters: Record<string, string>) => void;
  }
}

export function trackEvent<Name extends AnalyticsEventName>(
  eventName: Name,
  parameters: AnalyticsEventParameters[Name],
) {
  if (!getClientGoogleAnalyticsMeasurementId() || typeof window === "undefined" || typeof window.gtag !== "function") return false;

  const source = parameters as unknown as Record<string, unknown>;
  if (!isAllowedEventParameters(eventName, source)) return false;

  const safeParameters = Object.fromEntries(EVENT_PARAMETER_KEYS[eventName].map((key) => [String(key), source[String(key)]])) as Record<string, string>;
  window.gtag("event", eventName, safeParameters);
  return true;
}

export function isHomeLoanPrimaryArticleSlug(value: string): value is HomeLoanPrimaryArticleSlug {
  return ALLOWED_EVENT_VALUES.article_slug.has(value as never);
}

export function isTaxArticleSlug(value: string): value is TaxArticleSlug {
  return (TAX_ARTICLE_SLUGS as readonly string[]).includes(value);
}

export function isHomeLoanGuideCardSlug(value: string): value is HomeLoanGuideCardSlug {
  return value === "home-loan-guide" || value === "home-loan-emi-calculation" || value === "home-loan-tenure-comparison" || value === "when-home-loan-emi-starts";
}
