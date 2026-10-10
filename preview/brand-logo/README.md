# Local logo review

Run `node preview/brand-logo/render.mjs` from the repository root, then open
`preview/brand-logo/logo.html` directly in a browser. Do not publish this folder.
It is outside `app` and `public`; it creates no application route or navigation.

The generator renders the actual BrandLogo component in navy, teal and inherited
monochrome, at three sizes, plus white on navy. It embeds the existing local Geist
font build asset when available; otherwise it shows the system fallback. It makes
no network requests. Re-run after component or token edits.

BrandLogo accepts `variant="lockup" | "mark"`,
`treatment="navy" | "teal" | "monochrome"`, and optional `className`.
Size with the wrapper's font-size. Monochrome inherits wrapper text color.
The component is not itself a link or button; integration must supply those semantics.
The SVG is decorative; the lockup has visible text and mark-only has a named image role.

Tokens are opt-in `--as-*` CSS properties in globals.css. Brand tokens are identity
colors; surface, text, border and action tokens describe UI roles. Use CSS var()
or Tailwind arbitrary values. They are outside Tailwind @theme and do not generate
named utilities or override the existing slate/emerald palette. Decorative copper
is not for small text; subtle borders are not sufficient control boundaries alone.
Geist and all existing page styles are retained.

Review silhouette, crossbar, spacing, small-size legibility and monochrome before
adopting this prototype. Copper detail is deliberately omitted. Header and favicon
integration belong to later approved work.

On narrow preview windows the samples use 24px text to fit the review sheet;
desktop retains the three reference sizes. Screenshots are local review artifacts.

## Closeout verification

Run `node preview/brand-logo/verify-browser.mjs` after rendering. This requires
installed Chrome at the script's Windows path and permission to launch it.
It uses CDP viewport emulation (320, 360, 390, 1280px; DPR 1), verifies no horizontal
overflow, checks exact SVG dimensions, and captures PNGs plus browser-results.json.
HTTP(S) requests are blocked. Browser profiles use the OS temporary directory.
The exact mark-size panel shows 16, 24, 32 and 48px navy, inherited monochrome
and reversed white marks. No production geometry was changed for preview layout.

Recommended Git disposition: retain this README, render.mjs and verify-browser.mjs
as reproducible development sources. Do not stage logo.html, PNG captures or
browser-results.json. Preserve them locally for review. If desired, add the exact
patterns `/preview/brand-logo/logo.html`, `/preview/brand-logo/*.png` and
`/preview/brand-logo/browser-results.json` to `.git/info/exclude` locally, subject
to review. No ignore/exclude file has been changed by this milestone.

Small-size review: A silhouette remains recognizable at 16px; the rising crossbar
is subtle there and clearer at 24?48px. Retain navy on ivory, teal secondary,
and inherited white on navy. Consider a separately approved optical simplification
for a future favicon; no icon assets are created or replaced here.

Current closeout captures use numeric names logo-320.png through logo-1280.png.
The earlier logo-mobile.png and logo-desktop.png captures are retained as historical
review artifacts; they are not the final overflow-verification captures.
