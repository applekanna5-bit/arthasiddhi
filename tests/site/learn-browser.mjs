// Optional real-browser regression check: start the production server, then run
// node tests/calculator/home-loan-browser.mjs. Uses installed Chrome and Node CDP.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.env.LEARN_TEST_BASE_URL || "http://127.0.0.1:3000";
const profile = await mkdtemp(join(tmpdir(), "arthasiddhi-learn-browser-"));
const browser = spawn(process.env.LEARN_TEST_BROWSER || "C:/Program Files/Google/Chrome/Application/chrome.exe", [
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
const screenshots = await mkdtemp(join(tmpdir(), 'arthasiddhi-learn-review-'));
async function capture(name, full = false) {
  const m = await send('Page.getLayoutMetrics');
  const clip = full ? { x:0, y:0, width:m.cssContentSize.width, height:m.cssContentSize.height, scale:1 } : undefined;
  const result = await send('Page.captureScreenshot', {format:'png',captureBeyondViewport:full,...(clip?{clip}:{})});
  await writeFile(join(screenshots,name),Buffer.from(result.data,'base64'));
}
try {
  const { targetId } = await send('Target.createTarget',{url:'about:blank'},false);
  ({sessionId}=await send('Target.attachToTarget',{targetId,flatten:true},false));
  await send('Runtime.enable'); await send('Page.enable');
  await send('Page.navigate',{url:base+'/learn'});
  await waitFor("document.querySelector('.learn-editorial') && document.readyState === 'complete'");
  const hrefs=await evaluate("[...document.querySelectorAll('.learn-editorial a')].map(a=>a.getAttribute('href'))");
  for(const href of [...new Set(hrefs)]) assert.equal((await fetch(new URL(href,base),{signal:AbortSignal.timeout(10000)})).status,200,href);
  checks++; console.log('PASS all Learn destinations return 200');
  for(const width of [320,390,768,1024,1440]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});
    // Scroll each lazy image into view and wait for actual decode before review.
    for(let i=0;i<6;i++){
      await evaluate("document.querySelectorAll('.learn-art img')["+i+"].scrollIntoView()");
      await waitFor("document.querySelectorAll('.learn-art img')["+i+"].complete && document.querySelectorAll('.learn-art img')["+i+"].naturalWidth > 0");
    }
    await evaluate('window.scrollTo(0,0)');
    await check('document.documentElement.scrollWidth <= window.innerWidth','no overflow at '+width);
    const columns=width>=1024?3:width>=640?2:1;
    await check("getComputedStyle(document.querySelector('.learn-topic-grid')).gridTemplateColumns.split(' ').length === "+columns,columns+' columns at '+width);
    await check("[...document.querySelectorAll('.learn-art img')].every(i=>getComputedStyle(i).objectFit==='contain' && i.alt==='' && i.getBoundingClientRect().height<=176)",'modest uncropped decorative artwork at '+width);
    await check("document.querySelectorAll('.learn-topic-card').length===6",'six topic links at '+width);
    if(width===390||width===1440){await capture('learn-'+width+'.png');await capture('learn-'+width+'-full.png',true);}
  }
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await check("getComputedStyle(document.querySelector('.learn-card')).transitionDuration==='0s'",'reduced motion disables transitions');
  await send('Page.navigate',{url:base+'/learn'});
  await waitFor("document.querySelector('.learn-editorial') && document.readyState==='complete'");
  await send('Page.bringToFront');
  await evaluate('document.activeElement?.blur(); window.scrollTo(0,0)');
  for(let n=0;n<12;n++){
    await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
    await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
    if(await evaluate("document.activeElement.classList.contains('learn-topic-card')"))break;
  }
  console.log('Keyboard focus:',await evaluate("({tag:document.activeElement.tagName,classes:document.activeElement.className,outline:getComputedStyle(document.activeElement).outlineStyle})"));
  await check("document.activeElement.classList.contains('learn-topic-card') && getComputedStyle(document.activeElement).outlineStyle==='solid'",'full topic card receives keyboard focus with visible outline');
  const target=await evaluate('document.activeElement.pathname');
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r',windowsVirtualKeyCode:13});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  await waitFor("location.pathname==="+JSON.stringify(target));
  checks++;console.log('PASS keyboard activates topic destination');
  await send('Network.enable');
  await send('Network.setBlockedURLs',{urls:['*learn-*.webp*','*/_next/image*']});
  await send('Network.setCacheDisabled',{cacheDisabled:true});
  await send('Page.navigate',{url:base+'/learn'});
  await waitFor("document.querySelectorAll('.learn-topic-card').length===6 && document.readyState==='complete'");
  await check("[...document.querySelectorAll('.learn-topic-card')].every(a=>a.querySelector('h3').textContent.trim() && a.getAttribute('href').startsWith('/learn/'))",'all topic text and navigation survive blocked images');
  await check("document.querySelector('link[rel=canonical]').href==='https://arthasiddhi.com/learn'",'Learn canonical preserved');
  await send('Network.setBlockedURLs',{urls:[]});
  await send('Page.navigate',{url:base+'/'});
  await waitFor("document.querySelector('.home-photo img')?.complete && document.querySelector('.home-photo img')?.naturalWidth>0");
  for(const width of [390,1440]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});
    await check("document.documentElement.scrollWidth<=window.innerWidth && document.querySelectorAll('#decisions a').length===6 && getComputedStyle(document.querySelector('.home-display')).fontFamily.includes('Georgia')",'homepage retains layout and journeys at '+width);
    await evaluate('window.scrollTo(0,0)');
    await capture('homepage-regression-'+width+'.png');
  }
  assert.deepEqual(errors,[]);
  console.log(checks+' browser checks passed');
  console.log('Screenshots: '+screenshots);
}finally{
  await send('Browser.close',{},false).catch(()=>{});
  socket.close();browser.kill();
}
