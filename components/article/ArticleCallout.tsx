import type { ArticleInlineContent } from "@/lib/content/types";
import { ArticleText } from "./ArticleText";

export function ArticleCallout({ title, text }: { title: string; text: ArticleInlineContent }) {
  return <aside className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-950"><h3 className="font-semibold">{title}</h3><p className="mt-1"><ArticleText content={text} /></p></aside>;
}
