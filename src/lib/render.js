// Page helpers that build the result markup. Shared by the build step and the browser, so both draw the same thing.

export function esc(s) {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
}

const isWordChar = (ch) => ch !== undefined && /[A-Za-z0-9]/.test(ch);

/** Escape the pattern line and wrap each whole-word copy of `op` in <b>. No regex lookbehind, so old Safari works. */
export function lineHtml(text, op) {
  let out = '';
  let i = 0;
  while (i < text.length) {
    const at = op ? text.indexOf(op, i) : -1;
    if (at === -1) { out += esc(text.slice(i)); break; }
    const end = at + op.length;
    if (isWordChar(text[at - 1]) || isWordChar(text[end])) {
      out += esc(text.slice(i, end));
    } else {
      out += `${esc(text.slice(i, at))}<b>${esc(op)}</b>`;
    }
    i = end;
  }
  return out;
}

/** One dot per stitch. A gap after every 10 plain stitches (a decrease pair counts as 2). */
export function dotsHtml(cells) {
  let html = '';
  let count = 0;
  let decade = 0;
  for (const c of cells) {
    const gap = Math.floor(count / 10) > decade;
    if (gap) decade = Math.floor(count / 10);
    if (c === 'k') { html += `<i class="dot${gap ? ' gap' : ''}"></i>`; count++; }
    else if (c === 'i') html += '<i class="dot new"></i>';
    else { html += `<i class="dot new pill${gap ? ' gap' : ''}"></i>`; count += 2; }
  }
  return html;
}

// Join repeats: [1, 1, 2] -> "1 (twice), 2". Several changes can fall at one place when there are many.
function places(list) {
  const out = [];
  for (let i = 0; i < list.length; i++) {
    let j = i;
    while (j + 1 < list.length && list[j + 1] === list[i]) j++;
    const c = j - i + 1;
    out.push(c === 1 ? `${list[i]}` : `${list[i]} (${c === 2 ? 'twice' : `${c} times`})`);
    i = j;
  }
  return out;
}

/** The "where the changes go" sentence. */
export function whereText(p) {
  const lim = 40;
  const all = places(p.after);
  const list = all.slice(0, lim).join(', ') + (all.length > lim ? ', ...' : '');
  if (p.mode === 'dec') return `Work ${p.op} over these stitch pairs, counting from the first stitch you have now: starting at stitch ${list}.`;
  if (p.uses === 1) return `Work ${p.op} in these stitches, counted on the ${p.n} you have now: ${list}.`;
  return `${p.op} after stitch ${list} (counted on the ${p.n} you have now${p.after[0] === 0 ? '; 0 means before the first stitch' : ''}).`;
}

/**
 * The row as a map: each run of plain stitches is a block with its count, each change is a diamond.
 * Repeats are folded ("x6"), so a long row stays short.
 */
export function mapHtml(p) {
  const chip = (r, c) => {
    const k = r > 0 ? `<span class="mb k">${esc(p.w.trim())}${r}</span>` : '';
    const ch = `<span class="mb c">${esc(p.op)}${c > 1 ? ` &times;${c}` : ''}</span>`;
    return k + ch;
  };
  // Units: a plain run followed by one or more changes (a zero run joins the change before it).
  const units = [];
  const runs = p.flat ? p.runs.slice(0, -1) : p.runs;
  runs.forEach((r, i) => {
    if (r === 0 && i > 0 && units.length) units[units.length - 1].c++;
    else units.push({ r, c: 1 });
  });
  const tail = p.flat ? p.runs[p.runs.length - 1] : 0;
  const parts = [];
  for (let i = 0; i < units.length; ) {
    let j = i;
    while (j + 1 < units.length && units[j + 1].r === units[i].r && units[j + 1].c === units[i].c) j++;
    const n = j - i + 1;
    parts.push(n > 1 ? `<span class="mg">${chip(units[i].r, units[i].c)}<span class="mx">&times;${n}</span></span>` : chip(units[i].r, units[i].c));
    i = j + 1;
  }
  if (tail > 0) parts.push(`<span class="mb k">${esc(p.w.trim())}${tail}</span>`);
  return parts.join('') + (p.flat ? '' : '<span class="mx end">then repeat around</span>');
}
