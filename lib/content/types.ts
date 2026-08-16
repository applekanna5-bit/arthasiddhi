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
  "sip-explained",
  "fixed-deposit-explained",
  "compound-interest",
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
