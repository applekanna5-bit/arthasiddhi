import type { Metadata } from "next";
import { CalculatorLayout } from "@/components/calculator/CalculatorLayout";
import { FdCalculator } from "@/components/calculator/FdCalculator";

export const metadata: Metadata = { title: "FD Calculator | ArthaSiddhi", description: "Calculate fixed deposit interest and maturity amount with ArthaSiddhi's free calculator." };

export default function FdPage() { return <CalculatorLayout title="FD Calculator" description="Estimate your fixed deposit maturity amount for the rate, tenure and compounding frequency you choose." learningHref="/learn/banking/fixed-deposit-explained" learningTitle="Fixed Deposit Explained"><FdCalculator /></CalculatorLayout>; }
