export type FinancialRuleSource = {
  title: string;
  authority: string;
  sourceType?: "official" | "supporting";
  accessedAt?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  reference: string;
};

export type FinancialRuleSet<T> = {
  id: string;
  label: string;
  effectivePeriod: string;
  periodLabels?: { label: string; value: string }[];
  lastVerified: string;
  rules: T;
  sources: FinancialRuleSource[];
};
