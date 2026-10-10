import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { footerLinkGroups } from "@/lib/content/site-pages";

export function SiteFooter() {
  return (
    <footer className="bg-[var(--as-brand-navy)] text-[var(--as-surface-page)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)] lg:px-8">
        <div className="max-w-sm">
          <Link
            href="/"
            className="inline-flex min-h-11 min-w-11 items-center rounded-sm text-xl text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <BrandLogo treatment="monochrome" />
          </Link>
          <p className="mt-3 text-sm leading-6 text-[var(--as-surface-page)]">
            Indian financial calculators with short guides explaining the numbers and assumptions.
          </p>
        </div>
        <nav aria-label="Footer navigation" className="grid min-w-0 gap-6 sm:grid-cols-3">
          {footerLinkGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold text-white">{group.title}</h2>
              <ul className="mt-2 text-sm">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-11 min-w-11 items-center rounded-sm py-2 text-[var(--as-surface-page)] underline decoration-transparent underline-offset-4 hover:text-white hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
      <div className="border-t border-white/20">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs leading-5 text-[var(--as-surface-page)] sm:px-6 lg:px-8">
          Calculator outputs are illustrative estimates and are not financial advice.
        </p>
      </div>
    </footer>
  );
}
