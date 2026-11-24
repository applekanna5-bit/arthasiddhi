import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CalculatorInput } from "../../components/calculator/CalculatorInput";

const renderInput = (props: { hint?: string; error?: boolean; errorId?: string }) =>
  renderToStaticMarkup(
    <CalculatorInput id="monthly-amount" label="Monthly amount" value="5000" onChange={() => {}} {...props} />,
  );

describe("Shared calculator input accessibility", () => {
  it("associates a visible hint with the input", () => {
    const html = renderInput({ hint: "Enter the amount in rupees." });
    expect(html).toContain('id="monthly-amount-hint"');
    expect(html).toContain('aria-describedby="monthly-amount-hint"');
    expect(html).toContain('for="monthly-amount"');
  });

  it("preserves the error reference alongside the hint", () => {
    const html = renderInput({ hint: "Enter the amount in rupees.", error: true, errorId: "monthly-amount-error" });
    expect(html).toContain('aria-describedby="monthly-amount-hint monthly-amount-error"');
    expect(html).toContain('aria-invalid="true"');
  });

  it("does not reference absent hints or inactive errors", () => {
    const html = renderInput({ error: false, errorId: "monthly-amount-error" });
    expect(html).not.toContain("aria-describedby");
    expect(html).not.toContain('id="monthly-amount-hint"');
    expect(html).toContain('aria-invalid="false"');
  });
});
