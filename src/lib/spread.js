// Core logic: spread increases or decreases evenly across a row or round.
// Plain JavaScript with no imports, so the tests and the page share the same code.

export const MAX_STITCHES = 1000;

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

const plural = (n, word) => `${n} ${n === 1 ? word : word.endsWith('stitch') ? `${word}es` : `${word}s`}`;

// Increases that are worked into a stitch you already have (the stitch is used up and makes two).
// M1, M1L, M1R and YO add a stitch between stitches, so they use none.
const USES_ONE = new Set(['KFB', 'PFB', 'inc']);

/**
 * Knit runs for a flat row. `n` knit stitches, `k` changes. Returns k+1 runs:
 * the two end runs are about half a middle run. Runs add up to n.
 * Change i sits at the center of the i-th of k equal parts of the row.
 */
export function flatRuns(n, k) {
  if (k === 0) return [n];
  const pos = new Array(k);
  const half = Math.floor(k / 2);
  for (let i = 0; i < half; i++) {
    pos[i] = Math.floor(((2 * i + 1) * n + k) / (2 * k)); // round half up
    pos[k - 1 - i] = n - pos[i];                           // mirror, so the row is symmetric
  }
  if (k % 2 === 1) pos[half] = Math.floor(n / 2);
  const runs = [pos[0]];
  for (let i = 1; i < k; i++) runs.push(pos[i] - pos[i - 1]);
  runs.push(n - pos[k - 1]);
  return runs;
}

/** Knit runs for work in the round. Returns k runs that add up to n; each is followed by one change. */
export function roundRuns(n, k) {
  const runs = [];
  for (let i = 0; i < k; i++) runs.push(Math.floor(((i + 1) * n) / k) - Math.floor((i * n) / k));
  return runs;
}

/**
 * "Fewest steps": same run sizes, but like sizes sit together, so the line has two or three parts.
 * Flat rows keep the end runs and put the longer runs in the middle. Rounds put the shorter runs first.
 */
export function groupRuns(runs, flat) {
  const mid = flat && runs.length > 2 ? runs.slice(1, -1) : runs;
  const lo = Math.min(...mid);
  const small = mid.filter((r) => r === lo).length;
  const big = mid.length - small;
  const bigRun = lo + 1;
  const out = flat
    ? [...Array(Math.ceil(small / 2)).fill(lo), ...Array(big).fill(bigRun), ...Array(Math.floor(small / 2)).fill(lo)]
    : [...Array(small).fill(lo), ...Array(big).fill(bigRun)];
  return flat && runs.length > 2 ? [runs[0], ...out, runs[runs.length - 1]] : out;
}

// Group equal neighbours: [4,4,5] -> [{r:4,c:2},{r:5,c:1}]. Items may be numbers or {r, c} units.
function groups(list) {
  const out = [];
  for (const item of list) {
    const u = typeof item === 'number' ? { r: item, c: 1 } : item;
    const last = out[out.length - 1];
    if (last && last.r === u.r && last.c === u.c) last.n++; else out.push({ r: u.r, c: u.c, n: 1 });
  }
  return out;
}

// A repeated unit, written two ways. "star": *K5, M1; rep from * 7 more times. "paren": (K5, M1) 8 times.
function rep(unit, c, style) {
  if (c === 1) return unit;
  if (style === 'paren') return `(${unit}) ${c === 2 ? 'twice' : `${c} times`}`;
  return `*${unit}; rep from * ${c === 2 ? 'once more' : `${c - 1} more times`}`;
}

// One plain run followed by `c` changes: "K5, M1" or "K1, M1 twice". A zero run is just the changes.
function unitText(r, c, w, op) {
  const chg = c === 1 ? op : c === 2 ? `${op} twice` : `${op} ${c} times`;
  return r > 0 ? `${w}${r}, ${chg}` : chg;
}

// Turn runs into units. A zero-length run sits right after a change, so it adds to the change before it.
function toUnits(runs) {
  const units = [];
  runs.forEach((r, i) => {
    if (r === 0 && i > 0 && units.length) units[units.length - 1].c++;
    else units.push({ r, c: 1 });
  });
  return units;
}

function unitsText(units, w, op, style) {
  return groups(units).map(({ r, c, n }) => rep(unitText(r, c, w, op), n, style)).join(', ');
}

/**
 * Main entry. opts: { stitches, changes, mode: 'inc'|'dec', shape: 'flat'|'round', craft: 'knit'|'crochet',
 *   knit: 'K'|'P', inc: 'M1', dec: 'K2tog', spacing: 'even'|'simple', style: 'star'|'paren', edge: 0 }
 * `edge` is the number of plain stitches to keep at each end of a flat row.
 * Returns { ok:false, error } or { ok:true, ... }.
 */
export function plan(opts) {
  const { stitches: n, changes: k, mode = 'inc', shape = 'flat' } = opts;
  const crochet = opts.craft === 'crochet';
  const w = crochet ? 'sc ' : opts.knit === 'P' ? 'P' : 'K';
  const isDec = mode === 'dec';
  const op = isDec
    ? (opts.dec || (crochet ? 'sc2tog' : w === 'P' ? 'P2tog' : 'K2tog'))
    : (opts.inc || (crochet ? 'inc' : 'M1'));
  const verb = isDec ? 'decrease' : 'increase';
  // Stitches of the current row that each change uses up.
  const uses = isDec ? 2 : USES_ONE.has(op) ? 1 : 0;
  const flat = shape === 'flat';
  const edge = flat && Number.isInteger(opts.edge) && opts.edge > 0 ? opts.edge : 0;

  if (!Number.isInteger(n) || n < 1) return { ok: false, error: 'Enter how many stitches you have now.' };
  if (!Number.isInteger(k) || k < 0) return { ok: false, error: `Enter how many stitches to ${verb} (a whole number).` };
  if (n > MAX_STITCHES) return { ok: false, error: `This tool handles up to ${MAX_STITCHES} stitches.` };
  if (k === 0) return { ok: false, error: `Nothing to ${verb}. Enter 1 or more.` };
  if (isDec && 2 * k > n) {
    return { ok: false, error: `Too many decreases. Each ${op} uses 2 stitches, so ${plural(n, 'stitch')} allow${n === 1 ? 's' : ''} at most ${Math.floor(n / 2)}.` };
  }
  if (uses === 1 && k > n) {
    return { ok: false, error: `Too many increases. Each ${op} is worked into 1 stitch, so ${plural(n, 'stitch')} allow${n === 1 ? 's' : ''} at most ${n}.` };
  }
  if (!isDec && uses === 0 && k > 3 * n) return { ok: false, error: `That is more than triple the stitches. Try a smaller number.` };
  // Stitches that are worked plain between changes. Each change uses up some stitches itself.
  const m = n - uses * k - 2 * edge;
  if (m < 0 || (uses === 0 && n - 2 * edge < 1)) {
    return { ok: false, error: `Not enough stitches. ${plural(edge, 'edge stitch')} at each end leave too few for ${plural(k, 'change')}.` };
  }

  let runs = flat ? flatRuns(m, k) : roundRuns(m, k);
  // Exactly q increases per stitch: every stitch is followed by q new stitches.
  const perStitch = !isDec && uses === 0 && !edge && k >= n && k % n === 0 ? k / n : 0;
  const simple = opts.spacing === 'simple' && !perStitch;
  if (perStitch) runs = Array.from({ length: flat ? k + 1 : k }, (_, i) => (i % perStitch === 0 && i < k ? 1 : 0));
  if (simple) runs = groupRuns(runs, flat);
  // In the round, start the line on a plain stitch, so a run of zeros never opens it.
  if (!flat && !isDec && uses === 0 && runs[0] === 0 && runs.some((r) => r > 0)) {
    const at = runs.findIndex((r) => r > 0);
    runs = [...runs.slice(at), ...runs.slice(0, at)];
  }
  const total = isDec ? n - k : n + k;
  const spread = Math.max(...runs) - Math.min(...(flat && runs.length > 2 ? runs.slice(1, -1) : runs));
  if (edge) { runs[0] += edge; runs[runs.length - 1] += edge; }

  // Pattern text
  const style = opts.style === 'paren' ? 'paren' : 'star';
  let text;
  let repeats = 1;
  if (perStitch) {
    text = rep(unitText(1, perStitch, w, op), n, 'paren');
  } else if (flat) {
    const tail = runs[runs.length - 1];
    const units = toUnits(runs.slice(0, -1));
    const parts = [rep(unitText(units[0].r, units[0].c, w, op), 1, style)];
    const rest = unitsText(units.slice(1), w, op, style);
    if (rest) parts.push(rest);
    if (tail > 0) parts.push(`${w}${tail}`);
    text = parts.join(', ');
  } else {
    // The runs repeat g times around when stitches and changes share a factor.
    // Grouped runs ("shorter line") do not repeat, unless every run is the same size.
    const g = simple && new Set(runs).size > 1 ? 1 : gcd(m, k);
    const base = toUnits(runs.slice(0, k / g));
    repeats = g;
    if (base.length === 1) {
      const unit = unitText(base[0].r, base[0].c, w, op);
      if (g === 1) text = unit;
      else text = style === 'paren' ? rep(unit, g, 'paren') : `*${unit}; rep from * to end of round`;
    } else {
      const inner = unitsText(base, w, op, style);
      text = g === 1 ? inner : `Work this ${g} times around: ${inner}`;
    }
  }

  // Cells for the picture: 'k' plain stitch, 'i' new stitch, 'd' stitch pair joined by a decrease
  const cells = [];
  const pushRun = (r) => { for (let j = 0; j < r; j++) cells.push('k'); };
  const change = () => {
    if (isDec) cells.push('d');
    else { if (uses === 1) cells.push('k'); cells.push('i'); }
  };
  runs.forEach((r, idx) => { pushRun(r); if (!flat || idx < k) change(); });

  // For each change: the stitch number (in the stitches you have now) it sits after (0 uses),
  // or the stitch it is worked in (1 use), or the first stitch of its pair (decrease).
  const after = [];
  let used = 0;
  for (let i = 0; i < k; i++) {
    used += runs[i];
    after.push(uses === 0 ? used : used + 1);
    used += uses;
  }

  const notes = [];
  if (uses === 0 && !isDec && flat && (runs[0] === 0 || runs[runs.length - 1] === 0)) {
    notes.push('Some increases fall at the very edge of the row. Check your edge stitches.');
  }
  if (perStitch === 1) notes.push(`Every stitch gets an ${op}. Work one ${op} after each stitch.`);
  else if (perStitch) notes.push(`You add ${perStitch} times the stitches you have, so every stitch gets ${perStitch} ${op} in a row. "${op} twice" means two ${op} one after the other.`);
  else if (!isDec && uses === 0 && k > n) notes.push(`You add more stitches than you have, so some places get 2 or more ${op} in a row. "${op} twice" means two ${op} one after the other.`);
  if (!isDec && uses === 1 && k === n) notes.push(`Every stitch gets an ${op}.`);
  if (isDec && m < k) notes.push('Some decreases sit next to each other.');
  if (!flat) notes.push('Place a marker at the start of the round and work the pattern from there.');

  const plain = runs.reduce((a, b) => a + b, 0);
  return { ok: true, flat, plain, mode, op, w, verb, uses, n, k, total, runs, text, repeats, cells, after, notes, perfect: spread === 0 };
}

/** Plain-language summary line. */
export function summary(p) {
  return `${p.verb[0].toUpperCase()}${p.verb.slice(1)} ${plural(p.k, 'stitch')} across ${plural(p.n, 'stitch')}. You end with ${p.total}.`;
}

/** One line to check the count: "Check: 7 M1 and 50 K. You end with 57 stitches." */
export function check(p) {
  const word = p.w.trim();
  return `Check: ${p.k} ${p.op} and ${p.plain} ${word}. You end with ${plural(p.total, 'stitch')}.`;
}

/** One visible sentence on where the changes sit at the edges. */
export function edgeNote(p) {
  if (!p.flat) return 'In the round there are no edges. Every gap is a full gap, and the line repeats evenly all the way around.';
  const first = p.runs[0];
  const last = p.runs[p.runs.length - 1];
  if (first === 0 || last === 0) return 'Flat row: some changes sit at the very edge here, because there are so many of them.';
  return `Flat row: the first and last runs (${first} and ${last}) are about half a gap, so no ${p.mode === 'dec' ? 'decrease' : 'new stitch'} sits on the edge.`;
}

/** Short explanation of one stitch name, shown next to the result. Empty when we have none. */
export function explain(op) {
  return EXPLAIN[op] || '';
}

const EXPLAIN = {
  M1: 'M1 (make one): lift the strand between two stitches with the left needle, then knit it through the back loop.',
  M1L: 'M1L (leans left): lift the strand from front to back, then knit it through the back loop.',
  M1R: 'M1R (leans right): lift the strand from back to front, then knit it through the front loop.',
  YO: 'YO (yarn over): wrap the yarn over the right needle. It makes a new stitch and a small hole.',
  KFB: 'KFB (knit front and back): knit into the front of the stitch, then into the back, then slip it off. One stitch becomes two.',
  PFB: 'PFB (purl front and back): purl into the front of the stitch, then into the back, then slip it off. One stitch becomes two.',
  K2tog: 'K2tog: knit two stitches together. The decrease leans right.',
  P2tog: 'P2tog: purl two stitches together.',
  SSK: 'SSK: slip two stitches one at a time as if to knit, then knit them together through the back loops. The decrease leans left.',
  SSP: 'SSP: slip two stitches one at a time as if to knit, put them back on the left needle, then purl them together through the back loops.',
  SKP: 'SKP: slip one stitch, knit the next, then pass the slipped stitch over it. The decrease leans left.',
  'K2tog tbl': 'K2tog tbl: knit two stitches together through the back loops.',
  'P2tog tbl': 'P2tog tbl: purl two stitches together through the back loops.',
  inc: 'inc: work 2 sc in the next stitch.',
  sc2tog: 'sc2tog: pull up a loop in the next stitch and another in the one after, then yarn over and pull through all 3 loops.',
};
