import { describe, expect, it } from "vitest";
import { calculateInflation } from "../../lib/calculator/expanded-calculators";
import { formatIndianCurrency } from "../../lib/calculator/formatting";
import {
  articles,
  getArticle,
  getArticlesByCategory,
  getPrimaryGuideForCalculator,
  getRelatedArticles,
  getSupportingGuidesForCalculator,
} from "../../lib/content/articles";
import { articleJsonLd, articleMetadata, breadcrumbJsonLd, faqJsonLd, getArticlePath } from "../../lib/content/seo";
import { absoluteUrl } from "../../lib/content/site";
import { buildSitemap } from "../../lib/content/sitemap";
import type { Article, ArticleInternalLink, ArticleSection, ArticleSlug } from "../../lib/content/types";

const inflationSlugs = [
  "inflation-explained",
  "inflation-future-cost",
  "purchasing-power-explained",
  "inflation-calculator-projection-assumptions",
] as const satisfies readonly ArticleSlug[];

function inflationArticle(slug: ArticleSlug) {
  const article = getArticle("personal-finance", slug);
  expect(article).toBeDefined();
  return article!;
}

function section(article: Article, id: string): ArticleSection {
  const value = article.sections.find((candidate) => candidate.id === id);
  expect(value).toBeDefined();
  return value!;
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

describe("Inflation cluster registry and discovery", () => {
  it("registers exactly four unique Inflation articles in Personal Finance", () => {
    const registered = articles.filter(({ primaryCalculator }) => primaryCalculator === "inflation");
    expect(registered.map(({ slug }) => slug)).toEqual(inflationSlugs);
    expect(new Set(registered.map(getArticlePath)).size).toBe(4);
    expect(getArticlesByCategory("personal-finance").map(({ slug }) => slug)).toEqual(["compound-interest", ...inflationSlugs]);
    for (const article of registered) {
      expect(article.category).toBe("personal-finance");
      expect(article.maintenance).toEqual({ kind: "evergreen" });
    }
  });

  it("keeps one core guide and three supporting guides", () => {
    expect(getPrimaryGuideForCalculator("inflation")?.slug).toBe("inflation-explained");
    expect(inflationSlugs.map((slug) => inflationArticle(slug).calculatorGuideRole)).toEqual(["core", "supporting", "supporting", "supporting"]);
    expect(articles.filter(({ primaryCalculator, calculatorGuideRole }) => primaryCalculator === "inflation" && calculatorGuideRole === "core")).toHaveLength(1);
  });

  it("curates exactly the two approved supporting cards without polluting other calculators", () => {
    expect(getSupportingGuidesForCalculator("inflation").map(({ slug }) => slug)).toEqual(["inflation-future-cost", "purchasing-power-explained"]);
    expect(getSupportingGuidesForCalculator("inflation")).toHaveLength(2);
    expect(getSupportingGuidesForCalculator("inflation").map(({ slug }) => slug)).not.toContain("inflation-calculator-projection-assumptions");
    expect(getSupportingGuidesForCalculator("ppf").map(({ slug }) => slug)).toEqual(["ppf-interest-calculation", "ppf-calculator-projection-vs-actual-maturity"]);
    expect(getSupportingGuidesForCalculator("fd").map(({ slug }) => slug)).toEqual(["fd-interest-calculation", "fd-vs-rd"]);
    expect(getSupportingGuidesForCalculator("sip").map(({ slug }) => slug)).toEqual(["sip-return-calculation", "sip-projection-assumptions"]);
    expect(getSupportingGuidesForCalculator("gratuity").map(({ slug }) => slug)).toEqual(["gratuity-calculation", "gratuity-calculator-vs-employer-settlement"]);
  });
});

describe("Inflation cluster internal links", () => {
  it.each([
    ["inflation-explained", [{ kind: "calculator", slug: "inflation" }, { kind: "article", slug: "inflation-future-cost" }, { kind: "article", slug: "purchasing-power-explained" }, { kind: "article", slug: "inflation-calculator-projection-assumptions" }, { kind: "article", slug: "compound-interest" }]],
    ["inflation-future-cost", [{ kind: "calculator", slug: "inflation" }, { kind: "article", slug: "inflation-explained" }, { kind: "article", slug: "purchasing-power-explained" }, { kind: "article", slug: "inflation-calculator-projection-assumptions" }]],
    ["purchasing-power-explained", [{ kind: "calculator", slug: "inflation" }, { kind: "article", slug: "inflation-explained" }, { kind: "article", slug: "inflation-future-cost" }, { kind: "article", slug: "inflation-calculator-projection-assumptions" }]],
    ["inflation-calculator-projection-assumptions", [{ kind: "calculator", slug: "inflation" }, { kind: "article", slug: "inflation-explained" }, { kind: "article", slug: "inflation-future-cost" }, { kind: "article", slug: "purchasing-power-explained" }]],
  ] as const)("links %s to the approved destinations", (slug, requiredLinks) => {
    const article = inflationArticle(slug);
    const links = inlineLinks(article);
    for (const link of requiredLinks) expect(links).toContainEqual(link);
    expect(new Set(article.relatedArticles).size).toBe(article.relatedArticles.length);
    expect(article.relatedArticles).not.toContain(article.slug);
    expect(getRelatedArticles(article)).toHaveLength(article.relatedArticles.length);
    expect(article.relatedCalculators).toEqual([]);
  });
});

describe("Inflation cluster numerical integrity", () => {
  it("reconciles both core example rows with calculateInflation", () => {
    const futureCost = calculateInflation({ mode: "future-cost", currentValue: 100_000, annualInflationRate: 6, years: 10 });
    const purchasingPower = calculateInflation({ mode: "purchasing-power", currentValue: 100_000, annualInflationRate: 6, years: 10 });
    expect(section(inflationArticle("inflation-explained"), "worked-example").table?.rows).toEqual([
      ["Future cost", formatIndianCurrency(futureCost.currentValue), "6%", "10 years", formatIndianCurrency(futureCost.estimatedValue), `${formatIndianCurrency(futureCost.change)} increase`],
      ["Purchasing power", formatIndianCurrency(purchasingPower.currentValue), "6%", "10 years", formatIndianCurrency(purchasingPower.estimatedValue), `${formatIndianCurrency(purchasingPower.change)} erosion`],
    ]);
  });

  it("reconciles the dedicated future-cost and purchasing-power examples", () => {
    const futureCost = calculateInflation({ mode: "future-cost", currentValue: 100_000, annualInflationRate: 6, years: 10 });
    expect(section(inflationArticle("inflation-future-cost"), "worked-example").table?.rows).toEqual([[
      formatIndianCurrency(futureCost.currentValue), "6%", "10 years", formatIndianCurrency(futureCost.estimatedValue), formatIndianCurrency(futureCost.change),
    ]]);
    const purchasingPower = calculateInflation({ mode: "purchasing-power", currentValue: 100_000, annualInflationRate: 6, years: 10 });
    expect(section(inflationArticle("purchasing-power-explained"), "worked-example").table?.rows).toEqual([[
      formatIndianCurrency(purchasingPower.currentValue), "6%", "10 years", formatIndianCurrency(purchasingPower.estimatedValue), formatIndianCurrency(purchasingPower.change),
    ]]);
  });

  it("reconciles every sensitivity value with calculateInflation", () => {
    const rows = [5, 6, 7].map((rate) => {
      const result = calculateInflation({ mode: "future-cost", currentValue: 100_000, annualInflationRate: rate, years: 10 });
      return [`${rate}%`, formatIndianCurrency(result.currentValue), "10 years", formatIndianCurrency(result.estimatedValue), formatIndianCurrency(result.change)];
    });
    expect(section(inflationArticle("inflation-calculator-projection-assumptions"), "sensitivity-example").table?.rows).toEqual(rows);
  });
});

describe("Inflation cluster editorial and assumption safety", () => {
  it("discloses constant annual compounding and whole-year limitations", () => {
    const combined = inflationSlugs.map((slug) => articleText(inflationArticle(slug))).join(" ");
    expect(combined).toContain("one constant rate for every whole year");
    expect(combined).toContain("compounds the same entered percentage once per whole year");
    expect(combined).toContain("does not accept monthly periods or negative inflation");
    expect(combined).toContain("does not connect to live cpi data");
  });

  it("keeps 6% illustrative and avoids guarantees or current-CPI claims", () => {
    const combined = inflationSlugs.map((slug) => articleText(inflationArticle(slug))).join(" ");
    for (const phrase of ["india's inflation is 6%", "current indian cpi is 6%", "guaranteed inflation rate", "guaranteed future cost", "this is the exact future price", "will definitely cost", "inflation will be 6%"] ) expect(combined).not.toContain(phrase);
    expect(combined).toContain("illustrative constant annual inflation assumption of 6%");
    expect(combined).toContain("not current indian cpi readings or forecasts");
  });

  it("does not confuse inflation with investment performance or product forecasts", () => {
    const futureCost = articleText(inflationArticle("inflation-future-cost"));
    const purchasingPower = articleText(inflationArticle("purchasing-power-explained"));
    expect(futureCost).toContain("not investment growth");
    expect(futureCost).toContain("does not predict the exact future price of a product, service, education course, medical expense, house or household basket");
    expect(purchasingPower).toContain("not an investment loss or portfolio return");
    expect(purchasingPower).toContain("not a future bank-account balance");
    expect(articleText(inflationArticle("inflation-explained"))).toContain("not india's current cpi, an inflation forecast, a guaranteed future rate or an investment return");
  });
});

describe("Inflation cluster SEO and sitemap", () => {
  it("provides unique metadata, production canonicals and existing schemas", () => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const slug of inflationSlugs) {
      const article = inflationArticle(slug);
      const url = absoluteUrl(getArticlePath(article));
      const metadata = articleMetadata(article);
      expect(metadata.alternates?.canonical).toBe(url);
      expect(url).toMatch(/^https:\/\/arthasiddhi\.com\/learn\/personal-finance\//);
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

  it("keeps all four URLs in the expanded unique sitemap without a new category", () => {
    const urls = buildSitemap().map(({ url }) => url);
    expect(urls).toHaveLength(93);
    expect(new Set(urls).size).toBe(93);
    for (const slug of inflationSlugs) expect(urls.filter((url) => url === absoluteUrl(getArticlePath(inflationArticle(slug))))).toHaveLength(1);
    expect(urls.filter((url) => url === absoluteUrl("/learn/personal-finance"))).toHaveLength(1);
  });
});
