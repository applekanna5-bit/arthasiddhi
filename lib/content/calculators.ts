export type CalculatorCategory = "Loans" | "Investments" | "Savings" | "Planning";

export type CalculatorDefinition = {
  slug: string;
  name: string;
  shortName: string;
  category: CalculatorCategory;
  description: string;
  href: `/calculators/${string}`;
  metadata: { title: string; description: string };
  relatedCalculators: string[];
  relatedGuide: string | null;
};

export const calculators: Record<string, CalculatorDefinition> = {
  "home-loan": { slug: "home-loan", name: "Home Loan EMI Calculator", shortName: "Home Loan", category: "Loans", description: "Estimate your EMI, interest, and repayment schedule.", href: "/calculators/home-loan", metadata: { title: "Home Loan EMI Calculator | ArthaSiddhi", description: "Calculate your home loan EMI, total interest and repayment schedule using ArthaSiddhi's free calculator." }, relatedCalculators: ["car-loan", "personal-loan"], relatedGuide: "/learn/loans/home-loan-guide" },
  "car-loan": { slug: "car-loan", name: "Car Loan EMI Calculator", shortName: "Car Loan", category: "Loans", description: "Plan an estimated car-loan repayment.", href: "/calculators/car-loan", metadata: { title: "Car Loan EMI Calculator | ArthaSiddhi", description: "Calculate your car loan EMI, total interest and repayment schedule using ArthaSiddhi's free calculator." }, relatedCalculators: ["home-loan", "personal-loan"], relatedGuide: null },
  "personal-loan": { slug: "personal-loan", name: "Personal Loan EMI Calculator", shortName: "Personal Loan", category: "Loans", description: "Understand an estimated personal-loan EMI.", href: "/calculators/personal-loan", metadata: { title: "Personal Loan EMI Calculator | ArthaSiddhi", description: "Calculate your personal loan EMI, total interest and repayment schedule using ArthaSiddhi's free calculator." }, relatedCalculators: ["home-loan", "car-loan"], relatedGuide: null },
  sip: { slug: "sip", name: "SIP Calculator", shortName: "SIP", category: "Investments", description: "Explore regular-investment scenarios.", href: "/calculators/sip", metadata: { title: "SIP Calculator | ArthaSiddhi", description: "Estimate SIP returns, total investment and future value with ArthaSiddhi's free calculator." }, relatedCalculators: ["step-up-sip", "lumpsum"], relatedGuide: "/learn/investments/sip-explained" },
  "step-up-sip": { slug: "step-up-sip", name: "Step-up SIP Calculator", shortName: "Step-up SIP", category: "Investments", description: "Estimate a SIP that increases once each year.", href: "/calculators/step-up-sip", metadata: { title: "Step-up SIP Calculator | Estimate Increasing SIP Growth | ArthaSiddhi", description: "Estimate future value when a monthly SIP increases annually using an assumed investment return." }, relatedCalculators: ["sip", "lumpsum"], relatedGuide: null },
  lumpsum: { slug: "lumpsum", name: "Lumpsum Calculator", shortName: "Lumpsum", category: "Investments", description: "Estimate growth of a one-time investment.", href: "/calculators/lumpsum", metadata: { title: "Lumpsum Calculator | Estimate Investment Growth | ArthaSiddhi", description: "Estimate the future value and gain from a one-time investment using an assumed annual return." }, relatedCalculators: ["sip", "cagr"], relatedGuide: null },
  cagr: { slug: "cagr", name: "CAGR Calculator", shortName: "CAGR", category: "Investments", description: "Calculate annualized growth between two values.", href: "/calculators/cagr", metadata: { title: "CAGR Calculator | Calculate Annualized Growth | ArthaSiddhi", description: "Calculate the constant annualized growth rate connecting a beginning value and ending value." }, relatedCalculators: ["lumpsum", "sip"], relatedGuide: null },
  swp: { slug: "swp", name: "SWP Calculator", shortName: "SWP", category: "Investments", description: "Estimate withdrawals and a remaining investment balance.", href: "/calculators/swp", metadata: { title: "SWP Calculator | Estimate Withdrawals & Balance | ArthaSiddhi", description: "Estimate systematic withdrawals and the remaining balance using an assumed annual investment return." }, relatedCalculators: ["sip", "lumpsum"], relatedGuide: null },
  fd: { slug: "fd", name: "FD Calculator", shortName: "FD", category: "Savings", description: "Estimate fixed-deposit interest and maturity.", href: "/calculators/fd", metadata: { title: "FD Calculator | ArthaSiddhi", description: "Calculate fixed deposit interest and maturity amount with ArthaSiddhi's free calculator." }, relatedCalculators: ["rd", "ppf"], relatedGuide: "/learn/banking/fixed-deposit-explained" },
  rd: { slug: "rd", name: "RD Calculator", shortName: "RD", category: "Savings", description: "Estimate recurring-deposit maturity from monthly deposits.", href: "/calculators/rd", metadata: { title: "RD Calculator | Estimate Recurring Deposit Maturity | ArthaSiddhi", description: "Estimate recurring deposit maturity and interest using monthly deposits and an assumed annual rate." }, relatedCalculators: ["fd", "ppf"], relatedGuide: null },
  ppf: { slug: "ppf", name: "PPF Calculator", shortName: "PPF", category: "Savings", description: "Estimate PPF accumulation with an editable assumed rate.", href: "/calculators/ppf", metadata: { title: "PPF Calculator | Estimate Public Provident Fund Growth | ArthaSiddhi", description: "Estimate PPF contributions, interest and maturity using an editable assumed annual interest rate." }, relatedCalculators: ["fd", "rd", "sip"], relatedGuide: null },
  inflation: { slug: "inflation", name: "Inflation Calculator", shortName: "Inflation", category: "Planning", description: "Estimate future costs or future purchasing power.", href: "/calculators/inflation", metadata: { title: "Inflation Calculator | Future Cost & Purchasing Power | ArthaSiddhi", description: "Estimate how an assumed inflation rate may affect future costs or purchasing power." }, relatedCalculators: ["sip", "gratuity"], relatedGuide: null },
  gratuity: { slug: "gratuity", name: "Gratuity Calculator", shortName: "Gratuity", category: "Planning", description: "Estimate gratuity using a statutory-style formula.", href: "/calculators/gratuity", metadata: { title: "Gratuity Calculator | Estimate Gratuity Amount | ArthaSiddhi", description: "Estimate gratuity from eligible monthly wage and completed service without determining legal eligibility." }, relatedCalculators: ["inflation"], relatedGuide: null },
};

export const calculatorCategories: CalculatorCategory[] = ["Loans", "Investments", "Savings", "Planning"];

export function getCalculator(slug: string) { return calculators[slug]; }
export function getCalculatorsByCategory(category: CalculatorCategory) { return Object.values(calculators).filter((calculator) => calculator.category === category); }
export function getRelatedCalculators(ids: string[]) { return ids.map((id) => calculators[id]).filter(Boolean); }
