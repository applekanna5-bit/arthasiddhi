import type { ArticleInlineContent } from "@/lib/content/types";
import type { BankingArticleSlug } from "@/lib/analytics";
import { ArticleText } from "./ArticleText";

export function ArticleCallout({ title, text, bankingArticleSlug }: { title: string; text: ArticleInlineContent; bankingArticleSlug?: BankingArticleSlug }) {
  return <aside className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-950"><h3 className="font-semibold">{title}</h3><p className="mt-1"><ArticleText content={text} bankingArticleSlug={bankingArticleSlug} placement="article_callout" /></p></aside>;
}
