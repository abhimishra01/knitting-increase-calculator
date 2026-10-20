# Mock-customer test: knitting increase calculator

Tested on the live build (served from a private folder, port 4457) with playwright-cli. Phones at 390x844 and 412x915, desktop at 1280 and 1440. Each persona typed real values and read the real output.

## Personas

### 1. Maria, 34, beginner, iPhone (390 px)
Task: first hat, pattern says "increase 8 stitches evenly in the round, 64 stitches". She picked In the round, typed 64 and 8, and got `*K8, M1; rep from * to end of round.` with a marker note. Done in about 20 seconds. The answer sat right under the inputs, mostly above the fold.
- Click on Google over others? "Yes, the title says exactly what I searched. It is free with no sign-up."
- Confused? "What is M1? The line says it, but I had to scroll down to the long text to learn how. A small link next to the line would help." She did not notice the style options at all.
- Bookmark? "A short 'how to do M1' next to the result. The Copy button scrolls off the screen when I look at the dots."
- Trust? Yes, the dots row let her count 8 gaps. Return? Yes, for the next pattern.

### 2. Dorothy, 68, intermediate, desktop 1280, sweater
Task: 112 stitches, add 14, flat. Got `K4, M1, *K8, M1; rep from * 12 more times, K4.` Checked by hand: 4 + 13 x 8 + 4 = 112. Correct. She then tried 20 more stitches and got a very long line (four repeated blocks, 300 characters). She found "Fewest steps" only because she read the page. With it on, the line became `K3, M1, (K5, M1) 4 times, (K6, M1) 11 times, (K5, M1) 4 times, K3.`
- Click on Google? "Yes."
- Under 30 seconds? Yes for the first case. No for the second, because the default line is hard to follow while knitting.
- Confused? "Why is the long one the default? I want the short one. I also typed '112 sts' by habit and it just kept the digits, which is fine."
- Bookmark? Set the short line as default, or remember my choice. Trust: yes, she checks the sum. Return: yes.

### 3. Jess, 27, crocheter, Android (412 px), amigurumi
Task: 45 stitches, add 9, in the round. Got `*K5, M1; rep from * to end of round.` Numbers are right, but the words are wrong for her: she works single crochet and writes "sc", "inc", "dec".
- Click on Google? "Only maybe. The page never says crochet anywhere. I would scroll past it for 'magic ring increase calculator'."
- Confused? "K and M1 mean nothing to me. I would have to translate by hand: K5 = 5 sc, M1 = inc."
- Bookmark? "A Crochet option (sc, inc, dec) and a line like 'sc 5, inc'. Then yes, I would."
- Trust: the math, yes. The words, no. Return: only if crochet is added.

### 4. Pat, 55, expert, desktop 1440, socks and sweaters
Task: decrease 12 from 96 in the round, SSK. Opened the options, chose SSK: `*K6, SSK; rep from * to end of round.` Correct. Then tried edges: 48 of 96 gives `*SSK`, 49 gives a clear error, 1 stitch minus 1 gives "1 stitches allow at most 0" (wrong grammar), 3000 stitches shows the hint "Most you can decrease: 1500" next to a 1000-stitch error.
- Under 30 seconds? Yes.
- Confused? "I chose Purl and kept SSK. On a purl row I want SSP or P2tog. Also I want KFB and lifted increase, not only M1."
- Bookmark? "More stitch names (KFB, SSP, p2tog tbl, yo). A way to leave out edge stitches. Rows for sleeve shaping: 'increase every 6th row'."
- Trust: yes, he checked three cases by hand. Return: yes, it is quicker than his spreadsheet.

### 5. Tom, 41, knits hats for his kids, desktop 1280
Task: crown of a hat, decrease 8 from 88, flat then in the round. Worked first try. Then his pattern said "keep 2 edge stitches". He took 4 off the count by hand, got the line, and had to add K2 at each end himself.
- Click on Google? Yes. Under 30 seconds? Yes.
- Confused? "Does the number I type include the edge stitches? The page tells me in the FAQ, not near the box."
- Bookmark? "An 'edge stitches' box, so I do not do sums on my sums." Tip: he liked that the address updates, so he can bookmark his numbers. He also liked the dots picture.
- Trust: yes. Return: yes.

## Ranked change list

Count = how many of the 5 personas asked for it.

### Must
1. Add crochet: a Craft choice (Knit or Crochet) with sc, inc, dec words, and say "crochet" on the page, in the title and in the intro. (1 asked outright; it is also the only reason Jess would find the page. Spec names crocheters as users.)
2. Show the short line by default, or put "Shorter line / Longer line" next to the result instead of inside a closed options panel. Today the default can be 300 characters long. (3 of 5 hit it or wanted it: Dorothy, Pat, Tom)
3. Add a one-line explanation of the stitch next to the result ("M1 = make one: lift the bar between stitches and knit it"). (2: Maria, Jess)

### Should
4. An "Edge stitches to keep plain" box, so the line gets K2 at each end. (2: Tom, Pat)
5. More stitch names: KFB, lifted increase, SSP and P2tog tbl when the row stitch is Purl. SSK on a purl row is wrong; today it stays SSK. (2: Pat, Jess)
6. Keep Copy visible on phones (a sticky bar or a second Copy under the dots). (2: Maria, Jess)
7. Fix error text: "1 stitches allow at most 0" and the stale hint "Most you can decrease: 1500" next to a 1000 limit. (1: Pat)

### Nice
8. "Increase every Nth row" mode for sleeves and tapers, since many searchers want it. (2: Pat, Dorothy)
9. Bigger step on the plus and minus buttons by holding them. (1)
10. A print or "save as image" option for the pattern line. (1)

## Checks that passed
Math was right in all 12 cases checked by hand, edge cases give clear errors, Copy works, numbers keep digits only, the page address keeps the setup, no horizontal scroll at 390 px.
