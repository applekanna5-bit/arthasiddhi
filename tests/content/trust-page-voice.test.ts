import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const aboutSource = readFileSync("app/about/page.tsx", "utf8");
const contactSource = readFileSync("app/contact/page.tsx", "utf8");

describe("About trust copy", () => {
  it("contains the approved purpose, trust details and boundaries", () => {
    expect(aboutSource).toContain("Understand the numbers behind financial decisions");
    expect(aboutSource).toContain("ArthaSiddhi is an independently operated financial education and calculator platform");
    expect(aboutSource).toContain("Rule-sensitive calculators show the applicable period, verification date and official sources used.");
    expect(aboutSource).toContain("What ArthaSiddhi does not do");
  });

  it("keeps product links and adds restrained trust links", () => {
    for (const route of ["/calculators", "/learn", "/disclaimer", "/editorial-policy", "/methodology", "/contact"]) expect(aboutSource).toContain(`href="${route}"`);
  });
});

describe("Contact trust copy", () => {
  it("publishes the confirmed mailbox without adding a form", () => {
    expect(contactSource).toContain('href="mailto:contact@arthasiddhi.com"');
    expect(contactSource).toContain(">contact@arthasiddhi.com</a>");
    expect(contactSource).not.toContain("<form");
  });

  it("covers the approved contact purposes and correction policy", () => {
    for (const phrase of ["suspected factual error", "outdated rule-sensitive information", "calculator result", "broken page", "privacy-related question"]) expect(contactSource).toContain(phrase);
    for (const route of ["/editorial-policy", "/privacy", "/disclaimer"]) expect(contactSource).toContain(`href="${route}"`);
  });

  it("does not invent another contact channel or use prohibited marketing language", () => {
    expect(contactSource).not.toMatch(/hostinger|support@|hello@|admin@|\b(?:\+?91[-\s]?)?\d{10}\b/i);
    for (const phrase of ["financial journey", "take control", "unlock", "empower", "trusted platform", "we're here to help", "we are here to help"]) expect(`${aboutSource} ${contactSource}`.toLowerCase()).not.toContain(phrase);
  });
});
