import type { ReactNode } from "react";
import type { CalculatorSlug } from "@/lib/content/calculators";
import { CalculatorRelatedContent } from "./CalculatorRelatedContent";

export function CalculatorLayout({
  eyebrow = "ArthaSiddhi",
  title,
  description,
  calculatorSlug,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  calculatorSlug?: CalculatorSlug;
  children: ReactNode;
}) {
  return (
    <main className="flex-1 bg-[var(--as-surface-page)] px-4 py-8 text-[var(--as-text-primary)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section>
          <header className="mb-8 max-w-3xl">
            <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-[var(--as-brand-copper)] uppercase">{eyebrow}</p>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--as-text-primary)] sm:text-4xl">{title}</h1>
            <p className="mt-3 text-base leading-7 text-[var(--as-text-secondary)]">{description}</p>
          </header>
          {children}
          {calculatorSlug && <CalculatorRelatedContent slug={calculatorSlug} />}
        </section>
      </div>
    </main>
  );
}
