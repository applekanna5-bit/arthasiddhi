import Link from "next/link";
import { getArticlePath } from "@/lib/content/seo";
import { getCalculator } from "@/lib/content/calculators";
import type { Article } from "@/lib/content/types";
import type { LearnTopicGroup as LearnTopicGroupDefinition } from "@/lib/content/discovery";

function GuideCard({ article, kind }: { article: Article; kind: "core" | "supporting" }) {
  return (
    <Link href={getArticlePath(article)} className={kind === "core" ? "rounded-xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-3 focus:ring-emerald-100" : "rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-3 focus:ring-emerald-100"}>
      <p className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">{kind === "core" ? "Start here" : "Guide"}</p>
      <h3 className="mt-2 text-lg font-semibold text-slate-950">{article.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{article.description}</p>
      <p className="mt-4 text-sm text-slate-500">{article.readingTime}</p>
    </Link>
  );
}

export function LearnTopicGroup({ group, core, supporting }: { group: LearnTopicGroupDefinition; core: Article; supporting: readonly Article[] }) {
  const calculator = group.calculator ? getCalculator(group.calculator) : undefined;
  return (
    <section aria-labelledby={`${group.id}-heading`}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id={`${group.id}-heading`} className="text-2xl font-bold tracking-tight text-slate-950">{group.title}</h2>
          {group.description && <p className="mt-2 max-w-3xl leading-7 text-slate-600">{group.description}</p>}
        </div>
        {calculator && <Link href={calculator.href} className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 focus:outline-none focus:ring-3 focus:ring-emerald-100">Open {calculator.shortName} calculator <span aria-hidden="true">→</span></Link>}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <GuideCard article={core} kind="core" />
        {supporting.map((article) => <GuideCard key={article.slug} article={article} kind="supporting" />)}
      </div>
    </section>
  );
}

export function GuideCollection({ id, title, articles }: { id: string; title: string; articles: readonly Article[] }) {
  return (
    <section aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} className="text-2xl font-bold tracking-tight text-slate-950">{title}</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {articles.map((article) => <GuideCard key={article.slug} article={article} kind="supporting" />)}
      </div>
    </section>
  );
}
