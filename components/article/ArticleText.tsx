import Link from "next/link";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { getBankingGuideLink, getHomeBuyingJourneyLink, type BankingArticleSlug } from "@/lib/analytics";
import { getArticleBySlug } from "@/lib/content/articles";
import { getCalculator } from "@/lib/content/calculators";
import { getArticlePath } from "@/lib/content/seo";
import type { ArticleInlineContent } from "@/lib/content/types";
import type { ArticleSlug } from "@/lib/content/types";

export function ArticleText({ content, bankingArticleSlug, journeySourceSlug, placement = "article_body" }: { content: ArticleInlineContent; bankingArticleSlug?: BankingArticleSlug; journeySourceSlug?: ArticleSlug; placement?: "article_body" | "article_callout" }) {
  if (typeof content === "string") return content;
  return content.map((segment, index) => {
    if (!segment.link) return <span key={`${index}-${segment.text}`}>{segment.text}</span>;
    const href = segment.link.kind === "calculator"
      ? getCalculator(segment.link.slug).href
      : getArticlePath(getArticleBySlug(segment.link.slug)!);
    const journeyAnalytics = journeySourceSlug ? getHomeBuyingJourneyLink(journeySourceSlug, segment.link.slug, placement) : undefined;
    const analytics = journeyAnalytics ?? (segment.link.kind === "calculator" ? getBankingGuideLink(bankingArticleSlug, segment.link.slug, placement) : undefined);
    if (analytics) return <TrackedLink key={`${index}-${segment.text}`} href={href} analytics={analytics} className="font-semibold text-emerald-700 underline underline-offset-4 focus:outline-none focus:ring-3 focus:ring-emerald-100">{segment.text}</TrackedLink>;
    return <Link key={`${index}-${segment.text}`} href={href} className="font-semibold text-emerald-700 underline underline-offset-4 focus:outline-none focus:ring-3 focus:ring-emerald-100">{segment.text}</Link>;
  });
}
