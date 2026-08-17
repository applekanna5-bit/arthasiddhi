import type { Metadata } from "next";
import { CalculatorLayout } from "@/components/calculator/CalculatorLayout";
import { SipCalculator } from "@/components/calculator/SipCalculator";
import { getCalculator } from "@/lib/content/calculators";
import { pageMetadata } from "@/lib/content/seo";

const calculator = getCalculator("sip");
export const metadata: Metadata = pageMetadata({ ...calculator.metadata, path: calculator.href });

export default function SipPage() { return <CalculatorLayout calculatorSlug="sip" title="SIP Calculator" description="See how much you invest over the period and what the projected value becomes at the return you enter."><SipCalculator /></CalculatorLayout>; }
