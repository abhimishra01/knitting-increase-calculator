# Design and SEO review: knitting-increase-calculator

Reviewer: Miranda (independent). Build: `astro build --outDir dist-design`, served on port 4456, checked at 1280 and 390, light and dark. Server stopped, build folder deleted, playwright session closed.

## Scores (Lighthouse 13, headless Chrome, local static server)

| Run | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Mobile | 100 | 97 | 100 | 100 |
| Desktop | 100 | 97 | 100 | 100 |

LCP 1.1 s mobile, 0.3 s desktop. CLS 0.003 mobile, 0 desktop. TBT 0 ms. Page weight 216 KB for the whole site (one CSS file 22 KB, one JS file 7 KB). No console errors. No horizontal scroll at 390.
The only Lighthouse failure is color-contrast (finding 1).

## Verdict
Clearly better than the competitors in the research (one iOS app and five spam copy pages). It gives the exact written line, flat and round, decrease mode, a dot picture, copy and a shareable URL. Design is clean, fast and on brand. The checked maths is right: 50 and 7 flat gives 50 stitches in the line, 100 and 10 flat sums to 100, 100 and 10 round repeats correctly. Must-fix items are few and small.

## Findings

| # | Severity | Area | Finding | Fix |
|---|---|---|---|---|
| 1 | Must-fix | Accessibility, dark mode | Selected segment buttons and the Copy button in dark mode use #16161a on #b65c77: contrast 4.11, needs 4.5. Lighthouse flags it. | Dark theme: lighten the text to #000 or darken the fill (mix brand with white at about 65% not 78%). Re-test with Lighthouse. |
| 2 | Must-fix | Error state, phone | At 390x844 with n=10, k=8, decrease, the error text "Too many decreases..." sits at y=846, below the fold. The pattern box above it looks blank and the Copy button looks dead. The hint under the field does show "Most you can decrease: 5", which helps, but the red error is unseen. | On phone, show the error directly under the "Stitches to add" field (or above the results box), and shrink the result box min-height when empty. Or move the error to the `k-hint` line in red. |
| 3 | Must-fix | Spec gap | Tool file lists crocheters as users, and the page title and copy say "knitting" only. There is no crochet wording (sc, inc, dec) in the options or text. A crocheter arriving gets "K" and "M1". | Decide: either remove crocheters from the target in copy and notes, or add a "Crochet" stitch preset (sc, 2 sc in next st, sc2tog) and one article paragraph. Small build. |
| 4 | Should-fix | Phone, one-thumb | The result starts about 650 px down at 390x844: summary at y=653, pattern line partly cut. A knitter has to scroll after every change of number. A 22 px gap sits under the inputs from the empty `k-hint` row. | Reduce the gap above the summary (drop `min-h` on k-hint to 0 when empty, tighten space-y), so the pattern line is fully above the fold at 390x844. Optionally move the summary into the result card. |
| 5 | Should-fix | Desktop layout | Left column ends after the two number fields. About 220 px of dead space shows under it while the right column runs 450 px longer. "Stitch names and style" is far from the inputs. | Move "Stitch names and style" into the left column on lg screens. It balances the card and keeps the settings next to the numbers. |
| 6 | Should-fix | Content | Default tool state is empty in the static HTML (`#result` is empty, no `noscript`). A crawler or no-JS user sees an empty box. First paint shows an empty result box. | Render the default 50 and 7 result at build time with `plan()` (the logic is plain JS), and add a `noscript` line. This also removes the small CLS. |
| 7 | Should-fix | Accessibility | Non-text contrast: the plain stitch dots are about 1.4:1 against the box in light and about 1.3:1 in dark. In long rows, a tired eye cannot see the stitches, only the brand diamonds. | Darken the dot colour (ink 35% mix in light, 40% in dark). The picture is a main feature. |
| 8 | Should-fix | Content | Singular grammar: "Increase 1 stitch across 1 stitches" and "counted on the 1 stitches you have now". | Pluralise the stitch count in `summary()` and the "where" text. |
| 9 | Should-fix | SEO | The H1 "Knitting increase calculator: spread stitches evenly" does not hold the exact phrase of the research query, "increase evenly". It appears only in the first H2. The title also has "Space Stitches Evenly", not "increase evenly". | H1: "Knitting increase calculator: increase evenly across a row". Title (under 60): "Knitting Increase Evenly Calculator: Free Row Spacing" or similar. Keep one H1. |
| 10 | Should-fix | SEO, outline | The tool puts three generic H2s ("Pattern line", "Your row", "Where the changes go") before the article's H2s. The outline starts with labels that carry no keywords. | Make these `<p>` or `<h3>` styled the same. Keep the article H2s as the real outline. |
| 11 | Should-fix | SEO, depth | Article is about 900 words and good, but it has no worked formula, no explanation of M1L and M1R (only a line), no "increase 10 stitches evenly across 80" long-tail style example, and no crochet. Spam rivals repeat these phrases. | Add 3 short sections: "How the maths works" (stitches divided by changes, remainder), "M1L vs M1R vs yarn over", "Example: increase 10 across 80 stitches". Keep the 70% plain style. Raises the page near 1,200 article words. |
| 12 | Should-fix | SEO, structure | One page only. Queries "decrease evenly calculator", "how to decrease evenly across a row" and "knitting decrease calculator" are served by one URL. | After launch, add `/decrease-evenly-calculator/` (the same tool preset to decrease, own H1, text and FAQ) and link both ways. Same tool, separate intent pages. |
| 13 | Consider | SEO | `meta keywords` is ignored by Google. BreadcrumbList with one item adds nothing. | Remove both. Keep WebApplication and FAQPage (both parse). FAQ rich results are rarely shown now, but the FAQ text still helps People Also Ask. |
| 14 | Consider | SEO | OG image has no `og:image:width`, `og:image:height` or `og:image:alt`. The image itself is good (1200x630, tool preview, readable). | Add the three tags. |
| 15 | Consider | SEO | Internal links: the article links only to About and Contact. The home page has no related content to link to. | Fine for launch. Once pages from #12 exist, link them from the article and footer. |
| 16 | Consider | Phone, tap size | Footer and legal links under the tool are 17 px tall (and 20 px in the footer). WCAG 2.5.8 asks for 24 px at least. The phone has no main nav (only the footer lists About and Contact). | Add `py-2` to those links. |
| 17 | Consider | Visual | For very long rows (997 stitches) the dots box scrolls inside the page (max-height 15rem, overflow auto): a nested scroll area. Also the "gap every 10 stitches" does not align to the wrapped lines, so it reads as noise. | For rows above about 200 stitches, draw each group of 10 as an inline block, or cap the picture and say "Showing the first 200 stitches". Keep it as is for the common range. |
| 18 | Consider | Visual | Favicon (three white chevrons on magenta) reads as stitches and is crisp. Fine at 16 px. The logo in the header is the same glyph. Fine. | None. |
| 19 | Consider | Design | Rule: no em dashes found in page text. Checked all article and FAQ copy: plain, short, no AI tells or vendor names. | None. |
| 20 | Consider | Robots and sitemap | robots.txt allows all and lists the sitemap index. Sitemap lists 5 URLs, no 404. `_headers` sets noindex on pages.dev. All good. | None. |

## Checked and fine
- Title 51 characters; description 133 characters; one H1; canonical correct; JSON-LD parses (WebApplication, BreadcrumbList, FAQPage with 8 questions).
- Dark and light themes both look finished; no flash of wrong theme (inline script).
- Skip link, labels on all inputs, radio groups with legends, visible focus ring, `aria-live` on result, keyboard arrows on number fields, stepper buttons 44x52.
- Edge cases: blank fields, too many decreases, 1 stitch, 997 stitches, round with no common factor (97 and 13 gives a long but correct line; "Fewest steps" option exists).

## Must-fix count: 3 (findings 1, 2, 3)
