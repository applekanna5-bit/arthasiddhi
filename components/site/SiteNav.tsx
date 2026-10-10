import Link from "next/link";
import { primaryLinks } from "@/lib/content/site-pages";

export function SiteNav() {
  return (
    <nav aria-label="Primary navigation">
      <ul className="flex flex-wrap items-center gap-1 text-sm font-medium text-[var(--as-text-primary)]">
        {primaryLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex min-h-11 items-center rounded-md px-3 py-2 hover:bg-[var(--as-surface-soft)] hover:text-[var(--as-brand-teal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--as-brand-teal)]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
