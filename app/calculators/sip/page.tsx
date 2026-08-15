import type { Metadata } from "next";
import { CalculatorLayout } from "@/components/calculator/CalculatorLayout";
import { SipCalculator } from "@/components/calculator/SipCalculator";

export const metadata: Metadata = { title: "SIP Calculator | ArthaSiddhi", description: "Estimate SIP returns, total investment and future value with ArthaSiddhi's free calculator." };

export default function SipPage() { return <CalculatorLayout title="SIP Calculator" description="Estimate the potential future value of a regular monthly investment." learningHref="/learn/investments/sip-explained" learningTitle="SIP Explained for Beginners"><SipCalculator /></CalculatorLayout>; }
