import type { Metadata } from "next";
import { CalculatorLayout } from "@/components/calculator/CalculatorLayout";
import { LoanCalculator } from "@/components/calculator/LoanCalculator";

export const metadata: Metadata = { title: "Personal Loan EMI Calculator | ArthaSiddhi", description: "Calculate your personal loan EMI, total interest and repayment schedule using ArthaSiddhi's free calculator." };

export default function PersonalLoanPage() { return <CalculatorLayout title="Personal Loan EMI Calculator" description="Estimate a personal loan EMI and understand the total repayment before you borrow."><LoanCalculator defaults={{ principal: "300000", annualInterestRate: "12", tenureYears: "3" }} /></CalculatorLayout>; }
