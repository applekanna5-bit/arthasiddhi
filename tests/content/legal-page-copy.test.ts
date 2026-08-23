import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const privacySource = readFileSync("app/privacy/page.tsx", "utf8");
const disclaimerSource = readFileSync("app/disclaimer/page.tsx", "utf8");
const termsSource = readFileSync("app/terms/page.tsx", "utf8");

describe("trust foundation legal copy", () => {
  it("protects the Privacy calculator-storage and infrastructure wording", () => {
    expect(privacySource).toContain("The calculator code does not save inputs in local or session storage");
    expect(privacySource).toContain("Hosting or network infrastructure may also use essential cookies or similar technical storage for security or delivery.");
  });

  it("discloses Google Analytics without inventing configuration details", () => {
    expect(privacySource).toContain("ArthaSiddhi uses Google Analytics");
    expect(privacySource).toContain("pages viewed, interactions, browser or device information");
    expect(privacySource).not.toContain("does not currently add advertising or analytics cookies");
    for (const detail of ["Google Signals", "consent mode", "IP anonymization", "retention period", "advertising personalization", "user-ID tracking"]) expect(privacySource).not.toContain(detail);
  });

  it("applies the site-wide external-link scope, contact, and revision date", () => {
    expect(privacySource).toContain("The site may link to external official or supporting sources.");
    expect(privacySource).not.toContain("Articles may link to external sources.");
    expect(privacySource).toContain("contact@arthasiddhi.com");
    expect(privacySource).toContain("Last updated: 23 August 2026.");
  });

  it("protects eligibility, investment-risk, and local-assumption boundaries", () => {
    expect(disclaimerSource).toContain("They do not determine eligibility for a financial product or benefit.");
    expect(disclaimerSource).toContain("Assumed or historical returns do not guarantee future results. Market-linked investments can rise or fall in value, and capital may be at risk.");
    expect(disclaimerSource).toContain("Tax, legal, lending, and regulatory information");
    expect(disclaimerSource).toContain("Calculator-specific assumptions and limitations shown near a tool continue to apply.");
  });

  it("keeps Terms general and links to supporting policies", () => {
    expect(termsSource).toContain("no content creates a professional or advisory relationship");
    for (const route of ["/privacy", "/disclaimer", "/methodology", "/contact"]) expect(termsSource).toContain(`href="${route}"`);
    expect(termsSource).not.toMatch(/governing law|arbitration|registered company/i);
  });
});
