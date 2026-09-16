// Optional real-browser regression check: start the production server, then run
// node tests/calculator/fd-rd-browser.mjs. Uses installed Chrome and Node CDP.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.env.BANKING_TEST_BASE_URL || "http://127.0.0.1:3000";
const profile = await mkdtemp(join(tmpdir(), "arthasiddhi-banking-browser-"));
const browser = spawn(process.env.BANKING_TEST_BROWSER || "C:/Program Files/Google/Chrome/Application/chrome.exe", [
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
let checks = 0;
async function check(expression, message) { assert.equal(await evaluate(expression), true, message); checks++; console.log(`PASS ${message}`); }
async function navigate(slug) {
  await send("Page.navigate", { url: `${base}/calculators/${slug}` });
  await waitFor(`document.querySelector('[aria-labelledby=${slug}-results]') && document.readyState === 'complete'`);
  await waitFor("Object.keys(document.getElementById('annualInterestRate')).some(key => key.startsWith('__reactProps$'))");
}
function result(slug, label) {
  return `[...document.querySelectorAll('[aria-labelledby=${slug}-results] [aria-live] p')].find(p => p.textContent === ${JSON.stringify(label)})?.nextElementSibling?.textContent`;
}
async function invalid(slug, message) {
  await check(`document.getElementById('${slug}-error')?.getAttribute('role') === 'alert' && !document.querySelector('[aria-labelledby=${slug}-results] [aria-live]')`, message);
}
try {
  const { targetId } = await send("Target.createTarget", { url: "about:blank" }, false);
  ({ sessionId } = await send("Target.attachToTarget", { targetId, flatten: true }, false));
  await send("Runtime.enable");
  await send("Page.enable");
  await navigate("fd");
  await check(`${result("fd", "Maturity amount")} === '₹1,23,143.93'`, "FD default maturity");
  await input("annualInterestRate", "");
  await invalid("fd", "FD blank rate removes live result cards");
  await check("document.getElementById('fd-error').textContent === 'Annual interest rate is required.'", "FD required-field message");
  await check("!document.querySelector('[aria-labelledby=fd-results]').textContent.includes('1,23,143.93')", "FD stale maturity removed");
  await check("document.getElementById('annualInterestRate').getAttribute('aria-invalid') === 'true' && document.getElementById('annualInterestRate').getAttribute('aria-describedby') === 'fd-error'", "FD accessible error association");
  // Number inputs sanitize whitespace to empty; invoke React's input callback to cover defensive string-state handling.
  await evaluate("(() => { const field = document.getElementById('annualInterestRate'); field[Object.keys(field).find(key => key.startsWith('__reactProps$'))].onChange({target:{value:'   '}}); })()");
  await pause();
  await invalid("fd", "FD whitespace-only state rejected");
  await input("annualInterestRate", "0");
  await check(`!document.getElementById('fd-error') && ${result("fd", "Maturity amount")} === '₹1,00,000.00' && ${result("fd", "Interest earned")} === '₹0.00'`, "FD explicit zero valid");
  await input("annualInterestRate", "7");
  await check(`${result("fd", "Maturity amount")} === '₹1,23,143.93'`, "FD ordinary rate recovery");
  for (const rate of ["-1", "101"]) {
    await input("annualInterestRate", rate);
    await invalid("fd", `FD rejects rate ${rate}`);
  }
  await input("annualInterestRate", "100");
  await check("!document.getElementById('fd-error') && !!document.querySelector('[aria-labelledby=fd-results] [aria-live]')", "FD inclusive maximum rate valid");
  await input("annualInterestRate", "7");
  for (const [field, restored] of [["principal", "100000"], ["tenureYears", "3"]]) {
    await input(field, "");
    await invalid("fd", `FD blank ${field} remains invalid`);
    await input(field, restored);
    await check(`${result("fd", "Maturity amount")} === '₹1,23,143.93'`, `FD ${field} recovery`);
  }
  await navigate("rd");
  await check(`${result("rd", "Estimated maturity")} === '₹3,60,052.63'`, "RD default maturity");
  await input("annualInterestRate", "");
  await invalid("rd", "RD blank rate remains invalid");
  await input("annualInterestRate", "0");
  await check(`!document.getElementById('rd-error') && ${result("rd", "Estimated maturity")} === '₹3,00,000.00' && ${result("rd", "Estimated interest")} === '₹0.00'`, "RD explicit zero valid");
  await input("monthlyDeposit", "10000");
  await input("tenureYears", "1");
  await input("annualInterestRate", "1e-13");
  await check(`${result("rd", "Estimated maturity")} === '₹1,20,000.00' && ${result("rd", "Estimated interest")} === '₹0.00'`, "RD tiny rate preserves contributions with no negative-zero interest");
  await input("annualInterestRate", "-1");
  await invalid("rd", "RD negative rate rejected");
  await input("annualInterestRate", "7");
  await input("tenureYears", "3");
  await check(`!document.getElementById('rd-error') && ${result("rd", "Estimated maturity")} === '₹4,01,630.26'`, "RD invalid-to-valid recovery");
  assert.deepEqual(errors, []);
  console.log(`PASS no browser runtime exceptions; ${checks} interaction checks passed`);
} finally {
  await send("Browser.close", {}, false).catch(() => {});
  socket.close();
  browser.kill();
}
