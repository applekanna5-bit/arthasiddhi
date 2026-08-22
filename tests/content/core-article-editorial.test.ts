import { describe, expect, it } from "vitest";
import { articles, getArticle, getArticleRegistryIssues } from "../../lib/content/articles";
import { calculateFd } from "../../lib/calculator/fd-calculator";
import { calculateSip } from "../../lib/calculator/sip-calculator";
import { calculateLoanDetails } from "../../lib/engine/loan";
import { articleJsonLd, articleMetadata, faqJsonLd, getArticlePath } from "../../lib/content/seo";
import type { Article, ArticleInlineContent, ArticleSlug } from "../../lib/content/types";

const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const identities = {
  "home-loan-guide": {
    category: "loans",
    title: "Home Loan Guide for Beginners",
    primaryCalculator: "home-loan",
    calculatorGuideRole: "core",
    relatedArticles: ["home-loan-emi-calculation", "home-loan-tenure-comparison", "home-loan-prepayment"],
    relatedCalculators: [],
    description: "What EMI, tenure, interest and lender terms mean when you compare a home loan.",
  },
  "sip-explained": {
    category: "investments",
    title: "SIP Explained for Beginners",
    primaryCalculator: "sip",
    calculatorGuideRole: "core",
    relatedArticles: ["sip-return-calculation", "sip-vs-lumpsum", "fixed-sip-vs-step-up-sip", "sip-projection-assumptions", "compound-interest"],
    relatedCalculators: [],
    description: "How monthly SIP contributions add up, where projected growth comes from and how to read the future value.",
  },
  "fixed-deposit-explained": {
    category: "banking",
    title: "Fixed Deposit Explained",
    primaryCalculator: "fd",
    calculatorGuideRole: "core",
    relatedArticles: ["fd-interest-calculation", "fd-vs-rd", "premature-fd-withdrawal", "compound-interest"],
    relatedCalculators: [],
    description: "How principal, rate, tenure and compounding determine an FD’s maturity amount, with terms to compare before opening one.",
  },
} as const;

function target(slug: keyof typeof identities) {
  return getArticle(identities[slug].category, slug)!;
}

function section(article: Article, id: string) {
  return article.sections.find((candidate) => candidate.id === id)!;
}

function inlineText(content: ArticleInlineContent) {
  return typeof content === "string" ? content : content.map(({ text }) => text).join("");
}

function articleText(article: Article) {
  return article.sections.flatMap((item) => [
    item.heading,
    ...(item.paragraphs?.map(inlineText) ?? []),
    ...(item.list ?? []),
    ...(item.table?.headers ?? []),
    ...(item.table?.rows.flat() ?? []),
  ]).join(" ");
}

describe("core article identity and architecture", () => {
  it("preserves slugs, categories, URLs, titles and typed relationships", () => {
    for (const [slug, expected] of Object.entries(identities) as [keyof typeof identities, (typeof identities)[keyof typeof identities]][]) {
      const article = target(slug);
      expect(article).toMatchObject(expected);
      expect(getArticlePath(article)).toBe(`/learn/${expected.category}/${slug}`);
      expect(article.publishedAt).toBe("2026-08-15");
    }
  });

  it("keeps every declared article route valid and the registry clean", () => {
    expect(articles).toHaveLength(47);
    expect(new Set(articles.map(getArticlePath)).size).toBe(47);
    expect(getArticleRegistryIssues()).toEqual([]);
  });

  it("feeds each approved description through metadata and Article JSON-LD", () => {
    for (const slug of Object.keys(identities) as (keyof typeof identities)[]) {
      const article = target(slug);
      expect(articleMetadata(article).description).toBe(article.description);
      expect(articleJsonLd(article).description).toBe(article.description);
    }
  });

  it("keeps visible FAQ data aligned with FAQ JSON-LD", () => {
    for (const slug of Object.keys(identities) as (keyof typeof identities)[]) {
      const article = target(slug);
      expect(faqJsonLd(article)?.mainEntity).toEqual(article.faq?.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })));
    }
  });
});

describe("core article numeric examples", () => {
  it("reconciles the home-loan example with the frozen loan engine", () => {
    const result = calculateLoanDetails({ principal: 4_000_000, annualInterestRate: 8.5, tenureMonths: 240 });
    expect(section(target("home-loan-guide"), "worked-example").table?.rows).toEqual([[
      formatter.format(result.monthlyEmi),
      formatter.format(result.totalInterest),
      formatter.format(result.totalPayment),
    ]]);
  });

  it("reconciles the SIP example and preserves beginning-of-month timing", () => {
    const article = target("sip-explained");
    const result = calculateSip({ monthlyInvestment: 5_000, annualReturnRate: 10, investmentYears: 10 });
    expect(section(article, "worked-example").table?.rows).toEqual([[
      formatter.format(result.totalInvested),
      formatter.format(result.estimatedReturns),
      formatter.format(result.futureValue),
    ]]);
    expect(articleText(article)).toContain("beginning of every month");
  });

  it("reconciles yearly and quarterly FD examples with the frozen FD engine", () => {
    const yearly = calculateFd({ principal: 100_000, annualInterestRate: 7, tenureYears: 3, compoundingFrequency: "yearly" });
    const quarterly = calculateFd({ principal: 100_000, annualInterestRate: 7, tenureYears: 3, compoundingFrequency: "quarterly" });
    expect(section(target("fixed-deposit-explained"), "worked-comparison").table?.rows).toEqual([
      ["Yearly", formatter.format(yearly.interestEarned), formatter.format(yearly.maturityAmount)],
      ["Quarterly", formatter.format(quarterly.interestEarned), formatter.format(quarterly.maturityAmount)],
    ]);
  });
});

describe("core article editorial boundaries", () => {
  it("protects the approved D2 editorial micro-edits", () => {
    const compoundInterest = getArticle("personal-finance", "compound-interest")!;
    const tenure = getArticle("loans", "home-loan-tenure-comparison")!;
    const prepayment = getArticle("loans", "home-loan-prepayment")!;
    const changedText = [articleText(compoundInterest), articleText(tenure), articleText(prepayment)].join(" ");

    expect(articleText(compoundInterest)).toContain("The example shows how compounding works; it is not a forecast of investment returns.");
    expect(section(compoundInterest, "using-calculators").heading).toBe("How compounding applies to an FD or SIP");
    expect(articleText(tenure)).toContain("Do not assume the lender will apply the same outcome in every case.");
    expect(section(prepayment, "calculator-scope").heading).toBe("Start with the original loan schedule");
    expect(articleText(prepayment)).toContain("The Home Loan EMI Calculator shows the original EMI, total interest and schedule for the amount, rate and tenure entered. It does not estimate the saving from a later part-prepayment.");
    expect(changedText).not.toContain("The example is mathematics, not an investment forecast.");
    expect(changedText).not.toContain("Using the idea in a calculation");
    expect(changedText).not.toContain("The lender should not be assumed to apply one outcome in every case.");
    expect(changedText).not.toContain("What the current calculator can show");
    expect(changedText).not.toContain("ArthaSiddhi does not currently have a dedicated prepayment calculator.");
  });

  it("keeps the beginner home-loan guide out of detailed comparison and amortization territory", () => {
    const article = target("home-loan-guide");
    expect(article.sections.filter(({ table }) => table)).toHaveLength(1);
    expect(section(article, "worked-example").table?.rows).toHaveLength(1);
    expect(articleText(article)).not.toMatch(/15 years|25 years|30 years|Balance after EMI/);
  });

  it("resolves contextual article and calculator links through declared slugs", () => {
    const expectedArticleLinks: Record<keyof typeof identities, readonly ArticleSlug[]> = {
      "home-loan-guide": ["home-loan-emi-calculation", "home-loan-tenure-comparison", "home-loan-prepayment"],
      "sip-explained": ["compound-interest", "sip-return-calculation", "sip-vs-lumpsum", "fixed-sip-vs-step-up-sip", "sip-projection-assumptions"],
      "fixed-deposit-explained": ["compound-interest", "fd-interest-calculation", "fd-vs-rd", "premature-fd-withdrawal"],
    };
    for (const slug of Object.keys(identities) as (keyof typeof identities)[]) {
      const article = target(slug);
      const links = article.sections.flatMap(({ paragraphs, callout }) => [
        ...(paragraphs ?? []),
        ...(callout ? [callout.text] : []),
      ]).flatMap((content) => typeof content === "string" ? [] : content.flatMap(({ link }) => link ? [link] : []));
      expect(links.filter((link) => link.kind === "article").map((link) => link.slug)).toEqual(expectedArticleLinks[slug]);
      expect(links.filter((link) => link.kind === "calculator").map((link) => link.slug)).toEqual([article.primaryCalculator]);
    }
  });
});
