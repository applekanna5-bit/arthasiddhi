import { getArticleMaintenanceContext } from "@/lib/content/articles";
import type { Article } from "@/lib/content/types";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

export function ArticleMaintenance({ article }: { article: Article }) {
  const context = getArticleMaintenanceContext(article);
  if (!context) return null;
  return (
    <dl className="mt-5 grid gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950 sm:grid-cols-2">
      {context.periodLabels?.map((period) => <div key={period.label}><dt className="font-semibold">{period.label}</dt><dd className="mt-1">{period.value}</dd></div>) ?? <div><dt className="font-semibold">Applies to</dt><dd className="mt-1">{context.applicablePeriod}</dd></div>}
      <div><dt className="font-semibold">Last verified</dt><dd className="mt-1"><time dateTime={context.verifiedAt}>{formatDate(context.verifiedAt)}</time></dd></div>
    </dl>
  );
}
