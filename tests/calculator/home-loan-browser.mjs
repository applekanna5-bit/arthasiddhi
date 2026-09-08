// Optional real-browser regression check: start the production server, then run
// node tests/calculator/home-loan-browser.mjs. Uses installed Chrome and Node CDP.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.env.LOAN_TEST_BASE_URL || "http://127.0.0.1:3000";
const profile = await mkdtemp(join(tmpdir(), "arthasiddhi-loan-browser-"));
const browser = spawn(process.env.LOAN_TEST_BROWSER || "C:/Program Files/Google/Chrome/Application/chrome.exe", [
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
async function select(value) {
  await evaluate(`(() => { const select = document.getElementById('schedule-scenario'); select.value = '${value}'; select.dispatchEvent(new Event('change', {bubbles:true})); })()`);
  await pause();
}
let checks = 0;
async function check(expression, message) { assert.equal(await evaluate(expression), true, message); checks++; console.log(`PASS ${message}`); }
try {
  const { targetId } = await send("Target.createTarget", { url: "about:blank" }, false);
  ({ sessionId } = await send("Target.attachToTarget", { targetId, flatten: true }, false));
  await send("Runtime.enable");
  await send("Page.enable");
  await send("Page.navigate", { url: `${base}/calculators/home-loan` });
  await waitFor("document.getElementById('principal') && document.readyState === 'complete'");
  await waitFor("Object.keys(document.getElementById('principal')).some(key => key.startsWith('__reactProps$'))");
  await evaluate("window.__loanEvents = []; window.gtag = (...args) => window.__loanEvents.push(args)");
  await check("!document.getElementById('comparison-rate')", "comparison initially closed");
  await check("window.__loanEvents.length === 0", "comparison emits no event on initial render");
  // Deliberate keyboard activation checks the native disclosure control after hydration.
  await send("Page.bringToFront");
  await evaluate("[...document.querySelectorAll('button')].find(b => b.textContent === 'Compare another scenario').focus()");
  await check("document.activeElement.textContent === 'Compare another scenario'", "disclosure receives keyboard focus");
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", text: "\r", unmodifiedText: "\r", windowsVirtualKeyCode: 13 });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  await waitFor("document.getElementById('comparison-rate')");
  await check("document.querySelector('[aria-expanded=true]') !== null", "keyboard opens disclosure");
  await check("window.__loanEvents.filter(event => event[1] === 'loan_comparison_open').length === 1 && window.__loanEvents[0][2].calculator_slug === 'home-loan' && window.__loanEvents[0][2].comparison_mode === 'tenure_rate'", "comparison open sends fixed metadata once");
  await check("[...document.querySelectorAll('#home-loan-comparison dd')].filter(x => x.textContent === '₹0.00 difference').length === 3", "initial currency differences are zero");
  await check("document.getElementById('home-loan-comparison').textContent.includes('0 months difference')", "initial tenure difference is zero");
  await check("document.querySelectorAll('#principal').length === 1 && document.querySelectorAll('#home-loan-comparison input').length === 2", "principal is shared with exactly two alternative inputs");
  await input("comparison-tenure", "25");
  await check("document.getElementById('home-loan-comparison').textContent.includes('60 months longer')", "tenure comparison updates");
  await check("window.__loanEvents.filter(event => event[1] === 'loan_comparison_used').length === 1", "meaningful comparison use sends once");
  await select("comparison");
  await check("document.querySelector('table caption').textContent.startsWith('Comparison') && document.querySelector('tbody tr th').textContent === '1'", "comparison schedule selected at first month");
  const comparisonRow = await evaluate("document.querySelector('tbody tr').textContent");
  await button("Next");
  await check("document.querySelector('tbody tr th').textContent === '25'", "24-row pagination");
  await select("current");
  await check("document.querySelector('tbody tr th').textContent === '1'", "scenario switch resets pagination");
  assert.notEqual(await evaluate("document.querySelector('tbody tr').textContent"), comparisonRow); checks++; console.log("PASS scenario switch changes schedule amounts");
  await select("comparison");
  await input("comparison-rate", "-1");
  await check("document.getElementById('comparison-error')?.getAttribute('role') === 'alert' && !document.querySelector('#home-loan-comparison dl')", "invalid alternative shows error and withholds differences");
  await check("window.__loanEvents.filter(event => event[1] === 'loan_comparison_used').length === 1", "invalid edits do not repeat comparison use");
  await check("document.querySelector('[aria-labelledby=loan-results]').textContent.includes('₹43,391.16') && !document.querySelector('table')", "valid baseline survives invalid selected alternative without stale rows");
  await select("current");
  await check("document.querySelector('tbody tr th').textContent === '1'", "baseline schedule remains available");
  await input("comparison-rate", "");
  await check("document.getElementById('comparison-error') !== null", "blank rate is not silently zero");
  await input("comparison-rate", "0");
  await input("annualInterestRate", "0");
  await check("!document.getElementById('comparison-error') && document.querySelectorAll('#home-loan-comparison dl').length === 4", "zero interest comparison renders");
  for (const width of [320, 375, 1280]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 });
    await check("document.documentElement.scrollWidth <= window.innerWidth", `no page overflow at ${width}px`);
  }
  await button("Close comparison");
  await check("window.__loanEvents.filter(event => event[1] === 'loan_comparison_open').length === 1", "closing comparison sends no open event");
  await input("annualInterestRate", "9");
  await button("Compare another scenario");
  await check("window.__loanEvents.filter(event => event[1] === 'loan_comparison_open').length === 2", "deliberate reopen sends another open event");
  await check("window.__loanEvents.filter(event => event[1] === 'loan_comparison_used').length === 1", "reopen does not reset comparison use guard");
  await check("document.getElementById('comparison-rate').value === '9' && document.getElementById('comparison-tenure').value === '20'", "reopening initializes from current baseline");
  for (const route of ["car-loan", "personal-loan"]) {
    await send("Page.navigate", { url: `${base}/calculators/${route}` });
    await waitFor("document.getElementById('principal') && document.readyState === 'complete'");
    await check("![...document.querySelectorAll('button')].some(b => b.textContent.includes('Compare')) && !!document.querySelector('tbody tr')", `${route} remains a single-scenario calculator`);
  }
  assert.deepEqual(errors, []); checks++; console.log("PASS no uncaught browser exceptions");
  console.log(`${checks} browser checks passed`);
} catch (error) {
  console.error("Browser exceptions:", errors);
  console.error("Active control:", await evaluate("document.activeElement.outerHTML"));
  throw error;
} finally {
  await send("Browser.close", {}, false).catch(() => {});
  socket.close();
  browser.kill();
}
