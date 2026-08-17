import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const aboutSource = readFileSync("app/about/page.tsx", "utf8");
const contactSource = readFileSync("app/contact/page.tsx", "utf8");

describe("About trust copy", () => {
  it("contains the approved purpose, trust details and boundaries", () => {
    expect(aboutSource).toContain("Understand the numbers behind financial decisions");
    expect(aboutSource).toContain("ArthaSiddhi brings together Indian financial calculators and practical guides.");
    expect(aboutSource).toContain("Rule-sensitive calculators show the applicable period, verification date and official sources used.");
    expect(aboutSource).toContain("What ArthaSiddhi does not do");
  });

  it("keeps the calculator, Learn and disclaimer destinations", () => {
    expect(aboutSource).toContain('href="/calculators"');
    expect(aboutSource).toContain('href="/learn"');
    expect(aboutSource).toContain('href="/disclaimer"');
  });
});

describe("Contact trust copy", () => {
  it("states contact availability once without recreating the removed section", () => {
    const status = "ArthaSiddhi does not currently provide a public email address or contact form.";
    expect(contactSource.split(status)).toHaveLength(2);
    expect(contactSource).not.toContain("Current contact options");
  });

  it("links to the three relevant information pages", () => {
    expect(contactSource).toContain('href="/about"');
    expect(contactSource).toContain('href="/privacy"');
    expect(contactSource).toContain('href="/disclaimer"');
  });

  it("does not invent a contact channel or prohibited marketing language", () => {
    expect(contactSource).not.toMatch(/mailto:|<form|\b(?:\+?91[-\s]?)?\d{10}\b/i);
    for (const phrase of ["financial journey", "take control", "unlock", "empower", "trusted platform", "we're here to help", "we are here to help"]) {
      expect(`${aboutSource} ${contactSource}`.toLowerCase()).not.toContain(phrase);
    }
  });
});
