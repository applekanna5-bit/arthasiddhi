import type { Metadata } from "next";
import { ExpandedCalculatorPage } from "@/components/calculator/ExpandedCalculatorPage";
import { getCalculator } from "@/lib/content/calculators";
import { pageMetadata } from "@/lib/content/seo";

const calculator = getCalculator("gratuity");
export const metadata: Metadata = pageMetadata({ ...calculator.metadata, path: calculator.href });
export default function GratuityPage() { return <ExpandedCalculatorPage slug="gratuity" />; }
