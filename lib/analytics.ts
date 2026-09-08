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

export type AnalyticsEventParameters = {
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
  if (key === "article_slug") {
    return eventName === "guide_calculator_click"
      ? isHomeLoanPrimaryArticleSlug(String(value))
      : isHomeLoanGuideCardSlug(String(value));
  }
  return isAllowedValue(key, value);
}

function isAllowedEventParameters(eventName: AnalyticsEventName, parameters: Record<string, unknown>) {
  return EVENT_PARAMETER_KEYS[eventName].every((key) => isAllowedEventParameter(eventName, String(key), parameters[String(key)]));
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
  if (process.env.NODE_ENV !== "production" || !getGoogleAnalyticsMeasurementId() || typeof window === "undefined" || typeof window.gtag !== "function") return false;

  const source = parameters as unknown as Record<string, unknown>;
  if (!isAllowedEventParameters(eventName, source)) return false;

  const safeParameters = Object.fromEntries(EVENT_PARAMETER_KEYS[eventName].map((key) => [String(key), source[String(key)]])) as Record<string, string>;
  window.gtag("event", eventName, safeParameters);
  return true;
}

export function isHomeLoanPrimaryArticleSlug(value: string): value is HomeLoanPrimaryArticleSlug {
  return ALLOWED_EVENT_VALUES.article_slug.has(value as never);
}

export function isHomeLoanGuideCardSlug(value: string): value is HomeLoanGuideCardSlug {
  return value === "home-loan-guide" || value === "home-loan-emi-calculation" || value === "home-loan-tenure-comparison" || value === "when-home-loan-emi-starts";
}
