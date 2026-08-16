import type { Metadata } from "next";
import { RuleDrivenCalculatorPage } from "@/components/calculator/RuleDrivenCalculatorPage";
import { getCalculator } from "@/lib/content/calculators";
import { pageMetadata } from "@/lib/content/seo";

const calculator = getCalculator("income-tax");
export const metadata: Metadata = pageMetadata({ ...calculator.metadata, path: calculator.href });
export default function IncomeTaxPage() { return <RuleDrivenCalculatorPage slug="income-tax" />; }

