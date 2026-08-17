import type { Metadata } from "next";
import Link from "next/link";
import { CalculatorLayout } from "@/components/calculator/CalculatorLayout";
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

export default function CalculatorsPage() {
  return <CalculatorLayout title="Indian financial calculators" description="Choose the calculation you need for a loan, investment, deposit, tax or longer-term plan."><div className="space-y-10">{calculatorCategories.map((category) => { const categoryId = `${category.toLowerCase().replaceAll(" & ", "-").replaceAll(" ", "-")}-calculators`; return <section key={category} aria-labelledby={categoryId}><h2 id={categoryId} className="text-2xl font-bold tracking-tight text-slate-950">{category}</h2><p className="mt-2 max-w-3xl leading-7 text-slate-600">{categoryDescriptions[category]}</p><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{getCalculatorsByCategory(category).map((calculator) => <Link key={calculator.slug} href={calculator.href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-3 focus:ring-emerald-100"><h3 className="text-lg font-semibold text-slate-950">{calculator.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{calculator.description}</p><span className="mt-4 inline-block text-sm font-semibold text-emerald-700">Open calculator <span aria-hidden="true">→</span></span></Link>)}</div></section>; })}</div></CalculatorLayout>;
}
