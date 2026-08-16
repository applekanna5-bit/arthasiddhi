import Link from "next/link";
import { footerLinkGroups } from "@/lib/content/site-pages";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)] lg:px-8">
        <div className="max-w-sm">
          <Link
            href="/"
            className="rounded-sm text-sm font-semibold tracking-[0.18em] text-emerald-400 uppercase focus:outline-none focus:ring-3 focus:ring-emerald-700"
          >
            ArthaSiddhi
          </Link>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Practical financial calculators and plain-language finance education for Indian users.
          </p>
        </div>
        <nav aria-label="Footer navigation" className="grid gap-8 sm:grid-cols-3">
          {footerLinkGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold text-white">{group.title}</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded-sm transition hover:text-white focus:outline-none focus:ring-3 focus:ring-emerald-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-slate-800">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs leading-5 text-slate-500 sm:px-6 lg:px-8">
          Calculator outputs are illustrative estimates and are not financial advice.
        </p>
      </div>
    </footer>
  );
}
