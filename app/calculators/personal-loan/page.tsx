import type { Metadata } from "next";
import { CalculatorLayout } from "@/components/calculator/CalculatorLayout";
import { LoanCalculator } from "@/components/calculator/LoanCalculator";
import { getCalculator } from "@/lib/content/calculators";
import { pageMetadata } from "@/lib/content/seo";

const calculator = getCalculator("personal-loan");
export const metadata: Metadata = pageMetadata({ ...calculator.metadata, path: calculator.href });

export default function PersonalLoanPage() { return <CalculatorLayout calculatorSlug="personal-loan" title="Personal Loan EMI Calculator" description="Compare the monthly EMI, total interest and total repayment for the personal loan amount, rate and tenure you enter."><LoanCalculator defaults={{ principal: "300000", annualInterestRate: "12", tenureYears: "3" }} /></CalculatorLayout>; }
