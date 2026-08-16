import Link from "next/link";
import { primaryLinks } from "@/lib/content/site-pages";

export function SiteNav() {
  return (
    <nav aria-label="Primary navigation">
      <ul className="flex flex-wrap items-center justify-end gap-1 text-sm font-medium text-slate-700">
        {primaryLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block rounded-md px-3 py-2 transition hover:bg-slate-100 focus:outline-none focus:ring-3 focus:ring-emerald-100"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
