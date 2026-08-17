import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "../../proxy";

function request(url: string) {
  return proxy(new NextRequest(url));
}

describe("canonical host redirect", () => {
  it("permanently redirects the www homepage to the non-www host", () => {
    const response = request("https://www.arthasiddhi.com/");

    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe("https://arthasiddhi.com/");
  });

  it("preserves the pathname", () => {
    const response = request("https://www.arthasiddhi.com/calculators/home-loan");

    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe("https://arthasiddhi.com/calculators/home-loan");
  });

  it("preserves query parameters", () => {
    const response = request("https://www.arthasiddhi.com/learn/loans/home-loan-guide?x=1&source=test");

    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe("https://arthasiddhi.com/learn/loans/home-loan-guide?x=1&source=test");
  });

  it.each([
    "https://arthasiddhi.com/calculators/home-loan",
    "http://localhost:3000/calculators/home-loan",
    "http://127.0.0.1:3000/calculators/home-loan",
    "https://preview.example.test/calculators/home-loan",
  ])("does not redirect a non-www host: %s", (url) => {
    const response = request(url);

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it("handles a port on the www host without changing the canonical destination", () => {
    const response = request("https://www.arthasiddhi.com:8443/calculators/sip?amount=5000");

    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe("https://arthasiddhi.com/calculators/sip?amount=5000");
  });

  it("does not create a redirect loop", () => {
    const firstResponse = request("https://www.arthasiddhi.com/learn");
    const redirectedUrl = firstResponse.headers.get("location");

    expect(redirectedUrl).toBe("https://arthasiddhi.com/learn");

    const secondResponse = request(redirectedUrl!);
    expect(secondResponse.status).toBe(200);
    expect(secondResponse.headers.get("location")).toBeNull();
  });
});
