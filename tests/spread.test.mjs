import assert from 'node:assert/strict';
import { test } from 'node:test';
import { plan, flatRuns, roundRuns, summary, explain, check, edgeNote } from '../src/lib/spread.js';
import { lineHtml, dotsHtml, whereText, mapHtml } from '../src/lib/render.js';

const sum = (a) => a.reduce((x, y) => x + y, 0);

test('flat: 50 stitches, 7 increases', () => {
  const p = plan({ stitches: 50, changes: 7 });
  assert.deepEqual(p.runs, [4, 7, 7, 7, 7, 7, 7, 4]);
  assert.equal(p.total, 57);
  assert.equal(p.text, 'K4, M1, *K7, M1; rep from * 5 more times, K4');
  assert.deepEqual(p.after, [4, 11, 18, 25, 32, 39, 46]);
});

test('flat: remainder is split at both ends', () => {
  const r = flatRuns(52, 7);
  assert.equal(sum(r), 52);
  assert.ok(Math.abs(r[0] - r[r.length - 1]) <= 1);
});

test('round: even split gives one simple repeat', () => {
  const p = plan({ stitches: 60, changes: 12, shape: 'round' });
  assert.equal(p.text, '*K5, M1; rep from * to end of round');
  assert.equal(p.total, 72);
  assert.ok(p.perfect);
});

test('round: uneven split uses runs of two sizes, repeated', () => {
  const p = plan({ stitches: 50, changes: 12, shape: 'round' });
  assert.equal(sum(p.runs), 50);
  assert.equal(p.runs.length, 12);
  assert.ok(Math.max(...p.runs) - Math.min(...p.runs) === 1);
  assert.equal(p.text, 'Work this 2 times around: *K4, M1; rep from * 4 more times, K5, M1');
});

test('decrease: each K2tog uses two stitches', () => {
  const p = plan({ stitches: 100, changes: 10, mode: 'dec' });
  assert.equal(p.total, 90);
  assert.equal(sum(p.runs) + 2 * 10, 100);
  assert.equal(p.text, 'K4, K2tog, *K8, K2tog; rep from * 8 more times, K4');
  assert.equal(p.cells.filter((c) => c === 'd').length, 10);
});

test('decrease: purl row uses P and P2tog', () => {
  const p = plan({ stitches: 20, changes: 2, mode: 'dec', knit: 'P' });
  assert.match(p.text, /^P\d+, P2tog/);
});

test('decrease: max is half the stitches, more is an error', () => {
  assert.equal(plan({ stitches: 10, changes: 5, mode: 'dec', shape: 'round' }).ok, true);
  assert.equal(plan({ stitches: 10, changes: 5, mode: 'dec', shape: 'round' }).text, '*K2tog; rep from * to end of round');
  const bad = plan({ stitches: 10, changes: 6, mode: 'dec' });
  assert.equal(bad.ok, false);
  assert.match(bad.error, /at most 5/);
});

test('input errors', () => {
  assert.equal(plan({ stitches: NaN, changes: 4 }).ok, false);
  assert.equal(plan({ stitches: 40, changes: 0 }).ok, false);
  assert.equal(plan({ stitches: 40, changes: -2 }).ok, false);
  assert.equal(plan({ stitches: 40.5, changes: 2 }).ok, false);
  assert.equal(plan({ stitches: 5000, changes: 2 }).ok, false);
});

test('single change goes in the middle', () => {
  assert.deepEqual(plan({ stitches: 20, changes: 1 }).runs, [10, 10]);
  assert.deepEqual(plan({ stitches: 21, changes: 1 }).runs, [10, 11]);
});

test('paren style', () => {
  const p = plan({ stitches: 50, changes: 7, style: 'paren' });
  assert.equal(p.text, 'K4, M1, (K7, M1) 6 times, K4');
});

test('property: every case adds up and stays balanced', () => {
  for (let n = 1; n <= 80; n++) {
    for (let k = 1; k <= n; k++) {
      for (const shape of ['flat', 'round']) {
        const inc = plan({ stitches: n, changes: k, shape });
        assert.ok(inc.ok, `${n} ${k} ${shape}`);
        assert.equal(sum(inc.runs), n);
        assert.equal(inc.total, n + k);
        assert.equal(inc.cells.length, n + k);
        const mid = shape === 'flat' && inc.runs.length > 2 ? inc.runs.slice(1, -1) : inc.runs;
        assert.ok(Math.max(...mid) - Math.min(...mid) <= 1, `balance ${n} ${k} ${shape} ${inc.runs}`);
        if (shape === 'flat') {
          assert.equal(inc.runs.length, k + 1);
          if (k < n) assert.ok(inc.runs.every((r) => r >= 1), `no zero runs ${n} ${k} ${inc.runs}`);
        } else assert.equal(inc.runs.length, k);
      }
    }
    for (let k = 1; 2 * k <= n; k++) {
      for (const shape of ['flat', 'round']) {
        const d = plan({ stitches: n, changes: k, mode: 'dec', shape });
        assert.ok(d.ok);
        assert.equal(sum(d.runs) + 2 * k, n);
        assert.equal(d.total, n - k);
        assert.equal(d.cells.length, n - 2 * k + k);
      }
    }
  }
});

test('fewest steps: like runs sit together, totals unchanged', () => {
  const even = plan({ stitches: 90, changes: 14 });
  const simple = plan({ stitches: 90, changes: 14, spacing: 'simple' });
  assert.equal(sum(simple.runs), 90);
  assert.deepEqual([...simple.runs].sort((a, b) => a - b), [...even.runs].sort((a, b) => a - b));
  assert.ok(simple.text.length < even.text.length);
  const r = plan({ stitches: 50, changes: 13, shape: 'round', spacing: 'simple' });
  assert.equal(r.text, '*K3, M1; rep from * once more, *K4, M1; rep from * 10 more times');
  assert.equal(sum(r.runs), 50);
  assert.equal(r.runs.length, 13);
});

test('summary line', () => {
  assert.equal(summary(plan({ stitches: 50, changes: 7 })), 'Increase 7 stitches across 50 stitches. You end with 57.');
});

test('article table rows stay pinned (most even spacing)', () => {
  const rows = [
    [40, 8, 'inc', 'round', '*K5, M1; rep from * to end of round', 48],
    [72, 12, 'inc', 'round', '*K6, M1; rep from * to end of round', 84],
    [80, 10, 'inc', 'round', '*K8, M1; rep from * to end of round', 90],
    [96, 8, 'dec', 'round', '*K10, K2tog; rep from * to end of round', 88],
    [50, 7, 'inc', 'flat', 'K4, M1, *K7, M1; rep from * 5 more times, K4', 57],
    [100, 10, 'dec', 'flat', 'K4, K2tog, *K8, K2tog; rep from * 8 more times, K4', 90],
  ];
  for (const [n, k, mode, shape, text, total] of rows) {
    const p = plan({ stitches: n, changes: k, mode, shape, spacing: 'even' });
    assert.equal(p.text, text);
    assert.equal(p.total, total);
  }
});

test('one change in the round is plain text, in both styles', () => {
  assert.equal(plan({ stitches: 50, changes: 1, shape: 'round' }).text, 'K50, M1');
  assert.equal(plan({ stitches: 50, changes: 1, shape: 'round', style: 'paren' }).text, 'K50, M1');
  assert.equal(plan({ stitches: 20, changes: 1, mode: 'dec', shape: 'round' }).text, 'K18, K2tog');
});

test('paren style in the round says twice and N times', () => {
  assert.equal(plan({ stitches: 40, changes: 2, shape: 'round', style: 'paren' }).text, '(K20, M1) twice');
  assert.equal(plan({ stitches: 60, changes: 12, shape: 'round', style: 'paren' }).text, '(K5, M1) 12 times');
});

test('KFB uses up a stitch: the line works exactly the stitches on the needle', () => {
  const p = plan({ stitches: 50, changes: 7, inc: 'KFB' });
  assert.equal(p.uses, 1);
  assert.equal(sum(p.runs), 43);
  assert.equal(p.total, 57);
  assert.equal(p.cells.length, 57);
  // Walk the line: plain runs plus one stitch per KFB must equal the 50 stitches on the needle.
  assert.equal(sum(p.runs) + p.k, 50);
  assert.equal(p.after[0], p.runs[0] + 1);
  assert.match(p.text, /KFB/);
  const err = plan({ stitches: 10, changes: 11, inc: 'KFB' });
  assert.equal(err.ok, false);
  assert.match(err.error, /at most 10/);
  assert.equal(plan({ stitches: 10, changes: 10, inc: 'KFB', shape: 'round' }).text, '*KFB; rep from * to end of round');
});

test('crochet: sc, inc and sc2tog', () => {
  const inc = plan({ stitches: 24, changes: 6, craft: 'crochet', shape: 'round' });
  assert.equal(inc.text, '*sc 3, inc; rep from * to end of round');
  assert.equal(inc.total, 30);
  assert.equal(sum(inc.runs) + inc.k, 24);
  const dec = plan({ stitches: 30, changes: 6, craft: 'crochet', mode: 'dec', shape: 'round' });
  assert.equal(dec.text, '*sc 3, sc2tog; rep from * to end of round');
  assert.equal(dec.total, 24);
  const flat = plan({ stitches: 20, changes: 2, craft: 'crochet' });
  assert.match(flat.text, /^sc \d+, inc/);
});

test('edge stitches stay plain at each end of a flat row', () => {
  const p = plan({ stitches: 50, changes: 7, edge: 2 });
  assert.equal(sum(p.runs), 50 - 7 * 0);
  assert.ok(p.text.startsWith('K'));
  const bare = plan({ stitches: 46, changes: 7 });
  assert.equal(p.runs[0], bare.runs[0] + 2);
  assert.equal(p.runs[p.runs.length - 1], bare.runs[bare.runs.length - 1] + 2);
  assert.equal(plan({ stitches: 50, changes: 7, edge: 2, shape: 'round' }).runs.length, 7); // ignored in the round
  assert.equal(plan({ stitches: 6, changes: 1, edge: 3 }).ok, false);
});

test('plural wording in errors and summary', () => {
  assert.equal(summary(plan({ stitches: 1, changes: 1 })), 'Increase 1 stitch across 1 stitch. You end with 2.');
  assert.match(plan({ stitches: 1, changes: 1, mode: 'dec' }).error, /1 stitch allows at most 0/);
});

test('property: wide sweep incl. k up to 3n, simple spacing, KFB and crochet', () => {
  for (let n = 1; n <= 40; n++) {
    for (let k = 1; k <= 3 * n; k++) {
      for (const shape of ['flat', 'round']) {
        for (const spacing of ['even', 'simple']) {
          const p = plan({ stitches: n, changes: k, shape, spacing });
          assert.ok(p.ok, `${n} ${k} ${shape} ${spacing}`);
          assert.equal(sum(p.runs), n);
          assert.equal(p.cells.length, n + k);
          // "after" equals a direct walk of the picture: count stitches before each new one
          const walk = [];
          let seen = 0;
          for (const c of p.cells) { if (c === 'k') seen++; else walk.push(seen); }
          assert.deepEqual(p.after, walk);
          const mid = shape === 'flat' && p.runs.length > 2 ? p.runs.slice(1, -1) : p.runs;
          assert.ok(Math.max(...mid) - Math.min(...mid) <= 1);
        }
      }
    }
    for (let k = 1; k <= n; k++) {
      for (const shape of ['flat', 'round']) {
        for (const inc of ['KFB', 'inc']) {
          const p = plan({ stitches: n, changes: k, shape, inc, spacing: 'simple' });
          assert.ok(p.ok, `${n} ${k} ${shape} ${inc}`);
          assert.equal(sum(p.runs) + k, n);
          assert.equal(p.total, n + k);
          assert.equal(p.cells.length, n + k);
          // plain stitches seen before each change, plus the change stitch itself, match "after"
          const walk = [];
          let seen = 0;
          for (const c of p.cells) { if (c === 'k') seen++; else walk.push(seen); }
          assert.deepEqual(p.after, walk.map((x) => x));
        }
      }
    }
  }
});

test('lineHtml bolds whole-word changes only and escapes text', () => {
  assert.equal(lineHtml('K4, M1, *K7, M1; rep from * 5 more times, K4.', 'M1'), 'K4, <b>M1</b>, *K7, <b>M1</b>; rep from * 5 more times, K4.');
  assert.equal(lineHtml('K2, K2tog tbl, K2tog tbl', 'K2tog tbl'), 'K2, <b>K2tog tbl</b>, <b>K2tog tbl</b>');
  assert.equal(lineHtml('K2, M1L, M1', 'M1'), 'K2, M1L, <b>M1</b>');
  assert.equal(lineHtml('a<b', 'zz'), 'a&lt;b');
});

test('dotsHtml puts a gap after each 10 stitches, also when a decrease pair jumps over', () => {
  const cells = Array(9).fill('k').concat(['d', 'k', 'k']);
  const html = dotsHtml(cells);
  assert.equal((html.match(/gap/g) || []).length, 1);
  assert.equal((dotsHtml(Array(25).fill('k')).match(/gap/g) || []).length, 2);
});

test('whereText and explain', () => {
  assert.match(whereText(plan({ stitches: 50, changes: 7 })), /^M1 after stitch 4, 11/);
  assert.match(whereText(plan({ stitches: 50, changes: 7, inc: 'KFB' })), /^Work KFB in these stitches/);
  assert.match(whereText(plan({ stitches: 50, changes: 7, mode: 'dec' })), /starting at stitch/);
  assert.match(explain('M1'), /make one/);
  assert.equal(explain('nope'), '');
});

test('shorter line in the round still says "to end of round" when every run is equal', () => {
  assert.equal(plan({ stitches: 40, changes: 8, shape: 'round', spacing: 'simple' }).text, '*K5, M1; rep from * to end of round');
});

test('gap fix: every stitch gets a change, in plain words', () => {
  const p = plan({ stitches: 20, changes: 20, style: 'paren' });
  assert.equal(p.text, '(K1, M1) 20 times');
  assert.equal(p.total, 40);
  assert.match(p.notes.join(' '), /Every stitch gets an M1/);
  assert.equal(plan({ stitches: 20, changes: 40, style: 'paren', shape: 'round' }).text, '(K1, M1 twice) 20 times');
});

test('gap fix: more changes than stitches never prints M1, M1 side by side', () => {
  for (const shape of ['flat', 'round']) {
    for (const k of [21, 25, 30, 33, 50, 59]) {
      const p = plan({ stitches: 20, changes: k, shape });
      assert.equal(p.ok, true);
      assert.ok(!/M1, M1/.test(p.text), p.text);
      assert.equal(sum(p.runs), 20);
    }
  }
});

test('gap fix: positions are not listed twice', () => {
  const where = whereText(plan({ stitches: 20, changes: 25 }));
  assert.ok(!/\b(\d+), \1\b/.test(where), where);
  assert.match(where, /\(twice\)/);
});

test('gap fix: check line and edge sentence', () => {
  const p = plan({ stitches: 50, changes: 7, style: 'paren' });
  assert.equal(p.text, 'K4, M1, (K7, M1) 6 times, K4');
  assert.equal(check(p), 'Check: 7 M1 and 50 K. You end with 57 stitches.');
  assert.match(edgeNote(p), /first and last runs \(4 and 4\)/);
  assert.match(edgeNote(plan({ stitches: 50, changes: 7, shape: 'round' })), /no edges/);
  assert.equal(check(plan({ stitches: 50, changes: 7, mode: 'dec' })), 'Check: 7 K2tog and 36 K. You end with 43 stitches.');
  assert.equal(check(plan({ stitches: 24, changes: 6, shape: 'round', craft: 'crochet' })), 'Check: 6 inc and 18 sc. You end with 30 stitches.');
});

test('gap fix: row map folds repeats', () => {
  const html = mapHtml(plan({ stitches: 50, changes: 7 }));
  assert.match(html, /K4/);
  assert.match(html, /&times;6/);
});

test('gap fix: every landing page case gives a valid line', async () => {
  const { cases } = await import('../src/data/cases.ts');
  assert.ok(cases.length >= 8 && cases.length <= 10);
  const slugs = new Set();
  for (const c of cases) {
    assert.ok(!slugs.has(c.slug)); slugs.add(c.slug);
    const p = plan({ stitches: c.preset.n, changes: c.preset.k, mode: c.preset.mode, shape: c.preset.shape, craft: c.preset.craft });
    assert.equal(p.ok, true, c.slug);
  }
});
