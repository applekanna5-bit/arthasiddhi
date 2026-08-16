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
    <main className="flex-1 bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section>
          <header className="mb-8 max-w-3xl">
            <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-emerald-700 uppercase">{eyebrow}</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
            <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
          </header>
          {children}
          {calculatorSlug && <CalculatorRelatedContent slug={calculatorSlug} />}
        </section>
      </div>
    </main>
  );
}
