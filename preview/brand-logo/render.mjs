// Local-only artifact generator: node preview/brand-logo/render.mjs
// Renders the real component; no app route, server, dependency or network use.
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { renderToStaticMarkup } from "react-dom/server";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const source = fs.readFileSync(path.join(root, "components/site/BrandLogo.tsx"), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2017 },
}).outputText;
const component = { exports: {} };
new Function("require", "module", "exports", compiled)(require, component, component.exports);
const { BrandLogo } = component.exports;
const tokens = fs.readFileSync(path.join(root, "app/globals.css"), "utf8").match(/:root\s*\{[^}]*\}/)[0];
const fontPath = path.join(root, ".next/static/media/22a5144ee8d83bca-s.p.woff2");
const font = fs.existsSync(fontPath)
  ? `@font-face{font-family:PreviewGeist;src:url(data:font/woff2;base64,${fs.readFileSync(fontPath).toString("base64")}) format('woff2');font-weight:100 900}:root{--font-geist-sans:PreviewGeist}`
  : "/* Local Geist build asset unavailable; system fallback shown. */";
const rows = ["navy", "teal", "monochrome"].map((treatment) =>
  `<section><h2>${treatment}</h2>${[16, 24, 40].map((size) =>
    `<div class="sample" style="--sample-size:${size}px"><div class="lockup">${renderToStaticMarkup(BrandLogo({ treatment }))}</div><div>${renderToStaticMarkup(BrandLogo({ treatment, variant: "mark" }))}</div></div>`).join("")}</section>`).join("");
const reverse = renderToStaticMarkup(BrandLogo({ treatment: "monochrome" }));
const smallMarks = ["navy", "monochrome", "white"].map((treatment) =>
  `<section class="small-marks ${treatment === "white" ? "reverse" : ""}"><h2>Exact mark pixels: ${treatment}</h2><div class="mark-grid">${[16, 24, 32, 48].map((size) =>
    `<div class="mark-cell"><p>${size} x ${size}</p><span data-mark-size="${size}" style="font-size:${size / 1.5}px">${renderToStaticMarkup(BrandLogo({ variant: "mark", treatment: treatment === "white" ? "monochrome" : treatment }))}</span></div>`).join("")}</div></section>`).join("");
const css = `
${tokens}${font}
*{box-sizing:border-box}
body{margin:0;padding:clamp(12px,4vw,24px);background:var(--as-surface-page);color:var(--as-text-primary);font-family:system-ui,sans-serif}
main{width:100%;max-width:900px;min-width:0;margin:auto}
section{min-width:0;padding:clamp(12px,3vw,20px);margin:16px 0;background:white;border:1px solid var(--as-border-subtle);border-radius:12px}
h1{font-size:24px;overflow-wrap:anywhere}h2{font-size:16px}
.sample{display:flex;flex-wrap:wrap;gap:16px;align-items:center;padding:16px 0;font-size:var(--sample-size)}
.sample>div{min-width:0}.lockup{max-width:100%}
.reverse{background:var(--as-brand-navy);color:white;font-size:24px}
.mark-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.mark-cell{min-width:0}.mark-cell p{font-size:12px}.mark-cell>span{display:inline-flex}
@media(max-width:600px){.sample{font-size:min(var(--sample-size),24px)}}
`;
fs.writeFileSync(path.join(__dirname, "logo.html"), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>ArthaSiddhi local logo prototype</title><style>${css}</style></head><body><main><h1>ArthaSiddhi - local logo prototype</h1><p>Real component at 16, 24 and 40px text sizes, capped at 24px on narrow screens. Mark size is 1.5em. Exact pixel samples follow. Not a public page.</p>${rows}<section class="reverse">${reverse}</section><div id="small-size-review">${smallMarks}</div></main></body></html>`);
console.log("Generated preview/brand-logo/logo.html (local only).");
