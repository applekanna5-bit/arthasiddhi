import Link from "next/link";
import { getArticleBySlug } from "@/lib/content/articles";
import { getCalculator } from "@/lib/content/calculators";
import { getArticlePath } from "@/lib/content/seo";
import type { ArticleInlineContent } from "@/lib/content/types";

export function ArticleText({ content }: { content: ArticleInlineContent }) {
  if (typeof content === "string") return content;
  return content.map((segment, index) => {
    if (!segment.link) return <span key={`${index}-${segment.text}`}>{segment.text}</span>;
    const href = segment.link.kind === "calculator"
      ? getCalculator(segment.link.slug).href
      : getArticlePath(getArticleBySlug(segment.link.slug)!);
    return <Link key={`${index}-${segment.text}`} href={href} className="font-semibold text-emerald-700 underline underline-offset-4 focus:outline-none focus:ring-3 focus:ring-emerald-100">{segment.text}</Link>;
  });
}
