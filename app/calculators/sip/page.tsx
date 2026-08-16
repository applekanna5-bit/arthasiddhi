import type { Metadata } from "next";
import { CalculatorLayout } from "@/components/calculator/CalculatorLayout";
import { SipCalculator } from "@/components/calculator/SipCalculator";
import { getCalculator } from "@/lib/content/calculators";
import { pageMetadata } from "@/lib/content/seo";

const calculator = getCalculator("sip");
export const metadata: Metadata = pageMetadata({ ...calculator.metadata, path: calculator.href });

export default function SipPage() { return <CalculatorLayout title="SIP Calculator" description="Enter a monthly SIP, investment period and assumed return to see the total invested, projected returns and future value." learningHref="/learn/investments/sip-explained" learningTitle="SIP Explained for Beginners"><SipCalculator /></CalculatorLayout>; }
