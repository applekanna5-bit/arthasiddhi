import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getGoogleAnalyticsMeasurementId } from "../../lib/analytics";

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
});
