import assert from 'node:assert/strict';
import { test } from 'node:test';
import { plan, flatRuns, roundRuns, summary } from '../src/lib/spread.js';

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
  assert.deepEqual([...simple.runs].sort(), [...even.runs].sort());
  assert.ok(simple.text.length < even.text.length);
  const r = plan({ stitches: 50, changes: 13, shape: 'round', spacing: 'simple' });
  assert.equal(r.text, '*K3, M1; rep from * once more, *K4, M1; rep from * 10 more times');
  assert.equal(sum(r.runs), 50);
  assert.equal(r.runs.length, 13);
});

test('summary line', () => {
  assert.equal(summary(plan({ stitches: 50, changes: 7 })), 'Increase 7 stitches across 50 stitches. You end with 57.');
});
