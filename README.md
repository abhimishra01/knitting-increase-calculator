# Knitting Increase Calculator

Free browser tool for knitters and crocheters. You enter the stitches you have and how many to add or remove. It writes the pattern line (for example `K4, M1, *K7, M1; rep from * 5 more times, K4.`), draws your row as dots, and lists where each change goes. It handles flat rows and work in the round, knit (M1, M1L, M1R, YO, KFB, K2tog, SSK, SKP, purl forms) and crochet (sc, inc, sc2tog), plain edge stitches, and a shorter or most-even line. Domain: knittingincreasecalculator.com. Astro (static) and Tailwind 4. No backend.

## Where things live

- `src/lib/spread.js`: all the spacing logic (`plan()`, `summary()`, `explain()`). Plain JavaScript, no imports. The page and the tests use the same file.
- `src/lib/render.js`: builds the result markup (bold change stitch, dots, "where" sentence). Used at build time and in the browser.
- `src/components/Tool.astro`: the calculator UI and its script. The first result is drawn at build time.
- `src/components/Article.astro`, `src/data/faq.ts`: the article and FAQ (the FAQ also becomes FAQPage schema).
- `src/lib/url.ts`: link helper that works at the domain root and under a base path.
- `src/site.config.ts`: name, domain, keywords, brand color, GA4 and AdSense IDs (empty means off).

## Commands

```
npm run dev       # work on the site
npm test          # logic tests (node:test): spacing, edge cases, crochet, KFB, markup helpers
npm run build     # make dist/
npm run deploy    # runs npm test, builds, then uploads dist/ to Cloudflare Pages (needs Node 22.6+)
```

## GitHub Pages

The site can also run at `https://abhimishra01.github.io/knitting-increase-calculator/` until the domain is live. `.github/workflows/pages.yml` runs the tests and builds with `PAGES_BASE=/knitting-increase-calculator/` and `PAGES_SITE=https://abhimishra01.github.io` on every push to `main`. To check it locally:

```
PAGES_BASE=/knitting-increase-calculator/ PAGES_SITE=https://abhimishra01.github.io npx astro build --outDir dist-pages
```

Serve `dist-pages` so it appears under `/knitting-increase-calculator/`, then delete the folder. The canonical link always points to the real domain.

## Notes

- Dark mode follows the system; the toggle saves the choice.
- Sitemap and robots.txt are generated. `public/_headers` keeps the `*.pages.dev` address out of Google.
- GA4 and AdSense load only when their IDs are set in `src/site.config.ts`.
- The Privacy and Terms pages are starting text, not legal advice. Read them before launch.
