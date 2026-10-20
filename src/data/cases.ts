// Landing pages for specific searches. Each has its own preset for the calculator and its own text.
// The pattern lines, totals and tables on these pages are computed at build time from src/lib/spread.js.
export interface Case {
  slug: string;
  title: string;          // <title> without the site name
  h1: string;
  description: string;
  link: string;           // link text on the home page
  preset: { n: number; k: number; mode: 'inc' | 'dec'; shape: 'flat' | 'round'; craft: 'knit' | 'crochet'; spacing?: 'simple' | 'even' };
  lead: string;
  sections: { h: string; p: string[] }[];
  faq: { q: string; a: string }[];
  related: string[];
}

export const cases: Case[] = [
  {
    slug: 'decrease-evenly',
    title: 'Decrease Evenly Across a Row Calculator',
    h1: 'Decrease evenly across a row',
    description: 'Enter your stitches and how many to remove. Get the K2tog pattern line for a flat row, with half a gap at each edge and a picture of the row.',
    link: 'Decrease evenly across a row',
    preset: { n: 84, k: 12, mode: 'dec', shape: 'flat', craft: 'knit' },
    lead: 'A pattern says "decrease 12 stitches evenly across the next row". The calculator below is set to that case: 84 stitches, 12 decreases, worked flat. Change the numbers and the line changes with them.',
    sections: [
      { h: 'Why decreases need different math', p: [
        'An increase can add a stitch between two stitches. A decrease cannot. Each K2tog eats two stitches and leaves one. So 12 decreases use 24 of your stitches, and only the other stitches are worked plain between them.',
        'The calculator takes those paired stitches out first. Then it spaces the plain stitches in equal runs. That is why a decrease line looks slightly different from an increase line for the same numbers.'] },
      { h: 'The limit: half your stitches', p: [
        'You cannot decrease more than half the stitches in one row. At that point every stitch is part of a pair and the line is just K2tog across. If you need more, split the decreases over two rows. The tool shows the limit under the number box as you type.'] },
      { h: 'Which decrease to use', p: [
        'K2tog leans right. SSK and SKP lean left. On a flat row, many knitters work K2tog on one side of the row and SSK on the other so the shaping looks even. This calculator spaces the changes. You choose the stitch under More options and the name in the line changes.'] },
    ],
    faq: [
      { q: 'How many stitches can I decrease in one row?', a: 'At most half of them. Each decrease uses two stitches, so 84 stitches allow 42 decreases.' },
      { q: 'Should the first decrease be at the very edge?', a: 'No. On a flat row the calculator leaves about half a gap at each end, so the edge stitches stay plain and the seam stays neat.' },
    ],
    related: ['hat-crown-decrease-calculator', 'decrease-8-stitches-evenly-across-96', 'crochet-decrease-evenly'],
  },
  {
    slug: 'crochet-increase-evenly',
    title: 'Crochet Increase Evenly Calculator',
    h1: 'Crochet increase evenly calculator',
    description: 'Space single crochet increases evenly in a round or a row. Enter your stitch count and the number of increases, then read the sc and inc pattern line.',
    link: 'Crochet increase evenly',
    preset: { n: 36, k: 6, mode: 'inc', shape: 'round', craft: 'crochet' },
    lead: 'Crochet increases are worked into a stitch you already have, so the math differs from knitting. The calculator below is set for a round of 36 stitches with 6 increases, the kind of round you see in amigurumi and hats.',
    sections: [
      { h: 'How an increase counts in crochet', p: [
        '"Inc" means two single crochet in the same stitch. The stitch you worked into is used, and it gives two. So each inc is one stitch of your count that ends up as two.',
        'This is why "sc 5, inc" repeated 6 times covers 36 stitches and not 30. The line already counts the inc stitch as one of your stitches. The check under the pattern line shows the plain stitches and the increases so you can confirm it.'] },
      { h: 'Flat or in the round', p: [
        'Most amigurumi and hat crowns are worked in the round. The tool then gives a short repeat to work all the way around, and you place a marker in the first stitch. For a flat piece such as a blanket border or a scarf, choose Flat rows. The first and last runs get half a gap, so no increase sits on the edge.'] },
      { h: 'Other stitches', p: [
        'For half double or double crochet, use the same line and swap the stitch name. The spacing does not change. Work two of that stitch in the next stitch for each inc.'] },
    ],
    faq: [
      { q: 'What does inc mean in crochet?', a: 'It means two stitches worked into the same stitch. In single crochet, that is 2 sc in the next stitch.' },
      { q: 'Do I count the inc as one stitch or two?', a: 'Count the stitch you work into as one stitch of your current count. After the round, each inc gives you two, so you end with your count plus the number of increases.' },
    ],
    related: ['crochet-decrease-evenly', 'increase-evenly-in-the-round', 'increase-12-stitches-evenly-across-60'],
  },
  {
    slug: 'crochet-decrease-evenly',
    title: 'Crochet Decrease Evenly Calculator',
    h1: 'Crochet decrease evenly calculator',
    description: 'Space sc2tog decreases evenly across a round or row. Enter the stitch count and how many to remove to get the pattern line and a picture of the row.',
    link: 'Crochet decrease evenly',
    preset: { n: 42, k: 6, mode: 'dec', shape: 'round', craft: 'crochet' },
    lead: 'Closing the top of a toy or shaping a hat needs decreases that sit evenly. The calculator below is set for 42 stitches and 6 decreases, worked in the round.',
    sections: [
      { h: 'sc2tog uses two stitches', p: [
        'A single crochet decrease (sc2tog) joins two stitches into one. So 6 decreases use 12 of your 42 stitches, and 30 stitches are worked as plain single crochet. The line below places the 6 decreases at equal distances.',
        'In amigurumi this is called an invisible decrease when you work it through the front loops only. The spacing stays the same. Only the way you work each sc2tog changes.'] },
      { h: 'Closing a shape', p: [
        'To close a ball or the top of a hat, you decrease round after round until few stitches are left. Run the calculator once for each round, using the stitch count you have at the start of that round. The totals shown under the line tell you the count for the next round.'] },
      { h: 'Check the count', p: [
        'After the round, count your stitches. If you have the number shown in the result, the round is right. If you are off by one, look for a decrease that landed in the wrong place, not a missed stitch.'] },
    ],
    faq: [
      { q: 'Where do crochet decreases go in a round?', a: 'Spread them at equal distances. For 42 stitches and 6 decreases, you work the same short run of sc between each sc2tog.' },
      { q: 'How many decreases can I work in one round?', a: 'At most half of the stitches, because each sc2tog uses two. Most patterns use far fewer, so the shape closes gradually.' },
    ],
    related: ['crochet-increase-evenly', 'hat-crown-decrease-calculator', 'decrease-evenly'],
  },
  {
    slug: 'increase-evenly-in-the-round',
    title: 'Increase Evenly in the Round Calculator',
    h1: 'Increase evenly in the round',
    description: 'Knit increases spaced evenly around a round. Enter the stitches on the needle and how many to add, then read the repeat to work around.',
    link: 'Increase evenly in the round',
    preset: { n: 80, k: 12, mode: 'inc', shape: 'round', craft: 'knit' },
    lead: 'Working in the round, a pattern may say "increase 12 stitches evenly around". The calculator below is set to 80 stitches and 12 increases in the round.',
    sections: [
      { h: 'No edges to plan around', p: [
        'In the round, the row has no ends, so every gap between increases is a full gap. 80 stitches with 12 increases do not divide exactly (80 &divide; 12 is 6 with 8 left over), so some gaps are 7 stitches and some are 6. The calculator spreads the longer gaps around so they do not bunch together.',
        'When the numbers do divide, such as 60 and 12, you get one short repeat: knit 5, make one, around.'] },
      { h: 'Use a marker', p: [
        'Place a marker at the start of the round. Work the line from the marker, one part after the other. When you reach the end of the line, you are back at the marker.'] },
      { h: 'Shorter line or most even', p: [
        'The default shows the shorter line, with like gaps grouped. Switch to Most even to see the gaps in the order they sit around the round. The fabric looks the same. The difference is at most one stitch per gap.'] },
    ],
    faq: [
      { q: 'What if my stitches do not divide evenly by the increases?', a: 'The gaps then come in two sizes that differ by one stitch. The calculator spreads the longer gaps evenly around the round.' },
      { q: 'Where do I start the pattern line?', a: 'At the start of the round, where your marker sits. The line ends right before the marker.' },
    ],
    related: ['increase-12-stitches-evenly-across-60', 'crochet-increase-evenly', 'hat-crown-decrease-calculator'],
  },
  {
    slug: 'hat-crown-decrease-calculator',
    title: 'Hat Crown Decrease Calculator',
    h1: 'Hat crown decrease calculator',
    description: 'Plan an even decrease round for a knit hat crown. Enter the stitches and how many to remove, then work the K2tog line around the round.',
    link: 'Hat crown decreases',
    preset: { n: 108, k: 12, mode: 'dec', shape: 'round', craft: 'knit' },
    lead: 'A hat crown closes in stages. This calculator plans one stage. It is set for 108 stitches and 12 decreases, which leaves 96 stitches for the next round.',
    sections: [
      { h: 'Decrease in stages', p: [
        'A flat top needs decreases in the same places each time. A smooth, rounded top needs the decreases to move over a little each round. Use the calculator for the first round, then plan the next one with the new stitch count.',
        'Many hats use 6, 8 or 12 decreases per decrease round. These numbers divide most hat sizes, which makes the crown look like a star or a spiral, depending on whether the decreases line up.'] },
      { h: 'Moving to double-pointed needles', p: [
        'As the crown shrinks, the circle becomes too small for a circular needle. Switch to double-pointed needles or a longer cord with a magic loop when the stitches no longer reach around. Keep your marker at the start of the round.'] },
      { h: 'Stitch count after each round', p: [
        'Each round removes the number you entered. From 108, with 12 decreases, the next round has 96. Then 84, and so on. The total under the pattern line shows the new count.'] },
    ],
    faq: [
      { q: 'How many decreases should a hat crown have?', a: 'Many patterns use 6, 8 or 12 per decrease round. More decreases give a flatter top and fewer give a taller one.' },
      { q: 'Should the decreases line up from round to round?', a: 'If they line up, the lines show as spokes, like a star. If you shift them by a stitch each round, the top looks smoother.' },
    ],
    related: ['decrease-8-stitches-evenly-across-96', 'decrease-evenly', 'crochet-decrease-evenly'],
  },
  {
    slug: 'increase-8-stitches-evenly-across-50',
    title: 'Increase 8 Stitches Evenly Across 50',
    h1: 'How to increase 8 stitches evenly across 50 stitches',
    description: 'Increase 8 stitches evenly across 50 stitches. Get the exact pattern line for a flat row or in the round, with a check count and a picture of the row.',
    link: 'Increase 8 across 50',
    preset: { n: 50, k: 8, mode: 'inc', shape: 'flat', craft: 'knit' },
    lead: '50 stitches do not divide by 8. That is why a quick guess often leaves the new stitches bunched on one side. The line below spaces them with the leftover split at the ends.',
    sections: [
      { h: 'The math', p: [
        '50 &divide; 8 is 6 with 2 left over. So most gaps are 6 stitches, and two of them are 7. On a flat row, the first and last runs are about half a gap, so the new stitches sit away from the edges.',
        'You end with 58 stitches. The check line under the result confirms 8 increases and 50 plain stitches.'] },
      { h: 'When this comes up', p: [
        'This case is common in a sleeve or a body, where a pattern says to increase to the next size or to the stitch count for a ribbing change. If your pattern gives the final count (58) and not the number to add, use I know: Final stitch count.'] },
    ],
    faq: [
      { q: 'How many stitches will I have after I increase 8 across 50?', a: 'You will have 58 stitches.' },
      { q: 'Can I use KFB instead of M1?', a: 'Yes. Open More options and choose KFB. The line then works the increases into stitches you already have, and the plain run lengths adjust to match.' },
    ],
    related: ['increase-10-stitches-evenly-across-60', 'increase-12-stitches-evenly-across-60', 'increase-20-stitches-evenly-across-100'],
  },
  {
    slug: 'increase-10-stitches-evenly-across-60',
    title: 'Increase 10 Stitches Evenly Across 60',
    h1: 'How to increase 10 stitches evenly across 60 stitches',
    description: 'Increase 10 stitches evenly across 60 stitches in knitting. See the line for a flat row and for the round, and the count you end with.',
    link: 'Increase 10 across 60',
    preset: { n: 60, k: 10, mode: 'inc', shape: 'flat', craft: 'knit' },
    lead: '60 stitches with 10 increases is a clean case: 60 &divide; 10 is exactly 6. Every gap can be the same size.',
    sections: [
      { h: 'Flat and round give different lines', p: [
        'In the round, the gaps are all 6 stitches, so the line is one short repeat. On a flat row, the first and last runs are about half a gap, so the increases sit inside the fabric and the edges stay straight.',
        'Use the buttons above to switch between the two and watch the line change. The final count is 70 stitches in both cases.'] },
      { h: 'Where to place the stitches', p: [
        'M1 goes between two stitches. Lift the strand between the stitches and knit it through the back loop. This makes a small twist that closes the hole. If you want a hole, such as in lace, use a yarn over.'] },
    ],
    faq: [
      { q: 'How many stitches do I have after I increase 10 across 60?', a: 'You have 70 stitches.' },
      { q: 'Why are the first and last runs shorter on a flat row?', a: 'They are half a gap. That puts the increases in the middle of each part of the row and keeps new stitches off the edges.' },
    ],
    related: ['increase-8-stitches-evenly-across-50', 'increase-12-stitches-evenly-across-60', 'increase-20-stitches-evenly-across-100'],
  },
  {
    slug: 'increase-12-stitches-evenly-across-60',
    title: 'Increase 12 Stitches Evenly Across 60',
    h1: 'How to increase 12 stitches evenly across 60 stitches',
    description: 'Increase 12 stitches evenly across 60 stitches. The gap is 5 stitches. Get the flat and round pattern lines and the stitch count you end with.',
    link: 'Increase 12 across 60',
    preset: { n: 60, k: 12, mode: 'inc', shape: 'round', craft: 'knit' },
    lead: '60 &divide; 12 is exactly 5, so this case has one repeat: knit 5, make one. The calculator is set for the round, where that repeat goes all the way around.',
    sections: [
      { h: 'A common case in the round', p: [
        'This is a typical yoke or sleeve cap increase. You work "knit 5, make one" 12 times around and finish with 72 stitches. Place a marker at the start of the round to keep your place.',
        'If you work flat, switch to Flat rows. The line then starts and ends with a shorter run, so the increases do not fall at the edges.'] },
      { h: 'Quick check', p: [
        'Count 5 stitches between each pair of new stitches after you finish the round. They should all match. If one gap looks different, one increase moved, and it is easier to fix now than after a few more rows.'] },
    ],
    faq: [
      { q: 'How many stitches do I end with?', a: '72 stitches.' },
      { q: 'What if I want fewer increases per round?', a: 'Change the second number. For 6 increases across 60 stitches, the gap grows to 10.' },
    ],
    related: ['increase-evenly-in-the-round', 'increase-10-stitches-evenly-across-60', 'crochet-increase-evenly'],
  },
  {
    slug: 'increase-20-stitches-evenly-across-100',
    title: 'Increase 20 Stitches Evenly Across 100',
    h1: 'How to increase 20 stitches evenly across 100 stitches',
    description: 'Increase 20 stitches evenly across 100 stitches. See the pattern line for a flat row or the round, and tips for long rows.',
    link: 'Increase 20 across 100',
    preset: { n: 100, k: 20, mode: 'inc', shape: 'flat', craft: 'knit' },
    lead: '100 stitches with 20 increases is one increase for every 5 stitches. It is a long row, so a good line and a few markers help.',
    sections: [
      { h: 'Use markers on a long row', p: [
        'It is easy to lose count in a row of 100 stitches. Slip a marker after every fourth repeat on the first row. After 5 markers you have done 20 increases. Take the markers out on the next row.',
        'You end with 120 stitches, a 20 percent increase. That is a large change, so check the fabric. A big jump can pull the stitches. If you can, spread the increases over two rows.'] },
      { h: 'Two rows instead of one', p: [
        'If your pattern allows it, do 10 increases in each of two rows. Run the calculator twice: 100 stitches with 10, then 110 with 10. The fabric lies flatter than with 20 at once.'] },
    ],
    faq: [
      { q: 'How many stitches will I have after I increase 20 across 100?', a: 'You will have 120 stitches.' },
      { q: 'Is it better to increase all at once or over two rows?', a: 'Two rows give a smoother fabric. Do it in one row only if your pattern says to.' },
    ],
    related: ['increase-10-stitches-evenly-across-60', 'increase-8-stitches-evenly-across-50', 'increase-12-stitches-evenly-across-60'],
  },
  {
    slug: 'decrease-8-stitches-evenly-across-96',
    title: 'Decrease 8 Stitches Evenly Across 96',
    h1: 'How to decrease 8 stitches evenly across 96 stitches',
    description: 'Decrease 8 stitches evenly across 96 stitches in the round. Get the K2tog pattern line, the count you end with and a picture of the round.',
    link: 'Decrease 8 across 96',
    preset: { n: 96, k: 8, mode: 'dec', shape: 'round', craft: 'knit' },
    lead: '96 stitches with 8 decreases: each K2tog uses 2 stitches, so 16 stitches go into decreases and 80 are worked plain. 80 &divide; 8 is exactly 10.',
    sections: [
      { h: 'The pattern', p: [
        'Because the plain stitches divide exactly, the round has one short repeat: knit 10, K2tog. Work it 8 times and you finish with 88 stitches. Place a marker at the start of the round.',
        'This is a typical case for the body of a sweater or a hat before the crown. Switch the stitch to SSK under More options if you want a left-leaning decrease.'] },
      { h: 'Flat rows', p: [
        'If you work this in rows, choose Flat rows. The calculator then adds a half gap at each end, so the decreases stay away from the edges.'] },
    ],
    faq: [
      { q: 'How many stitches do I have after I decrease 8 across 96?', a: 'You have 88 stitches.' },
      { q: 'Why does the line say K10, not K12?', a: 'Each K2tog uses two stitches. So between decreases you work 10 plain stitches, and the 2 stitches in the K2tog make a gap of 12 stitches from the old row.' },
    ],
    related: ['hat-crown-decrease-calculator', 'decrease-evenly', 'crochet-decrease-evenly'],
  },
];
