import Link from "next/link";

export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return <nav aria-label="Breadcrumb" className="text-sm text-slate-600"><ol className="flex flex-wrap items-center gap-x-2 gap-y-1">{items.map((item, index) => <li key={`${item.label}-${index}`} className="flex items-center gap-2">{index > 0 && <span aria-hidden="true" className="text-slate-400">/</span>}{item.href ? <Link href={item.href} className="rounded-sm hover:text-emerald-700 focus:outline-none focus:ring-3 focus:ring-emerald-100">{item.label}</Link> : <span aria-current="page" className="text-slate-700">{item.label}</span>}</li>)}</ol></nav>;
}
