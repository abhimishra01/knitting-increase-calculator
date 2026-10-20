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

/** The "where the changes go" sentence. */
export function whereText(p) {
  const lim = 40;
  const list = p.after.slice(0, lim).join(', ') + (p.after.length > lim ? ', ...' : '');
  if (p.mode === 'dec') return `Work ${p.op} over these stitch pairs, counting from the first stitch you have now: starting at stitch ${list}.`;
  if (p.uses === 1) return `Work ${p.op} in these stitches, counted on the ${p.n} you have now: ${list}.`;
  return `${p.op} after stitch ${list} (counted on the ${p.n} you have now${p.after[0] === 0 ? '; 0 means before the first stitch' : ''}).`;
}
