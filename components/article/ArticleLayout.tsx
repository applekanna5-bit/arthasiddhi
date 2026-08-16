import Link from "next/link";
import { ArticleCallout } from "./ArticleCallout";
import { ArticleFAQ } from "./ArticleFAQ";
import { ArticleReferences } from "./ArticleReferences";
import { Breadcrumbs } from "./Breadcrumbs";
import { RelatedArticles, RelatedCalculators } from "./RelatedContent";
import { TableOfContents } from "./TableOfContents";
import { categoryLabels, getRelatedArticles } from "@/lib/content/articles";
import { getRelatedCalculators } from "@/lib/content/calculators";
import type { Article } from "@/lib/content/types";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

export function ArticleLayout({ article }: { article: Article }) {
  const category = categoryLabels[article.category];

  return (
    <main className="flex-1 bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <article>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Learn", href: "/learn" }, { label: category, href: `/learn/${article.category}` }, { label: article.title }]} />
          <header className="mt-7 max-w-3xl">
            <Link href={`/learn/${article.category}`} className="rounded-sm text-sm font-semibold tracking-wide text-emerald-700 uppercase focus:outline-none focus:ring-3 focus:ring-emerald-100">{category}</Link>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">{article.title}</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">{article.description}</p>
            <dl className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
              <div><dt className="sr-only">Author</dt><dd>By {article.author}</dd></div>
              <div><dt className="sr-only">Published</dt><dd>Published <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time></dd></div>
              <div><dt className="sr-only">Updated</dt><dd>Updated <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time></dd></div>
              <div><dt className="sr-only">Reading time</dt><dd>{article.readingTime}</dd></div>
            </dl>
            <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
              This article is for education and general information. See the <Link href="/disclaimer" className="font-semibold underline underline-offset-2 focus:outline-none focus:ring-3 focus:ring-amber-200">Financial Disclaimer</Link> before using it for an important decision.
            </p>
          </header>
          <div className="mt-10 grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-6 lg:self-start"><TableOfContents sections={article.sections} /></aside>
            <div className="min-w-0 space-y-10">
              <div className="space-y-10">
                {article.sections.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-6">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-950">{section.heading}</h2>
                    {section.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-4 leading-7 text-slate-700">{paragraph}</p>)}
                    {section.list && <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-slate-700">{section.list.map((item) => <li key={item}>{item}</li>)}</ul>}
                    {section.table && <div className="mt-5 max-w-full overflow-x-auto rounded-xl border border-slate-200"><table className="min-w-full text-left text-sm"><caption className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left font-medium text-slate-700">{section.table.caption}</caption><thead className="bg-slate-50 text-slate-700"><tr>{section.table.headers.map((header) => <th key={header} scope="col" className="px-4 py-3 font-semibold">{header}</th>)}</tr></thead><tbody className="divide-y divide-slate-200 bg-white text-slate-700">{section.table.rows.map((row) => <tr key={row.join("-")}>{row.map((cell) => <td key={cell} className="px-4 py-3 align-top leading-6">{cell}</td>)}</tr>)}</tbody></table></div>}
                    {section.callout && <div className="mt-5"><ArticleCallout {...section.callout} /></div>}
                  </section>
                ))}
              </div>
              {article.faq && <ArticleFAQ items={article.faq} />}
              <ArticleReferences references={article.references} />
              <RelatedCalculators calculators={getRelatedCalculators(article.relatedCalculators)} />
              <RelatedArticles articles={getRelatedArticles(article)} />
              <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Learn", href: "/learn" }, { label: category, href: `/learn/${article.category}` }, { label: article.title }]} />
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
