import { describe, expect, it } from "vitest";
import { calculateSip } from "../../lib/calculator/sip-calculator";
import { calculateLumpsum, calculateStepUpSip } from "../../lib/calculator/expanded-calculators";
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

const sipSupportingSlugs = [
  "sip-return-calculation",
  "sip-vs-lumpsum",
  "fixed-sip-vs-step-up-sip",
  "sip-projection-assumptions",
] as const satisfies readonly ArticleSlug[];

function sipArticle(slug: ArticleSlug) {
  const article = getArticle("investments", slug);
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

describe("SIP content cluster registry and discovery", () => {
  it("registers four unique supporting articles in Investments", () => {
    expect(new Set(articles.map(({ slug }) => slug)).size).toBe(articles.length);
    expect(sipSupportingSlugs.map((slug) => sipArticle(slug).slug)).toEqual(sipSupportingSlugs);
    for (const slug of sipSupportingSlugs) {
      const article = sipArticle(slug);
      expect(article.category).toBe("investments");
      expect(article.primaryCalculator).toBe("sip");
      expect(article.calculatorGuideRole).toBe("supporting");
    }
  });

  it("preserves SIP Explained as the sole core guide", () => {
    expect(getPrimaryGuideForCalculator("sip")?.slug).toBe("sip-explained");
    expect(articles.filter(({ primaryCalculator, calculatorGuideRole }) => primaryCalculator === "sip" && calculatorGuideRole === "core")).toHaveLength(1);
  });

  it("lists all five SIP articles on the generic Investments category", () => {
    expect(getArticlesByCategory("investments").map(({ slug }) => slug)).toEqual(["sip-explained", ...sipSupportingSlugs]);
  });

  it("curates calculator discovery to the core guide and two intended supporting guides", () => {
    expect(getPrimaryGuideForCalculator("sip")?.slug).toBe("sip-explained");
    expect(getSupportingGuidesForCalculator("sip").map(({ slug }) => slug)).toEqual(["sip-return-calculation", "sip-projection-assumptions"]);
    expect(getSupportingGuidesForCalculator("sip")).toHaveLength(2);
    expect(getSupportingGuidesForCalculator("fd").map(({ slug }) => slug)).toEqual(["fd-interest-calculation", "fd-vs-rd"]);
    expect(getSupportingGuidesForCalculator("home-loan").map(({ slug }) => slug)).toEqual(["home-loan-emi-calculation", "home-loan-tenure-comparison"]);
  });
});

describe("SIP cluster internal links", () => {
  it("makes the core guide a contextual hub for all four supporting articles", () => {
    expect(getRelatedArticles(sipArticle("sip-explained")).map(({ slug }) => slug)).toEqual([...sipSupportingSlugs, "compound-interest"]);
    const links = inlineLinks(sipArticle("sip-explained"));
    for (const slug of sipSupportingSlugs) expect(links).toContainEqual({ kind: "article", slug });
  });

  it.each([
    ["sip-return-calculation", [{ kind: "calculator", slug: "sip" }, { kind: "article", slug: "sip-explained" }, { kind: "article", slug: "sip-projection-assumptions" }]],
    ["sip-vs-lumpsum", [{ kind: "calculator", slug: "sip" }, { kind: "calculator", slug: "lumpsum" }, { kind: "article", slug: "sip-explained" }, { kind: "article", slug: "sip-return-calculation" }]],
    ["fixed-sip-vs-step-up-sip", [{ kind: "calculator", slug: "sip" }, { kind: "calculator", slug: "step-up-sip" }, { kind: "article", slug: "sip-explained" }, { kind: "article", slug: "sip-projection-assumptions" }]],
    ["sip-projection-assumptions", [{ kind: "calculator", slug: "sip" }, { kind: "article", slug: "sip-explained" }, { kind: "article", slug: "sip-return-calculation" }]],
  ] as const)("links %s to its required cluster destinations", (slug, requiredLinks) => {
    const links = inlineLinks(sipArticle(slug));
    for (const link of requiredLinks) expect(links).toContainEqual(link);
  });
});

describe("SIP article numerical integrity", () => {
  it("matches the return-calculation example to the SIP engine", () => {
    const result = calculateSip({ monthlyInvestment: 5_000, annualReturnRate: 12, investmentYears: 10 });
    expect(section(sipArticle("sip-return-calculation"), "worked-example").table?.rows).toEqual([[
      "₹5,000", "10 years", wholeRupees(result.totalInvested), wholeRupees(result.estimatedReturns), wholeRupees(result.futureValue),
    ]]);
  });

  it("matches the equal-capital SIP and lumpsum comparison to both engines", () => {
    const sip = calculateSip({ monthlyInvestment: 5_000, annualReturnRate: 12, investmentYears: 10 });
    const lumpsum = calculateLumpsum({ initialInvestment: 600_000, annualReturnRate: 12, investmentYears: 10 });
    expect(section(sipArticle("sip-vs-lumpsum"), "worked-comparison").table?.rows).toEqual([
      ["Monthly SIP", "₹5,000 at the beginning of each month", wholeRupees(sip.totalInvested), wholeRupees(sip.estimatedReturns), wholeRupees(sip.futureValue)],
      ["Lumpsum", "₹6,00,000 at the start", wholeRupees(lumpsum.investedAmount), wholeRupees(lumpsum.estimatedGain), wholeRupees(lumpsum.futureValue)],
    ]);
  });

  it("matches the fixed and step-up comparison to both engines", () => {
    const fixed = calculateSip({ monthlyInvestment: 5_000, annualReturnRate: 12, investmentYears: 10 });
    const stepUp = calculateStepUpSip({ startingMonthlyInvestment: 5_000, annualReturnRate: 12, investmentYears: 10, annualStepUpRate: 10 });
    expect(section(sipArticle("fixed-sip-vs-step-up-sip"), "worked-example").table?.rows).toEqual([
      ["Fixed ₹5,000 a month", wholeRupees(fixed.totalInvested), wholeRupees(fixed.estimatedReturns), wholeRupees(fixed.futureValue), "₹5,000"],
      ["₹5,000 initially; 10% annual step-up", wholeRupees(stepUp.totalInvested), wholeRupees(stepUp.estimatedReturns), wholeRupees(stepUp.futureValue), wholeRupees(stepUp.finalMonthlyInvestment)],
    ]);
    const interpretation = JSON.stringify(section(sipArticle("fixed-sip-vs-step-up-sip"), "separate-contributions-growth"));
    expect(interpretation).toContain(wholeRupees(stepUp.totalInvested - fixed.totalInvested));
    expect(interpretation).toContain(wholeRupees(stepUp.estimatedReturns - fixed.estimatedReturns));
    expect(interpretation).toContain(wholeRupees(stepUp.futureValue - fixed.futureValue));
    expect(interpretation).toContain(wholeRupees(stepUp.finalMonthlyInvestment));
  });

  it("matches all three projection-assumption scenarios to the SIP engine", () => {
    const rows = [8, 10, 12].map((annualReturnRate) => {
      const result = calculateSip({ monthlyInvestment: 5_000, annualReturnRate, investmentYears: 10 });
      return [`${annualReturnRate}%`, wholeRupees(result.totalInvested), wholeRupees(result.estimatedReturns), wholeRupees(result.futureValue)];
    });
    expect(section(sipArticle("sip-projection-assumptions"), "three-assumptions").table?.rows).toEqual(rows);
  });
});

describe("SIP cluster search-intent and SEO protection", () => {
  it("does not create a second generic beginner page", () => {
    expect(articles.filter(({ primaryCalculator, title }) => primaryCalculator === "sip" && /what is sip|sip explained|sip for beginners/i.test(title))).toHaveLength(1);
  });

  it("avoids frozen marketing phrases and unsupported recommendation language", () => {
    const forbidden = ["financial journey", "unlock", "empower", "take control", "make informed decisions", "guaranteed return", "always better", "we recommend"];
    for (const slug of sipSupportingSlugs) for (const phrase of forbidden) expect(articleText(sipArticle(slug))).not.toContain(phrase);
  });

  it("provides canonicals and existing Article, breadcrumb and FAQ schemas", () => {
    for (const slug of sipSupportingSlugs) {
      const article = sipArticle(slug);
      const url = absoluteUrl(getArticlePath(article));
      expect(articleMetadata(article).alternates?.canonical).toBe(url);
      expect(articleJsonLd(article)).toMatchObject({ "@type": "Article", mainEntityOfPage: url, headline: article.title });
      expect(breadcrumbJsonLd(article).itemListElement).toHaveLength(4);
      expect(faqJsonLd(article)).toMatchObject({ "@type": "FAQPage" });
    }
  });

  it("keeps all four routes in the expanded unique sitemap", () => {
    const sitemap = buildSitemap();
    const urls = sitemap.map(({ url }) => url);
    expect(urls).toHaveLength(60);
    expect(new Set(urls).size).toBe(60);
    for (const slug of sipSupportingSlugs) expect(urls).toContain(absoluteUrl(getArticlePath(sipArticle(slug))));
  });
});
