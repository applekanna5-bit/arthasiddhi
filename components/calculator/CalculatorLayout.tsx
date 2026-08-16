import type { ReactNode } from "react";
import Link from "next/link";

export function CalculatorLayout({
  eyebrow = "ArthaSiddhi",
  title,
  description,
  learningHref,
  learningTitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  learningHref?: string;
  learningTitle?: string;
  children: ReactNode;
}) {
  return (
    <main className="flex-1 bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section>
          <header className="mb-8 max-w-3xl">
            <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-emerald-700 uppercase">{eyebrow}</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
            <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
            {learningHref && learningTitle && (
              <Link
                href={learningHref}
                className="mt-4 inline-block rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 focus:outline-none focus:ring-3 focus:ring-emerald-100"
              >
                Read: {learningTitle} <span aria-hidden="true">→</span>
              </Link>
            )}
          </header>
          {children}
        </section>
      </div>
    </main>
  );
}
