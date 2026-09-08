import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getGoogleAnalyticsMeasurementId, trackEvent } from "../../lib/analytics";

const analyticsSource = readFileSync("components/site/GoogleAnalytics.tsx", "utf8");
const layoutSource = readFileSync("app/layout.tsx", "utf8");
const privacySource = readFileSync("app/privacy/page.tsx", "utf8");
const calculatorSources = [
  "components/calculator/ExpandedCalculator.tsx",
  "components/calculator/FdCalculator.tsx",
  "components/calculator/LoanCalculator.tsx",
  "components/calculator/RuleDrivenCalculator.tsx",
  "components/calculator/SipCalculator.tsx",
].map((path) => readFileSync(path, "utf8")).join("\n");
const analyticsHelperSource = readFileSync("lib/analytics.ts", "utf8");

afterEach(() => {
  vi.unstubAllEnvs();
  delete (globalThis as { window?: unknown }).window;
});

describe("Google Analytics configuration boundary", () => {
  it("only resolves a valid GA4 measurement ID in production", () => {
    const validId = `G-${"A".repeat(10)}`;
    expect(getGoogleAnalyticsMeasurementId({ NODE_ENV: "production", NEXT_PUBLIC_GA_MEASUREMENT_ID: validId })).toBe(validId);
    expect(getGoogleAnalyticsMeasurementId({ NODE_ENV: "production" })).toBeNull();
    expect(getGoogleAnalyticsMeasurementId({ NODE_ENV: "production", NEXT_PUBLIC_GA_MEASUREMENT_ID: "invalid" })).toBeNull();
    expect(getGoogleAnalyticsMeasurementId({ NODE_ENV: "development", NEXT_PUBLIC_GA_MEASUREMENT_ID: validId })).toBeNull();
    expect(getGoogleAnalyticsMeasurementId({ NODE_ENV: "test", NEXT_PUBLIC_GA_MEASUREMENT_ID: validId })).toBeNull();
  });

  it("mounts one non-blocking GA loader without manual page-view events", () => {
    expect(layoutSource.match(/<GoogleAnalytics \/>/g)).toHaveLength(1);
    expect(analyticsSource.match(/googletagmanager\.com\/gtag\/js/g)).toHaveLength(1);
    expect(analyticsSource.match(/gtag\('config'/g)).toHaveLength(1);
    expect(analyticsSource).toContain('strategy="afterInteractive"');
    expect(analyticsSource).not.toContain("gtag('event'");
    expect(analyticsSource).not.toMatch(/G-[A-Z0-9]{6,}/);
  });

  it("does not add calculator-value tracking and preserves the truthful privacy disclosure", () => {
    expect(calculatorSources).not.toMatch(/gtag|dataLayer|GoogleAnalytics/);
    expect(privacySource).toContain("ArthaSiddhi uses Google Analytics");
    expect(privacySource).not.toMatch(/Google Signals|User-ID|remarketing|consent mode/i);
  });

  it("forwards only the fixed allowlisted event payload", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "G-TEST123");
    const calls: unknown[][] = [];
    (globalThis as { window?: { gtag: (...args: unknown[]) => void } }).window = { gtag: (...args) => calls.push(args) };

    expect(trackEvent("guide_calculator_click", { article_slug: "home-loan-guide", calculator_slug: "home-loan", placement: "primary_callout" })).toBe(true);
    expect(calls).toEqual([["event", "guide_calculator_click", { article_slug: "home-loan-guide", calculator_slug: "home-loan", placement: "primary_callout" }]]);
    expect(analyticsHelperSource).not.toMatch(/["'](?:amount|principal|annualInterestRate|tenureYears|monthlyEmi|totalInterest|totalPayment|balance|income|salary|age|email|phone)["']/);
  });

  it("is safe when gtag or analytics configuration is unavailable", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "G-TEST123");
    (globalThis as { window?: unknown }).window = {};
    expect(() => trackEvent("loan_comparison_open", { calculator_slug: "home-loan", comparison_mode: "tenure_rate" })).not.toThrow();
    expect(trackEvent("loan_comparison_open", { calculator_slug: "home-loan", comparison_mode: "tenure_rate" })).toBe(false);

    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "invalid");
    expect(trackEvent("loan_comparison_open", { calculator_slug: "home-loan", comparison_mode: "tenure_rate" })).toBe(false);
  });

  it("filters unexpected runtime keys instead of forwarding arbitrary payloads", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "G-TEST123");
    const calls: unknown[][] = [];
    (globalThis as { window?: { gtag: (...args: unknown[]) => void } }).window = { gtag: (...args) => calls.push(args) };
    expect(trackEvent("loan_comparison_used", { calculator_slug: "home-loan", comparison_mode: "tenure_rate", emi: 123 } as never)).toBe(true);
    expect(calls).toEqual([["event", "loan_comparison_used", { calculator_slug: "home-loan", comparison_mode: "tenure_rate" }]]);
    expect(trackEvent("calculator_guide_click", { calculator_slug: "home-loan", article_slug: "home-loan-prepayment", placement: "guide_card" } as never)).toBe(false);
  });
});
