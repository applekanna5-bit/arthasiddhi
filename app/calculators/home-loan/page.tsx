import type { Metadata } from "next";
import { CalculatorLayout } from "@/components/calculator/CalculatorLayout";
import { LoanCalculator } from "@/components/calculator/LoanCalculator";
import { getCalculator } from "@/lib/content/calculators";
import { pageMetadata } from "@/lib/content/seo";

const calculator = getCalculator("home-loan");
export const metadata: Metadata = pageMetadata({ ...calculator.metadata, path: calculator.href });

export default function HomeLoanPage() { return <CalculatorLayout title="Home Loan EMI Calculator" description="Estimate your home loan EMI and inspect your complete repayment schedule." learningHref="/learn/loans/home-loan-guide" learningTitle="Home Loan Guide for Beginners"><LoanCalculator defaults={{ principal: "5000000", annualInterestRate: "8.5", tenureYears: "20" }} /></CalculatorLayout>; }
