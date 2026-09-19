// Optional browser regression: build with NEXT_PUBLIC_GA_MEASUREMENT_ID=G-TEST123,
// start the production server, then run
// node tests/calculator/banking-analytics-browser.mjs. Uses installed Chrome and Node CDP.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.env.BANKING_ANALYTICS_TEST_BASE_URL || "http://127.0.0.1:3000";
const profile = await mkdtemp(join(tmpdir(), "arthasiddhi-banking-analytics-browser-"));
const browser = spawn(process.env.BANKING_ANALYTICS_TEST_BROWSER || "C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`,
  "--no-first-run", "--no-default-browser-check", "about:blank",
], { windowsHide: true, stdio: ["ignore", "ignore", "pipe"] });
const endpoint = await new Promise((resolve, reject) => {
  let output = "";
  const timer = setTimeout(() => reject(new Error("Browser startup timed out")), 15000);
  browser.on("error", reject);
  browser.stderr.on("data", (data) => {
    output += data;
    const match = output.match(/DevTools listening on (ws:\/\/\S+)/);
    if (match) { clearTimeout(timer); resolve(match[1]); }
  });
});
const socket = new WebSocket(endpoint);
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
let sequence = 0;
let sessionId;
const pending = new Map();
const errors = [];
const events = []; // Node memory survives full document navigation; no browser storage.
socket.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.text);
  if (message.method === "Runtime.bindingCalled" && message.params.name === "__captureBankingEvent") {
    events.push(JSON.parse(message.params.payload));
  }
  const request = pending.get(message.id);
  if (request) {
    clearTimeout(request.timer);
    pending.delete(message.id);
    if (message.error) request.reject(new Error(message.error.message));
    else request.resolve(message.result);
  }
};
function send(method, params = {}, attached = true) {
  const id = ++sequence;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 15000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params, ...(attached && sessionId ? { sessionId } : {}) }));
  });
}
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
const pause = () => new Promise((resolve) => setTimeout(resolve, 100));
async function waitFor(expression) {
  for (let attempt = 0; attempt < 100; attempt++) { if (await evaluate(`Boolean(${expression})`)) return; await pause(); }
  throw new Error(`Timed out: ${expression}`);
}

let checks = 0;
const guideEvent = "banking_guide_calculator_click";
const calculatorEvent = "banking_calculator_guide_click";
const metadata = (event, article_slug, calculator_slug, placement) => ["event", event, { article_slug, calculator_slug, placement }];

async function navigate(path, selector) {
  await send("Page.navigate", { url: `${base}${path}` });
  await waitFor(`location.pathname === ${JSON.stringify(path)} && document.readyState === 'complete' && document.querySelector(${JSON.stringify(selector)})`);
  await waitFor(`Object.keys(document.querySelector(${JSON.stringify(selector)})).some(key => key.startsWith('__reactProps$'))`);
}

async function clickCase({ label, source, selector, destination, expected, unavailable = false }) {
  const beforePage = events.length;
  await navigate(source, selector);
  assert.equal(events.length, beforePage, "rendering does not emit custom events"); checks++;
  const attributes = await evaluate(`(() => {
    const link = document.querySelector(${JSON.stringify(selector)});
    return { href: link.getAttribute('href'), target: link.getAttribute('target') };
  })()`);
  assert.deepEqual(attributes, { href: destination, target: null }); checks++;
  if (unavailable) await evaluate("window.gtag = undefined");
  const beforeClick = events.length;
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  await waitFor(`location.pathname === ${JSON.stringify(destination)} && document.querySelector('main h1')`);
  assert.equal(await evaluate("location.href"), `${base}${destination}`); checks++;
  // Allow delayed duplicate effects to surface after the route transition.
  await new Promise((resolve) => setTimeout(resolve, 400));
  const emitted = events.slice(beforeClick);
  assert.deepEqual(emitted, expected ? [expected] : [], "exactly the intended event, or none for excluded surfaces"); checks++;
  if (expected) {
    assert.deepEqual(Object.keys(emitted[0][2]).sort(), ["article_slug", "calculator_slug", "placement"]); checks++;
  }
  console.log(`PASS ${label}`);
}

try {
  const { targetId } = await send("Target.createTarget", { url: "about:blank" }, false);
  ({ sessionId } = await send("Target.attachToTarget", { targetId, flatten: true }, false));
  await send("Runtime.enable");
  await send("Page.enable");
  await send("Network.enable");
  await send("Network.setBlockedURLs", { urls: ["*googletagmanager.com*", "*google-analytics.com*"] });
  await send("Runtime.addBinding", { name: "__captureBankingEvent" });
  await send("Page.addScriptToEvaluateOnNewDocument", { source: `
    const capture = (...args) => { if (args[0] === 'event') window.__captureBankingEvent(JSON.stringify(args)); };
    window.gtag = capture;
    window.dataLayer = [];
    window.dataLayer.push = (...items) => { for (const item of items) capture(...item); return 0; };
  ` });

  const cases = [
    { label: "guide primary callout to FD", source: "/learn/banking/fixed-deposit-explained", selector: "article > aside a[href='/calculators/fd']", destination: "/calculators/fd", expected: metadata(guideEvent, "fixed-deposit-explained", "fd", "primary_callout") },
    { label: "FD-vs-RD article callout to RD", source: "/learn/banking/fd-vs-rd", selector: "#interpret-difference aside a[href='/calculators/rd']", destination: "/calculators/rd", expected: metadata(guideEvent, "fd-vs-rd", "rd", "article_callout") },
    { label: "RD article body to RD", source: "/learn/banking/rd-explained", selector: "#calculator-boundaries a[href='/calculators/rd']", destination: "/calculators/rd", expected: metadata(guideEvent, "rd-explained", "rd", "article_body") },
    { label: "FD-vs-RD related calculator card to RD", source: "/learn/banking/fd-vs-rd", selector: "[aria-labelledby=related-calculators-heading] a[href='/calculators/rd']", destination: "/calculators/rd", expected: metadata(guideEvent, "fd-vs-rd", "rd", "related_calculator_card") },
    { label: "FD calculator to guide card", source: "/calculators/fd", selector: "[aria-labelledby=calculator-guides-heading] a[href='/learn/banking/fixed-deposit-explained']", destination: "/learn/banking/fixed-deposit-explained", expected: metadata(calculatorEvent, "fixed-deposit-explained", "fd", "guide_card") },
    { label: "RD calculator to guide card", source: "/calculators/rd", selector: "[aria-labelledby=calculator-guides-heading] a[href='/learn/banking/rd-interest-calculation']", destination: "/learn/banking/rd-interest-calculation", expected: metadata(calculatorEvent, "rd-interest-calculation", "rd", "guide_card") },
    { label: "PPF calculator to PPF guide stays untracked", source: "/calculators/ppf", selector: "[aria-labelledby=calculator-guides-heading] a[href='/learn/banking/ppf-explained']", destination: "/learn/banking/ppf-explained" },
    { label: "PPF primary callout stays untracked", source: "/learn/banking/ppf-explained", selector: "article > aside a[href='/calculators/ppf']", destination: "/calculators/ppf" },
    { label: "PPF article body stays untracked", source: "/learn/banking/ppf-explained", selector: "#interpretation a[href='/calculators/ppf']", destination: "/calculators/ppf" },
    { label: "PPF related card to FD stays untracked", source: "/calculators/ppf", selector: "[aria-labelledby=calculator-related-heading] a[href='/calculators/fd']", destination: "/calculators/fd" },
    { label: "PPF related card to RD stays untracked", source: "/calculators/ppf", selector: "[aria-labelledby=calculator-related-heading] a[href='/calculators/rd']", destination: "/calculators/rd" },
    { label: "FD related card to PPF stays untracked", source: "/calculators/fd", selector: "[aria-labelledby=calculator-related-heading] a[href='/calculators/ppf']", destination: "/calculators/ppf" },
    { label: "RD related card to PPF stays untracked", source: "/calculators/rd", selector: "[aria-labelledby=calculator-related-heading] a[href='/calculators/ppf']", destination: "/calculators/ppf" },
    { label: "guide navigation works without analytics", source: "/learn/banking/rd-explained", selector: "article > aside a[href='/calculators/rd']", destination: "/calculators/rd", unavailable: true },
    { label: "calculator navigation works without analytics", source: "/calculators/fd", selector: "[aria-labelledby=calculator-guides-heading] a[href='/learn/banking/fd-interest-calculation']", destination: "/learn/banking/fd-interest-calculation", unavailable: true },
  ];
  for (const testCase of cases) await clickCase(testCase);
  assert.equal(events.length, 6); checks++;
  assert.deepEqual(errors, []); checks++;
  console.log(`${checks} Banking analytics browser checks passed (${cases.length} navigation cases)`);
} finally {
  await send("Browser.close", {}, false).catch(() => {});
  socket.close();
  browser.kill();
}
