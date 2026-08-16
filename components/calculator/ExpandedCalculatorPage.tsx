import { CalculatorLayout } from "./CalculatorLayout";
import { ExpandedCalculator } from "./ExpandedCalculator";
import { getCalculator } from "@/lib/content/calculators";

type ExpandedSlug = "ppf" | "rd" | "lumpsum" | "cagr" | "step-up-sip" | "gratuity" | "swp" | "inflation";

export function ExpandedCalculatorPage({ slug }: { slug: ExpandedSlug }) {
  const calculator = getCalculator(slug);
  return <CalculatorLayout title={calculator.name} description={calculator.description}><ExpandedCalculator slug={slug} /></CalculatorLayout>;
}
