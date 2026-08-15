export const calculators = {
  "home-loan": { title: "Home Loan EMI Calculator", href: "/calculators/home-loan", description: "Estimate your EMI, interest, and repayment schedule." },
  "car-loan": { title: "Car Loan EMI Calculator", href: "/calculators/car-loan", description: "Plan an estimated car-loan repayment." },
  "personal-loan": { title: "Personal Loan EMI Calculator", href: "/calculators/personal-loan", description: "Understand an estimated personal-loan EMI." },
  sip: { title: "SIP Calculator", href: "/calculators/sip", description: "Explore regular-investment scenarios." },
  fd: { title: "FD Calculator", href: "/calculators/fd", description: "Estimate fixed-deposit interest and maturity." },
} as const;

export function getRelatedCalculators(ids: string[]) {
  return ids.map((id) => calculators[id as keyof typeof calculators]).filter(Boolean);
}
