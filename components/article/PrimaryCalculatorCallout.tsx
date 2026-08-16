import Link from "next/link";
import { getCalculator } from "@/lib/content/calculators";
import type { CalculatorSlug } from "@/lib/content/calculators";

export function PrimaryCalculatorCallout({ slug }: { slug: CalculatorSlug }) {
  const calculator = getCalculator(slug);
  return (
    <aside className="mt-7 max-w-3xl rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
      <h2 className="font-semibold">Use the {calculator.shortName} calculator</h2>
      <p className="mt-2 text-sm leading-6">{calculator.description}</p>
      <Link href={calculator.href} className="mt-3 inline-block text-sm font-semibold text-emerald-800 underline underline-offset-4 focus:outline-none focus:ring-3 focus:ring-emerald-100">Open the {calculator.name} <span aria-hidden="true">→</span></Link>
    </aside>
  );
}
