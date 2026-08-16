import { CalculatorLayout } from "./CalculatorLayout";
import { RuleDrivenCalculator, type RuleDrivenSlug } from "./RuleDrivenCalculator";
import { getCalculator } from "@/lib/content/calculators";

export function RuleDrivenCalculatorPage({ slug }: { slug: RuleDrivenSlug }) {
  const calculator = getCalculator(slug);
  return <CalculatorLayout title={calculator.name} description={calculator.description}><RuleDrivenCalculator slug={slug} /></CalculatorLayout>;
}

