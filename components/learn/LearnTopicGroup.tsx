import Link from "next/link";
import { getArticlePath } from "@/lib/content/seo";
import { getCalculator } from "@/lib/content/calculators";
import type { Article } from "@/lib/content/types";
import type { LearnTopicGroup as LearnTopicGroupDefinition } from "@/lib/content/discovery";

function GuideCard({ article, kind, corePresentation = "start-here" }: { article: Article; kind: "core" | "supporting"; corePresentation?: LearnTopicGroupDefinition["corePresentation"] }) {
  const isEntry = kind === "core" && corePresentation === "start-here";
  return (
    <Link href={getArticlePath(article)} className={isEntry ? "learn-card rounded-xl border border-[var(--as-brand-teal)] bg-[var(--as-surface-soft)] p-5 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--as-brand-teal)]" : "learn-card rounded-xl border border-[var(--as-border-subtle)] bg-[var(--as-surface-card)] p-5 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--as-brand-teal)]"}>
      <p className="text-xs font-semibold tracking-wide text-[var(--as-brand-copper)] uppercase">{kind === "core" ? (isEntry ? "Start here" : "Overview") : "Guide"}</p>
      <h3 className="mt-2 text-lg font-semibold text-[var(--as-text-primary)]">{article.title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--as-text-secondary)]">{article.description}</p>
      <p className="mt-4 text-sm text-[var(--as-text-secondary)]">{article.readingTime}</p>
    </Link>
  );
}

export function LearnTopicGroup({ group, core, supporting }: { group: LearnTopicGroupDefinition; core: Article; supporting: readonly Article[] }) {
  const calculator = group.calculator ? getCalculator(group.calculator) : undefined;
  return (
    <section aria-labelledby={`${group.id}-heading`}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id={`${group.id}-heading`} className="learn-display text-2xl leading-tight tracking-tight sm:text-3xl">{group.title}</h2>
          {group.description && <p className="mt-2 max-w-3xl leading-7 text-[var(--as-text-secondary)]">{group.description}</p>}
        </div>

{calculator && (
  <Link
    href={`${calculator.href}?returnTo=${encodeURIComponent(`/learn/${core.category}`)}`}
    className="text-sm font-semibold text-[var(--as-brand-teal)] underline decoration-transparent underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--as-brand-teal)]"
  >
    Open {calculator.shortName} calculator{" "}
    <span aria-hidden="true">→</span>
  </Link>
)}

      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <GuideCard article={core} kind="core" corePresentation={group.corePresentation} />
        {supporting.map((article) => <GuideCard key={article.slug} article={article} kind="supporting" />)}
      </div>
    </section>
  );
}

export function GuideCollection({ id, title, articles }: { id: string; title: string; articles: readonly Article[] }) {
  return (
    <section aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} className="text-2xl font-bold tracking-tight text-[var(--as-text-primary)]">{title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {articles.map((article) => <GuideCard key={article.slug} article={article} kind="supporting" />)}
      </div>
    </section>
  );
}
