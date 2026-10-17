// Optional real-browser regression check: start the production server, then run
// node tests/calculator/home-loan-browser.mjs. Uses installed Chrome and Node CDP.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.env.HOME_TEST_BASE_URL || "http://127.0.0.1:3000";
const profile = await mkdtemp(join(tmpdir(), "arthasiddhi-home-browser-"));
const browser = spawn(process.env.HOME_TEST_BROWSER || "C:/Program Files/Google/Chrome/Application/chrome.exe", [
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

let checks = 0;
async function check(expression, message) {
  assert.equal(await evaluate(expression), true, message);
  checks++; console.log('PASS', message);
}
const screenshots = await mkdtemp(join(tmpdir(), 'arthasiddhi-home-review-'));
async function capture(name, full = false) {
  const metrics = await send('Page.getLayoutMetrics');
  const clip = full ? { x: 0, y: 0, width: metrics.cssContentSize.width, height: metrics.cssContentSize.height, scale: 1 } : undefined;
  const result = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: full, ...(clip ? { clip } : {}) });
  await writeFile(join(screenshots, name), Buffer.from(result.data, 'base64'));
}
try {
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' }, false);
  ({ sessionId } = await send('Target.attachToTarget', { targetId, flatten: true }, false));
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Page.navigate', { url: base });
  await waitFor("document.querySelector('.home-photo img') && document.readyState === 'complete'");
  await waitFor("document.querySelector('.home-photo img').complete && document.querySelector('.home-photo img').naturalWidth > 0");
  const hrefs = await evaluate("[...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href'))");
  for (const href of [...new Set(hrefs.filter(h => h.startsWith('/') && !h.startsWith('//')))]) {
    const response = await fetch(new URL(href, base));
    assert.equal(response.status, 200, href);
  }
  checks++; console.log('PASS every local homepage navigation destination returns 200');
  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
    await waitFor("document.querySelector('.home-photo img').complete");
    await check('document.documentElement.scrollWidth <= window.innerWidth', 'no overflow at ' + width);
    await check("(() => { const i=document.querySelector('.home-photo img'),r=i.getBoundingClientRect(); return Math.abs(r.width/r.height - 2) < .02 && getComputedStyle(i).objectFit !== 'cover'; })()", 'whole 2:1 image retained at ' + width);
    await check("document.querySelectorAll('#decisions a').length === 6", 'six financial journeys at ' + width);
    await check("getComputedStyle(document.getElementById('home-heading')).fontFamily.includes('Georgia')", 'editorial heading font at ' + width);
    if (width < 1024) await check("document.querySelector('a[href=\"#decisions\"]').getBoundingClientRect().bottom < document.querySelector('.home-photo').getBoundingClientRect().top", 'actions precede image at ' + width);
    await check("document.querySelectorAll('.home-process-steps > li').length === 4", 'all four process steps at ' + width);
    await check("(() => { const s=getComputedStyle(document.querySelector('.home-process')); return s.backgroundColor === 'rgba(0, 0, 0, 0)' && s.borderTopWidth === '0px' && s.borderRadius === '0px'; })()", 'process has no enclosing panel at ' + width);
    if (width >= 1024) {
      await check("getComputedStyle(document.querySelector('.home-process-steps')).gridTemplateColumns.split(' ').length === 4", 'balanced horizontal process at ' + width);
      await check("getComputedStyle(document.querySelector('.home-process-steps > li:nth-child(3)')).borderLeftWidth === '1px'", 'subtle desktop step separators at ' + width);
    }
    if (width === 390 || width === 1440) {
      await evaluate('window.scrollTo(0,0)');
      await capture('home-' + width + '.png');
      await capture('home-' + width + '-full.png', true);
    }
  }
  // CSS zoom exercises 200% content magnification and reflow; not browser-toolbar zoom.
  await evaluate("document.documentElement.style.zoom='2'");
  await check('document.documentElement.scrollWidth <= window.innerWidth', 'no horizontal overflow at 200% CSS zoom');
  await check("document.querySelector('a[href=\"#decisions\"]').getBoundingClientRect().height >= 44", 'primary action remains operable at 200% CSS zoom');
  await capture('home-200-percent.png');
  await evaluate("document.documentElement.style.zoom=''");
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await check("getComputedStyle(document.querySelector('.home-card')).transitionDuration === '0s'", 'reduced motion disables card transitions');
  await send('Page.bringToFront');
  await evaluate("document.activeElement?.blur(); window.scrollTo(0,0)");
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  await check("document.activeElement.tagName === 'A' && getComputedStyle(document.activeElement).outlineStyle !== 'none'", 'keyboard Tab receives a visible focus outline');
  await evaluate("document.querySelector('a[href=\"#decisions\"]').focus()");
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', windowsVirtualKeyCode: 13 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await waitFor("location.hash === '#decisions'");
  await check("document.activeElement.id === 'decisions'", 'keyboard action moves to financial journeys');
  await check("document.querySelector('link[rel=canonical]').href === 'https://arthasiddhi.com/'", 'canonical preserved');
  assert.deepEqual(errors, []);
  console.log(checks + ' browser checks passed');
  console.log('Screenshots: ' + screenshots);
} finally {
  await send('Browser.close', {}, false).catch(() => {});
  socket.close();
  browser.kill();
}
