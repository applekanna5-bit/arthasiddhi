import { describe, expect, it } from "vitest";
import { calculateRd } from "../../lib/calculator/expanded-calculators";
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

const rdSlugs = [
  "rd-explained",
  "rd-interest-calculation",
  "rd-calculator-projection-vs-actual-maturity",
] as const satisfies readonly ArticleSlug[];

function rdArticle(slug: (typeof rdSlugs)[number]) {
  const article = getArticle("banking", slug);
  expect(article).toBeDefined();
  return article!;
}

function section(article: Article, id: string): ArticleSection {
  const value = article.sections.find((candidate) => candidate.id === id);
  expect(value).toBeDefined();
  return value!;
}

function inlineLinks(article: Article): ArticleInternalLink[] {
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

describe("RD cluster registry and discovery", () => {
  it("registers exactly three unique evergreen Banking articles", () => {
    const registered = articles.filter(({ primaryCalculator }) => primaryCalculator === "rd");
    expect(registered.map(({ slug }) => slug)).toEqual(rdSlugs);
    expect(new Set(registered.map(getArticlePath)).size).toBe(3);
    expect(getArticlesByCategory("banking")).toHaveLength(11);
    for (const article of registered) {
      expect(article.category).toBe("banking");
      expect(article.primaryCalculator).toBe("rd");
      expect(article.maintenance).toEqual({ kind: "evergreen" });
    }
  });

  it("keeps one core and exactly two priority-ordered supporting cards", () => {
    expect(getPrimaryGuideForCalculator("rd")?.slug).toBe("rd-explained");
    expect(rdSlugs.map((slug) => rdArticle(slug).calculatorGuideRole)).toEqual(["core", "supporting", "supporting"]);
    expect(rdArticle("rd-interest-calculation").calculatorDiscoveryPriority).toBe(100);
    expect(rdArticle("rd-calculator-projection-vs-actual-maturity").calculatorDiscoveryPriority).toBe(50);
    expect(getSupportingGuidesForCalculator("rd").map(({ slug }) => slug)).toEqual([
      "rd-interest-calculation",
      "rd-calculator-projection-vs-actual-maturity",
    ]);
  });

  it("does not pollute FD, PPF or unrelated calculator discovery", () => {
    expect(getPrimaryGuideForCalculator("fd")?.slug).toBe("fixed-deposit-explained");
    expect(getSupportingGuidesForCalculator("fd").map(({ slug }) => slug)).toEqual(["fd-interest-calculation", "fd-vs-rd"]);
    expect(getPrimaryGuideForCalculator("ppf")?.slug).toBe("ppf-explained");
    expect(getSupportingGuidesForCalculator("ppf").map(({ slug }) => slug)).toEqual(["ppf-interest-calculation", "ppf-calculator-projection-vs-actual-maturity"]);
    expect(getSupportingGuidesForCalculator("car-loan").map(({ slug }) => slug)).toEqual(["car-loan-down-payment-and-loan-amount", "car-loan-on-road-price-vs-loan-amount"]);
  });
});

describe("RD internal links", () => {
  it.each([
    ["rd-explained", ["rd-interest-calculation", "rd-calculator-projection-vs-actual-maturity", "fd-vs-rd"]],
    ["rd-interest-calculation", ["rd-explained", "rd-calculator-projection-vs-actual-maturity", "fd-vs-rd"]],
    ["rd-calculator-projection-vs-actual-maturity", ["rd-explained", "rd-interest-calculation"]],
  ] as const)("keeps %s on the approved compact graph", (slug, relatedSlugs) => {
    const article = rdArticle(slug);
    const links = inlineLinks(article);
    expect(links).toContainEqual({ kind: "calculator", slug: "rd" });
    for (const relatedSlug of relatedSlugs) expect(links).toContainEqual({ kind: "article", slug: relatedSlug });
    expect(article.relatedArticles).toEqual(relatedSlugs);
    expect(article.relatedArticles).not.toContain(article.slug);
    expect(new Set(article.relatedArticles).size).toBe(article.relatedArticles.length);
    expect(getRelatedArticles(article)).toHaveLength(article.relatedArticles.length);
  });
});

describe("RD numerical and timing integrity", () => {
  const result = calculateRd({ monthlyDeposit: 10_000, annualInterestRate: 7, tenureYears: 3 });

  it("reconciles every displayed baseline result directly with calculateRd", () => {
    expect(section(rdArticle("rd-explained"), "worked-example").table?.rows).toEqual([[
      formatIndianCurrency(10_000),
      "7%",
      "3 years",
      "36",
      formatIndianCurrency(result.totalDeposits),
      formatIndianCurrency(result.interestEarned),
      formatIndianCurrency(result.maturityAmount),
    ]]);
    for (const slug of ["rd-interest-calculation", "rd-calculator-projection-vs-actual-maturity"] as const) {
      const articleText = text(rdArticle(slug));
      for (const value of [result.totalDeposits, result.interestEarned, result.maturityAmount]) expect(articleText).toContain(formatIndianCurrency(value).toLowerCase());
    }
  });

  it("protects the beginning-of-month annuity-due timing convention", () => {
    const combined = rdSlugs.map((slug) => text(rdArticle(slug))).join(" ");
    expect(combined).toContain("annual percentage ÷ 12 ÷ 100");
    expect(combined).toContain("tenure years multiplied by 12");
    expect(combined).toContain("first contribution receives 36 monthly growth periods");
    expect(combined).toContain("final contribution receives one");
    expect(combined).toContain("installments do not all earn interest for the same duration");
    expect(section(rdArticle("rd-interest-calculation"), "deposit-count-and-timing").table?.rows).toEqual([
      ["First", "Beginning of month 1", "36"],
      ["Second", "Beginning of month 2", "35"],
      ["Final", "Beginning of month 36", "1"],
    ]);
    expect(result.totalDeposits).toBe(36 * 10_000);
    expect(result.interestEarned).toBeCloseTo(result.maturityAmount - result.totalDeposits, 8);
  });
});

describe("RD calculator boundaries and editorial safety", () => {
  const combined = rdSlugs.map((slug) => text(rdArticle(slug))).join(" ");

  it("states every unsupported calculator capability", () => {
    for (const boundary of ["variable interest rates", "missed installments", "late installments", "penalties", "premature closure", "tax", "tds", "current bank rates", "bank-specific contribution timing", "bank-specific rounding", "institution-specific contractual terms"]) expect(combined).toContain(boundary);
    expect(combined).toContain("does not expose an installment schedule");
    expect(combined).toContain("does not model missed installments, late installments or penalties");
  });

  it("contains no volatile, guaranteed, penalty or recommendation claims", () => {
    for (const phrase of ["current rd rate", "market rd rate", "typical bank rate", "best rd rate", "highest rd rate", "prevailing rate", "recommended rd", "ideal tenure", "risk-free return", "100% accurate", "best bank", "universal penalty"] ) expect(combined).not.toContain(phrase);
    expect(combined).not.toMatch(/(?:is|offers|provides) (?:a )?guaranteed (?:maturity|return)/);
    expect(combined).not.toMatch(/(?:late|missed|premature)[^.!]{0,40}penalt(?:y|ies) (?:is|are|of) \d/);
  });

  it("does not create cannibalizing RD article slugs", () => {
    for (const slug of ["rd-vs-fd", "how-monthly-rd-installments-build-maturity", "rd-tenure", "rd-premature-closure", "rd-missed-installments", "rd-tax-tds", "best-rd-rates"]) expect(articleSlugs).not.toContain(slug);
    expect(combined).not.toContain("compound interest formula");
  });
});

describe("RD SEO, schema and sitemap", () => {
  it("uses unique metadata, production canonicals and existing schemas", () => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const slug of rdSlugs) {
      const article = rdArticle(slug);
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

  it("adds each route once to a unique 75-URL sitemap without a new category", () => {
    const urls = buildSitemap().map(({ url }) => url);
    expect(urls).toHaveLength(75);
    expect(new Set(urls).size).toBe(75);
    for (const slug of rdSlugs) expect(urls.filter((url) => url === absoluteUrl(getArticlePath(rdArticle(slug))))).toHaveLength(1);
    expect(urls.filter((url) => url === absoluteUrl("/learn/banking"))).toHaveLength(1);
  });
});
