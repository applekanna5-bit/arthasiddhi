// Optional real-browser regression check: start the production server, then run
// node tests/site/calculator-directory-browser.mjs. Uses installed Chrome and Node CDP.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.env.DIRECTORY_TEST_BASE_URL || "http://127.0.0.1:3000";
const profile = await mkdtemp(join(tmpdir(), "arthasiddhi-directory-browser-"));
const browser = spawn(process.env.DIRECTORY_TEST_BROWSER || "C:/Program Files/Google/Chrome/Application/chrome.exe", [
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
const screenshots=await mkdtemp(join(tmpdir(),'arthasiddhi-directory-review-'));
async function capture(name,full=false){
  const m=await send('Page.getLayoutMetrics');
  const clip=full?{x:0,y:0,width:m.cssContentSize.width,height:m.cssContentSize.height,scale:1}:undefined;
  const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:full,...(clip?{clip}:{})});
  await writeFile(join(screenshots,name),Buffer.from(r.data,'base64'));
}
try{
  const {targetId}=await send('Target.createTarget',{url:'about:blank'},false);
  ({sessionId}=await send('Target.attachToTarget',{targetId,flatten:true},false));
  await send('Runtime.enable');await send('Page.enable');
  await send('Page.navigate',{url:base+'/calculators'});
  await waitFor("document.querySelectorAll('.directory-card').length===17 && document.readyState==='complete'");
  const hrefs=await evaluate("[...document.querySelectorAll('.directory-card')].map(a=>a.getAttribute('href'))");
  assert.equal(new Set(hrefs).size,17);
  for(const href of hrefs)assert.equal((await fetch(new URL(href,base),{signal:AbortSignal.timeout(10000)})).status,200,href);
  checks++;console.log('PASS all 17 unique calculator destinations return 200');
  for(const width of [320,390,768,1024,1440]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});
    await check('document.documentElement.scrollWidth<=window.innerWidth','no overflow at '+width);
    const columns=width>=1024?3:width>=640?2:1;
    await check("[...document.querySelectorAll('.directory-grid')].every(g=>getComputedStyle(g).gridTemplateColumns.split(' ').length==="+columns+")",columns+' columns at '+width);
    await check("[...document.querySelectorAll('.directory-card')].every(a=>a.getBoundingClientRect().height>0 && a.querySelector('svg[aria-hidden=true][focusable=false]') && !a.querySelector('a,button'))",'17 accessible visible cards at '+width);
    await check("(() => {const rows=new Map();for(const a of document.querySelectorAll('.directory-card')){const r=a.getBoundingClientRect(),k=Math.round(r.top);if(rows.has(k)&&Math.abs(rows.get(k)-r.height)>1)return false;rows.set(k,r.height);}return true;})()",'balanced row heights at '+width);
    if(width===390||width===1440){await evaluate('window.scrollTo(0,0)');await capture('calculators-'+width+'.png');await capture('calculators-'+width+'-full.png',true);}
  }
  for(const id of ['loans','investments','savings','tax','retirement-planning']){
    await evaluate("document.querySelector('a[href=\"#"+id+"-calculators\"]').click()");
    await check("location.hash==='#"+id+"-calculators' && !!document.getElementById('"+id+"-calculators')",'category jump '+id);
  }
  await evaluate("document.documentElement.style.zoom='2';window.scrollTo(0,0)");
  await check("document.documentElement.scrollWidth<=window.innerWidth && document.querySelectorAll('.directory-card').length===17",'200% CSS zoom reflow keeps all calculators without overflow');
  await capture('calculators-css-zoom-200.png');
  await evaluate("document.documentElement.style.zoom=''");
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await check("getComputedStyle(document.querySelector('.directory-card')).transitionDuration==='0s'",'reduced motion');
  await send('Page.navigate',{url:base+'/calculators'});
  await waitFor("document.querySelector('.directory-card') && document.readyState==='complete'");
  await send('Page.bringToFront');
  for(let i=0;i<16;i++){
    await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
    await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
    if(await evaluate("document.activeElement.classList.contains('directory-card')"))break;
  }
  await check("document.activeElement.classList.contains('directory-card') && getComputedStyle(document.activeElement).outlineStyle!=='none'",'card reached by keyboard with visible focus');
  const target=await evaluate('document.activeElement.pathname');
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:String.fromCharCode(13),windowsVirtualKeyCode:13});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  await waitFor('location.pathname==='+JSON.stringify(target));
  checks++;console.log('PASS keyboard activates calculator');
  for(const route of ['/','/learn','/calculators/home-loan','/calculators/sip','/calculators/income-tax']){
    await send('Page.navigate',{url:base+route});
    await waitFor("document.readyState==='complete' && !!document.querySelector('main h1')");
    for(const width of [390,1440]){
      await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});
      await check("document.documentElement.scrollWidth<=window.innerWidth && !document.querySelector('.calculator-directory')",'no directory CSS wrapper or overflow on '+route+' at '+width);
      if(route==='/')await waitFor("document.querySelector('.home-photo img').complete && document.querySelector('.home-photo img').naturalWidth>0");
      if(route==='/'||route==='/learn')await capture((route==='/'?'home':'learn')+'-regression-'+width+'.png');
    }
  }
  assert.deepEqual(errors,[]);console.log(checks+' browser checks passed');console.log('Screenshots: '+screenshots);
}finally{await send('Browser.close',{},false).catch(()=>{});socket.close();browser.kill();}
