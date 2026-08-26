import { createElement } from "react";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ArticleReferences } from "../../components/article/ArticleReferences";
import { calculateLoanDetails } from "../../lib/engine/loan";
import {
  articles,
  getArticle,
  getArticleReferences,
  getArticleRegistryIssues,
  getArticlesByCategory,
  getPrimaryGuideForCalculator,
  getSupportingGuidesForCalculator,
} from "../../lib/content/articles";
import { getCalculator } from "../../lib/content/calculators";
import { calculatorGuideCuration, learnCategoryHubs } from "../../lib/content/discovery";
import { articleJsonLd, articleMetadata, breadcrumbJsonLd, faqJsonLd, getArticlePath } from "../../lib/content/seo";
import { absoluteUrl } from "../../lib/content/site";
import { buildSitemap } from "../../lib/content/sitemap";
import type { Article, ArticleSlug, ArticleTextSegment } from "../../lib/content/types";

const wholeRupeeFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatWholeRupees(value: number) {
  return wholeRupeeFormatter.format(value);
}

const supportingSlugs = [
  "when-home-loan-emi-starts",
  "home-loan-emi-calculation",
  "home-loan-tenure-comparison",
  "home-loan-prepayment",
] as const satisfies readonly ArticleSlug[];

function supportingArticles() {
  return supportingSlugs.map((slug) => getArticle("loans", slug)!);
}

function section(article: Article, id: string) {
  return article.sections.find((candidate) => candidate.id === id)!;
}

describe("Home Loan search cluster", () => {
  it("registers one new EMI-start owner while preserving existing public paths", () => {
    expect(supportingArticles().map(({ slug }) => slug)).toEqual(supportingSlugs);
    expect(articles).toHaveLength(63);
    expect(articles.filter(({ slug }) => slug === "when-home-loan-emi-starts")).toHaveLength(1);
    expect(getArticleRegistryIssues()).toEqual([]);
    expect([
      getArticlePath(getArticle("loans", "home-loan-guide")!),
      getArticlePath(getArticle("loans", "when-home-loan-emi-starts")!),
      getArticlePath(getArticle("investments", "sip-explained")!),
      getArticlePath(getArticle("banking", "fixed-deposit-explained")!),
      getArticlePath(getArticle("personal-finance", "compound-interest")!),
    ]).toEqual([
      "/learn/loans/home-loan-guide",
      "/learn/loans/when-home-loan-emi-starts",
      "/learn/investments/sip-explained",
      "/learn/banking/fixed-deposit-explained",
      "/learn/personal-finance/compound-interest",
    ]);
  });

  it("keeps one Home Loan core guide and four supporting guides in the expanded Loans category", () => {
    const loanArticles = getArticlesByCategory("loans");
    const homeLoanGuides = articles.filter(({ primaryCalculator }) => primaryCalculator === "home-loan");
    expect(loanArticles).toHaveLength(11);
    expect(homeLoanGuides.filter(({ calculatorGuideRole }) => calculatorGuideRole === "core")).toHaveLength(1);
    expect(getPrimaryGuideForCalculator("home-loan")?.slug).toBe("home-loan-guide");
    expect(homeLoanGuides.filter(({ calculatorGuideRole }) => calculatorGuideRole === "supporting")).toHaveLength(4);
    expect(getSupportingGuidesForCalculator("home-loan").map(({ slug }) => slug)).toEqual(["home-loan-emi-calculation", "home-loan-tenure-comparison"]);
    expect(calculatorGuideCuration["home-loan"].supporting).toEqual(["home-loan-emi-calculation", "home-loan-tenure-comparison", "when-home-loan-emi-starts"]);
  });

  it("keeps supporting relationships valid without self-links or duplicates", () => {
    for (const article of supportingArticles()) {
      expect(article.primaryCalculator).toBe("home-loan");
      expect(article.calculatorGuideRole).toBe("supporting");
      expect(article.relatedArticles).not.toContain(article.slug);
      expect(new Set(article.relatedArticles).size).toBe(article.relatedArticles.length);
      for (const relatedSlug of article.relatedArticles) expect(articles.some(({ slug }) => slug === relatedSlug)).toBe(true);
    }
  });

  it("publishes unique metadata and the self-canonical EMI-start route once", () => {
    const sitemapUrls = new Set(buildSitemap().map(({ url }) => url));
    for (const article of supportingArticles()) {
      const url = absoluteUrl(getArticlePath(article));
      expect(articleMetadata(article).alternates?.canonical).toBe(url);
      expect(articleMetadata(article).openGraph?.url).toBe(url);
      expect(sitemapUrls.has(url)).toBe(true);
    }
    const titles = articles.map(({ title }) => title);
    const descriptions = articles.map(({ description }) => description);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
    const newUrl = "https://arthasiddhi.com/learn/loans/when-home-loan-emi-starts";
    expect(buildSitemap().filter(({ url }) => url === newUrl)).toHaveLength(1);
  });

  it("uses official primary references that render as source links", () => {
    for (const article of supportingArticles().filter(({ slug }) => slug !== "when-home-loan-emi-starts")) {
      const references = getArticleReferences(article);
      expect(references.length).toBeGreaterThan(0);
      expect(references.every(({ sourceType, url }) => sourceType === "official" && new URL(url).protocol === "https:")).toBe(true);
      expect(references.some(({ publisher, url }) => publisher === "Reserve Bank of India" && new URL(url).hostname.endsWith("rbi.org.in"))).toBe(true);
      const html = renderToStaticMarkup(createElement(ArticleReferences, { references }));
      expect(html).toContain("Reserve Bank of India");
      expect(html).toContain(`href="${references[0].url.replaceAll("&", "&amp;")}"`);
    }
  });

  it("resolves existing article callouts to the registry-derived Home Loan calculator route", () => {
    for (const article of supportingArticles().filter(({ slug }) => slug !== "when-home-loan-emi-starts")) {
      const segments = article.sections.flatMap(({ callout }) => typeof callout?.text === "string" ? [] : callout?.text ?? []) as readonly ArticleTextSegment[];
      const calculatorLinks = segments.filter((segment) => segment.link?.kind === "calculator");
      expect(calculatorLinks).toHaveLength(1);
      const link = calculatorLinks[0].link;
      expect(link?.kind).toBe("calculator");
      if (link?.kind === "calculator") expect(getCalculator(link.slug).href).toBe("/calculators/home-loan");
    }
  });

  it("keeps EMI-start and tenure variants under one owner each", () => {
    const emiStart = getArticle("loans", "when-home-loan-emi-starts")!;
    const tenure = getArticle("loans", "home-loan-tenure-comparison")!;
    expect(emiStart.sections.map(({ id }) => id)).toEqual(expect.arrayContaining(["sanction-vs-disbursement", "full-disbursement", "partial-disbursement", "pre-emi-vs-regular-emi", "documents-to-check", "calculator-boundary"]));
    expect(section(tenure, "maximum-available-tenure")).toBeDefined();
    expect(articles.some(({ slug }) => ["maximum-home-loan-tenure", "home-loan-duration", "home-loan-period", "home-loan-time-period"].includes(slug))).toBe(false);
    expect(emiStart.relatedArticles).toEqual(["home-loan-guide", "home-loan-emi-calculation"]);
    expect(emiStart.relatedArticles).not.toContain("home-loan-prepayment");
    expect(getArticle("loans", "home-loan-guide")?.relatedArticles).toContain(emiStart.slug);
    expect(getArticle("loans", "home-loan-emi-calculation")?.relatedArticles).toContain(emiStart.slug);
  });

  it("places the EMI-start guide once in Loans and leaves homepage curation unchanged", () => {
    const placements = learnCategoryHubs.loans.groups.flatMap((group) => [group.coreArticle, ...group.supportingArticles]);
    expect(placements.filter((slug) => slug === "when-home-loan-emi-starts")).toHaveLength(1);
  });

  it("uses the existing organization, breadcrumb and visible FAQ schema", () => {
    const article = getArticle("loans", "when-home-loan-emi-starts")!;
    const articleSchema = articleJsonLd(article);
    expect(articleSchema).toMatchObject({ author: { "@type": "Organization", name: "ArthaSiddhi" }, publisher: { "@type": "Organization", name: "ArthaSiddhi" }, mainEntityOfPage: "https://arthasiddhi.com/learn/loans/when-home-loan-emi-starts" });
    expect(breadcrumbJsonLd(article).itemListElement[2]).toMatchObject({ name: "Loans", item: "https://arthasiddhi.com/learn/loans" });
    expect(faqJsonLd(article)?.mainEntity).toHaveLength(article.faq!.length);
  });

  it("links the EMI-start guide to the calculator and preserves the 50-year model range", () => {
    const article = getArticle("loans", "when-home-loan-emi-starts")!;
    const segments = article.sections.flatMap(({ paragraphs }) => paragraphs ?? []).flatMap((paragraph) => typeof paragraph === "string" ? [] : paragraph) as readonly ArticleTextSegment[];
    expect(segments.some((segment) => segment.link?.kind === "calculator" && segment.link.slug === "home-loan")).toBe(true);
    const calculatorSource = readFileSync("components/calculator/LoanCalculator.tsx", "utf8");
    expect(calculatorSource).toContain('id="tenureYears"');
    expect(calculatorSource).toContain("max={50}");
    expect(calculatorSource).toContain("step={0.5}");
  });
});

describe("Home Loan article numeric examples", () => {
  it("reconciles the tenure table and 20-versus-30 comparison with the frozen engine", () => {
    const article = getArticle("loans", "home-loan-tenure-comparison")!;
    const tenures = [15, 20, 25, 30];
    const results = tenures.map((years) => calculateLoanDetails({ principal: 5_000_000, annualInterestRate: 8.5, tenureMonths: years * 12 }));
    const expectedRows = results.map((result, index) => [
      `${tenures[index]} years`,
      formatWholeRupees(result.monthlyEmi),
      `${formatWholeRupees(result.totalInterest)} (₹${(result.totalInterest / 100_000).toFixed(2)} lakh)`,
    ]);
    expect(section(article, "comparison").table?.rows).toEqual(expectedRows);

    const emiDifference = formatWholeRupees(results[1].monthlyEmi - results[3].monthlyEmi);
    const interestDifference = formatWholeRupees(results[3].totalInterest - results[1].totalInterest);
    const comparisonText = section(article, "why-interest-rises").paragraphs?.join(" ") ?? "";
    expect(comparisonText).toContain(`${emiDifference} lower`);
    expect(comparisonText).toContain(`${interestDifference} higher`);
  });

  it("reconciles the EMI and first three amortization rows with the frozen engine", () => {
    const article = getArticle("loans", "home-loan-emi-calculation")!;
    const result = calculateLoanDetails({ principal: 1_000_000, annualInterestRate: 8.5, tenureMonths: 240 });
    const expectedRows = result.amortizationSchedule.slice(0, 3).map((row) => [
      String(row.month),
      formatWholeRupees(row.emi),
      formatWholeRupees(row.interestComponent),
      formatWholeRupees(row.principalComponent),
      formatWholeRupees(row.remainingBalance),
    ]);
    expect(section(article, "worked-example").table?.rows).toEqual(expectedRows);
    expect(section(article, "worked-example").paragraphs?.join(" ")).toContain(`the EMI is ${formatWholeRupees(result.monthlyEmi)}`);
  });
});
