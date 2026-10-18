"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { primaryLinks } from "@/lib/content/site-pages";

export function SiteNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary navigation" className="site-header-nav min-w-0 w-full sm:w-auto">
      <ul className="flex flex-wrap items-center gap-1 text-sm sm:gap-2 font-medium text-[var(--as-text-primary)]">
        {primaryLinks.map((link) => {
          const exact = pathname === link.href;
          const active = exact || (link.href !== "/" && pathname?.startsWith(`${link.href}/`));
          return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={exact ? "page" : undefined}
              data-section-active={active ? "true" : undefined}
              className="site-header-link relative inline-flex min-h-11 min-w-11 items-center rounded-md px-3 py-2 hover:bg-[var(--as-surface-soft)] hover:text-[var(--as-brand-teal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--as-brand-teal)]"
            >
              {link.label}
            </Link>
          </li>
        ); })}
      </ul>
    </nav>
  );
}
