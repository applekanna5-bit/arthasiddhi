import { describe, expect, it } from "vitest";
import { calculatePpf } from "../../lib/calculator/expanded-calculators";
import { ppfRuleSet } from "../../lib/financial-rules/rule-sets";
import {
  articles,
  getArticle,
  getArticleMaintenanceContext,
  getArticleReferences,
  getArticlesByCategory,
  getPrimaryGuideForCalculator,
  getRelatedArticles,
  getSupportingGuidesForCalculator,
} from "../../lib/content/articles";
import { articleJsonLd, articleMetadata, breadcrumbJsonLd, faqJsonLd, getArticlePath } from "../../lib/content/seo";
import { absoluteUrl } from "../../lib/content/site";
import { buildSitemap } from "../../lib/content/sitemap";
import type { Article, ArticleInternalLink, ArticleSection, ArticleSlug } from "../../lib/content/types";

const ppfSlugs = [
  "ppf-explained",
  "ppf-interest-calculation",
  "ppf-tenure-extension",
  "ppf-calculator-projection-vs-actual-maturity",
] as const satisfies readonly ArticleSlug[];

function ppfArticle(slug: ArticleSlug) {
  const article = getArticle("banking", slug);
  expect(article).toBeDefined();
  return article!;
}

function section(article: Article, id: string): ArticleSection {
  const value = article.sections.find((candidate) => candidate.id === id);
  expect(value).toBeDefined();
  return value!;
}

function wholeRupees(value: number) {
  return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value)}`;
}

function inlineLinks(article: Article): ArticleInternalLink[] {
  const links: ArticleInternalLink[] = [];
  for (const item of article.sections) {
    for (const paragraph of item.paragraphs ?? []) {
      if (typeof paragraph !== "string") for (const segment of paragraph) if (segment.link) links.push(segment.link);
    }
    if (item.callout && typeof item.callout.text !== "string") {
      for (const segment of item.callout.text) if (segment.link) links.push(segment.link);
    }
  }
  return links;
}

function articleText(article: Article) {
  return JSON.stringify(article).toLowerCase();
}

describe("PPF cluster registry and maintenance", () => {
  it("registers exactly the four approved PPF articles in Banking", () => {
    const registered = articles.filter(({ primaryCalculator }) => primaryCalculator === "ppf");
    expect(registered.map(({ slug }) => slug)).toEqual(ppfSlugs);
    expect(new Set(registered.map(getArticlePath)).size).toBe(4);
    for (const article of registered) expect(article.category).toBe("banking");
    expect(getArticlesByCategory("banking").map(({ slug }) => slug)).toEqual([
      "fixed-deposit-explained", "fd-interest-calculation", "fd-vs-rd", "premature-fd-withdrawal", ...ppfSlugs,
      "rd-explained", "rd-interest-calculation", "rd-calculator-projection-vs-actual-maturity",
    ]);
  });

  it("keeps one sole core guide and three supporting guides", () => {
    expect(getPrimaryGuideForCalculator("ppf")?.slug).toBe("ppf-explained");
    expect(ppfSlugs.map((slug) => ppfArticle(slug).calculatorGuideRole)).toEqual(["core", "supporting", "supporting", "supporting"]);
    expect(articles.filter(({ primaryCalculator, calculatorGuideRole }) => primaryCalculator === "ppf" && calculatorGuideRole === "core")).toHaveLength(1);
  });

  it("derives visible maintenance and official references from the shared PPF rule set", () => {
    expect(ppfRuleSet.id).toBe("ppf-scheme-2019-amended-2020");
    expect(ppfRuleSet.periodLabels).toEqual([{ label: "Applicable scheme", value: "Public Provident Fund Scheme, 2019 (as amended in 2020)" }]);
    expect(ppfRuleSet.lastVerified).toBe("2026-08-20");
    for (const slug of ppfSlugs) {
      const article = ppfArticle(slug);
      expect(article.maintenance).toEqual({ kind: "rule-sensitive", ruleSetId: ppfRuleSet.id });
      expect(getArticleMaintenanceContext(article)).toEqual({ applicablePeriod: ppfRuleSet.effectivePeriod, periodLabels: ppfRuleSet.periodLabels, verifiedAt: "2026-08-20" });
      const references = getArticleReferences(article);
      expect(references).toHaveLength(ppfRuleSet.sources.length);
      expect(references.every(({ sourceType, url }) => sourceType === "official" && /^https:\/\/(dea\.gov\.in|www\.nsiindia\.gov\.in)\//.test(url))).toBe(true);
      expect(references.every(({ accessedAt }) => accessedAt === "2026-08-20")).toBe(true);
    }
  });
});

describe("PPF calculator discovery and internal links", () => {
  it("curates the approved core and exactly two supporting cards", () => {
    expect(getSupportingGuidesForCalculator("ppf").map(({ slug }) => slug)).toEqual(["ppf-interest-calculation", "ppf-calculator-projection-vs-actual-maturity"]);
    expect(getSupportingGuidesForCalculator("ppf")).toHaveLength(2);
    expect(getSupportingGuidesForCalculator("ppf").map(({ slug }) => slug)).not.toContain("ppf-tenure-extension");
    expect(getSupportingGuidesForCalculator("fd").map(({ slug }) => slug)).toEqual(["fd-interest-calculation", "fd-vs-rd"]);
    expect(getSupportingGuidesForCalculator("rd").map(({ slug }) => slug)).toEqual(["rd-interest-calculation", "rd-calculator-projection-vs-actual-maturity"]);
    expect(getSupportingGuidesForCalculator("sip").map(({ slug }) => slug)).toEqual(["sip-return-calculation", "sip-projection-assumptions"]);
    expect(getSupportingGuidesForCalculator("home-loan").map(({ slug }) => slug)).toEqual(["home-loan-emi-calculation", "home-loan-tenure-comparison"]);
  });

  it.each([
    ["ppf-explained", [{ kind: "calculator", slug: "ppf" }, { kind: "article", slug: "ppf-interest-calculation" }, { kind: "article", slug: "ppf-tenure-extension" }, { kind: "article", slug: "ppf-calculator-projection-vs-actual-maturity" }]],
    ["ppf-interest-calculation", [{ kind: "calculator", slug: "ppf" }, { kind: "article", slug: "ppf-explained" }, { kind: "article", slug: "ppf-calculator-projection-vs-actual-maturity" }]],
    ["ppf-tenure-extension", [{ kind: "calculator", slug: "ppf" }, { kind: "article", slug: "ppf-explained" }, { kind: "article", slug: "ppf-interest-calculation" }]],
    ["ppf-calculator-projection-vs-actual-maturity", [{ kind: "calculator", slug: "ppf" }, { kind: "article", slug: "ppf-explained" }, { kind: "article", slug: "ppf-interest-calculation" }]],
  ] as const)("links %s to the approved destinations", (slug, requiredLinks) => {
    const article = ppfArticle(slug);
    const links = inlineLinks(article);
    for (const link of requiredLinks) expect(links).toContainEqual(link);
    expect(new Set(article.relatedArticles).size).toBe(article.relatedArticles.length);
    expect(article.relatedArticles).not.toContain(article.slug);
    expect(getRelatedArticles(article)).toHaveLength(article.relatedArticles.length);
    expect(article.relatedCalculators).toEqual([]);
  });
});

describe("PPF numerical and assumption integrity", () => {
  it("reconciles the core baseline example directly with calculatePpf", () => {
    const result = calculatePpf({ annualContribution: 150_000, annualInterestRate: 7.1, tenureYears: 15 });
    expect(section(ppfArticle("ppf-explained"), "worked-example").table?.rows).toEqual([[
      wholeRupees(150_000), "15 years", wholeRupees(result.totalContribution), wholeRupees(result.interestEarned), wholeRupees(result.maturityAmount),
    ]]);
  });

  it("reconciles displayed annual schedule rows with calculatePpf", () => {
    const result = calculatePpf({ annualContribution: 150_000, annualInterestRate: 7.1, tenureYears: 15 });
    const rows = result.schedule.slice(0, 2).map((row) => [String(row.year), wholeRupees(row.openingBalance), wholeRupees(row.contribution), wholeRupees(row.interest), wholeRupees(row.closingBalance)]);
    expect(section(ppfArticle("ppf-interest-calculation"), "schedule-example").table?.rows).toEqual(rows);
    expect(result.schedule[0]).toMatchObject({ openingBalance: 0, contribution: 150_000, closingBalance: 160_650 });
    expect(result.schedule[0].interest).toBeCloseTo(10_650, 8);
  });

  it("reconciles every sensitivity row with the engine", () => {
    const rows = [6, 7, 8].map((rate) => {
      const result = calculatePpf({ annualContribution: 100_000, annualInterestRate: rate, tenureYears: 15 });
      return [`${rate}%`, wholeRupees(result.totalContribution), wholeRupees(result.interestEarned), wholeRupees(result.maturityAmount)];
    });
    expect(section(ppfArticle("ppf-calculator-projection-vs-actual-maturity"), "sensitivity-example").table?.rows).toEqual(rows);
  });

  it("states the calculator and actual-scheme timing boundaries", () => {
    const combined = ppfSlugs.map((slug) => articleText(ppfArticle(slug))).join(" ");
    expect(combined).toContain("beginning of every modeled year");
    expect(articleText(ppfArticle("ppf-interest-calculation"))).toContain("does not model monthly deposits");
    expect(combined).toContain("lowest balance at credit between the close of the fifth day and the end of each month");
    expect(combined).toContain("interest is credited at the end of the year");
    expect(combined).toContain("government-notified ppf rates can change");
  });
});

describe("PPF tenure, editorial and SEO safety", () => {
  it("sources the statutory framework and rejects calculator-based extension validation", () => {
    const tenure = articleText(ppfArticle("ppf-tenure-extension"));
    expect(tenure).toContain("15 years from the end of the financial year in which the account was opened");
    expect(tenure).toContain("further block of five years");
    expect(tenure).toContain("before one year expires from maturity");
    expect(tenure).toContain("20-year projection is not an extension election");
    expect(tenure).toContain("does not submit or validate");
  });

  it("avoids prohibited guarantees, future-rate claims, comparisons and unsupported calculations", () => {
    const combined = ppfSlugs.map((slug) => articleText(ppfArticle(slug))).join(" ");
    for (const phrase of [
      "ppf rate is fixed for 15 years", "7.1% is guaranteed", "guaranteed maturity amount", "exact maturity amount", "annual contribution always earns a full year", "20 years automatically means a valid extension", "ppf is universally better than sip", "ppf is universally better than fd", "best investment", "wealth creation guaranteed",
    ]) expect(combined).not.toContain(phrase);
    expect(combined).not.toMatch(/calculator (determines|calculates) (withdrawal eligibility|loan eligibility|ppf tax liability)/);
    expect(combined).toContain("illustrative constant-rate scenario");
    expect(combined).toContain("not a guaranteed maturity value");
    expect(combined).toContain("not forecasts of future ppf rates");
  });

  it("provides unique metadata, production canonicals and existing schemas", () => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const slug of ppfSlugs) {
      const article = ppfArticle(slug);
      const url = absoluteUrl(getArticlePath(article));
      const metadata = articleMetadata(article);
      expect(metadata.alternates?.canonical).toBe(url);
      expect(url).toMatch(/^https:\/\/arthasiddhi\.com\/learn\/banking\//);
      expect(metadata.openGraph).toMatchObject({ type: "article", url, title: article.title });
      expect(articleJsonLd(article)).toMatchObject({ "@type": "Article", mainEntityOfPage: url, headline: article.title });
      expect(breadcrumbJsonLd(article).itemListElement).toHaveLength(4);
      expect(faqJsonLd(article)).toMatchObject({ "@type": "FAQPage" });
      expect(article.faq?.length).toBeGreaterThan(0);
      titles.add(article.title);
      descriptions.add(article.description);
    }
    expect(titles.size).toBe(4);
    expect(descriptions.size).toBe(4);
  });

  it("keeps all four article URLs in the expanded unique sitemap without a new category", () => {
    const urls = buildSitemap().map(({ url }) => url);
    expect(urls).toHaveLength(95);
    expect(new Set(urls).size).toBe(95);
    for (const slug of ppfSlugs) expect(urls).toContain(absoluteUrl(getArticlePath(ppfArticle(slug))));
    expect(urls.filter((url) => url === absoluteUrl("/learn/banking"))).toHaveLength(1);
    expect(urls.filter((url) => /\/learn\/(government-savings|ppf)$/.test(url))).toEqual([]);
  });
});
