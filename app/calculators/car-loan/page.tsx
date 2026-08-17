import type { Metadata } from "next";
import { CalculatorLayout } from "@/components/calculator/CalculatorLayout";
import { LoanCalculator } from "@/components/calculator/LoanCalculator";
import { getCalculator } from "@/lib/content/calculators";
import { pageMetadata } from "@/lib/content/seo";

const calculator = getCalculator("car-loan");
export const metadata: Metadata = pageMetadata({ ...calculator.metadata, path: calculator.href });

export default function CarLoanPage() { return <CalculatorLayout calculatorSlug="car-loan" title="Car Loan EMI Calculator" description="Work out the monthly repayment and total repayment for the car loan amount, rate and tenure you enter."><LoanCalculator defaults={{ principal: "800000", annualInterestRate: "9", tenureYears: "5" }} /></CalculatorLayout>; }
