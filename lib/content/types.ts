export type ContentCategory =
  | "personal-finance"
  | "loans"
  | "investments"
  | "banking"
  | "tax"
  | "insurance"
  | "retirement"
  | "real-estate";

export type ArticleSection = {
  id: string;
  heading: string;
  paragraphs?: string[];
  list?: string[];
  callout?: { title: string; text: string };
  table?: { caption: string; headers: string[]; rows: string[][] };
};

export type FaqItem = { question: string; answer: string };

export type Article = {
  title: string;
  slug: string;
  description: string;
  category: ContentCategory;
  author: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  sections: ArticleSection[];
  faq?: FaqItem[];
  relatedCalculators: string[];
  relatedArticles: string[];
};
