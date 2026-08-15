import type { Metadata } from "next";
import { CalculatorLayout } from "@/components/calculator/CalculatorLayout";
import { LoanCalculator } from "@/components/calculator/LoanCalculator";

export const metadata: Metadata = { title: "Home Loan EMI Calculator | ArthaSiddhi", description: "Calculate your home loan EMI, total interest and repayment schedule using ArthaSiddhi's free calculator." };

export default function HomeLoanPage() { return <CalculatorLayout title="Home Loan EMI Calculator" description="Estimate your home loan EMI and inspect your complete repayment schedule."><LoanCalculator defaults={{ principal: "5000000", annualInterestRate: "8.5", tenureYears: "20" }} /></CalculatorLayout>; }
