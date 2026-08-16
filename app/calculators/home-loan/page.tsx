import type { Metadata } from "next";
import { CalculatorLayout } from "@/components/calculator/CalculatorLayout";
import { LoanCalculator } from "@/components/calculator/LoanCalculator";
import { pageMetadata } from "@/lib/content/seo";

export const metadata: Metadata = pageMetadata({ title: "Home Loan EMI Calculator | ArthaSiddhi", description: "Calculate your home loan EMI, total interest and repayment schedule using ArthaSiddhi's free calculator.", path: "/calculators/home-loan" });

export default function HomeLoanPage() { return <CalculatorLayout title="Home Loan EMI Calculator" description="Estimate your home loan EMI and inspect your complete repayment schedule." learningHref="/learn/loans/home-loan-guide" learningTitle="Home Loan Guide for Beginners"><LoanCalculator defaults={{ principal: "5000000", annualInterestRate: "8.5", tenureYears: "20" }} /></CalculatorLayout>; }
