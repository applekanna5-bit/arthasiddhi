import type { Metadata } from "next";
import { CalculatorLayout } from "@/components/calculator/CalculatorLayout";
import { FdCalculator } from "@/components/calculator/FdCalculator";
import { getCalculator } from "@/lib/content/calculators";
import { pageMetadata } from "@/lib/content/seo";

const calculator = getCalculator("fd");
export const metadata: Metadata = pageMetadata({ ...calculator.metadata, path: calculator.href });

export default function FdPage() { return <CalculatorLayout title="FD Calculator" description="Enter the deposit amount, rate, tenure and compounding frequency to see the interest earned and maturity amount." learningHref="/learn/banking/fixed-deposit-explained" learningTitle="Fixed Deposit Explained"><FdCalculator /></CalculatorLayout>; }
