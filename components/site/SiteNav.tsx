import Link from "next/link";

export function SiteNav() {
  return <nav aria-label="Primary navigation" className="flex items-center gap-1 text-sm font-medium text-slate-700"><Link href="/" className="rounded-md px-3 py-2 transition hover:bg-slate-100 focus:outline-none focus:ring-3 focus:ring-emerald-100">Home</Link><Link href="/calculators" className="rounded-md px-3 py-2 transition hover:bg-slate-100 focus:outline-none focus:ring-3 focus:ring-emerald-100">Calculators</Link><Link href="/learn" className="rounded-md px-3 py-2 transition hover:bg-slate-100 focus:outline-none focus:ring-3 focus:ring-emerald-100">Learn</Link></nav>;
}
