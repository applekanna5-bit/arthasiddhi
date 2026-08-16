export type FinancialRuleSource = {
  title: string;
  authority: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  reference: string;
};

export type FinancialRuleSet<T> = {
  id: string;
  label: string;
  effectivePeriod: string;
  lastVerified: string;
  rules: T;
  sources: FinancialRuleSource[];
};

