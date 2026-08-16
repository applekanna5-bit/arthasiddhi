import type { Metadata } from "next";
import { RuleDrivenCalculatorPage } from "@/components/calculator/RuleDrivenCalculatorPage";
import { getCalculator } from "@/lib/content/calculators";
import { pageMetadata } from "@/lib/content/seo";

const calculator = getCalculator("nps");
export const metadata: Metadata = pageMetadata({ ...calculator.metadata, path: calculator.href });
export default function NpsPage() { return <RuleDrivenCalculatorPage slug="nps" />; }

