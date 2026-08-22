import type { CalculatorSlug } from "./calculators";

export const contentCategories = [
  "personal-finance",
  "loans",
  "investments",
  "banking",
  "tax",
  "retirement",
] as const;

export type ContentCategory = (typeof contentCategories)[number];

export const articleSlugs = [
  "home-loan-guide",
  "home-loan-emi-calculation",
  "home-loan-tenure-comparison",
  "home-loan-prepayment",
  "personal-loan-emi-explained",
  "personal-loan-tenure-comparison",
  "personal-loan-calculator-vs-lender-quote",
  "car-loan-cost-guide",
  "car-loan-down-payment-and-loan-amount",
  "car-loan-on-road-price-vs-loan-amount",
  "sip-explained",
  "sip-return-calculation",
  "sip-vs-lumpsum",
  "fixed-sip-vs-step-up-sip",
  "sip-projection-assumptions",
  "cagr-explained",
  "cagr-vs-absolute-return",
  "cagr-and-year-to-year-volatility",
  "cagr-vs-average-annual-return",
  "fixed-deposit-explained",
  "fd-interest-calculation",
  "fd-vs-rd",
  "premature-fd-withdrawal",
  "ppf-explained",
  "ppf-interest-calculation",
  "ppf-tenure-extension",
  "ppf-calculator-projection-vs-actual-maturity",
  "rd-explained",
  "rd-interest-calculation",
  "rd-calculator-projection-vs-actual-maturity",
  "compound-interest",
  "inflation-explained",
  "inflation-future-cost",
  "purchasing-power-explained",
  "inflation-calculator-projection-assumptions",
  "new-tax-regime-slab-calculation",
  "section-87a-rebate",
  "health-education-cess-calculation",
  "gross-income-vs-taxable-income",
  "income-tax-calculator-vs-payroll-tds",
  "nps-explained",
  "nps-corpus-calculation",
  "nps-lump-sum-and-annuity",
  "nps-calculator-assumptions",
  "epf-explained",
  "epf-contribution-calculation",
  "epf-calculator-projection-assumptions",
] as const;

export type ArticleSlug = (typeof articleSlugs)[number];

export type ArticleInternalLink =
  | { kind: "calculator"; slug: CalculatorSlug }
  | { kind: "article"; slug: ArticleSlug };

export type ArticleTextSegment = {
  text: string;
  link?: ArticleInternalLink;
};

export type ArticleInlineContent = string | readonly ArticleTextSegment[];

export type ArticleSection = {
  id: string;
  heading: string;
  paragraphs?: readonly ArticleInlineContent[];
  list?: readonly string[];
  callout?: { title: string; text: ArticleInlineContent };
  table?: { caption: string; headers: readonly string[]; rows: readonly (readonly string[])[] };
};

export type FaqItem = { question: string; answer: string };

export type ArticleReference = {
  title: string;
  publisher: string;
  url: string;
  sourceType: "official" | "supporting";
  accessedAt?: string;
};

export type ArticleMaintenance =
  | { kind: "evergreen" }
  | {
      kind: "rule-sensitive";
      ruleSetId?: undefined;
      verifiedAt: string;
      applicablePeriod: string;
    }
  | {
      kind: "rule-sensitive";
      ruleSetId: string;
      verifiedAt?: undefined;
      applicablePeriod?: undefined;
    };

type ArticleBase = {
  title: string;
  slug: ArticleSlug;
  description: string;
  category: ContentCategory;
  byline?: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  maintenance: ArticleMaintenance;
  primaryCalculator: CalculatorSlug | null;
  calculatorGuideRole: "core" | "supporting" | null;
  calculatorDiscoveryPriority?: number;
  sections: readonly ArticleSection[];
  faq?: readonly FaqItem[];
  references?: readonly ArticleReference[];
  relatedCalculators: readonly CalculatorSlug[];
  relatedArticles: readonly ArticleSlug[];
};

export type Article = ArticleBase & (
  | { primaryCalculator: CalculatorSlug; calculatorGuideRole: "core" | "supporting" }
  | { primaryCalculator: null; calculatorGuideRole: null }
);
