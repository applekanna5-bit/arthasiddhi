export interface CalculatorFormField {
  id: string;
  label: string;
  value: string;
  hint?: string;
}

export type CompoundingFrequency = "monthly" | "quarterly" | "half-yearly" | "yearly";
