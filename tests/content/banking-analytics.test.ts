import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { articles } from "../../lib/content/articles";
import { calculators } from "../../lib/content/calculators";
import { trackEvent, type AnalyticsEventParameters, type TrackedLinkMetadata } from "../../lib/analytics";

vi.mock("@/lib/analytics", async () => import("../../lib/analytics"));
vi.mock("@/lib/content/articles", async () => import("../../lib/content/articles"));
vi.mock("@/lib/content/calculators", async () => import("../../lib/content/calculators"));
vi.mock("@/lib/content/discovery", async () => import("../../lib/content/discovery"));
vi.mock("@/lib/content/seo", async () => import("../../lib/content/seo"));
vi.mock("@/lib/content/site", async () => import("../../lib/content/site"));
vi.mock("@/lib/content/maintenance", async () => import("../../lib/content/maintenance"));
const renderedLinks = vi.hoisted(() => [] as { href: string; analytics: TrackedLinkMetadata }[]);
// Observe the client boundary while rendering the real shared server components.
vi.mock("@/components/analytics/TrackedLink", () => ({
  TrackedLink: ({ href, analytics, children }: { href: string; analytics: TrackedLinkMetadata; children: ReactNode }) => {
    renderedLinks.push({ href, analytics });
    return createElement("a", { href }, children);
  },
}));
import { ArticleLayout } from "../../components/article/ArticleLayout";
import { CalculatorRelatedContent } from "../../components/calculator/CalculatorRelatedContent";

const forward = [
  ["fixed-deposit-explained", "fd", "primary_callout"],
  ["fixed-deposit-explained", "fd", "article_callout"],
  ["fd-interest-calculation", "fd", "primary_callout"],
  ["fd-interest-calculation", "fd", "article_callout"],
  ["fd-vs-rd", "fd", "primary_callout"],
  ["fd-vs-rd", "fd", "article_callout"],
  ["fd-vs-rd", "rd", "article_callout"],
  ["fd-vs-rd", "rd", "related_calculator_card"],
  ["premature-fd-withdrawal", "fd", "primary_callout"],
  ["premature-fd-withdrawal", "fd", "article_callout"],
  ["rd-explained", "rd", "primary_callout"],
  ["rd-explained", "rd", "article_body"],
  ["rd-interest-calculation", "rd", "primary_callout"],
  ["rd-interest-calculation", "rd", "article_body"],
  ["rd-calculator-projection-vs-actual-maturity", "rd", "primary_callout"],
  ["rd-calculator-projection-vs-actual-maturity", "rd", "article_body"],
] as const;
const reverse = [
  ["fixed-deposit-explained", "fd", "guide_card"],
  ["fd-interest-calculation", "fd", "guide_card"],
  ["fd-vs-rd", "fd", "guide_card"],
  ["rd-explained", "rd", "guide_card"],
  ["rd-interest-calculation", "rd", "guide_card"],
  ["rd-calculator-projection-vs-actual-maturity", "rd", "guide_card"],
] as const;
const guideEvent = "banking_guide_calculator_click";
const calculatorEvent = "banking_calculator_guide_click";
const payload = ([article_slug, calculator_slug, placement]: readonly string[]) => ({ article_slug, calculator_slug, placement });
const keys = ["article_slug", "calculator_slug", "placement"];

function capture() {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "G-TEST123");
  const gtag = vi.fn();
  vi.stubGlobal("window", { gtag });
  return gtag;
}
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  renderedLinks.length = 0;
});

describe("Banking analytics exact contracts", () => {
  for (const [event, tuples] of [[guideEvent, forward], [calculatorEvent, reverse]] as const) {
    it.each(tuples.map((tuple) => payload(tuple)))(`${event}: $article_slug / $calculator_slug / $placement`, (parameters) => {
      const gtag = capture();
      expect(trackEvent(event, parameters as never)).toBe(true);
      expect(gtag.mock.calls).toEqual([["event", event, parameters]]);
      expect(Object.keys(gtag.mock.calls[0][2]).sort()).toEqual(keys);
      expect(gtag.mock.calls[0][2]).not.toBe(parameters);
    });

    it(`${event}: rejects every unapproved combination of bounded identifiers`, () => {
      const gtag = capture();
      for (const article of new Set(forward.map((tuple) => tuple[0]))) {
        for (const calculator of ["fd", "rd", "ppf"]) {
          for (const placement of ["primary_callout", "article_callout", "article_body", "related_calculator_card", "guide_card"]) {
            if (tuples.some((tuple) => tuple[0] === article && tuple[1] === calculator && tuple[2] === placement)) continue;
            expect(trackEvent(event, payload([article, calculator, placement]) as never)).toBe(false);
          }
        }
      }
      expect(gtag).not.toHaveBeenCalled();
    });

    it(`${event}: rejects missing keys, malformed values and cross-vertical identities`, () => {
      const gtag = capture();
      const valid = payload(tuples[0]);
      for (const key of keys) {
        const missing: Record<string, unknown> = { ...valid };
        delete missing[key];
        expect(trackEvent(event, missing as never)).toBe(false);
        for (const value of [undefined, null, true, 123, [], {}, { toString: () => valid[key as keyof typeof valid] }, "arbitrary text", "/calculators/fd?private=synthetic"]) {
          expect(trackEvent(event, { ...valid, [key]: value } as never)).toBe(false);
        }
      }
      for (const article_slug of ["ppf-explained", "ppf-interest-calculation", "ppf-tenure-extension", "ppf-calculator-projection-vs-actual-maturity", "home-loan-guide", "new-tax-regime-slab-calculation", "unknown-banking-guide"]) {
        expect(trackEvent(event, { ...valid, article_slug } as never)).toBe(false);
      }
      for (const calculator_slug of ["ppf", "home-loan", "income-tax", "invalid"]) {
        expect(trackEvent(event, { ...valid, calculator_slug } as never)).toBe(false);
      }
      for (const invalid of [null, undefined, [], "arbitrary", Object.create(valid)]) expect(trackEvent(event, invalid as never)).toBe(false);
      expect(gtag).not.toHaveBeenCalled();
    });

    it.each(["extra", "deposit_amount", "principal", "monthlyDeposit", "annualInterestRate", "tenureYears", "compoundingFrequency", "maturityAmount", "interestEarned", "difference", "penalty", "closureDate", "result", "isValid", "range", "bucket", "age", "tax", "text", "url", "pathname", "searchParams", "localStorage", "sessionStorage", "cookies", "email", "phone"])(`${event}: rejects unexpected %s`, (key) => {
      const gtag = capture();
      for (const value of [123, "synthetic-private-value", true]) {
        expect(trackEvent(event, { ...payload(tuples[0]), [key]: value } as never)).toBe(false);
      }
      expect(gtag).not.toHaveBeenCalled();
    });

    it(`${event}: rejects hidden and symbol extra keys`, () => {
      const gtag = capture();
      const hidden = Object.defineProperty(payload(tuples[0]), "extra", { value: "synthetic" });
      expect(trackEvent(event, hidden as never)).toBe(false);
      expect(trackEvent(event, { ...payload(tuples[0]), [Symbol("extra")]: "synthetic" } as never)).toBe(false);
      expect(gtag).not.toHaveBeenCalled();
    });
  }

  it("does not enable additional Banking events", () => {
    const gtag = capture();
    for (const event of ["banking_calculation", "banking_comparison_open", "banking_result", "banking_cta_click", "toString"]) {
      expect(trackEvent(event as never, payload(forward[0]) as never)).toBe(false);
    }
    expect(gtag).not.toHaveBeenCalled();
  });

  it("remains disabled outside configured production and when analytics is absent", () => {
    const gtag = capture();
    for (const NODE_ENV of ["development", "test"]) {
      vi.stubEnv("NODE_ENV", NODE_ENV);
      expect(trackEvent(guideEvent, payload(forward[0]) as never)).toBe(false);
    }
    vi.stubEnv("NODE_ENV", "production");
    for (const id of ["", "invalid"]) {
      vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", id);
      expect(trackEvent(calculatorEvent, payload(reverse[0]) as never)).toBe(false);
    }
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "G-TEST123");
    vi.stubGlobal("window", {});
    expect(trackEvent(guideEvent, payload(forward[0]) as never)).toBe(false);
    vi.stubGlobal("window", undefined);
    expect(trackEvent(calculatorEvent, payload(reverse[0]) as never)).toBe(false);
    expect(gtag).not.toHaveBeenCalled();
  });

  it("retains compile-time tuple constraints", () => {
    if (false) {
      // @ts-expect-error An RD guide cannot link to FD in this contract.
      const wrongRelationship: AnalyticsEventParameters[typeof guideEvent] = { article_slug: "rd-explained", calculator_slug: "fd", placement: "primary_callout" };
      // @ts-expect-error This RD primary callout is not rendered.
      const wrongPlacement: AnalyticsEventParameters[typeof guideEvent] = { article_slug: "fd-vs-rd", calculator_slug: "rd", placement: "primary_callout" };
      // @ts-expect-error FD does not render this guide card.
      const wrongReverse: AnalyticsEventParameters[typeof calculatorEvent] = { article_slug: "premature-fd-withdrawal", calculator_slug: "fd", placement: "guide_card" };
      // @ts-expect-error No extra payload fields.
      trackEvent(guideEvent, { article_slug: "rd-explained", calculator_slug: "rd", placement: "primary_callout", principal: 123 });
      void [wrongRelationship, wrongPlacement, wrongReverse];
    }
  });
});

describe("Banking rendered link coverage", () => {
  it.each([...new Set(forward.map((tuple) => tuple[0]))])("instruments every approved calculator link in %s", (slug) => {
    const article = articles.find((item) => item.slug === slug)!;
    const html = renderToStaticMarkup(createElement(ArticleLayout, { article }));
    const expected = forward.filter((tuple) => tuple[0] === slug);
    expect(renderedLinks).toEqual(expected.map((tuple) => ({ href: `/calculators/${tuple[1]}`, analytics: { eventName: guideEvent, parameters: payload(tuple) } })));
    // Counts actual destination anchors, catching untracked duplicate surfaces too.
    expect(html.match(/href="\/calculators\/(?:fd|rd)"/g)).toHaveLength(expected.length);
  });

  it.each(["fd", "rd"] as const)("instruments exactly the curated guide cards for %s", (slug) => {
    const html = renderToStaticMarkup(createElement(CalculatorRelatedContent, { slug }));
    const expected = reverse.filter((tuple) => tuple[1] === slug);
    expect(renderedLinks).toEqual(expected.map((tuple) => ({ href: `/learn/banking/${tuple[0]}`, analytics: { eventName: calculatorEvent, parameters: payload(tuple) } })));
    expect(html.match(/href="\/learn\/banking\/[^"]+"/g)).toHaveLength(3);
  });

  it("keeps every other article and calculator outside Banking tracking", () => {
    for (const article of articles.filter((article) => !forward.some((tuple) => tuple[0] === article.slug))) {
      renderToStaticMarkup(createElement(ArticleLayout, { article }));
    }
    for (const slug of Object.keys(calculators) as (keyof typeof calculators)[]) {
      if (slug !== "fd" && slug !== "rd") renderToStaticMarkup(createElement(CalculatorRelatedContent, { slug }));
    }
    expect(renderedLinks.filter((link) => link.analytics.eventName.startsWith("banking_"))).toEqual([]);
    expect(renderedLinks.some((link) => link.analytics.eventName === "guide_calculator_click")).toBe(true);
    expect(renderedLinks.some((link) => link.analytics.eventName === "tax_guide_calculator_click")).toBe(true);
    expect(renderedLinks.some((link) => link.analytics.eventName === "calculator_guide_click")).toBe(true);
    expect(renderedLinks.some((link) => link.analytics.eventName === "tax_calculator_guide_click")).toBe(true);
  });
});
