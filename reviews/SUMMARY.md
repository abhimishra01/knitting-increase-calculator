# Fix summary (Bruce)

## Fixed
- Wrong answer: "Inc 1" used up a stitch but the line ignored it. Replaced by KFB/PFB and crochet inc, which use one stitch each (runs, "where" text, dots and totals now add up). Test walks the picture against `after`.
- Crochet: Knit/Crochet choice (sc, inc, sc2tog), in H1, title, intro, About, FAQ and a new article section.
- Pattern line: shorter line is now the default, with a visible "Shorter line / Most even" switch under the result. Round lines say "to end of round" when all runs are equal. One change in the round prints plain text. Paren style: "twice" and "N times".
- One-line stitch explanation under the result (M1, M1L, M1R, YO, KFB, K2tog, SSK, SSP, SKP, tbl forms, inc, sc2tog).
- Purl row: SSK becomes SSP, K2tog tbl becomes P2tog tbl, SKP is hidden; KFB becomes PFB.
- Edge stitches option (flat rows only).
- Safari lookbehind crash removed (`lineHtml`, no regex). `color-mix` fallbacks added.
- Errors show under the number fields (visible on a phone). Plural fixes ("1 stitch"). Stale hint removed.
- Dark mode contrast on selected buttons and Copy. Darker stitch dots. Gap-every-10 fixed for decrease pairs.
- Share link now carries all choices. Privacy page matches (address bar line, no cookie banner claim, US spelling, fixed date). Terms fixed date.
- Default result and dots are drawn at build time; noscript line added. Generic H2s in the tool are now paragraphs. Phone: intro text hidden on small screens so the result sits higher; desktop options moved to the left column.
- SEO: H1 and title use "increase evenly" and crochet; meta keywords and single-item breadcrumb removed; og:image width, height, alt added; 3 article sections added (math, M1L/M1R/YO, 10 across 80) plus crochet; footer links 44px-ish tap height.
- Template items: README rewritten; scripts/new-tool.sh removed; screenshots/ and .playwright-cli/ ignored and untracked; duplicate legal links removed from home; deploy runs npm test first; `engines` node >=22.6; Tailwind limited to src.
- GitHub Pages: PAGES_BASE and PAGES_SITE in astro.config, all links and assets use `href()`, relative manifest, canonical always the real domain, `.github/workflows/pages.yml` (checkout@v4, setup-node@v4 node 22, upload-pages-artifact@v3, deploy-pages@v4). Checked locally under /knitting-increase-calculator/: home, about, privacy, icons, manifest, og.png all 200 and links resolve; dist-pages removed.

## Rejected
- Sticky or second Copy button on phones: Copy now sits in the result card, which is higher on the page after the layout changes.
- Lifted increases (LLI/RLI): niche; M1L/M1R/KFB cover the need.
- "Increase every Nth row" mode and print/save image: a different tool, breaks single purpose.
- Hold-to-repeat on steppers, lowering the 3x cap, nested dots scroll, `unit` dedupe was done; removing unused return fields left (cheap, low value).
- Separate /decrease-evenly-calculator/ page: Phase 2.

## Status
- npm test: 25 pass. npm run build: ok (6 pages).
- Tailwind CSS: 115,047 B before, 22,397 B after (5.4 KB gzip).
- Lighthouse (mobile, local build): performance 100, accessibility 100, best practices 100, SEO 100.
- Screenshots (ignored by git) in screenshots/: 1280 and 390, light and dark.

## Left for the owner
- Buy the domain; set GA4/AdSense IDs later. Push to GitHub and enable Pages (source: GitHub Actions). Read Privacy/Terms before launch.

## Phase 2 SEO pages (not built)
1. decrease evenly calculator
2. how to decrease evenly across a row
3. knitting decrease calculator
4. crochet increase calculator
5. crochet decrease calculator
6. increase 10 stitches evenly across 80
7. increase 12 stitches evenly across 60
8. increase 20 stitches evenly across 100
9. decrease 10 stitches evenly across 100
10. decrease 8 stitches evenly across 96
11. increase evenly in the round
12. decrease evenly in the round (hat crown)
13. M1L vs M1R guide with calculator
14. how to space increases on a sleeve
15. increase evenly across a row of 40 stitches
16. sock gusset decrease calculator
17. raglan increase calculator
18. amigurumi increase calculator
19. evenly spaced increases for lace (yarn over)
20. knitting stitch calculator for a swatch to gauge
