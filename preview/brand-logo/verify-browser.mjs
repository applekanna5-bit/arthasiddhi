// Local-only logo checks: node preview/brand-logo/verify-browser.mjs
// Uses installed Chrome and Node CDP; blocks HTTP(S) requests.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";


const profile = await mkdtemp(join(tmpdir(), "arthasiddhi-brand-browser-"));
const browser = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`,
  "--no-first-run", "--no-default-browser-check", "--disable-background-networking", "about:blank",
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

const results = [];
try {
  const { targetId } = await send("Target.createTarget", { url: "about:blank" }, false);
  ({ sessionId } = await send("Target.attachToTarget", { targetId, flatten: true }, false));
  await send("Runtime.enable");
  await send("Page.enable");
  await send("Network.enable");
  await send("Network.setBlockedURLs", { urls: ["http://*", "https://*"] });
  for (const width of [320, 360, 390, 1280]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 1000, deviceScaleFactor: 1, mobile: false });
    await send("Page.navigate", { url: pathToFileURL(join(process.cwd(), "preview/brand-logo/logo.html")).href });
    await new Promise(resolve => setTimeout(resolve, 300));
    await evaluate("document.fonts.ready");
    await evaluate("window.scrollTo(0,0)");
    const metrics = await evaluate(`(() => ({width:innerWidth,clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth, marks:[...document.querySelectorAll('[data-mark-size]')].map(el=>{const r=el.querySelector('svg').getBoundingClientRect();return {expected:Number(el.dataset.markSize),width:r.width,height:r.height}}),overflow:[...document.querySelectorAll('main *')].filter(el=>{const r=el.getBoundingClientRect();return r.left<0 || r.right>innerWidth+0.5}).map(el=>el.tagName)}))()`);
    assert.equal(metrics.scrollWidth, metrics.clientWidth, `Horizontal overflow at ${width}`);
    assert.deepEqual(metrics.overflow, [], `Element overflow at ${width}`);
    for (const mark of metrics.marks) { assert.ok(Math.abs(mark.width-mark.expected)<0.05); assert.ok(Math.abs(mark.height-mark.expected)<0.05); }
    const image = await send("Page.captureScreenshot", { format:"png", captureBeyondViewport:true });
    await writeFile(`preview/brand-logo/logo-${width}.png`, Buffer.from(image.data,"base64"));
    results.push(metrics);
  }
  const box = await evaluate("(() => {const r=document.getElementById('small-size-review').getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height,scale:1}})()");
  const shot = await send("Page.captureScreenshot", { format:"png",clip:box,captureBeyondViewport:true });
  await writeFile("preview/brand-logo/marks-small.png",Buffer.from(shot.data,"base64"));
  await writeFile("preview/brand-logo/browser-results.json",JSON.stringify(results,null,2)+"\n");
  assert.deepEqual(errors, []);
  console.log(JSON.stringify(results));
} finally {
  socket.close();
  browser.kill();
}
