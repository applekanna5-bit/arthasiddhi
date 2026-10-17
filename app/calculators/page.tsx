import type { Metadata } from "next";
import Link from "next/link";
import { CalculatorDirectoryIcon } from "@/components/calculator/CalculatorDirectoryIcon";
import { calculatorCategories, getCalculatorsByCategory } from "@/lib/content/calculators";
import { pageMetadata } from "@/lib/content/seo";

export const metadata: Metadata = pageMetadata({ title: "Indian Financial Calculators | ArthaSiddhi", description: "Seventeen calculators for loan EMIs, investments, savings, income tax, GST, EPF, NPS, gratuity and inflation.", path: "/calculators" });

const categoryDescriptions = {
  Loans: "See what a loan costs each month and how much interest it adds over the full tenure.",
  Investments: "Compare regular and one-time investing, check annualised growth, or see how long a withdrawal plan may last.",
  Savings: "See how a fixed deposit, monthly RD or annual PPF contribution builds towards maturity.",
  Tax: "Calculate supported income-tax or GST amounts from your inputs. The tools do not decide which tax treatment or GST classification applies.",
  "Retirement & Planning": "Work out retirement savings, gratuity and how inflation can change the value of money over time.",
} as const;


const categoryAnchor = (category: string) => `${category.toLowerCase().replaceAll(" & ", "-").replaceAll(" ", "-")}-calculators`;
const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--as-brand-teal)]";

export default function CalculatorsPage() {
  return (
    <main className="calculator-directory flex-1 bg-[var(--as-surface-page)] px-4 py-9 text-[var(--as-text-primary)] sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--as-brand-copper)] uppercase">ArthaSiddhi</p>
          <h1 className="directory-display mt-4 text-4xl leading-tight tracking-tight sm:text-5xl">Indian financial calculators</h1>
          <p className="mt-4 text-lg leading-8 text-[var(--as-text-secondary)]">Choose the calculation you need for a loan, investment, deposit, tax or longer-term plan.</p>
        </header>
        <nav aria-label="Calculator categories" className="my-7 border-y border-[var(--as-border-subtle)] py-3 sm:my-9">
          <ul className="flex flex-wrap gap-x-2 gap-y-1">
            {calculatorCategories.map((category) => <li key={category}><a href={`#${categoryAnchor(category)}`} className={`inline-flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-semibold text-[var(--as-brand-teal)] hover:bg-[var(--as-surface-soft)] ${focus}`}>{category}</a></li>)}
          </ul>
        </nav>
        <div className="space-y-10 sm:space-y-12">
          {calculatorCategories.map((category) => (
            <section key={category} aria-labelledby={categoryAnchor(category)} className="scroll-mt-6">
              <h2 id={categoryAnchor(category)} tabIndex={-1} className={`directory-display scroll-mt-6 text-3xl leading-tight tracking-tight ${focus}`}>{category}</h2>
              <p className="mt-3 max-w-3xl leading-7 text-[var(--as-text-secondary)]">{categoryDescriptions[category]}</p>
              <div className="directory-grid mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {getCalculatorsByCategory(category).map((calculator) => (
                  <Link key={calculator.slug} href={calculator.href} className={`directory-card flex min-w-0 flex-col rounded-xl border border-[var(--as-border-subtle)] bg-[var(--as-surface-card)] p-5 sm:p-6 ${focus}`}>
                    <CalculatorDirectoryIcon slug={calculator.slug} />
                    <h3 className="mt-4 text-lg font-semibold leading-7">{calculator.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--as-text-secondary)]">{calculator.description}</p>
                    <span className="mt-auto pt-5 text-sm font-semibold text-[var(--as-brand-teal)]">Open calculator <span aria-hidden="true">&rarr;</span></span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
