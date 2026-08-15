import { describe, expect, it } from "vitest";
import { calculateFd } from "../../lib/calculator/fd-calculator";

describe("FD calculator", () => {
  it("calculates a standard fixed deposit without rounding the result", () => {
    const result = calculateFd({ principal: 100000, annualInterestRate: 7, tenureYears: 3, compoundingFrequency: "quarterly" });
    expect(result.maturityAmount).toBeCloseTo(123_143.93, 2);
    expect(result.interestEarned).toBeCloseTo(23_143.93, 2);
  });

  it("supports every standard compounding frequency", () => {
    const base = { principal: 100000, annualInterestRate: 10, tenureYears: 1 };
    expect(calculateFd({ ...base, compoundingFrequency: "monthly" }).maturityAmount).toBeCloseTo(110_471.31, 2);
    expect(calculateFd({ ...base, compoundingFrequency: "quarterly" }).maturityAmount).toBeCloseTo(110_381.29, 2);
    expect(calculateFd({ ...base, compoundingFrequency: "half-yearly" }).maturityAmount).toBeCloseTo(110_250, 2);
    expect(calculateFd({ ...base, compoundingFrequency: "yearly" }).maturityAmount).toBeCloseTo(110_000, 2);
  });

  it("handles zero interest", () => {
    expect(calculateFd({ principal: 100000, annualInterestRate: 0, tenureYears: 5, compoundingFrequency: "yearly" })).toEqual({ principal: 100000, interestEarned: 0, maturityAmount: 100000 });
  });

  it("rejects invalid and out-of-bound inputs", () => {
    expect(() => calculateFd({ principal: 0, annualInterestRate: 7, tenureYears: 1, compoundingFrequency: "yearly" })).toThrow(/greater than 0/);
    expect(() => calculateFd({ principal: 1000, annualInterestRate: Infinity, tenureYears: 1, compoundingFrequency: "yearly" })).toThrow(/finite/);
    expect(() => calculateFd({ principal: 1000, annualInterestRate: 7, tenureYears: 101, compoundingFrequency: "yearly" })).toThrow(/up to 100/);
  });
});
