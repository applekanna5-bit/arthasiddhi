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
import { articleSlugs, type Article, type ArticleInternalLink, type ArticleSection, type ArticleSlug } from "../../lib/content/types";

const carLoanSlugs = [
  "car-loan-cost-guide",
  "car-loan-down-payment-and-loan-amount",
  "car-loan-on-road-price-vs-loan-amount",
] as const satisfies readonly ArticleSlug[];

function carLoanArticle(slug: (typeof carLoanSlugs)[number]) {
  const article = getArticle("loans", slug);
  expect(article).toBeDefined();
  return article!;
}

function section(article: Article, id: string): ArticleSection {
  const value = article.sections.find((candidate) => candidate.id === id);
  expect(value).toBeDefined();
  return value!;
}

function links(article: Article): ArticleInternalLink[] {
  const found: ArticleInternalLink[] = [];
  for (const item of article.sections) {
    for (const paragraph of item.paragraphs ?? []) {
      if (typeof paragraph !== "string") for (const segment of paragraph) if (segment.link) found.push(segment.link);
    }
    if (item.callout && typeof item.callout.text !== "string") {
      for (const segment of item.callout.text) if (segment.link) found.push(segment.link);
    }
  }
  return found;
}

function text(article: Article) {
  return JSON.stringify(article).toLowerCase();
}

describe("Car Loan cluster registry and discovery", () => {
  it("registers exactly three unique evergreen Loans articles", () => {
    const registered = articles.filter(({ primaryCalculator }) => primaryCalculator === "car-loan");
    expect(registered.map(({ slug }) => slug)).toEqual(carLoanSlugs);
    expect(new Set(registered.map(getArticlePath)).size).toBe(3);
    expect(getArticlesByCategory("loans")).toHaveLength(10);
    for (const article of registered) {
      expect(article.category).toBe("loans");
      expect(article.primaryCalculator).toBe("car-loan");
      expect(article.maintenance).toEqual({ kind: "evergreen" });
    }
  });

  it("keeps one core guide and two priority-ordered supporting cards", () => {
    expect(getPrimaryGuideForCalculator("car-loan")?.slug).toBe("car-loan-cost-guide");
    expect(carLoanSlugs.map((slug) => carLoanArticle(slug).calculatorGuideRole)).toEqual(["core", "supporting", "supporting"]);
    expect(carLoanArticle("car-loan-down-payment-and-loan-amount").calculatorDiscoveryPriority).toBe(100);
    expect(carLoanArticle("car-loan-on-road-price-vs-loan-amount").calculatorDiscoveryPriority).toBe(50);
    expect(getSupportingGuidesForCalculator("car-loan").map(({ slug }) => slug)).toEqual([
      "car-loan-down-payment-and-loan-amount",
      "car-loan-on-road-price-vs-loan-amount",
    ]);
  });

  it("does not pollute unrelated calculator discovery", () => {
    expect(getPrimaryGuideForCalculator("personal-loan")?.slug).toBe("personal-loan-emi-explained");
    expect(getSupportingGuidesForCalculator("personal-loan").map(({ slug }) => slug)).toEqual(["personal-loan-tenure-comparison", "personal-loan-calculator-vs-lender-quote"]);
    expect(getPrimaryGuideForCalculator("home-loan")?.slug).toBe("home-loan-guide");
    expect(getSupportingGuidesForCalculator("home-loan").map(({ slug }) => slug)).toEqual(["home-loan-emi-calculation", "home-loan-tenure-comparison"]);
  });
});

describe("Car Loan internal links", () => {
  it.each([
    ["car-loan-cost-guide", ["car-loan-down-payment-and-loan-amount", "car-loan-on-road-price-vs-loan-amount", "home-loan-emi-calculation"]],
    ["car-loan-down-payment-and-loan-amount", ["car-loan-cost-guide", "car-loan-on-road-price-vs-loan-amount"]],
    ["car-loan-on-road-price-vs-loan-amount", ["car-loan-cost-guide", "car-loan-down-payment-and-loan-amount"]],
  ] as const)("keeps %s on the approved graph", (slug, relatedSlugs) => {
    const article = carLoanArticle(slug);
    const inlineLinks = links(article);
    expect(inlineLinks).toContainEqual({ kind: "calculator", slug: "car-loan" });
    for (const relatedSlug of relatedSlugs) expect(inlineLinks).toContainEqual({ kind: "article", slug: relatedSlug });
    expect(article.relatedArticles).toEqual(relatedSlugs);
    expect(article.relatedArticles).not.toContain(article.slug);
    expect(new Set(article.relatedArticles).size).toBe(article.relatedArticles.length);
    expect(getRelatedArticles(article)).toHaveLength(article.relatedArticles.length);
  });
});

describe("Car Loan numerical and down-payment integrity", () => {
  const result = calculateLoanDetails({ principal: 800_000, annualInterestRate: 9, tenureMonths: 60 });

  it("reconciles the core example directly with the loan engine", () => {
    expect(section(carLoanArticle("car-loan-cost-guide"), "worked-example").table?.rows).toEqual([[
      formatIndianCurrency(800_000),
      "9%",
      "5 years / 60 months",
      formatIndianCurrency(result.monthlyEmi),
      formatIndianCurrency(result.totalInterest),
      formatIndianCurrency(result.totalPayment),
    ]]);
  });

  it("performs only transparent vehicle-minus-contribution arithmetic outside the engine", () => {
    const article = carLoanArticle("car-loan-down-payment-and-loan-amount");
    expect(section(article, "subtraction-example").table?.rows).toEqual([["₹10,00,000", "₹2,00,000", "₹8,00,000"]]);
    expect(1_000_000 - 200_000).toBe(800_000);
    const engineText = JSON.stringify(section(article, "engine-example"));
    for (const value of [result.monthlyEmi, result.totalInterest, result.totalPayment]) expect(engineText).toContain(formatIndianCurrency(value));
    expect(text(article)).toContain("subtraction happens outside the car loan calculator");
    expect(text(article)).toContain("expects the resulting loan principal to be entered directly");
  });
});

describe("Car Loan boundaries and editorial safety", () => {
  const combined = carLoanSlugs.map((slug) => text(carLoanArticle(slug))).join(" ");

  it("states the supported inputs and unsupported product features", () => {
    const core = text(carLoanArticle("car-loan-cost-guide"));
    expect(core).toContain("accepts only loan amount, annual interest rate and tenure");
    for (const excluded of ["ex-showroom price", "on-road price", "down payment", "registration charges", "road tax", "insurance", "accessories", "processing fees", "financed add-ons", "apr or effective borrowing cost", "prepayment", "balloon or residual value", "flat-rate interest", "eligibility", "approval", "sanction"]) expect(core).toContain(excluded);
    expect(combined).toContain("calculator has no vehicle-price or down-payment input");
  });

  it("contains no prohibited claims, rates, percentages or recommendations", () => {
    for (const phrase of ["guaranteed approval", "likely approval", "pre-approved", "amount you qualify for", "best lender", "lowest rate", "ideal emi", "affordable emi", "best car loan", "current lender rate", "typical lender rate", "market rate", "zero down available", "zero-down availability", "recommended down payment"] ) expect(combined).not.toContain(phrase);
    expect(combined).not.toMatch(/road tax (?:of|at|is) \d/);
    expect(combined).not.toMatch(/(?:registration|dealer|processing) fee (?:of|at|is) \d/);
  });

  it("does not create cannibalizing Car Loan slugs or duplicate the EMI formula", () => {
    for (const slug of ["car-loan-tenure-comparison", "car-loan-calculator-vs-dealer-quote", "car-loan-calculator-vs-lender-quote", "car-loan-prepayment", "flat-rate-vs-reducing-balance-car-loan-interest", "zero-down-payment-car-loan"]) expect(articleSlugs).not.toContain(slug);
    expect(combined).not.toContain("emi = [p");
    expect(combined).not.toContain("(1 + r)^n");
  });
});

describe("Car Loan SEO, schema and sitemap", () => {
  it("uses unique metadata, production canonicals and existing schemas", () => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const slug of carLoanSlugs) {
      const article = carLoanArticle(slug);
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
    expect(titles.size).toBe(3);
    expect(descriptions.size).toBe(3);
  });

  it("keeps each Car Loan route once in the unique 85-URL sitemap", () => {
    const urls = buildSitemap().map(({ url }) => url);
    expect(urls).toHaveLength(85);
    expect(new Set(urls).size).toBe(85);
    for (const slug of carLoanSlugs) expect(urls.filter((url) => url === absoluteUrl(getArticlePath(carLoanArticle(slug))))).toHaveLength(1);
    expect(urls.filter((url) => url === absoluteUrl("/learn/loans"))).toHaveLength(1);
  });
});
