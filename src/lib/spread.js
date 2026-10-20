// Core logic: spread increases or decreases evenly across a row or round.
// Plain JavaScript with no imports, so the tests and the page share the same code.

export const MAX_STITCHES = 1000;

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

/**
 * Knit runs for a flat row. `n` knit stitches, `k` changes. Returns k+1 runs:
 * the two end runs are about half a middle run. Runs add up to n.
 * Change i sits at the centre of the i-th of k equal parts of the row.
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

// Group equal neighbours: [4,4,5] -> [{r:4,c:2},{r:5,c:1}]
function groups(list) {
  const out = [];
  for (const r of list) {
    const last = out[out.length - 1];
    if (last && last.r === r) last.c++; else out.push({ r, c: 1 });
  }
  return out;
}

// A repeated unit, written two ways. "star": *K5, M1; rep from * 7 more times. "paren": (K5, M1) 8 times.
function rep(unit, c, style) {
  if (c === 1) return unit;
  if (style === 'paren') return `(${unit}) ${c === 2 ? 'twice' : `${c} times`}`;
  return `*${unit}; rep from * ${c === 2 ? 'once more' : `${c - 1} more times`}`;
}

function unitsText(list, w, op, style) {
  const unit = (r) => (r > 0 ? `${w}${r}, ${op}` : op);
  return groups(list).map(({ r, c }) => rep(unit(r), c, style)).join(', ');
}

/**
 * Main entry. opts: { stitches, changes, mode: 'inc'|'dec', shape: 'flat'|'round',
 *   knit: 'K'|'P', inc: 'M1', dec: 'K2tog' }
 * Returns { ok:false, error } or { ok:true, ... }.
 */
export function plan(opts) {
  const { stitches: n, changes: k, mode = 'inc', shape = 'flat' } = opts;
  const w = opts.knit === 'P' ? 'P' : 'K';
  const isDec = mode === 'dec';
  const op = isDec ? (opts.dec || (w === 'P' ? 'P2tog' : 'K2tog')) : (opts.inc || 'M1');
  const verb = isDec ? 'decrease' : 'increase';

  if (!Number.isInteger(n) || n < 1) return { ok: false, error: 'Enter how many stitches you have now.' };
  if (!Number.isInteger(k) || k < 0) return { ok: false, error: `Enter how many stitches to ${verb} (a whole number).` };
  if (n > MAX_STITCHES) return { ok: false, error: `This tool handles up to ${MAX_STITCHES} stitches.` };
  if (k === 0) return { ok: false, error: `Nothing to ${verb}. Enter 1 or more.` };
  if (isDec && 2 * k > n) {
    return { ok: false, error: `Too many decreases. Each ${op} uses 2 stitches, so ${n} stitches allow at most ${Math.floor(n / 2)}.` };
  }
  if (!isDec && k > 3 * n) return { ok: false, error: `That is more than triple the stitches. Try a smaller number.` };

  // Stitches that are worked plain between changes. A decrease uses 2 stitches itself.
  const m = isDec ? n - 2 * k : n;
  const flat = shape === 'flat';
  let runs = flat ? flatRuns(m, k) : roundRuns(m, k);
  const simple = opts.spacing === 'simple';
  if (simple) runs = groupRuns(runs, flat);
  const total = isDec ? n - k : n + k;

  // Pattern text
  const style = opts.style === 'paren' ? 'paren' : 'star';
  const unit = (r) => (r > 0 ? `${w}${r}, ${op}` : op);
  let text;
  let repeats = 1;
  if (flat) {
    const first = runs[0];
    const last = runs[runs.length - 1];
    const parts = [];
    if (first > 0) parts.push(`${w}${first}`);
    parts.push(op);
    for (const { r, c } of groups(runs.slice(1, -1))) parts.push(rep(unit(r), c, style));
    if (last > 0) parts.push(`${w}${last}`);
    text = parts.join(', ');
  } else {
    // The runs repeat g times around when stitches and changes share a factor.
    const g = simple ? 1 : gcd(m, k);
    const base = runs.slice(0, k / g);
    repeats = g;
    const inner = unitsText(base, w, op, style);
    if (base.length === 1) {
      text = style === 'paren' ? `(${unit(base[0])}) ${g} times` : `*${unit(base[0])}; rep from * to end of round`;
    } else {
      text = g === 1 ? inner : `Work this ${g} times around: ${inner}`;
    }
  }

  // Cells for the picture: 'k' knit stitch, 'i' new stitch, 'd' stitch pair joined by a decrease
  const cells = [];
  const pushRun = (r) => { for (let j = 0; j < r; j++) cells.push('k'); };
  if (flat) {
    runs.forEach((r, idx) => { pushRun(r); if (idx < k) cells.push(isDec ? 'd' : 'i'); });
  } else {
    runs.forEach((r) => { pushRun(r); cells.push(isDec ? 'd' : 'i'); });
  }

  // "After stitch number" (in the stitches you have now) for each change
  const after = [];
  let used = 0;
  for (let i = 0; i < k; i++) {
    used += runs[i];
    if (isDec) after.push(used + 1); // first stitch of each pair, counted from the start
    else after.push(used);
    if (isDec) used += 2;
  }

  const notes = [];
  if (!isDec && flat && (runs[0] === 0 || runs[runs.length - 1] === 0)) {
    notes.push('Some increases fall at the very edge of the row. Check your edge stitches.');
  }
  if (!isDec && k > n) notes.push('You add more stitches than you have. Some places get two or more increases in a row.');
  if (isDec && m < k) notes.push('Some decreases sit next to each other.');
  if (!flat) notes.push('Place a marker at the start of the round and work the pattern from there.');

  const spread = Math.max(...runs) - Math.min(...(flat && runs.length > 2 ? runs.slice(1, -1) : runs));
  return {
    ok: true, mode, shape, op, w, verb, n, k, total, runs, text, repeats, cells, after, notes,
    perfect: spread === 0,
  };
}

/** Plain-language summary line. */
export function summary(p) {
  const ch = p.k === 1 ? '1 stitch' : `${p.k} stitches`;
  return `${p.verb[0].toUpperCase()}${p.verb.slice(1)} ${ch} across ${p.n} stitches. You end with ${p.total}.`;
}
