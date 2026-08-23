import { describe, expect, it } from "vitest";
import { calculateLoanDetails } from "../../lib/engine/loan";
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

const personalLoanSlugs = [
  "personal-loan-emi-explained",
  "personal-loan-tenure-comparison",
  "personal-loan-calculator-vs-lender-quote",
] as const satisfies readonly ArticleSlug[];

function personalLoanArticle(slug: (typeof personalLoanSlugs)[number]) {
  const article = getArticle("loans", slug);
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

describe("Personal Loan cluster registry and discovery", () => {
  it("registers exactly three unique evergreen Loans articles", () => {
    const registered = articles.filter(({ primaryCalculator }) => primaryCalculator === "personal-loan");
    expect(registered.map(({ slug }) => slug)).toEqual(personalLoanSlugs);
    expect(new Set(registered.map(getArticlePath)).size).toBe(3);
    for (const article of registered) {
      expect(article.category).toBe("loans");
      expect(article.maintenance).toEqual({ kind: "evergreen" });
    }
    expect(getArticlesByCategory("loans")).toHaveLength(10);
  });

  it("keeps one core guide and two supporting guides", () => {
    expect(getPrimaryGuideForCalculator("personal-loan")?.slug).toBe("personal-loan-emi-explained");
    expect(personalLoanSlugs.map((slug) => personalLoanArticle(slug).calculatorGuideRole)).toEqual(["core", "supporting", "supporting"]);
    expect(articles.filter(({ primaryCalculator, calculatorGuideRole }) => primaryCalculator === "personal-loan" && calculatorGuideRole === "core")).toHaveLength(1);
  });

  it("curates the two approved supporting cards without polluting other calculators", () => {
    expect(getSupportingGuidesForCalculator("personal-loan").map(({ slug }) => slug)).toEqual([
      "personal-loan-tenure-comparison",
      "personal-loan-calculator-vs-lender-quote",
    ]);
    expect(getSupportingGuidesForCalculator("personal-loan")).toHaveLength(2);
    expect(getSupportingGuidesForCalculator("home-loan").map(({ slug }) => slug)).toEqual(["home-loan-emi-calculation", "home-loan-tenure-comparison"]);
    expect(getSupportingGuidesForCalculator("car-loan").map(({ slug }) => slug)).toEqual(["car-loan-down-payment-and-loan-amount", "car-loan-on-road-price-vs-loan-amount"]);
    expect(getSupportingGuidesForCalculator("inflation").map(({ slug }) => slug)).toEqual(["inflation-future-cost", "purchasing-power-explained"]);
  });
});

describe("Personal Loan cluster internal links", () => {
  it.each([
    ["personal-loan-emi-explained", ["personal-loan-tenure-comparison", "personal-loan-calculator-vs-lender-quote", "home-loan-emi-calculation"]],
    ["personal-loan-tenure-comparison", ["personal-loan-emi-explained", "personal-loan-calculator-vs-lender-quote"]],
    ["personal-loan-calculator-vs-lender-quote", ["personal-loan-emi-explained", "personal-loan-tenure-comparison"]],
  ] as const)("links %s to the approved destinations", (slug, siblingSlugs) => {
    const article = personalLoanArticle(slug);
    const links = inlineLinks(article);
    expect(links).toContainEqual({ kind: "calculator", slug: "personal-loan" });
    for (const siblingSlug of siblingSlugs) expect(links).toContainEqual({ kind: "article", slug: siblingSlug });
    expect(article.relatedArticles).not.toContain(article.slug);
    expect(new Set(article.relatedArticles).size).toBe(article.relatedArticles.length);
    expect(getRelatedArticles(article)).toHaveLength(article.relatedArticles.length);
    expect(article.relatedCalculators).toEqual([]);
  });
});

describe("Personal Loan cluster numerical integrity", () => {
  it("reconciles the core scenario with calculateLoanDetails", () => {
    const result = calculateLoanDetails({ principal: 500_000, annualInterestRate: 12, tenureMonths: 60 });
    expect(section(personalLoanArticle("personal-loan-emi-explained"), "worked-example").table?.rows).toEqual([[
      formatIndianCurrency(500_000),
      "12%",
      "5 years",
      formatIndianCurrency(result.monthlyEmi),
      formatIndianCurrency(result.totalInterest),
      formatIndianCurrency(result.totalPayment),
    ]]);
  });

  it("reconciles every 2/3/5-year comparison row with the engine", () => {
    const rows = [2, 3, 5].map((years) => {
      const result = calculateLoanDetails({ principal: 500_000, annualInterestRate: 12, tenureMonths: years * 12 });
      return [`${years} years`, formatIndianCurrency(result.monthlyEmi), formatIndianCurrency(result.totalInterest), formatIndianCurrency(result.totalPayment)];
    });
    expect(section(personalLoanArticle("personal-loan-tenure-comparison"), "comparison").table?.rows).toEqual(rows);
  });

  it("keeps the lender-quote baseline aligned with the engine output", () => {
    const result = calculateLoanDetails({ principal: 500_000, annualInterestRate: 12, tenureMonths: 60 });
    const text = JSON.stringify(section(personalLoanArticle("personal-loan-calculator-vs-lender-quote"), "baseline"));
    for (const value of [result.monthlyEmi, result.totalInterest, result.totalPayment]) expect(text).toContain(formatIndianCurrency(value));
  });
});

describe("Personal Loan editorial, assumption and cannibalization safety", () => {
  it("discloses the approved calculation assumptions and exclusions", () => {
    const combined = personalLoanSlugs.map((slug) => articleText(personalLoanArticle(slug))).join(" ");
    expect(combined).toContain("monthly reducing-balance");
    expect(combined).toContain("constant annual rate");
    expect(combined).toContain("regular monthly repayments");
    expect(combined).toContain("does not model variable-rate changes, payment-date differences, missed payments, prepayment, flat-rate interest");
    expect(combined).toContain("apr or effective borrowing cost is not calculated");
  });

  it("avoids approval, eligibility, affordability and lender-rate claims", () => {
    const combined = personalLoanSlugs.map((slug) => articleText(personalLoanArticle(slug))).join(" ");
    for (const phrase of ["guaranteed approval", "instant approval", "pre-approved", "best personal loan", "lowest rate", "amount you qualify for", "12% is a current", "12% is a typical", "recommended tenure"] ) expect(combined).not.toContain(phrase);
    expect(combined).toContain("not a lender quote, sanction, approval or eligibility decision");
    expect(combined).toContain("not an affordability, eligibility or suitability assessment");
    expect(combined).toContain("not a current market rate, typical lender rate, best available rate or guaranteed offer");
  });

  it("does not duplicate generic EMI, Home Loan tenure or prepayment content", () => {
    const core = articleText(personalLoanArticle("personal-loan-emi-explained"));
    const tenure = articleText(personalLoanArticle("personal-loan-tenure-comparison"));
    expect(core).not.toContain("emi = [p");
    for (const duration of ["15 years", "20 years", "25 years", "30 years"]) expect(tenure).not.toContain(duration);
    expect(personalLoanSlugs.some((slug) => slug.includes("prepayment"))).toBe(false);
    expect(tenure).not.toContain("floating-rate home loan");
  });
});

describe("Personal Loan cluster SEO and sitemap", () => {
  it("provides unique metadata, production canonicals and existing schemas", () => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const slug of personalLoanSlugs) {
      const article = personalLoanArticle(slug);
      const url = absoluteUrl(getArticlePath(article));
      const metadata = articleMetadata(article);
      expect(metadata.alternates?.canonical).toBe(url);
      expect(url).toMatch(/^https:\/\/arthasiddhi\.com\/learn\/loans\//);
      expect(metadata.openGraph).toMatchObject({ type: "article", url, title: article.title });
      expect(articleJsonLd(article)).toMatchObject({ "@type": "Article", headline: article.title, mainEntityOfPage: url });
      expect(breadcrumbJsonLd(article).itemListElement).toHaveLength(4);
      expect(faqJsonLd(article)).toMatchObject({ "@type": "FAQPage" });
      expect(article.faq?.length).toBeGreaterThan(0);
      titles.add(article.title);
      descriptions.add(article.description);
    }
    expect(titles.size).toBe(3);
    expect(descriptions.size).toBe(3);
  });

  it("preserves Personal Loan URLs in the unique 95-URL sitemap without a new category", () => {
    const urls = buildSitemap().map(({ url }) => url);
    expect(urls).toHaveLength(95);
    expect(new Set(urls).size).toBe(95);
    for (const slug of personalLoanSlugs) expect(urls.filter((url) => url === absoluteUrl(getArticlePath(personalLoanArticle(slug))))).toHaveLength(1);
    expect(urls.filter((url) => url === absoluteUrl("/learn/loans"))).toHaveLength(1);
  });
});
