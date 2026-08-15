const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percentageFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
});

/** Presentation-only helpers. Calculator engines retain their full precision. */
export function formatIndianCurrency(value: number): string {
  return inrFormatter.format(value);
}

export function formatPercentage(value: number): string {
  return `${percentageFormatter.format(value)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);
}
