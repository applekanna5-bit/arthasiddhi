import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getGoogleAnalyticsMeasurementId, isTaxArticleSlug, trackEvent, type AnalyticsEventParameters } from "../../lib/analytics";
import { articles } from "../../lib/content/articles";

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

describe("Tax analytics contracts and privacy", () => {
  const slugs = ["new-tax-regime-slab-calculation", "section-87a-rebate", "gross-income-vs-taxable-income", "health-education-cess-calculation", "income-tax-calculator-vs-payroll-tds"] as const;
  const comparison = { calculator_slug: "income-tax", comparison_mode: "regime" } as const;
  function capture() {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "G-TEST123");
    const calls: unknown[][] = [];
    (globalThis as { window?: { gtag: (...args: unknown[]) => void } }).window = { gtag: (...args) => calls.push(args) };
    return calls;
  }

  it("bounds Tax articles to the existing Income Tax cluster", () => {
    expect(articles.filter(({ slug }) => isTaxArticleSlug(slug)).map(({ slug }) => slug).sort()).toEqual([...slugs].sort());
    expect(articles.filter(({ primaryCalculator }) => primaryCalculator === "income-tax").map(({ slug }) => slug).sort()).toEqual([...slugs].sort());
    expect(isTaxArticleSlug("gst-explained")).toBe(false);
    expect(isTaxArticleSlug("home-loan-guide")).toBe(false);
  });

  it.each(slugs)("sends only fixed link metadata for %s", (article_slug) => {
    const calls = capture();
    const primary = { article_slug, calculator_slug: "income-tax", placement: "primary_callout" } as const;
    expect(trackEvent("tax_guide_calculator_click", primary)).toBe(true);
    for (const placement of ["guide_card", "comparison_context"] as const) {
      const params = { calculator_slug: "income-tax", article_slug, placement } as const;
      expect(trackEvent("tax_calculator_guide_click", params)).toBe(true);
      expect(calls.at(-1)).toEqual(["event", "tax_calculator_guide_click", params]);
    }
    expect(calls[0]).toEqual(["event", "tax_guide_calculator_click", primary]);
  });

  it.each(["tax_comparison_open", "tax_comparison_used"] as const)("sends only fixed comparison metadata for %s", (event) => {
    const calls = capture();
    expect(trackEvent(event, comparison)).toBe(true);
    expect(calls).toEqual([["event", event, comparison]]);
  });

  it.each(["income", "taxableOrdinaryIncome", "gross_income", "salary", "age", "ageCategory", "regime", "deductions", "exemptions", "HRA", "standard_deduction", "rebate", "marginalRelief", "slab_tax", "cess", "totalTax", "effectiveTaxRate", "difference", "lower_regime", "range", "bucket", "is_lower", "error", "url", "email", "phone", "PAN", "text"])("rejects the entire Tax payload containing forbidden key %s", (key) => {
    const calls = capture();
    for (const value of [123456, "private-input", true]) {
      expect(trackEvent("tax_comparison_open", { ...comparison, [key]: value } as never)).toBe(false);
      expect(trackEvent("tax_comparison_used", { ...comparison, [key]: value } as never)).toBe(false);
      expect(trackEvent("tax_guide_calculator_click", { calculator_slug: "income-tax", article_slug: slugs[0], placement: "primary_callout", [key]: value } as never)).toBe(false);
      expect(trackEvent("tax_calculator_guide_click", { calculator_slug: "income-tax", article_slug: slugs[0], placement: "guide_card", [key]: value } as never)).toBe(false);
    }
    expect(calls).toEqual([]);
  });

  it("rejects arbitrary event names, values, cross-cluster metadata and wrong placements", () => {
    const calls = capture();
    for (const event of ["tax_income_1200000", "page_view", "arbitrary", "toString"]) expect(trackEvent(event as never, comparison as never)).toBe(false);
    for (const value of ["home-loan", "gst", "1200000", "old", "below-60", true, 42, { toString: () => "regime" }]) {
      expect(trackEvent("tax_comparison_open", { ...comparison, calculator_slug: value } as never)).toBe(false);
      expect(trackEvent("tax_comparison_used", { ...comparison, comparison_mode: value } as never)).toBe(false);
      expect(trackEvent("tax_calculator_guide_click", { calculator_slug: "income-tax", article_slug: value, placement: "guide_card" } as never)).toBe(false);
    }
    for (const placement of ["guide_card", "comparison_context", "arbitrary"]) expect(trackEvent("tax_guide_calculator_click", { calculator_slug: "income-tax", article_slug: slugs[0], placement } as never)).toBe(false);
    for (const placement of ["primary_callout", "arbitrary"]) expect(trackEvent("tax_calculator_guide_click", { calculator_slug: "income-tax", article_slug: slugs[0], placement } as never)).toBe(false);
    expect(calls).toEqual([]);
  });

  it("keeps all four Home Loan contracts unchanged and excludes Tax identifiers from them", () => {
    const calls = capture();
    const guide = { calculator_slug: "home-loan", article_slug: "home-loan-guide", placement: "primary_callout" } as const;
    const card = { ...guide, placement: "guide_card" } as const;
    const loan = { calculator_slug: "home-loan", comparison_mode: "tenure_rate" } as const;
    expect(trackEvent("guide_calculator_click", guide)).toBe(true);
    expect(trackEvent("calculator_guide_click", card)).toBe(true);
    expect(trackEvent("loan_comparison_open", loan)).toBe(true);
    expect(trackEvent("loan_comparison_used", loan)).toBe(true);
    expect(calls).toEqual([["event", "guide_calculator_click", guide], ["event", "calculator_guide_click", card], ["event", "loan_comparison_open", loan], ["event", "loan_comparison_used", loan]]);
    expect(trackEvent("loan_comparison_open", comparison as never)).toBe(false);
    expect(trackEvent("guide_calculator_click", { ...guide, article_slug: slugs[0] } as never)).toBe(false);
    expect(calls).toHaveLength(4);
  });

  it("retains compile-time constraints", () => {
    // This block is checked by tsc, never executed.
    if (false) {
      // @ts-expect-error No arbitrary events.
      trackEvent("tax_arbitrary", comparison);
      // @ts-expect-error No financial payload keys.
      trackEvent("tax_comparison_used", { ...comparison, income: 1 });
      // @ts-expect-error Tax calculator identity is fixed.
      trackEvent("tax_comparison_open", { calculator_slug: "home-loan", comparison_mode: "regime" });
      // @ts-expect-error No selected-regime value.
      trackEvent("tax_comparison_used", { calculator_slug: "income-tax", comparison_mode: "old" });
      // @ts-expect-error Article slugs are bounded.
      trackEvent("tax_guide_calculator_click", { calculator_slug: "income-tax", article_slug: "arbitrary", placement: "primary_callout" });
      // @ts-expect-error Placements are bounded per event.
      trackEvent("tax_calculator_guide_click", { calculator_slug: "income-tax", article_slug: slugs[0], placement: "primary_callout" });
      const params: AnalyticsEventParameters["tax_comparison_used"] = comparison;
      trackEvent("tax_comparison_used", params);
    }
  });
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
