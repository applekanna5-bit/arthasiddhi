import { describe, expect, it } from "vitest";
import { calculateCagr } from "../../lib/calculator/expanded-calculators";
import { formatIndianCurrency, formatPercentage } from "../../lib/calculator/formatting";
import {
  articles,
  getArticle,
  getPrimaryGuideForCalculator,
  getRelatedArticles,
  getSupportingGuidesForCalculator,
} from "../../lib/content/articles";
import { articleJsonLd, articleMetadata, breadcrumbJsonLd, faqJsonLd, getArticlePath } from "../../lib/content/seo";
import { absoluteUrl } from "../../lib/content/site";
import { buildSitemap } from "../../lib/content/sitemap";
import type { Article, ArticleInlineContent, ArticleInternalLink, ArticleSection, ArticleSlug } from "../../lib/content/types";

const cagrSlugs = [
  "cagr-explained",
  "cagr-vs-absolute-return",
  "cagr-and-year-to-year-volatility",
  "cagr-vs-average-annual-return",
] as const satisfies readonly ArticleSlug[];

function cagrArticle(slug: ArticleSlug) {
  const article = getArticle("investments", slug);
  expect(article).toBeDefined();
  return article!;
}

function section(article: Article, id: string): ArticleSection {
  const value = article.sections.find((candidate) => candidate.id === id);
  expect(value).toBeDefined();
  return value!;
}

function inlineText(content: ArticleInlineContent) {
  return typeof content === "string" ? content : content.map(({ text }) => text).join("");
}

function articleText(article: Article) {
  return JSON.stringify(article).toLowerCase();
}

function inlineLinks(article: Article): ArticleInternalLink[] {
  return article.sections.flatMap(({ paragraphs, callout }) => [
    ...(paragraphs ?? []),
    ...(callout ? [callout.text] : []),
  ]).flatMap((content) => typeof content === "string" ? [] : content.flatMap(({ link }) => link ? [link] : []));
}

describe("CAGR cluster registry and discovery", () => {
  it("registers exactly four approved evergreen CAGR articles in Investments", () => {
    const registered = articles.filter(({ primaryCalculator }) => primaryCalculator === "cagr");
    expect(registered.map(({ slug }) => slug)).toEqual(cagrSlugs);
    expect(new Set(registered.map(getArticlePath)).size).toBe(4);
    for (const article of registered) {
      expect(article.category).toBe("investments");
      expect(article.maintenance).toEqual({ kind: "evergreen" });
    }
  });

  it("keeps CAGR Explained as the sole core and the other three as supporting", () => {
    expect(getPrimaryGuideForCalculator("cagr")?.slug).toBe("cagr-explained");
    expect(cagrSlugs.map((slug) => cagrArticle(slug).calculatorGuideRole)).toEqual(["core", "supporting", "supporting", "supporting"]);
    expect(articles.filter(({ primaryCalculator, calculatorGuideRole }) => primaryCalculator === "cagr" && calculatorGuideRole === "core")).toHaveLength(1);
  });

  it("curates the two approved supporting cards in priority order", () => {
    expect(getSupportingGuidesForCalculator("cagr").map(({ slug }) => slug)).toEqual([
      "cagr-vs-absolute-return",
      "cagr-and-year-to-year-volatility",
    ]);
    expect(getSupportingGuidesForCalculator("cagr").map(({ slug }) => slug)).not.toContain("cagr-vs-average-annual-return");
    expect(cagrArticle("cagr-vs-average-annual-return").calculatorDiscoveryPriority).toBeUndefined();
  });

  it("does not pollute unrelated calculator discovery", () => {
    expect(getSupportingGuidesForCalculator("sip").map(({ slug }) => slug)).toEqual(["sip-return-calculation", "sip-projection-assumptions"]);
    expect(getSupportingGuidesForCalculator("inflation").map(({ slug }) => slug)).toEqual(["inflation-future-cost", "purchasing-power-explained"]);
    expect(getSupportingGuidesForCalculator("fd").map(({ slug }) => slug)).toEqual(["fd-interest-calculation", "fd-vs-rd"]);
    expect(getSupportingGuidesForCalculator("lumpsum")).toEqual([]);
  });
});

describe("CAGR cluster internal links", () => {
  it("makes the core a compact hub for all supporting articles and the calculator", () => {
    const core = cagrArticle("cagr-explained");
    const links = inlineLinks(core);
    expect(getRelatedArticles(core).map(({ slug }) => slug)).toEqual(cagrSlugs.slice(1));
    expect(links).toContainEqual({ kind: "calculator", slug: "cagr" });
    for (const slug of cagrSlugs.slice(1)) expect(links).toContainEqual({ kind: "article", slug });
  });

  it.each(cagrSlugs.slice(1))("keeps %s relationships valid, unique and free of self-links", (slug) => {
    const article = cagrArticle(slug);
    const links = inlineLinks(article);
    expect(links).toContainEqual({ kind: "calculator", slug: "cagr" });
    expect(links).toContainEqual({ kind: "article", slug: "cagr-explained" });
    expect(article.relatedArticles).toHaveLength(2);
    expect(new Set(article.relatedArticles).size).toBe(article.relatedArticles.length);
    expect(article.relatedArticles).not.toContain(article.slug);
    expect(getRelatedArticles(article)).toHaveLength(article.relatedArticles.length);
  });
});

describe("CAGR cluster numerical integrity", () => {
  it("reconciles the positive and negative core examples with calculateCagr", () => {
    const positive = calculateCagr({ beginningValue: 100_000, endingValue: 200_000, durationYears: 5 });
    const negative = calculateCagr({ beginningValue: 200_000, endingValue: 150_000, durationYears: 3 });
    expect(section(cagrArticle("cagr-explained"), "positive-example").table?.rows).toEqual([[
      formatIndianCurrency(positive.beginningValue), formatIndianCurrency(positive.endingValue), "5 years", formatPercentage(positive.cagrPercentage),
    ]]);
    expect(section(cagrArticle("cagr-explained"), "result-signs").table?.rows).toEqual([[
      formatIndianCurrency(negative.beginningValue), formatIndianCurrency(negative.endingValue), "3 years", formatPercentage(negative.cagrPercentage),
    ]]);
  });

  it("preserves the engine's zero-ending-value boundary", () => {
    const zeroEnding = calculateCagr({ beginningValue: 100_000, endingValue: 0, durationYears: 5 });
    expect(zeroEnding.cagrPercentage).toBe(-100);
    expect(articleText(cagrArticle("cagr-explained"))).toContain(formatPercentage(zeroEnding.cagrPercentage).toLowerCase());
  });

  it("reconciles CAGR and transparent absolute-return arithmetic", () => {
    const result = calculateCagr({ beginningValue: 100_000, endingValue: 200_000, durationYears: 5 });
    const absoluteReturn = ((result.endingValue - result.beginningValue) / result.beginningValue) * 100;
    expect(section(cagrArticle("cagr-vs-absolute-return"), "worked-comparison").table?.rows).toEqual([
      ["Absolute return", "Full 5-year period", formatPercentage(absoluteReturn)],
      ["CAGR", "Annualized across 5 years", formatPercentage(result.cagrPercentage)],
    ]);
  });

  it("derives every displayed CAGR percentage from the approved engine result", () => {
    const expected = formatPercentage(calculateCagr({ beginningValue: 100_000, endingValue: 200_000, durationYears: 5 }).cagrPercentage);
    expect(section(cagrArticle("cagr-and-year-to-year-volatility"), "controlled-example").table?.rows.map((row) => row[4])).toEqual([expected, expected]);
    expect(inlineText(section(cagrArticle("cagr-vs-average-annual-return"), "insufficient-endpoints").paragraphs![0])).toContain(expected);
  });
});

describe("CAGR cluster editorial safety", () => {
  const combined = () => cagrSlugs.map((slug) => articleText(cagrArticle(slug))).join(" ");

  it("states endpoint, volatility and interim-cash-flow limitations", () => {
    expect(combined()).toContain("beginning value, ending value and duration");
    expect(combined()).toContain("does not show the sequence or volatility");
    expect(combined()).toContain("does not model contributions, withdrawals, dividends or other interim or dated cash flows");
  });

  it("distinguishes CAGR from arithmetic average annual return", () => {
    const averageArticle = combined();
    expect(averageArticle).toContain("cagr is not an arithmetic average annual return");
    expect(averageArticle).toContain("not sufficient to calculate an arithmetic average of the actual annual returns");
  });

  it("avoids SIP misuse, forecasts, guarantees and current-market claims", () => {
    const text = combined();
    for (const phrase of [
      "cagr accurately measures sip performance",
      "cagr includes sip contributions",
      "cagr guarantees future performance",
      "cagr forecasts future performance",
      "current stock return",
      "current mutual fund return",
      "current index return",
    ]) expect(text).not.toContain(phrase);
    expect(text).toContain("cagr is not a forecast");
    expect(text).toContain("does not prove that a constant return was actually realized each year");
  });
});

describe("CAGR cluster SEO, schema and sitemap", () => {
  it("provides unique metadata, production canonicals and existing schemas", () => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const slug of cagrSlugs) {
      const article = cagrArticle(slug);
      const url = absoluteUrl(getArticlePath(article));
      const metadata = articleMetadata(article);
      expect(metadata.alternates?.canonical).toBe(url);
      expect(metadata.openGraph).toMatchObject({ type: "article", url, title: article.title });
      expect(articleJsonLd(article)).toMatchObject({ "@type": "Article", headline: article.title, mainEntityOfPage: url });
      expect(breadcrumbJsonLd(article).itemListElement).toHaveLength(4);
      expect(faqJsonLd(article)).toMatchObject({ "@type": "FAQPage" });
      expect(article.faq?.length).toBeGreaterThan(0);
      titles.add(article.title);
      descriptions.add(article.description);
    }
    expect(titles.size).toBe(4);
    expect(descriptions.size).toBe(4);
  });

  it("keeps each article once in the 82-URL sitemap without a category duplicate", () => {
    const urls = buildSitemap().map(({ url }) => url);
    expect(urls).toHaveLength(82);
    expect(new Set(urls).size).toBe(82);
    for (const slug of cagrSlugs) expect(urls.filter((url) => url === absoluteUrl(getArticlePath(cagrArticle(slug))))).toHaveLength(1);
    expect(urls.filter((url) => url === absoluteUrl("/learn/investments"))).toHaveLength(1);
  });
});
