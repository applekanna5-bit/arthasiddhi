// Optional browser regression: build with NEXT_PUBLIC_GA_MEASUREMENT_ID=G-TEST123,
// start the production server, then run
// node tests/calculator/income-tax-comparison-browser.mjs. Uses installed Chrome and Node CDP.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.env.TAX_TEST_BASE_URL || "http://127.0.0.1:3000";
const profile = await mkdtemp(join(tmpdir(), "arthasiddhi-tax-browser-"));
const browser = spawn(process.env.TAX_TEST_BROWSER || "C:/Program Files/Google/Chrome/Application/chrome.exe", [
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
socket.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.text);
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
async function input(id, value) {
  await evaluate(`(() => { const input = document.getElementById(${JSON.stringify(id)}); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, ${JSON.stringify(value)}); input.dispatchEvent(new Event('input', {bubbles:true})); })()`);
  await pause();
}
async function button(text) {
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent === ${JSON.stringify(text)}).click()`);
  await pause();
}
async function select(id, value) {
  await evaluate(`(() => { const select = document.getElementById('${id}'); select.value = '${value}'; select.dispatchEvent(new Event('change', {bubbles:true})); })()`);
  await pause();
}
let checks = 0;
async function check(expression, message) { assert.equal(await evaluate(expression), true, message); checks++; console.log(`PASS ${message}`); }
const panel = "document.getElementById('income-tax-comparison')";
const output = `(key, column) => [...${panel}.querySelectorAll('tbody tr')].find(row => row.querySelector('th').textContent === key).querySelectorAll('td')[column].textContent`;
async function navigate(path, control) {
  await send("Page.navigate", { url: `${base}${path}` });
  await waitFor(`document.querySelector(${JSON.stringify(control)}) && document.readyState === 'complete'`);
  await waitFor(`Object.keys(document.querySelector(${JSON.stringify(control)})).some(key => key.startsWith('__reactProps$'))`);
}
async function activateLink(selector, path, expected) {
  const before = await evaluate("window.__taxEvents.length");
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  await waitFor(`location.pathname === ${JSON.stringify(path)}`);
  await check(`window.__taxEvents.length === ${before + 1}`, "link emits exactly one custom event");
  assert.deepEqual(await evaluate("window.__taxEvents.at(-1)"), expected); checks++;
}
try {
  const { targetId } = await send("Target.createTarget", { url: "about:blank" }, false);
  ({ sessionId } = await send("Target.attachToTarget", { targetId, flatten: true }, false));
  await send("Runtime.enable");
  await send("Page.enable");
  await send("Network.enable");
  await send("Network.setBlockedURLs", { urls: ["*googletagmanager.com*", "*google-analytics.com*"] });
  // Capture fixed custom-event payloads before hydration and across navigation.
  // This test-only stub prevents any data being sent to an analytics service.
  await send("Page.addScriptToEvaluateOnNewDocument", { source: `
    window.__taxEvents = JSON.parse(sessionStorage.getItem('tax-test-events') || '[]');
    const capture = (...args) => { if (args[0] === 'event') { window.__taxEvents.push(args); sessionStorage.setItem('tax-test-events', JSON.stringify(window.__taxEvents)); } };
    window.gtag = capture;
    window.dataLayer = [];
    window.dataLayer.push = (...items) => { for (const item of items) capture(...item); return 0; };
  ` });
  await send("Page.navigate", { url: `${base}/calculators/income-tax` });
  await waitFor("document.getElementById('income') && document.readyState === 'complete'");
  await waitFor("Object.keys(document.getElementById('income')).some(key => key.startsWith('__reactProps$'))");
  await check("window.__taxEvents.length === 0", "no custom events before user action");
  await check(`${panel}.hidden && !${panel}.querySelector('table')`, "comparison initially closed");
  await send("Page.bringToFront");
  await evaluate("document.querySelector('[aria-controls=income-tax-comparison]').focus()");
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", text: "\r", unmodifiedText: "\r", windowsVirtualKeyCode: 13 });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  await waitFor(`${panel}.querySelector('table')`);
  assert.deepEqual(await evaluate("window.__taxEvents"), [["event", "tax_comparison_open", { calculator_slug: "income-tax", comparison_mode: "regime" }]]); checks++;
  await check("document.querySelector('[aria-controls=income-tax-comparison]').getAttribute('aria-expanded') === 'true'", "keyboard activation opens accessible comparison");
  await check(`${panel}.innerText.includes('not personalized tax advice or a filing computation') && ${panel}.innerText.includes('does not derive deductions, exemptions, HRA, or standard deduction')`, "limitations visible with results");
  await check(`${panel}.querySelectorAll('tbody tr').length === 6 && (${output})('Total modeled tax', 0) === '₹0.00'`, "six comparable engine outputs and new-regime rebate at 12 lakh");
  const initialTable = await evaluate(`${panel}.querySelector('table').innerText`);
  await select("taxRegime", "old");
  assert.equal(await evaluate(`${panel}.querySelector('table').innerText`), initialTable); checks++;
  await check("document.querySelector('[aria-labelledby=income-tax-results]').innerText.includes('Old regime')", "primary calculator still responds to regime selection");
  await check("window.__taxEvents.length === 1", "regime-only change does not count as comparison use");
  await input("income", "-1");
  await check("window.__taxEvents.length === 1", "invalid change before first use sends no event");
  await input("income", "1200000");
  await check("window.__taxEvents.length === 1", "return to opening input does not count as use");
  await input("income", "600000");
  assert.deepEqual(await evaluate("window.__taxEvents.at(-1)"), ["event", "tax_comparison_used", { calculator_slug: "income-tax", comparison_mode: "regime" }]); checks++;
  const newTax = await evaluate(`(${output})('Total modeled tax', 0)`);
  const oldTax = await evaluate(`(${output})('Total modeled tax', 1)`);
  await select("ageCategory", "80-or-above");
  assert.equal(await evaluate(`(${output})('Total modeled tax', 0)`), newTax); checks++;
  assert.notEqual(await evaluate(`(${output})('Total modeled tax', 1)`), oldTax); checks++;
  await check(`${panel}.querySelector('caption').innerText.includes('₹6,00,000.00')`, "income edits refresh comparison");
  for (const value of ["", "-1", "5000001", "1e309"]) {
    await input("income", value);
    await check(`!${panel}.querySelector('table') && ${panel}.innerText.includes('Enter valid taxable ordinary income') && document.getElementById('income').getAttribute('aria-invalid') === 'true'`, `invalid input ${JSON.stringify(value)} removes stale results`);
  }
  for (const value of ["0", "1200001", "1250000", "1270588", "1270589", "1300000", "5000000"]) {
    await input("income", value);
    await check(`!!${panel}.querySelector('table') && !document.getElementById('income-tax-error')`, `comparison recovers for valid income ${value}`);
  }
  for (const width of [375, 768, 1280]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 });
    await check("document.documentElement.scrollWidth <= window.innerWidth", `no page overflow at ${width}px`);
  }
  await button("Hide comparison");
  await input("income", "1300000");
  await check("window.__taxEvents.length === 2", "closing, repeated edits and closed edits send no further events");
  await button("Compare both regimes");
  await check("window.__taxEvents.filter(e => e[1] === 'tax_comparison_open').length === 2 && window.__taxEvents.filter(e => e[1] === 'tax_comparison_used').length === 1", "reopening emits open without resetting the used guard");
  await check(`${panel}.querySelector('caption').innerText.includes('₹13,00,000.00')`, "reopening uses current input");
  await check(`${panel}.querySelectorAll('a').length === 2`, "two deliberate contextual links");
  for (const path of ["gross-income-vs-taxable-income", "section-87a-rebate"]) {
    assert.equal((await fetch(`${base}/learn/tax/${path}`)).status, 200); checks++;
  }
  for (const slug of ["gross-income-vs-taxable-income", "section-87a-rebate"]) {
    await activateLink(`#income-tax-comparison a[href='/learn/tax/${slug}']`, `/learn/tax/${slug}`, ["event", "tax_calculator_guide_click", { calculator_slug: "income-tax", article_slug: slug, placement: "comparison_context" }]);
    await navigate("/calculators/income-tax", "#income");
    await button("Compare both regimes");
  }
  const beforeAge = await evaluate("window.__taxEvents.filter(e => e[1] === 'tax_comparison_used').length");
  await select("ageCategory", "60-to-below-80");
  await check(`window.__taxEvents.filter(e => e[1] === 'tax_comparison_used').length === ${beforeAge + 1}`, "age-only edit counts even when New Regime output is unchanged");

  const cardLinks = await evaluate("[...document.querySelectorAll('[aria-labelledby=calculator-guides-heading] a')].map(a => a.getAttribute('href'))");
  for (const path of cardLinks) {
    const slug = path.split('/').at(-1);
    await activateLink(`[aria-labelledby=calculator-guides-heading] a[href='${path}']`, path, ["event", "tax_calculator_guide_click", { calculator_slug: "income-tax", article_slug: slug, placement: "guide_card" }]);
    await navigate("/calculators/income-tax", "#income");
  }
  for (const slug of ["new-tax-regime-slab-calculation", "section-87a-rebate", "gross-income-vs-taxable-income", "health-education-cess-calculation", "income-tax-calculator-vs-payroll-tds"]) {
    await navigate(`/learn/tax/${slug}`, "aside a[href='/calculators/income-tax']");
    await activateLink("aside a[href='/calculators/income-tax']", "/calculators/income-tax", ["event", "tax_guide_calculator_click", { article_slug: slug, calculator_slug: "income-tax", placement: "primary_callout" }]);
  }
  await navigate("/learn/tax/new-tax-regime-slab-calculation", "aside a[href='/calculators/income-tax']");
  const beforeOrdinary = await evaluate("window.__taxEvents.length");
  await evaluate("document.querySelector('a[href=\"/learn/tax/gross-income-vs-taxable-income\"]').click()");
  await waitFor("location.pathname === '/learn/tax/gross-income-vs-taxable-income'");
  await check(`window.__taxEvents.length === ${beforeOrdinary}`, "ordinary guide links are not tracked");
  const events = await evaluate("window.__taxEvents");
  for (const [command, event, params] of events) {
    assert.equal(command, "event");
    assert.equal(params.calculator_slug, "income-tax");
    if (event === "tax_comparison_open" || event === "tax_comparison_used") {
      assert.deepEqual(params, { calculator_slug: "income-tax", comparison_mode: "regime" });
    } else {
      assert.ok(["tax_guide_calculator_click", "tax_calculator_guide_click"].includes(event));
      assert.deepEqual(Object.keys(params).sort(), ["article_slug", "calculator_slug", "placement"]);
    }
  }
  checks++; console.log("PASS all captured Tax events contain only fixed approved metadata");
  assert.equal((await fetch(`${base}/calculators/old-vs-new-tax-regime`)).status, 404); checks++;
  await send("Page.navigate", { url: `${base}/calculators/gst` });
  await waitFor("document.getElementById('amount') && document.readyState === 'complete'");
  await check("!document.getElementById('income-tax-comparison') && document.body.innerText.includes('GST calculation')", "GST retains its existing surface without tax comparison");
  assert.deepEqual(errors, []); checks++;
  console.log(`${checks} browser checks passed`);
} finally {
  await send("Browser.close", {}, false).catch(() => {});
  socket.close();
  browser.kill();
}
