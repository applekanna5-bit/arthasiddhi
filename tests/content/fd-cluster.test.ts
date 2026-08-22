import { describe, expect, it } from "vitest";
import { calculateFd } from "../../lib/calculator/fd-calculator";
import { calculateRd } from "../../lib/calculator/expanded-calculators";
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
import type { CompoundingFrequency } from "../../lib/calculator/types";

const fdSupportingSlugs = [
  "fd-interest-calculation",
  "fd-vs-rd",
  "premature-fd-withdrawal",
] as const satisfies readonly ArticleSlug[];

function fdArticle(slug: ArticleSlug) {
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

describe("FD content cluster registry and discovery", () => {
  it("registers exactly three unique FD supporting articles in Banking", () => {
    expect(new Set(articles.map(({ slug }) => slug)).size).toBe(articles.length);
    expect(fdSupportingSlugs.map((slug) => fdArticle(slug).slug)).toEqual(fdSupportingSlugs);
    for (const slug of fdSupportingSlugs) {
      const article = fdArticle(slug);
      expect(article.category).toBe("banking");
      expect(article.primaryCalculator).toBe("fd");
      expect(article.calculatorGuideRole).toBe("supporting");
    }
  });

  it("preserves Fixed Deposit Explained as the sole FD core guide", () => {
    expect(getPrimaryGuideForCalculator("fd")?.slug).toBe("fixed-deposit-explained");
    expect(articles.filter(({ primaryCalculator, calculatorGuideRole }) => primaryCalculator === "fd" && calculatorGuideRole === "core")).toHaveLength(1);
  });

  it("lists the core guide and all three supporting guides in Banking", () => {
    expect(getArticlesByCategory("banking").map(({ slug }) => slug)).toEqual(["fixed-deposit-explained", ...fdSupportingSlugs, "ppf-explained", "ppf-interest-calculation", "ppf-tenure-extension", "ppf-calculator-projection-vs-actual-maturity", "rd-explained", "rd-interest-calculation", "rd-calculator-projection-vs-actual-maturity"]);
  });

  it("curates exactly the approved two FD calculator cards", () => {
    expect(getSupportingGuidesForCalculator("fd").map(({ slug }) => slug)).toEqual(["fd-interest-calculation", "fd-vs-rd"]);
    expect(getSupportingGuidesForCalculator("fd")).toHaveLength(2);
    expect(getSupportingGuidesForCalculator("fd").map(({ slug }) => slug)).not.toContain("premature-fd-withdrawal");
    expect(getSupportingGuidesForCalculator("rd").map(({ slug }) => slug)).toEqual(["rd-interest-calculation", "rd-calculator-projection-vs-actual-maturity"]);
    expect(getSupportingGuidesForCalculator("ppf").map(({ slug }) => slug)).toEqual(["ppf-interest-calculation", "ppf-calculator-projection-vs-actual-maturity"]);
    expect(getSupportingGuidesForCalculator("sip").map(({ slug }) => slug)).toEqual(["sip-return-calculation", "sip-projection-assumptions"]);
  });
});

describe("FD cluster internal links", () => {
  it("makes the core guide a contextual hub for all three supporting articles", () => {
    const core = fdArticle("fixed-deposit-explained");
    expect(getRelatedArticles(core).map(({ slug }) => slug)).toEqual([...fdSupportingSlugs, "compound-interest"]);
    const links = inlineLinks(core);
    for (const slug of fdSupportingSlugs) expect(links).toContainEqual({ kind: "article", slug });
  });

  it.each([
    ["fd-interest-calculation", [{ kind: "calculator", slug: "fd" }, { kind: "article", slug: "fixed-deposit-explained" }, { kind: "article", slug: "premature-fd-withdrawal" }]],
    ["fd-vs-rd", [{ kind: "calculator", slug: "fd" }, { kind: "calculator", slug: "rd" }, { kind: "article", slug: "fixed-deposit-explained" }, { kind: "article", slug: "fd-interest-calculation" }]],
    ["premature-fd-withdrawal", [{ kind: "calculator", slug: "fd" }, { kind: "article", slug: "fixed-deposit-explained" }, { kind: "article", slug: "fd-interest-calculation" }]],
  ] as const)("links %s to its required destinations", (slug, requiredLinks) => {
    const links = inlineLinks(fdArticle(slug));
    for (const link of requiredLinks) expect(links).toContainEqual(link);
  });

  it("keeps all declared relationships valid, unique and free of self-links", () => {
    for (const slug of fdSupportingSlugs) {
      const article = fdArticle(slug);
      expect(new Set(article.relatedArticles).size).toBe(article.relatedArticles.length);
      expect(article.relatedArticles).not.toContain(article.slug);
      expect(getRelatedArticles(article)).toHaveLength(article.relatedArticles.length);
    }
  });
});

describe("FD cluster numerical integrity", () => {
  it("reconciles all four frequency rows with calculateFd", () => {
    const frequencies: readonly [string, CompoundingFrequency, string][] = [
      ["Yearly", "yearly", "3"],
      ["Half-yearly", "half-yearly", "6"],
      ["Quarterly", "quarterly", "12"],
      ["Monthly", "monthly", "36"],
    ];
    const expected = frequencies.map(([label, compoundingFrequency, periods]) => {
      const result = calculateFd({ principal: 200_000, annualInterestRate: 7, tenureYears: 3, compoundingFrequency });
      return [label, periods, wholeRupees(result.principal), wholeRupees(result.interestEarned), wholeRupees(result.maturityAmount)];
    });
    expect(section(fdArticle("fd-interest-calculation"), "worked-example").table?.rows).toEqual(expected);
  });

  it("reconciles the equal-capital FD and RD comparison with both engines", () => {
    const fd = calculateFd({ principal: 120_000, annualInterestRate: 7, tenureYears: 1, compoundingFrequency: "quarterly" });
    const rd = calculateRd({ monthlyDeposit: 10_000, annualInterestRate: 7, tenureYears: 1 });
    expect(fd.principal).toBe(rd.totalDeposits);
    expect(section(fdArticle("fd-vs-rd"), "worked-comparison").table?.rows).toEqual([
      ["FD", "₹1,20,000 at the start; quarterly compounding", wholeRupees(fd.principal), wholeRupees(fd.interestEarned), wholeRupees(fd.maturityAmount)],
      ["RD", "₹10,000 at the beginning of each month", wholeRupees(rd.totalDeposits), wholeRupees(rd.interestEarned), wholeRupees(rd.maturityAmount)],
    ]);
    expect(articleText(fdArticle("fd-vs-rd"))).toContain("equal capital does not mean equal time invested");
    expect(articleText(fdArticle("fd-vs-rd"))).toContain("beginning-of-month contribution convention");
  });

  it("uses calculateFd only for the original premature-withdrawal scenario", () => {
    const original = calculateFd({ principal: 200_000, annualInterestRate: 7, tenureYears: 3, compoundingFrequency: "quarterly" });
    expect(section(fdArticle("premature-fd-withdrawal"), "original-example").table?.rows).toEqual([[
      wholeRupees(original.principal), "3 years", "Quarterly", wholeRupees(original.interestEarned), wholeRupees(original.maturityAmount),
    ]]);
    const text = articleText(fdArticle("premature-fd-withdrawal"));
    expect(text).toContain("does not calculate premature-withdrawal proceeds");
    expect(text).toContain("original maturity estimate");
    expect(text).not.toMatch(/18-month (withdrawal|closure) (amount|proceeds).*₹/);
  });
});

describe("FD cluster search-intent and SEO protection", () => {
  it("keeps one broad FD guide and distinct supporting titles", () => {
    expect(articles.filter(({ primaryCalculator, title }) => primaryCalculator === "fd" && /fixed deposit explained|what is (an )?fd|how fd works/i.test(title))).toHaveLength(1);
    expect(fdSupportingSlugs.map((slug) => fdArticle(slug).title)).toEqual([
      "How FD Interest Is Calculated: Rate, Tenure and Compounding",
      "FD vs RD: How Deposit Timing Changes the Maturity Value",
      "What Premature FD Withdrawal Can Change",
    ]);
  });

  it("avoids prohibited winner, rate, tax, insurance and senior-rate claims", () => {
    const combined = fdSupportingSlugs.map((slug) => articleText(fdArticle(slug))).join(" ");
    for (const phrase of ["guaranteed best returns", "highest returns", "best investment", "risk-free wealth", "assured wealth creation", "fd is always better", "rd is always better", "current fd rate", "tds", "deposit insurance", "senior citizen rate"]) {
      expect(combined).not.toContain(phrase);
    }
    expect(combined).not.toMatch(/universal (penalty percentage|revised rate)/);
  });

  it("provides unique metadata, production canonicals and existing schemas", () => {
    const descriptions = new Set<string>();
    for (const slug of fdSupportingSlugs) {
      const article = fdArticle(slug);
      const url = absoluteUrl(getArticlePath(article));
      const metadata = articleMetadata(article);
      expect(metadata.alternates?.canonical).toBe(url);
      expect(metadata.openGraph).toMatchObject({ type: "article", url, title: article.title });
      expect(articleJsonLd(article)).toMatchObject({ "@type": "Article", mainEntityOfPage: url, headline: article.title });
      expect(breadcrumbJsonLd(article).itemListElement).toHaveLength(4);
      expect(faqJsonLd(article)).toMatchObject({ "@type": "FAQPage" });
      expect(article.faq?.length).toBeGreaterThan(0);
      descriptions.add(article.description);
    }
    expect(descriptions.size).toBe(3);
  });

  it("keeps all three article routes in the expanded unique sitemap", () => {
    const urls = buildSitemap().map(({ url }) => url);
    expect(urls).toHaveLength(93);
    expect(new Set(urls).size).toBe(93);
    for (const slug of fdSupportingSlugs) expect(urls).toContain(absoluteUrl(getArticlePath(fdArticle(slug))));
  });
});
