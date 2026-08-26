import { articles, getArticleBySlug } from "./articles";
import { calculators, type CalculatorSlug } from "./calculators";
import type { Article, ArticleSlug, ContentCategory } from "./types";

export type CalculatorGuideCuration = {
  core?: ArticleSlug;
  supporting: readonly ArticleSlug[];
};

export const calculatorGuideCuration = {
  "home-loan": { core: "home-loan-guide", supporting: ["home-loan-emi-calculation", "home-loan-tenure-comparison", "when-home-loan-emi-starts"] },
  "car-loan": { core: "car-loan-cost-guide", supporting: ["car-loan-down-payment-and-loan-amount", "car-loan-on-road-price-vs-loan-amount"] },
  "personal-loan": { core: "personal-loan-emi-explained", supporting: ["personal-loan-tenure-comparison", "personal-loan-calculator-vs-lender-quote"] },
  sip: { core: "sip-explained", supporting: ["sip-return-calculation", "sip-projection-assumptions"] },
  "step-up-sip": { core: "step-up-sip-explained", supporting: ["step-up-sip-calculation", "step-up-sip-projection-assumptions"] },
  lumpsum: { core: "lumpsum-explained", supporting: ["lumpsum-projection-assumptions"] },
  cagr: { core: "cagr-explained", supporting: ["cagr-vs-absolute-return", "cagr-and-year-to-year-volatility"] },
  swp: { core: "swp-explained", supporting: ["swp-calculation", "swp-corpus-exhaustion"] },
  fd: { core: "fixed-deposit-explained", supporting: ["fd-interest-calculation", "fd-vs-rd"] },
  rd: { core: "rd-explained", supporting: ["rd-interest-calculation", "rd-calculator-projection-vs-actual-maturity"] },
  ppf: { core: "ppf-explained", supporting: ["ppf-interest-calculation", "ppf-calculator-projection-vs-actual-maturity"] },
  "income-tax": { core: "new-tax-regime-slab-calculation", supporting: ["section-87a-rebate", "gross-income-vs-taxable-income"] },
  gst: { core: "gst-explained", supporting: ["gst-remove-from-inclusive-price", "gst-calculator-vs-invoice"] },
  epf: { core: "epf-explained", supporting: ["epf-contribution-calculation", "epf-calculator-projection-assumptions"] },
  nps: { core: "nps-explained", supporting: ["nps-corpus-calculation", "nps-lump-sum-and-annuity"] },
  inflation: { core: "inflation-explained", supporting: ["inflation-future-cost", "purchasing-power-explained"] },
  gratuity: { core: "gratuity-explained", supporting: ["gratuity-calculation", "gratuity-calculator-vs-employer-settlement"] },
} as const satisfies Record<CalculatorSlug, CalculatorGuideCuration>;

export type LearnTopicGroup = {
  id: string;
  title: string;
  description?: string;
  calculator?: CalculatorSlug;
  coreArticle: ArticleSlug;
  supportingArticles: readonly ArticleSlug[];
};

export type LearnCategoryHub = {
  category: ContentCategory;
  topicPreview: readonly string[];
  groups: readonly LearnTopicGroup[];
  comparisons?: readonly ArticleSlug[];
  broaderGuides?: readonly ArticleSlug[];
};

export const learnCategoryHubs: Record<ContentCategory, LearnCategoryHub> = {
  "personal-finance": {
    category: "personal-finance",
    topicPreview: ["Inflation", "Purchasing power", "Compound growth"],
    groups: [{ id: "inflation", title: "Inflation and purchasing power", calculator: "inflation", coreArticle: "inflation-explained", supportingArticles: ["inflation-future-cost", "purchasing-power-explained", "inflation-calculator-projection-assumptions"] }],
    broaderGuides: ["compound-interest"],
  },
  loans: {
    category: "loans",
    topicPreview: ["Home loans", "Personal loans", "Car loans"],
    groups: [
      { id: "home-loan", title: "Home loans", calculator: "home-loan", coreArticle: "home-loan-guide", supportingArticles: ["home-loan-emi-calculation", "home-loan-tenure-comparison", "when-home-loan-emi-starts", "home-loan-prepayment"] },
      { id: "personal-loan", title: "Personal loans", calculator: "personal-loan", coreArticle: "personal-loan-emi-explained", supportingArticles: ["personal-loan-tenure-comparison", "personal-loan-calculator-vs-lender-quote"] },
      { id: "car-loan", title: "Car loans", calculator: "car-loan", coreArticle: "car-loan-cost-guide", supportingArticles: ["car-loan-down-payment-and-loan-amount", "car-loan-on-road-price-vs-loan-amount"] },
    ],
  },
  investments: {
    category: "investments",
    topicPreview: ["SIP", "Lumpsum", "Step-up SIP", "CAGR", "SWP"],
    groups: [
      { id: "sip", title: "Regular investing", calculator: "sip", coreArticle: "sip-explained", supportingArticles: ["sip-return-calculation", "sip-projection-assumptions"] },
      { id: "lumpsum", title: "One-time investing", calculator: "lumpsum", coreArticle: "lumpsum-explained", supportingArticles: ["lumpsum-projection-assumptions"] },
      { id: "step-up-sip", title: "Increasing contributions", calculator: "step-up-sip", coreArticle: "step-up-sip-explained", supportingArticles: ["step-up-sip-calculation", "step-up-sip-projection-assumptions"] },
      { id: "cagr", title: "Measuring growth", calculator: "cagr", coreArticle: "cagr-explained", supportingArticles: ["cagr-vs-absolute-return", "cagr-and-year-to-year-volatility", "cagr-vs-average-annual-return"] },
      { id: "swp", title: "Taking withdrawals", calculator: "swp", coreArticle: "swp-explained", supportingArticles: ["swp-calculation", "swp-corpus-exhaustion"] },
    ],
    comparisons: ["sip-vs-lumpsum", "fixed-sip-vs-step-up-sip"],
  },
  banking: {
    category: "banking",
    topicPreview: ["Fixed deposits", "Recurring deposits", "PPF"],
    groups: [
      { id: "fixed-deposits", title: "Fixed deposits", calculator: "fd", coreArticle: "fixed-deposit-explained", supportingArticles: ["fd-interest-calculation", "premature-fd-withdrawal"] },
      { id: "recurring-deposits", title: "Recurring deposits", calculator: "rd", coreArticle: "rd-explained", supportingArticles: ["rd-interest-calculation", "rd-calculator-projection-vs-actual-maturity"] },
      { id: "ppf", title: "Public Provident Fund", calculator: "ppf", coreArticle: "ppf-explained", supportingArticles: ["ppf-interest-calculation", "ppf-tenure-extension", "ppf-calculator-projection-vs-actual-maturity"] },
    ],
    comparisons: ["fd-vs-rd"],
  },
  tax: {
    category: "tax",
    topicPreview: ["Income tax", "GST"],
    groups: [
      { id: "income-tax", title: "Income tax", calculator: "income-tax", coreArticle: "new-tax-regime-slab-calculation", supportingArticles: ["section-87a-rebate", "gross-income-vs-taxable-income", "health-education-cess-calculation", "income-tax-calculator-vs-payroll-tds"] },
      { id: "gst", title: "GST", calculator: "gst", coreArticle: "gst-explained", supportingArticles: ["gst-remove-from-inclusive-price", "gst-calculator-vs-invoice"] },
    ],
  },
  retirement: {
    category: "retirement",
    topicPreview: ["NPS", "EPF", "Gratuity"],
    groups: [
      { id: "nps", title: "NPS", calculator: "nps", coreArticle: "nps-explained", supportingArticles: ["nps-corpus-calculation", "nps-lump-sum-and-annuity", "nps-calculator-assumptions"] },
      { id: "epf", title: "EPF", calculator: "epf", coreArticle: "epf-explained", supportingArticles: ["epf-contribution-calculation", "epf-calculator-projection-assumptions"] },
      { id: "gratuity", title: "Gratuity", calculator: "gratuity", coreArticle: "gratuity-explained", supportingArticles: ["gratuity-calculation", "gratuity-calculator-vs-employer-settlement", "gratuity-eligibility"] },
    ],
  },
};

export const featuredArticleSlugs = [
  "compound-interest",
  "home-loan-guide",
  "sip-explained",
  "fixed-deposit-explained",
  "new-tax-regime-slab-calculation",
  "nps-explained",
] as const satisfies readonly ArticleSlug[];

export const homeGuideSlugs = ["home-loan-guide", "home-loan-emi-calculation", "home-loan-tenure-comparison"] as const satisfies readonly ArticleSlug[];

function resolveArticles(slugs: readonly ArticleSlug[]): Article[] {
  return slugs.map((slug) => getArticleBySlug(slug)).filter((article): article is Article => Boolean(article));
}

export function getCalculatorGuideCuration(slug: CalculatorSlug, candidateArticles: readonly Article[] = articles) {
  const curation = calculatorGuideCuration[slug];
  const articleBySlug = new Map(candidateArticles.map((article) => [article.slug, article]));
  return { core: curation.core ? articleBySlug.get(curation.core) : undefined, supporting: curation.supporting.map((supportingSlug) => articleBySlug.get(supportingSlug)).filter((article): article is Article => Boolean(article)) };
}

export function getLearnCategoryHub(category: ContentCategory) { return learnCategoryHubs[category]; }
export function getFeaturedArticles() { return resolveArticles(featuredArticleSlugs); }
export function getHomeGuides() { return resolveArticles(homeGuideSlugs); }

export function getDiscoveryRegistryIssues(candidateArticles: readonly Article[] = articles) {
  const issues: string[] = [];
  const articleBySlug = new Map(candidateArticles.map((article) => [article.slug, article]));
  const placements = new Map<ArticleSlug, number>();

  for (const slug of Object.keys(calculators) as CalculatorSlug[]) {
    const curation = calculatorGuideCuration[slug];
    if (!curation) { issues.push(`Missing calculator curation: ${slug}`); continue; }
    const core = curation.core ? articleBySlug.get(curation.core) : undefined;
    if (curation.core && !core) issues.push(`Unknown curated core for ${slug}: ${curation.core}`);
    if (core && (core.primaryCalculator !== slug || core.calculatorGuideRole !== "core")) issues.push(`Curated core ownership mismatch for ${slug}: ${core.slug}`);
    if (new Set(curation.supporting).size !== curation.supporting.length) issues.push(`Duplicate curated supporting guide for ${slug}`);
    if (curation.core && (curation.supporting as readonly ArticleSlug[]).includes(curation.core)) issues.push(`Curated core repeated as supporting for ${slug}: ${curation.core}`);
    for (const supportingSlug of curation.supporting) {
      const article = articleBySlug.get(supportingSlug);
      if (!article) issues.push(`Unknown curated supporting guide for ${slug}: ${supportingSlug}`);
      else if (article.primaryCalculator !== slug && !article.relatedCalculators.includes(slug)) issues.push(`Curated supporting relationship mismatch for ${slug}: ${supportingSlug}`);
    }
  }

  for (const hub of Object.values(learnCategoryHubs)) {
    const ids = hub.groups.map((group) => group.id);
    const headings = hub.groups.map((group) => group.title);
    if (new Set(ids).size !== ids.length) issues.push(`Duplicate group id in ${hub.category}`);
    if (new Set(headings).size !== headings.length) issues.push(`Duplicate group heading in ${hub.category}`);
    for (const group of hub.groups) {
      if (!group.coreArticle || !group.supportingArticles.length && !articleBySlug.has(group.coreArticle)) issues.push(`Invalid empty topic group in ${hub.category}: ${group.id}`);
      for (const slug of [group.coreArticle, ...group.supportingArticles]) registerPlacement(slug, hub.category);
    }
    for (const slug of hub.comparisons ?? []) registerPlacement(slug, hub.category);
    for (const slug of hub.broaderGuides ?? []) registerPlacement(slug, hub.category);
  }

  for (const article of candidateArticles) {
    const count = placements.get(article.slug) ?? 0;
    if (count === 0) issues.push(`Article has no category hub placement: ${article.slug}`);
    if (count > 1) issues.push(`Article has multiple category hub placements: ${article.slug}`);
  }
  for (const slug of featuredArticleSlugs) if (!articleBySlug.has(slug)) issues.push(`Unknown featured article: ${slug}`);
  if (new Set(featuredArticleSlugs).size !== featuredArticleSlugs.length) issues.push("Duplicate featured article");
  return issues;

  function registerPlacement(slug: ArticleSlug, category: ContentCategory) {
    const article = articleBySlug.get(slug);
    if (!article) issues.push(`Unknown category hub article in ${category}: ${slug}`);
    else if (article.category !== category) issues.push(`Category hub ownership mismatch in ${category}: ${slug}`);
    placements.set(slug, (placements.get(slug) ?? 0) + 1);
  }
}

const discoveryIssues = getDiscoveryRegistryIssues();
if (discoveryIssues.length) throw new Error(`Invalid discovery registry:\n${discoveryIssues.join("\n")}`);
