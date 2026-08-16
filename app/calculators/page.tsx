import type { Metadata } from "next";
import Link from "next/link";
import { CalculatorLayout } from "@/components/calculator/CalculatorLayout";
import { calculatorCategories, getCalculatorsByCategory } from "@/lib/content/calculators";
import { pageMetadata } from "@/lib/content/seo";

export const metadata: Metadata = pageMetadata({ title: "Financial Calculators | ArthaSiddhi", description: "Indian financial calculators for loans, investments, savings, and practical planning.", path: "/calculators" });

export default function CalculatorsPage() {
  return <CalculatorLayout title="Indian financial calculators" description="Explore lightweight tools for loans, investments, savings, and financial planning."><div className="space-y-10">{calculatorCategories.map((category) => { const categoryId = `${category.toLowerCase().replaceAll(" & ", "-").replaceAll(" ", "-")}-calculators`; return <section key={category} aria-labelledby={categoryId}><h2 id={categoryId} className="text-2xl font-bold tracking-tight text-slate-950">{category}</h2><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{getCalculatorsByCategory(category).map((calculator) => <Link key={calculator.slug} href={calculator.href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-3 focus:ring-emerald-100"><h3 className="text-lg font-semibold text-slate-950">{calculator.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{calculator.description}</p><span className="mt-4 inline-block text-sm font-semibold text-emerald-700">Open calculator <span aria-hidden="true">→</span></span></Link>)}</div></section>; })}</div></CalculatorLayout>;
}
