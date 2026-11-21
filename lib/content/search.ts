import { articles, categoryLabels } from "./articles";
import { calculators } from "./calculators";
import { getArticlePath } from "./seo";

export type SearchKind = "calculator" | "guide";
export type SearchItem = { kind: SearchKind; title: string; description: string; href: string; category: string; keywords: string };
const aliases: Record<string, string> = {
  "home-loan": "emi mortgage housing",
  "car-loan": "emi vehicle",
  "personal-loan": "emi borrowing",
  sip: "systematic investment plan mutual fund",
  "step-up-sip": "increasing sip",
  fd: "fixed deposit",
  rd: "recurring deposit",
  ppf: "public provident fund",
  epf: "employee provident fund pf",
  nps: "national pension system",
  gst: "goods and services tax",
  swp: "systematic withdrawal plan",
  cagr: "compound annual growth rate",
};

export const searchItems: readonly SearchItem[] = [
  ...Object.values(calculators).map((calculator) => ({
    kind: "calculator" as const,
    title: calculator.name,
    description: calculator.description,
    href: calculator.href,
    category: calculator.category,
    keywords: [calculator.slug.replaceAll("-", " "), aliases[calculator.slug] ?? ""].join(" "),
  })),
  ...articles.map((article) => ({
    kind: "guide" as const,
    title: article.title,
    description: article.description,
    href: getArticlePath(article),
    category: categoryLabels[article.category],
    keywords: [article.slug.replaceAll("-", " "), aliases[article.primaryCalculator ?? ""] ?? ""].join(" "),
  })),
];

function normalize(value: string) {
  return value.toLocaleLowerCase("en-IN").normalize("NFKC").replace(/[^a-z0-9]+/g, " ").trim();
}

export function searchContent(query: string, kind: "all" | SearchKind = "all"): SearchItem[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return searchItems
    .filter((item) => kind === "all" || item.kind === kind)
    .map((item) => {
      const title = normalize(item.title);
      const keywords = normalize(item.keywords);
      const body = normalize(item.description + " " + item.category);
      if (!terms.every((term) => (title + " " + keywords + " " + body).includes(term))) return null;
      const score = terms.reduce((sum, term) => sum + (title.includes(term) ? 5 : 0) + (keywords.includes(term) ? 3 : 0) + (body.includes(term) ? 1 : 0), 0)\n        + (item.kind === "calculator" && (title === terms.join(" ") || title.startsWith(terms.join(" ") + " ") || normalize(item.href.split("/").pop() ?? "") === terms.join(" ")) ? 30 : 0);
      return { item, score };
    })
    .filter((result): result is { item: SearchItem; score: number } => result !== null)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .map(({ item }) => item);
}
