import { calculateGst } from "../../calculator/rule-driven-calculators";
import { formatIndianCurrency, formatPercentage } from "../../calculator/formatting";
import { gstRuleSet } from "../../financial-rules/rule-sets";
import type { Article } from "../types";

const exclusiveInput = { mode: "exclusive" as const, transactionType: "intra-state" as const, amount: 1_000, gstRate: 18 };
const inclusiveInput = { mode: "inclusive" as const, transactionType: "intra-state" as const, amount: 1_180, gstRate: 18 };
const twelvePercentInput = { ...inclusiveInput, transactionType: "inter-state" as const, amount: 1_120, gstRate: 12 };
const exclusive = calculateGst(exclusiveInput, gstRuleSet);
const inclusive = calculateGst(inclusiveInput, gstRuleSet);
const twelvePercent = calculateGst(twelvePercentInput, gstRuleSet);

const components = (result: ReturnType<typeof calculateGst>) => [formatIndianCurrency(result.taxableValue), formatIndianCurrency(result.totalGst), formatIndianCurrency(result.cgst), formatIndianCurrency(result.sgst), formatIndianCurrency(result.igst), formatIndianCurrency(result.invoiceTotal)];

export const gstArticles = [
  {
    title: "GST Explained: Base Amount, Tax and Total Price",
    slug: "gst-explained",
    description: "Understand GST-exclusive and GST-inclusive arithmetic, selected rates, tax components, invoice totals and calculator limits.",
    category: "tax",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    readingTime: "7 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "gst",
    calculatorGuideRole: "core",
    relatedCalculators: [],
    relatedArticles: ["gst-remove-from-inclusive-price", "gst-calculator-vs-invoice"],
    sections: [
      { id: "answer", heading: "GST arithmetic starts with the amount and rate you select", paragraphs: ["The GST Calculator adds GST to a taxable value or separates GST from an amount that already includes tax. It uses the selected or custom rate as an arithmetic input; it does not determine the legally applicable rate for a supply.", [{ text: "Enter the amount and assumptions in the " }, { text: "GST Calculator", link: { kind: "calculator", slug: "gst" } }, { text: "." }]] },
      { id: "exclusive", heading: "Adding GST to an exclusive amount", paragraphs: [`For ${formatIndianCurrency(exclusiveInput.amount)} at ${formatPercentage(exclusiveInput.gstRate)} in the selected intra-state mode, the engine produces GST of ${formatIndianCurrency(exclusive.totalGst)}. It splits that arithmetic amount into CGST of ${formatIndianCurrency(exclusive.cgst)} and SGST of ${formatIndianCurrency(exclusive.sgst)}, giving an invoice total of ${formatIndianCurrency(exclusive.invoiceTotal)}.`], table: { caption: "Engine-derived exclusive GST example", headers: ["Taxable value", "GST", "CGST", "SGST", "IGST", "Invoice total"], rows: [components(exclusive)] } },
      { id: "inclusive", heading: "Removing GST from an inclusive amount", paragraphs: [`For ${formatIndianCurrency(inclusiveInput.amount)} inclusive of ${formatPercentage(inclusiveInput.gstRate)}, the engine recovers a taxable value of ${formatIndianCurrency(inclusive.taxableValue)} and GST of ${formatIndianCurrency(inclusive.totalGst)}. The selected intra-state split is CGST ${formatIndianCurrency(inclusive.cgst)} and SGST ${formatIndianCurrency(inclusive.sgst)}.`], callout: { title: "Reverse-GST detail", text: [{ text: "The division-based recovery is explained in " }, { text: "How to Remove GST From an Inclusive Price", link: { kind: "article", slug: "gst-remove-from-inclusive-price" } }, { text: "." }] } },
      { id: "components", heading: "Transaction type is a user-selected calculation assumption", paragraphs: ["In the selected intra-state mode the engine divides GST equally between CGST and SGST. In the selected inter-state mode it assigns the full amount to IGST. This selector does not determine place of supply or the legally applicable tax component.", `For example, ${formatIndianCurrency(twelvePercentInput.amount)} inclusive at ${formatPercentage(twelvePercentInput.gstRate)} in the selected inter-state mode gives a taxable value of ${formatIndianCurrency(twelvePercent.taxableValue)}, GST of ${formatIndianCurrency(twelvePercent.totalGst)} and IGST of ${formatIndianCurrency(twelvePercent.igst)}.`] },
      { id: "limits", heading: "Selected rates and calculator arithmetic are not compliance conclusions", paragraphs: ["The visible presets—0%, 3%, 5%, 12%, 18% and 28%—are arithmetic shortcuts, not a complete GST rate list. Custom rates remain available.", "The calculator does not determine HSN/SAC classification, exemptions, nil- or zero-rated status, cess, reverse charge, composition treatment, place of supply, statutory valuation, return obligations or invoice compliance.", [{ text: "If your invoice differs, review " }, { text: "Why a GST Calculator May Differ From an Invoice", link: { kind: "article", slug: "gst-calculator-vs-invoice" } }, { text: "." }]] },
    ],
    faq: [
      { question: "Does selecting 18% prove that 18% legally applies?", answer: "No. The rate is a calculator input. Correct GST treatment depends on the supply, classification and applicable official rules." },
      { question: "Does the calculator determine whether CGST and SGST apply?", answer: "No. It performs the selected intra-state or inter-state arithmetic split; it does not determine place of supply." },
      { question: "Does the calculator include cess or reverse charge?", answer: "No. Those are outside this arithmetic calculator." },
    ],
  },
  {
    title: "How to Remove GST From an Inclusive Price",
    slug: "gst-remove-from-inclusive-price",
    description: "Recover the taxable base and GST portion from an inclusive amount using the GST calculator's reverse-GST arithmetic.",
    category: "tax",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    readingTime: "6 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "gst",
    calculatorGuideRole: "supporting",
    calculatorDiscoveryPriority: 100,
    relatedCalculators: [],
    relatedArticles: ["gst-explained", "gst-calculator-vs-invoice"],
    sections: [
      { id: "answer", heading: "Reverse GST recovers the pre-tax base from the total", paragraphs: ["When a displayed price already includes GST, the GST portion is not found by subtracting the rate percentage from the total. The calculator's inclusive mode recovers the taxable base and then derives GST as the difference between total and base.", [{ text: "Use the inclusive mode in the " }, { text: "GST Calculator", link: { kind: "calculator", slug: "gst" } }, { text: " when the entered amount already includes the selected rate." }]] },
      { id: "example", heading: "Example: ₹1,180 inclusive at 18%", paragraphs: [`The engine-derived result for ${formatIndianCurrency(inclusiveInput.amount)} inclusive at ${formatPercentage(inclusiveInput.gstRate)} is a taxable base of ${formatIndianCurrency(inclusive.taxableValue)} and GST of ${formatIndianCurrency(inclusive.totalGst)}. With intra-state selected, CGST is ${formatIndianCurrency(inclusive.cgst)} and SGST is ${formatIndianCurrency(inclusive.sgst)}.`], table: { caption: "Engine-derived reverse-GST example", headers: ["Inclusive amount", "Taxable base", "GST", "CGST", "SGST", "Invoice total"], rows: [[formatIndianCurrency(inclusive.invoiceTotal), formatIndianCurrency(inclusive.taxableValue), formatIndianCurrency(inclusive.totalGst), formatIndianCurrency(inclusive.cgst), formatIndianCurrency(inclusive.sgst), formatIndianCurrency(inclusive.invoiceTotal)]] } },
      { id: "why", heading: "Why subtracting 18% from ₹1,180 is not the reverse calculation", paragraphs: ["The 18% rate applies to the pre-tax base, not to the GST-inclusive total. The inclusive total is therefore the base plus 18% of that base. Subtracting 18% of the total answers a different question and does not recover the original base.", "The engine keeps full internal precision and the interface formats the displayed currency values."] },
      { id: "scope", heading: "The transaction selector remains an assumption", paragraphs: ["The selected intra-state mode splits the calculated GST equally into CGST and SGST. Selecting inter-state would show the full calculated amount as IGST. The calculator does not determine legal place of supply, classification, exemption, cess or reverse-charge treatment.", [{ text: "For the wider arithmetic scope, read " }, { text: "GST Explained", link: { kind: "article", slug: "gst-explained" } }, { text: ". If an invoice differs, see " }, { text: "Why a GST Calculator May Differ From an Invoice", link: { kind: "article", slug: "gst-calculator-vs-invoice" } }, { text: "." }]] },
    ],
    faq: [
      { question: "Can I subtract 18% from an inclusive price to remove GST?", answer: "No. Reverse GST recovers the base using the inclusive amount and selected rate relationship; subtracting the percentage from the total does not recover the pre-tax base." },
      { question: "Does reverse GST identify the legally correct rate?", answer: "No. It uses the rate selected by the user for arithmetic only." },
    ],
  },
  {
    title: "Why a GST Calculator May Differ From an Invoice",
    slug: "gst-calculator-vs-invoice",
    description: "Understand why selected rates, taxable-value rules, line items, rounding and invoice-specific adjustments can produce different GST amounts.",
    category: "tax",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    readingTime: "6 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "gst",
    calculatorGuideRole: "supporting",
    calculatorDiscoveryPriority: 50,
    relatedCalculators: [],
    relatedArticles: ["gst-explained", "gst-remove-from-inclusive-price"],
    sections: [
      { id: "different-inputs", heading: "Different inputs produce different arithmetic", paragraphs: ["The calculator uses one entered amount, one selected or custom rate, one calculation mode and one selected transaction type. An invoice can reflect several taxable lines, discounts, freight or other charges, and invoice-specific rounding.", "The calculator assumes the amount supplied is appropriate for the selected mode. It does not perform statutory valuation under Section 15 or derive the taxable value from an invoice."] },
      { id: "legal-context", heading: "Classification and tax treatment are outside the calculator", paragraphs: ["Actual GST treatment can depend on goods or services classification, exemptions, nil- or zero-rated treatment, cess, reverse charge and place-of-supply rules. The calculator does not determine any of those matters.", "A selected rate is an arithmetic assumption, not a conclusion that the rate legally applies. An amount difference alone does not show that an invoice is wrong or non-compliant."] },
      { id: "rounding", heading: "Line-level and invoice-level rounding can differ", list: ["An invoice may calculate multiple line items separately before totaling them.", "Discounts or additional charges can change the taxable value.", "Invoice rounding conventions may differ from the calculator's full-precision internal arithmetic and display formatting.", "Cess or other invoice-specific adjustments are not modeled."], callout: { title: "Compare assumptions first", text: [{ text: "Check the selected inputs in the " }, { text: "GST Calculator", link: { kind: "calculator", slug: "gst" } }, { text: ", then review " }, { text: "GST Explained", link: { kind: "article", slug: "gst-explained" } }, { text: " and the " }, { text: "reverse-GST guide", link: { kind: "article", slug: "gst-remove-from-inclusive-price" } }, { text: "." }] } },
    ],
    faq: [
      { question: "Does a different calculator result prove an invoice is wrong?", answer: "No. The invoice may use different valuation, classification, line-item, discount, charge, rounding or tax-treatment inputs." },
      { question: "Does the calculator check GST compliance?", answer: "No. It performs arithmetic from user-selected assumptions and does not diagnose invoice compliance." },
    ],
  },
] as const satisfies readonly Article[];
