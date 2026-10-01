import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HOME_BUYING_JOURNEY_TUPLES, getHomeBuyingJourneyLink, trackEvent, type TrackedLinkMetadata } from "../../lib/analytics";
import { articles, getArticleBySlug } from "../../lib/content/articles";
import { getLearnCategoryHub } from "../../lib/content/discovery";

vi.mock("@/lib/analytics", async () => import("../../lib/analytics"));
vi.mock("@/lib/content/articles", async () => import("../../lib/content/articles"));
vi.mock("@/lib/content/calculators", async () => import("../../lib/content/calculators"));
vi.mock("@/lib/content/discovery", async () => import("../../lib/content/discovery"));
vi.mock("@/lib/content/seo", async () => import("../../lib/content/seo"));
vi.mock("@/lib/content/site", async () => import("../../lib/content/site"));
vi.mock("@/lib/content/maintenance", async () => import("../../lib/content/maintenance"));

const renderedLinks = vi.hoisted(() => [] as { href: string; analytics: TrackedLinkMetadata }[]);
vi.mock("@/components/analytics/TrackedLink", () => ({
  TrackedLink: ({ href, analytics, children }: { href: string; analytics: TrackedLinkMetadata; children: ReactNode }) => {
    renderedLinks.push({ href, analytics });
    return createElement("a", { href }, children);
  },
}));

import { ArticleLayout } from "../../components/article/ArticleLayout";
import { CalculatorRelatedContent } from "../../components/calculator/CalculatorRelatedContent";
import { GuideCollection, LearnTopicGroup } from "../../components/learn/LearnTopicGroup";

const eventName = "home_buying_journey_click" as const;
const link = <Source extends string, Destination extends string, Placement extends string>(source_slug: Source, destination_slug: Destination, placement: Placement) => ({ source_slug, destination_slug, placement });
const expectedTuples = [
  link("how-much-house-can-i-afford", "home-loan-down-payment", "article_body"),
  link("how-much-house-can-i-afford", "home-buying-costs-beyond-property-price", "article_body"),
  link("how-much-house-can-i-afford", "emergency-fund-before-home-loan", "article_body"),
  link("how-much-house-can-i-afford", "home-loan-tenure-comparison", "article_body"),
  link("how-much-house-can-i-afford", "home-loan", "article_callout"),
  link("home-loan-down-payment", "home-loan", "article_callout"),
  link("emergency-fund-before-home-loan", "home-loan", "article_callout"),
  link("home-loan-tenure-comparison", "home-loan-emi-calculation", "article_body"),
  link("home-loan-emi-calculation", "when-home-loan-emi-starts", "article_body"),
] as const;

function capture() {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "G-TEST123");
  const gtag = vi.fn();
  vi.stubGlobal("window", { gtag });
  return gtag;
}

function renderArticle(slug: string) {
  const article = articles.find((item) => item.slug === slug);
  expect(article).toBeDefined();
  return renderToStaticMarkup(createElement(ArticleLayout, { article: article! }));
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  renderedLinks.length = 0;
});

describe("Home Buying journey analytics exact contract", () => {
  it("defines exactly the nine approved complete tuples", () => {
    expect(HOME_BUYING_JOURNEY_TUPLES).toHaveLength(9);
    expect(HOME_BUYING_JOURNEY_TUPLES).toEqual(expectedTuples);
    expect(new Set(HOME_BUYING_JOURNEY_TUPLES.map(({ source_slug, destination_slug, placement }) => `${source_slug}|${destination_slug}|${placement}`)).size).toBe(9);
  });

  it.each(expectedTuples)("dispatches only the approved tuple $source_slug → $destination_slug", (parameters) => {
    const gtag = capture();
    expect(trackEvent(eventName, parameters)).toBe(true);
    expect(gtag).toHaveBeenCalledOnce();
    expect(gtag).toHaveBeenCalledWith("event", eventName, parameters);
    expect(gtag.mock.calls[0][2]).not.toBe(parameters);
    expect(Object.keys(gtag.mock.calls[0][2] as object).sort()).toEqual(["destination_slug", "placement", "source_slug"]);
  });

  it("returns event metadata only for complete approved source/destination/placement combinations", () => {
    for (const tuple of expectedTuples) {
      expect(getHomeBuyingJourneyLink(tuple.source_slug, tuple.destination_slug, tuple.placement)).toEqual({ eventName, parameters: tuple });
    }
    expect(getHomeBuyingJourneyLink("home-loan-guide", "home-loan", "article_callout")).toBeUndefined();
    expect(getHomeBuyingJourneyLink("how-much-house-can-i-afford", "/calculators/home-loan", "article_callout")).toBeUndefined();
    expect(getHomeBuyingJourneyLink("how-much-house-can-i-afford", "home-loan-down-payment", "article_callout")).toBeUndefined();
    expect(getHomeBuyingJourneyLink("how-much-house-can-i-afford", "home-loan", "article_body")).toBeUndefined();
  });

  it.each([
    ["invalid source", { ...expectedTuples[0], source_slug: "arbitrary-article" }],
    ["invalid destination", { ...expectedTuples[0], destination_slug: "unknown-destination" }],
    ["invalid placement", { ...expectedTuples[0], placement: "related_guide_card" }],
    ["a valid but unapproved combination", { source_slug: "home-loan-down-payment", destination_slug: "home-loan-emi-calculation", placement: "article_body" }],
    ["a calculator URL", { ...expectedTuples[4], destination_slug: "/calculators/home-loan" }],
    ["an absolute URL", { ...expectedTuples[4], destination_slug: "https://arthasiddhi.com/calculators/home-loan" }],
    ["a query string", { ...expectedTuples[4], destination_slug: "home-loan?amount=private" }],
    ["arbitrary text", { ...expectedTuples[0], source_slug: "reader-entered text" }],
  ])("rejects %s", (_label, parameters) => {
    const gtag = capture();
    expect(trackEvent(eventName, parameters as never)).toBe(false);
    expect(gtag).not.toHaveBeenCalled();
  });

  it("rejects missing keys, every unexpected key, symbol keys and malformed payloads", () => {
    const gtag = capture();
    const valid = expectedTuples[0];
    for (const key of ["source_slug", "destination_slug", "placement"] as const) {
      const missing = { ...valid } as Record<string, unknown>;
      delete missing[key];
      expect(trackEvent(eventName, missing as never)).toBe(false);
    }
    for (const key of ["journey_stage", "loan_amount", "principal", "emi", "monthly_emi", "interest_rate", "tenure", "total_interest", "income", "salary", "expenses", "debt", "age", "dependants", "employment", "savings", "down_payment", "property_price", "calculator_result", "scenario_values", "form_state", "url", "pathname", "query", "search_params", "localStorage", "sessionStorage", "cookies", "email", "phone", "text", "arbitrary_metadata"]) {
      expect(trackEvent(eventName, { ...valid, [key]: "private-or-arbitrary-value" } as never)).toBe(false);
    }
    expect(trackEvent(eventName, { ...valid, [Symbol("unexpected")]: "extra" } as never)).toBe(false);
    const hiddenExtra = Object.defineProperty({ ...valid }, "hidden", { value: "extra" });
    expect(trackEvent(eventName, hiddenExtra as never)).toBe(false);
    for (const malformed of [null, undefined, [], "arbitrary", 42, Object.create(valid)]) expect(trackEvent(eventName, malformed as never)).toBe(false);
    expect(gtag).not.toHaveBeenCalled();
  });

  it("keeps the existing production and gtag dispatch gates", () => {
    const gtag = capture();
    vi.stubEnv("NODE_ENV", "test");
    expect(trackEvent(eventName, expectedTuples[0])).toBe(false);
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "invalid");
    expect(trackEvent(eventName, expectedTuples[0])).toBe(false);
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "G-TEST123");
    vi.stubGlobal("window", {});
    expect(trackEvent(eventName, expectedTuples[0])).toBe(false);
    expect(gtag).not.toHaveBeenCalled();
  });

  it("dispatches synchronously without preventing or rewriting native navigation", async () => {
    const gtag = capture();
    const { TrackedLink: ActualTrackedLink } = await vi.importActual<typeof import("../../components/analytics/TrackedLink")>("../../components/analytics/TrackedLink");
    const destination = "/learn/loans/home-loan-down-payment";
    const element = ActualTrackedLink({ href: destination, analytics: { eventName, parameters: expectedTuples[0] }, children: "Continue" });
    const props = element.props as { href: string; onClick: (event: unknown) => void };
    const event = { defaultPrevented: false, preventDefault: vi.fn(), stopPropagation: vi.fn() };

    expect(props.href).toBe(destination);
    props.onClick(event);
    expect(gtag).toHaveBeenCalledOnce();
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(event.stopPropagation).not.toHaveBeenCalled();
  });
});

describe("Home Buying journey analytics rendered surfaces", () => {
  it.each([
    ["how-much-house-can-i-afford", expectedTuples.slice(0, 5)],
    ["home-loan-down-payment", [expectedTuples[5]]],
    ["emergency-fund-before-home-loan", [expectedTuples[6]]],
    ["home-loan-tenure-comparison", [expectedTuples[7]]],
    ["home-loan-emi-calculation", [expectedTuples[8]]],
  ] as const)("instruments only approved canonical surfaces in %s", (sourceSlug, expected) => {
    renderArticle(sourceSlug);
    const journeyLinks = renderedLinks.filter(({ analytics }) => analytics.eventName === eventName);
    const actual = journeyLinks.map(({ href, analytics }) => ({ href, analytics: analytics.parameters })).sort((left, right) => left.href.localeCompare(right.href));
    const expectedLinks = expected.map((tuple) => ({ href: tuple.destination_slug === "home-loan" ? "/calculators/home-loan" : `/learn/loans/${tuple.destination_slug}`, analytics: tuple })).sort((left, right) => left.href.localeCompare(right.href));
    expect(actual).toEqual(expectedLinks);

    for (const tuple of expected) {
      const destination = tuple.destination_slug === "home-loan" ? "/calculators/home-loan" : `/learn/loans/${tuple.destination_slug}`;
      expect(journeyLinks.filter(({ href }) => href === destination)).toHaveLength(1);
    }
  });

  it("does not instrument duplicate related-guide or related-calculator cards", () => {
    const affordMarkup = renderArticle("how-much-house-can-i-afford");
    expect(affordMarkup.match(/href="\/calculators\/home-loan"/g)).toHaveLength(2);
    expect(renderedLinks.filter(({ href, analytics }) => href === "/calculators/home-loan" && analytics.eventName === eventName)).toHaveLength(1);
    const affordDestination = "/learn/loans/home-loan-tenure-comparison";
    expect(affordMarkup.match(/href="\/learn\/loans\/home-loan-tenure-comparison"/g)).toHaveLength(2);
    expect(renderedLinks.filter(({ href, analytics }) => href === affordDestination && analytics.eventName === eventName)).toHaveLength(1);

    renderedLinks.length = 0;
    const tenureMarkup = renderArticle("home-loan-tenure-comparison");
    expect(tenureMarkup.match(/href="\/learn\/loans\/home-loan-emi-calculation"/g)).toHaveLength(2);
    expect(renderedLinks.filter(({ href, analytics }) => href === "/learn/loans/home-loan-emi-calculation" && analytics.eventName === eventName)).toHaveLength(1);

    renderedLinks.length = 0;
    const mechanicsMarkup = renderArticle("home-loan-emi-calculation");
    expect(mechanicsMarkup.match(/href="\/learn\/loans\/when-home-loan-emi-starts"/g)).toHaveLength(2);
    expect(renderedLinks.filter(({ href, analytics }) => href === "/learn/loans/when-home-loan-emi-starts" && analytics.eventName === eventName)).toHaveLength(1);

    renderedLinks.length = 0;
    const downPaymentMarkup = renderArticle("home-loan-down-payment");
    expect(downPaymentMarkup.match(/href="\/calculators\/home-loan"/g)).toHaveLength(2);
    expect(renderedLinks.filter(({ href, analytics }) => href === "/calculators/home-loan" && analytics.eventName === eventName)).toHaveLength(1);

    renderedLinks.length = 0;
    const reserveMarkup = renderArticle("emergency-fund-before-home-loan");
    expect(reserveMarkup.match(/href="\/calculators\/home-loan"/g)).toHaveLength(2);
    expect(renderedLinks.filter(({ href, analytics }) => href === "/calculators/home-loan" && analytics.eventName === eventName)).toHaveLength(1);
  });

  it("does not instrument other Loans, Car Loan, Personal Loan, Tax, Banking or hub surfaces", () => {
    for (const slug of ["home-loan-guide", "when-home-loan-emi-starts", "home-loan-prepayment", "personal-loan-emi-explained", "car-loan-cost-guide", "new-tax-regime-slab-calculation", "fixed-deposit-explained"]) renderArticle(slug);
    expect(renderedLinks.filter(({ analytics }) => analytics.eventName === eventName)).toEqual([]);
    const hub = getLearnCategoryHub("loans");
    for (const group of hub.groups) {
      const core = getArticleBySlug(group.coreArticle)!;
      const supporting = group.supportingArticles.map((slug) => getArticleBySlug(slug)!);
      renderToStaticMarkup(createElement(LearnTopicGroup, { group, core, supporting }));
    }
    const broaderGuides = hub.broaderGuides!.map((slug) => getArticleBySlug(slug)!);
    renderToStaticMarkup(createElement(GuideCollection, { id: "foundations", title: "Broader foundations", articles: broaderGuides }));
    expect(renderedLinks.filter(({ analytics }) => analytics.eventName === eventName)).toEqual([]);
  });

  it("preserves the existing Home Loan events without double firing", () => {
    renderArticle("home-loan-guide");
    expect(renderedLinks.filter(({ analytics }) => analytics.eventName === "guide_calculator_click")).toHaveLength(1);
    expect(renderedLinks.filter(({ analytics }) => analytics.eventName === eventName)).toEqual([]);
    renderedLinks.length = 0;
    renderToStaticMarkup(createElement(CalculatorRelatedContent, { slug: "home-loan" }));
    expect(renderedLinks.filter(({ analytics }) => analytics.eventName === "calculator_guide_click").length).toBeGreaterThan(0);
    expect(renderedLinks.filter(({ analytics }) => analytics.eventName === eventName)).toEqual([]);
  });
});
