import { describe, it, expect } from "vitest";
import { calculateLoanDetails } from "../../lib/engine/loan";

describe("Loan Calculation Engine", () => {
  describe("Input Validation", () => {
    it("rejects zero or negative principal", () => {
      expect(() =>
        calculateLoanDetails({
          principal: 0,
          annualInterestRate: 10,
          tenureMonths: 12,
        })
      ).toThrow(/Principal must be greater than 0/);

      expect(() =>
        calculateLoanDetails({
          principal: -50000,
          annualInterestRate: 10,
          tenureMonths: 12,
        })
      ).toThrow(/Principal must be greater than 0/);
    });

    it("rejects negative interest rates", () => {
      expect(() =>
        calculateLoanDetails({
          principal: 100000,
          annualInterestRate: -1,
          tenureMonths: 12,
        })
      ).toThrow(/Interest rate must be between 0%/);
    });

    it("rejects zero, negative, or fractional tenure", () => {
      expect(() =>
        calculateLoanDetails({
          principal: 100000,
          annualInterestRate: 10,
          tenureMonths: 0,
        })
      ).toThrow(/Tenure must be a positive integer/);

      expect(() =>
        calculateLoanDetails({
          principal: 100000,
          annualInterestRate: 10,
          tenureMonths: 10.5,
        })
      ).toThrow(/Tenure must be a positive integer/);
    });

    it("rejects NaN and Infinity", () => {
      expect(() =>
        calculateLoanDetails({
          principal: NaN,
          annualInterestRate: 10,
          tenureMonths: 12,
        })
      ).toThrow(/Inputs must be finite numbers/);

      expect(() =>
        calculateLoanDetails({
          principal: 100000,
          annualInterestRate: Infinity,
          tenureMonths: 12,
        })
      ).toThrow(/Inputs must be finite numbers/);
    });

    it("rejects extremely large values beyond limits", () => {
      expect(() =>
        calculateLoanDetails({
          principal: 20_000_000_000,
          annualInterestRate: 10,
          tenureMonths: 12,
        })
      ).toThrow(/Principal must be greater than 0 and up to/);

      expect(() =>
        calculateLoanDetails({
          principal: 100000,
          annualInterestRate: 150,
          tenureMonths: 12,
        })
      ).toThrow(/Interest rate must be between 0%/);
    });
  });

  describe("Financial Calculations & Reconciliation", () => {
    it("calculates 0% interest with exact reconciliation", () => {
      const result = calculateLoanDetails({
        principal: 100000,
        annualInterestRate: 0,
        tenureMonths: 3,
      });

      expect(result.totalInterest).toBe(0);
      expect(result.amortizationSchedule[2].remainingBalance).toBe(0);

      const sumPayments = result.amortizationSchedule.reduce(
        (acc, row) => acc + row.emi,
        0
      );

      expect(sumPayments).toBeCloseTo(100000, 4);
    });

    it("forces final balance to exactly zero for long tenures", () => {
      const result = calculateLoanDetails({
        principal: 10000000,
        annualInterestRate: 8.35,
        tenureMonths: 360,
      });

      const finalMonth = result.amortizationSchedule[359];
      const penultimateMonth = result.amortizationSchedule[358];

      expect(finalMonth.remainingBalance).toBe(0);
      expect(finalMonth.principalComponent).toBe(
        penultimateMonth.remainingBalance
      );
    });
  });

  describe("Invariants & Consistency", () => {
    const testInvariants = (
      principal: number,
      rate: number,
      months: number
    ) => {
      const result = calculateLoanDetails({
        principal,
        annualInterestRate: rate,
        tenureMonths: months,
      });

      let sumPrincipal = 0;
      let sumInterest = 0;
      let sumEmi = 0;

      result.amortizationSchedule.forEach((row) => {
        sumPrincipal += row.principalComponent;
        sumInterest += row.interestComponent;
        sumEmi += row.emi;
      });

      expect(sumPrincipal).toBeCloseTo(principal, 4);
      expect(sumInterest).toBeCloseTo(result.totalInterest, 4);
      expect(sumEmi).toBeCloseTo(result.totalPayment, 4);

      expect(
        result.amortizationSchedule[months - 1].remainingBalance
      ).toBe(0);
    };

    it("maintains invariants for ?1,00,000 at 10% for 12 months", () => {
      testInvariants(100000, 10, 12);
    });

    it("maintains invariants for ?50,00,000 at 8.5% for 240 months", () => {
      testInvariants(5000000, 8.5, 240);
    });

    it("maintains invariants for ?1,00,00,000 at 7.5% for 360 months", () => {
      testInvariants(10000000, 7.5, 360);
    });
  });
});
