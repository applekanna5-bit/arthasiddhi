import type { Metadata } from "next";
import { CalculatorLayout } from "@/components/calculator/CalculatorLayout";
import { LoanCalculator } from "@/components/calculator/LoanCalculator";
import { pageMetadata } from "@/lib/content/seo";

export const metadata: Metadata = pageMetadata({ title: "Car Loan EMI Calculator | ArthaSiddhi", description: "Calculate your car loan EMI, total interest and repayment schedule using ArthaSiddhi's free calculator.", path: "/calculators/car-loan" });

export default function CarLoanPage() { return <CalculatorLayout title="Car Loan EMI Calculator" description="Plan a car loan with a clear estimate of your monthly EMI and total cost."><LoanCalculator defaults={{ principal: "800000", annualInterestRate: "9", tenureYears: "5" }} /></CalculatorLayout>; }
