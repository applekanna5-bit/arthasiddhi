import type { Metadata } from "next";
import { CalculatorLayout } from "@/components/calculator/CalculatorLayout";
import { LoanCalculator } from "@/components/calculator/LoanCalculator";
import { getCalculator } from "@/lib/content/calculators";
import { pageMetadata } from "@/lib/content/seo";

const calculator = getCalculator("home-loan");
export const metadata: Metadata = pageMetadata({ ...calculator.metadata, path: calculator.href });

export default function HomeLoanPage() { return <CalculatorLayout calculatorSlug="home-loan" title="Home Loan EMI Calculator" description="See what the loan costs each month and how much interest it adds over the full tenure."><LoanCalculator defaults={{ principal: "5000000", annualInterestRate: "8.5", tenureYears: "20" }} /></CalculatorLayout>; }
