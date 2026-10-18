// Optional real-browser regression check: start the production server, then run
// node tests/site/site-header-browser.mjs. Uses installed Chrome and Node CDP.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.env.HEADER_TEST_BASE_URL || "http://127.0.0.1:3000";
const profile = await mkdtemp(join(tmpdir(), "arthasiddhi-header-browser-"));
const browser = spawn(process.env.HEADER_TEST_BROWSER || "C:/Program Files/Google/Chrome/Application/chrome.exe", [
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




let checks=0;
async function check(expression,message){assert.equal(await evaluate(expression),true,message);checks++;console.log('PASS',message);}
const screenshots=await mkdtemp(join(tmpdir(),'arthasiddhi-header-review-'));
async function capture(name){
 const r=await send('Page.captureScreenshot',{format:'png'});
 await writeFile(join(screenshots,name),Buffer.from(r.data,'base64'));
}
const routes=[
 ['/', 'Home', true, 'home'],
 ['/learn','Learn',true,'learn'],
 ['/calculators','Calculators',true,'directory'],
 ['/learn/loans/how-much-house-can-i-afford','Learn',false,'article'],
 ['/calculators/home-loan','Calculators',false,'calculator'],
];
async function load(path){
 await send('Page.navigate',{url:base+path});
 await waitFor("document.readyState==='complete' && !!document.querySelector('.site-header-nav')");
}
try{
 const {targetId}=await send('Target.createTarget',{url:'about:blank'},false);
 ({sessionId}=await send('Target.attachToTarget',{targetId,flatten:true},false));
 await send('Runtime.enable');await send('Page.enable');
 for(const [path,label,exact,name] of routes){
  await load(path);
  await waitFor("document.querySelector('.site-header-link[data-section-active=true]')?.textContent.trim()==="+JSON.stringify(label));
  await check("document.querySelectorAll('.site-header-nav [aria-current=page]').length==="+(exact?1:0),'exact-page semantics on '+path);
  for(const width of [320,360,390,768,1024,1440]){
   await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});
   await check("document.documentElement.scrollWidth<=window.innerWidth && [...document.querySelectorAll('.site-header a')].every(a=>{const r=a.getBoundingClientRect();return r.height>=44&&r.width>=44;})",'no overflow and 44px targets on '+path+' at '+width);
   await check("(() => { const logo=document.querySelector('.site-header-inner > a').getBoundingClientRect(),nav=document.querySelector('.site-header-nav').getBoundingClientRect();return "+(width<640?"nav.top>=logo.bottom && Math.abs(nav.left-logo.left)<1":"Math.abs(nav.top-logo.top)<12")+"; })()",'intentional header arrangement on '+path+' at '+width);
   if(width===390||width===1440){
    await evaluate('window.scrollTo(0,0)');
    if(path==='/')await waitFor("document.querySelector('.home-photo img').complete && document.querySelector('.home-photo img').naturalWidth>0");
    await capture(name+'-'+width+'.png');
   }
  }
  await evaluate("document.documentElement.style.zoom='2';window.scrollTo(0,0)");
  await check("document.documentElement.scrollWidth<=window.innerWidth && document.querySelectorAll('.site-header-nav a').length===3",'200% CSS zoom reflow on '+path);
  await evaluate("document.documentElement.style.zoom=''");
 }
 await load('/');
 await send('Page.bringToFront');
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
 await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
 await check("document.activeElement.closest('.site-header')!==null && getComputedStyle(document.activeElement).outlineStyle!=='none'",'Tab has visible header focus');
 const first=await evaluate('document.activeElement.outerHTML');
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
 await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9,modifiers:8});
 await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9,modifiers:8});
 assert.equal(await evaluate('document.activeElement.outerHTML'),first);checks++;console.log('PASS Shift+Tab returns to prior link');
 // Deliberate keyboard activation also verifies active route changes after client navigation.
 await evaluate("document.querySelector('.site-header-nav a[href=\"/learn\"]').focus()");
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:String.fromCharCode(13),windowsVirtualKeyCode:13});
 await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
 await waitFor("location.pathname==='/learn' && document.querySelector('.site-header-nav [aria-current=page]')?.textContent==='Learn'");
 checks++;console.log('PASS Enter navigation updates current page');
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 await check("[...document.querySelectorAll('.site-header a')].every(a=>getComputedStyle(a).animationName==='none'&&getComputedStyle(a).transitionDuration==='0s')",'header is static under reduced motion');
 await send('Emulation.setEmulatedMedia',{features:[{name:'forced-colors',value:'active'}]});
 await check("matchMedia('(forced-colors: active)').matches && getComputedStyle(document.querySelector('.site-header-link[data-section-active=true]'),'::after').height==='2px'",'active marker retained in forced colors');
 await evaluate("document.querySelector('.site-header-nav a[href=\"/learn\"]').focus()");
 await check("getComputedStyle(document.activeElement).outlineStyle!=='none'",'focus outline retained in forced colors');
 await capture('header-forced-colors.png');
 await send('Emulation.setEmulatedMedia',{features:[]});
 await send('Emulation.setScriptExecutionDisabled',{value:true});
 for(const path of ['/','/learn/loans/how-much-house-can-i-afford','/calculators']){
  await load(path);
  await check("[...document.querySelectorAll('.site-header-nav a')].map(a=>a.getAttribute('href')).join('|')==='/|/calculators|/learn'",'all links present without JavaScript on '+path);
  const exact=path==='/learn/loans/how-much-house-can-i-afford'?0:1;
  await check("document.querySelectorAll('.site-header-nav [aria-current=page]').length==="+exact,'server-rendered current-page semantics on '+path);
 }
 await send('Emulation.setScriptExecutionDisabled',{value:false});
 assert.deepEqual(errors,[]);console.log(checks+' browser checks passed');console.log('Screenshots: '+screenshots);
}finally{await send('Browser.close',{},false).catch(()=>{});socket.close();browser.kill();}
