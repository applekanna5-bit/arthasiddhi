import type { Metadata } from "next";
import { ExpandedCalculatorPage } from "@/components/calculator/ExpandedCalculatorPage";
import { getCalculator } from "@/lib/content/calculators";
import { pageMetadata } from "@/lib/content/seo";

const calculator = getCalculator("lumpsum");
export const metadata: Metadata = pageMetadata({ ...calculator.metadata, path: calculator.href });
export default function LumpsumPage() { return <ExpandedCalculatorPage slug="lumpsum" />; }
