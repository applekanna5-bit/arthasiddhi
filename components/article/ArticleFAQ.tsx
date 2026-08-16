import type { FaqItem } from "@/lib/content/types";

export function ArticleFAQ({ items }: { items: readonly FaqItem[] }) {
  return <section aria-labelledby="faq-heading" className="border-t border-slate-200 pt-8"><h2 id="faq-heading" className="text-2xl font-bold tracking-tight text-slate-950">Frequently asked questions</h2><div className="mt-5 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">{items.map((item) => <details key={item.question} className="group p-5"><summary className="cursor-pointer list-none font-semibold text-slate-900 focus:outline-none focus:ring-3 focus:ring-emerald-100"><span className="flex items-center justify-between gap-4">{item.question}<span aria-hidden="true" className="text-emerald-700 group-open:rotate-45">+</span></span></summary><p className="mt-3 leading-7 text-slate-600">{item.answer}</p></details>)}</div></section>;
}
