import { financialRuleSets } from "../../financial-rules/rule-sets";
import type { FinancialRuleSet } from "../../financial-rules/types";
import { calculators, isCalculatorSlug, type CalculatorSlug } from "../calculators";
import {
  articleSlugs,
  contentCategories,
  type Article,
  type ArticleReference,
  type ArticleSlug,
  type ContentCategory,
} from "../types";
import { bankingArticles } from "./banking";
import { epfArticles } from "./epf";
import { gratuityArticles } from "./gratuity";
import { investmentArticles } from "./investments";
import { loanArticles } from "./loans";
import { personalFinanceArticles } from "./personal-finance";
import { retirementArticles } from "./retirement";
import { taxArticles } from "./tax";

export const categoryLabels: Record<ContentCategory, string> = {
  "personal-finance": "Personal Finance",
  loans: "Loans",
  investments: "Investments",
  banking: "Banking & Savings",
  tax: "Tax",
  retirement: "Retirement",
};

export const categoryDescriptions: Record<ContentCategory, string> = {
  "personal-finance": "Understand compound growth, inflation, future costs and how purchasing power can change over time.",
  loans: "Understand how loan EMIs, tenure, interest and lender-specific costs affect monthly payments and total repayment.",
  investments: "See how regular SIP contributions build over time, how projected growth is calculated and where the assumptions matter.",
  banking: "Understand deposits, savings products and Government-backed savings schemes such as PPF, including how contributions, rates and timing affect an estimate.",
  tax: "Understand taxable-income inputs, new-regime slabs, Section 87A, cess and the difference between annual tax estimates and payroll TDS.",
  retirement: "Understand retirement contributions, corpus projections, annuity assumptions and how to interpret calculator estimates.",
};

export const articles: readonly Article[] = [
  ...loanArticles,
  ...investmentArticles,
  ...bankingArticles,
  ...personalFinanceArticles,
  ...taxArticles,
  ...retirementArticles,
  ...epfArticles,
  ...gratuityArticles,
];

export const publishedCategories = contentCategories.filter((category) => articles.some((article) => article.category === category));

export const featuredArticleSlugs = [
  "home-loan-guide",
  "sip-explained",
  "fixed-deposit-explained",
  "compound-interest",
] as const satisfies readonly ArticleSlug[];

const articleBySlug = new Map<ArticleSlug, Article>(articles.map((article) => [article.slug, article]));

function getRuleSetById(id: string): FinancialRuleSet<unknown> | undefined {
  return (Object.values(financialRuleSets) as FinancialRuleSet<unknown>[]).find((ruleSet) => ruleSet.id === id);
}

export function isContentCategory(category: string): category is ContentCategory {
  return (contentCategories as readonly string[]).includes(category);
}

export function isArticleSlug(slug: string): slug is ArticleSlug {
  return (articleSlugs as readonly string[]).includes(slug);
}

export function getArticle(category: string, slug: string) {
  if (!isArticleSlug(slug)) return undefined;
  const article = articleBySlug.get(slug);
  return article?.category === category ? article : undefined;
}

export function getArticleBySlug(slug: ArticleSlug) {
  return articleBySlug.get(slug);
}

export function getArticlesByCategory(category: string) {
  if (!isContentCategory(category)) return [];
  return articles.filter((article) => article.category === category);
}

export function getRelatedArticles(article: Article) {
  return article.relatedArticles.map((slug) => articleBySlug.get(slug)).filter((candidate): candidate is Article => Boolean(candidate));
}

export function getFeaturedArticles() {
  return featuredArticleSlugs.map((slug) => articleBySlug.get(slug)).filter((article): article is Article => Boolean(article));
}

export function getPrimaryGuideForCalculator(slug: CalculatorSlug) {
  return articles.find((article) => article.primaryCalculator === slug && article.calculatorGuideRole === "core");
}

export function getSupportingGuidesForCalculator(slug: CalculatorSlug, limit = 2) {
  return articles
    .filter((article) => article.primaryCalculator === slug && article.calculatorGuideRole === "supporting")
    .toSorted((left, right) => (right.calculatorDiscoveryPriority ?? 0) - (left.calculatorDiscoveryPriority ?? 0))
    .slice(0, limit);
}

export function getArticleReferences(article: Article): readonly ArticleReference[] {
  const directReferences = article.references ?? [];
  if (article.maintenance.kind !== "rule-sensitive" || !article.maintenance.ruleSetId) return directReferences;
  const ruleSet = getRuleSetById(article.maintenance.ruleSetId);
  if (!ruleSet) return directReferences;
  const ruleReferences = ruleSet.sources.map((source) => ({
    title: source.title,
    publisher: source.authority,
    url: source.reference,
    sourceType: source.sourceType ?? "official" as const,
    accessedAt: source.accessedAt,
  }));
  return [...directReferences, ...ruleReferences];
}

export function getArticleMaintenanceContext(article: Article): { applicablePeriod: string; periodLabels?: { label: string; value: string }[]; verifiedAt: string } | null {
  if (article.maintenance.kind === "evergreen") return null;
  if (article.maintenance.ruleSetId === undefined && article.maintenance.verifiedAt !== undefined && article.maintenance.applicablePeriod !== undefined) {
    return {
      applicablePeriod: article.maintenance.applicablePeriod,
      verifiedAt: article.maintenance.verifiedAt,
    };
  }
  const ruleSet = getRuleSetById(article.maintenance.ruleSetId);
  if (!ruleSet) return null;
  return { applicablePeriod: ruleSet.effectivePeriod, periodLabels: ruleSet.periodLabels, verifiedAt: ruleSet.lastVerified };
}

export function getArticleRegistryIssues(
  candidateArticles: readonly Article[] = articles,
  candidateFeaturedSlugs: readonly ArticleSlug[] = featuredArticleSlugs,
) {
  const issues: string[] = [];
  const seenSlugs = new Set<string>();
  const seenPaths = new Set<string>();
  const coreGuideCalculators = new Set<CalculatorSlug>();
  const candidateBySlug = new Map(candidateArticles.map((article) => [article.slug, article]));

  for (const article of candidateArticles) {
    const path = `/learn/${article.category}/${article.slug}`;
    if (seenSlugs.has(article.slug)) issues.push(`Duplicate article slug: ${article.slug}`);
    if (seenPaths.has(path)) issues.push(`Duplicate article path: ${path}`);
    seenSlugs.add(article.slug);
    seenPaths.add(path);

    if (!isContentCategory(article.category)) issues.push(`Invalid category for ${article.slug}: ${article.category}`);
    if (article.primaryCalculator && !isCalculatorSlug(article.primaryCalculator)) issues.push(`Invalid primary calculator for ${article.slug}: ${article.primaryCalculator}`);
    if (article.primaryCalculator && article.relatedCalculators.includes(article.primaryCalculator)) issues.push(`Primary calculator repeated as secondary for ${article.slug}`);
    if (new Set(article.relatedCalculators).size !== article.relatedCalculators.length) issues.push(`Duplicate secondary calculator for ${article.slug}`);
    for (const calculatorSlug of article.relatedCalculators) {
      if (!isCalculatorSlug(calculatorSlug)) issues.push(`Invalid secondary calculator for ${article.slug}: ${calculatorSlug}`);
    }

    if (article.relatedArticles.includes(article.slug)) issues.push(`Article relates to itself: ${article.slug}`);
    if (new Set(article.relatedArticles).size !== article.relatedArticles.length) issues.push(`Duplicate related article for ${article.slug}`);
    for (const relatedSlug of article.relatedArticles) {
      if (!candidateBySlug.has(relatedSlug)) issues.push(`Invalid related article for ${article.slug}: ${relatedSlug}`);
    }

    if (article.calculatorGuideRole === "core" && article.primaryCalculator) {
      if (coreGuideCalculators.has(article.primaryCalculator)) issues.push(`Multiple core guides for calculator: ${article.primaryCalculator}`);
      coreGuideCalculators.add(article.primaryCalculator);
    }

    if (article.maintenance.kind === "rule-sensitive") {
      const ruleSet = article.maintenance.ruleSetId ? getRuleSetById(article.maintenance.ruleSetId) : undefined;
      if (article.maintenance.ruleSetId && !ruleSet) issues.push(`Unknown rule set for ${article.slug}: ${article.maintenance.ruleSetId}`);
      const context = getArticleMaintenanceContext(article);
      if (!context?.applicablePeriod || !context.verifiedAt) issues.push(`Missing maintenance metadata for ${article.slug}`);
      const hasOfficialSource = getArticleReferences(article).some((reference) => reference.sourceType === "official");
      if (!hasOfficialSource) issues.push(`Rule-sensitive article lacks an official source: ${article.slug}`);
    }
  }

  if (candidateArticles === articles) {
    for (const slug of articleSlugs) {
      if (!candidateBySlug.has(slug)) issues.push(`Declared article slug does not resolve: ${slug}`);
    }
  }
  for (const slug of candidateFeaturedSlugs) {
    if (!candidateBySlug.has(slug)) issues.push(`Featured article slug does not resolve: ${slug}`);
  }
  if (new Set(candidateFeaturedSlugs).size !== candidateFeaturedSlugs.length) issues.push("Duplicate featured article slug");

  for (const calculator of Object.values(calculators)) {
    for (const relatedSlug of calculator.relatedCalculators) {
      if (!isCalculatorSlug(relatedSlug)) issues.push(`Invalid related calculator for ${calculator.slug}: ${relatedSlug}`);
    }
  }

  return issues;
}

const registryIssues = getArticleRegistryIssues();
if (registryIssues.length) throw new Error(`Invalid article registry:\n${registryIssues.join("\n")}`);
