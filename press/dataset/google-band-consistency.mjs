// Is Google's captured typical range CONSISTENT per destination, once lead time and season are
// accounted for?   node google-band-consistency.mjs
//
// Glenn, 2026-10-21: "consolidate all the like destinations and compare the differences in
// Google's typical low/high for each of the destinations. Are they consistent assuming like
// leadtimes and seasons, etc"
//
// WHY IT MATTERS: we are considering replacing the hand-typed routes.baseline_price with Google's
// band, which is already captured per fare in raw_json.googleRange. That is only an improvement if
// the band is STABLE for a route. If it swings as much as the error we are trying to fix, it is
// not a baseline either - it is just a different noisy number.
//
// CV = coefficient of variation (sd / mean). Rule of thumb used below:
//   under 10% = tight, 10-20% = usable, over 20% = volatile.
import fs from 'fs';
import path from 'path';

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const parseLine = (l) => { const o = []; let c = '', q = false; for (const ch of l) { if (ch === '"') q = !q; else if (ch === ',' && !q) { o.push(c); c = ''; } else c += ch; } o.push(c); return o; };
const lines = fs.readFileSync(path.join(DIR, 'ric-fares-FULL-aug-oct-2026.csv'), 'utf-8').trim().split('\n');
const head = parseLine(lines[0]);
const rows = lines.slice(1).map(l => { const f = parseLine(l); const o = {}; head.forEach((k, i) => o[k] = f[i]); return o; })
  .filter(r => r.date_found <= '2026-10-19' && r.google_typical_low_usd);

const MONTH = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const DAY = 86400000;
const SEASON = ['WIN', 'WIN', 'SPR', 'SPR', 'SPR', 'SUM', 'SUM', 'SUM', 'FAL', 'FAL', 'FAL', 'WIN'];

for (const r of rows) {
  const m = (r.travel_dates || '').split(/\s*[–—-]\s*/)[0].match(/([A-Z][a-z]{2})\s+(\d{1,2})/);
  if (!m) continue;
  const found = new Date(r.date_found + 'T00:00:00Z');
  let dep = new Date(Date.UTC(found.getUTCFullYear(), MONTH[m[1]], +m[2]));
  if (dep < found) dep = new Date(Date.UTC(found.getUTCFullYear() + 1, MONTH[m[1]], +m[2]));
  r._lead = Math.round((dep - found) / DAY);
  r._depMonth = dep.getUTCMonth();
  r._season = SEASON[dep.getUTCMonth()];
  r._lo = +r.google_typical_low_usd;
  r._hi = +r.google_typical_high_usd;
}

const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const sd = (a) => { if (a.length < 2) return 0; const m = mean(a); return Math.sqrt(a.reduce((s, v) => s + (v - m) ** 2, 0) / (a.length - 1)); };
const cv = (a) => a.length < 2 ? 0 : (sd(a) / mean(a)) * 100;
// Pearson r, for "does lead time explain the swing?"
const corr = (x, y) => {
  if (x.length < 3) return NaN;
  const mx = mean(x), my = mean(y);
  const num = x.reduce((s, v, i) => s + (v - mx) * (y[i] - my), 0);
  const den = Math.sqrt(x.reduce((s, v) => s + (v - mx) ** 2, 0) * y.reduce((s, v) => s + (v - my) ** 2, 0));
  return den === 0 ? NaN : num / den;
};

const byDest = {};
for (const r of rows) (byDest[r.destination] ||= []).push(r);

console.log('GOOGLE TYPICAL BAND — consistency per destination');
console.log('='.repeat(108));
console.log('destination          n   LOW edge            CV%   HIGH edge           CV%   width   seeded  verdict');
console.log('-'.repeat(108));

const summary = [];
for (const [dest, rs] of Object.entries(byDest).sort((a, b) => a[0].localeCompare(b[0]))) {
  const los = rs.map(r => r._lo), his = rs.map(r => r._hi);
  const cvLo = cv(los), cvHi = cv(his);
  const widthRatio = mean(his) / mean(los);
  const verdict = cvLo < 10 ? 'TIGHT' : cvLo < 20 ? 'usable' : 'VOLATILE';
  summary.push({ dest, n: rs.length, meanLo: mean(los), meanHi: mean(his), cvLo, cvHi, widthRatio, seeded: +rs[0].route_baseline_usd, rs });
  console.log(
    dest.padEnd(20),
    String(rs.length).padStart(2),
    `$${Math.min(...los)}-${Math.max(...los)}`.padEnd(12), `mean $${mean(los).toFixed(0)}`.padEnd(10),
    `${cvLo.toFixed(0)}%`.padStart(4),
    `$${Math.min(...his)}-${Math.max(...his)}`.padEnd(14),
    `${cvHi.toFixed(0)}%`.padStart(4),
    `${widthRatio.toFixed(1)}x`.padStart(6),
    `$${rs[0].route_baseline_usd}`.padStart(7),
    ' ' + verdict
  );
}

console.log('');
console.log('ACROSS ALL ROUTES');
console.log(`  mean CV of the LOW edge : ${mean(summary.map(s => s.cvLo)).toFixed(1)}%`);
console.log(`  mean CV of the HIGH edge: ${mean(summary.map(s => s.cvHi)).toFixed(1)}%`);
console.log(`  tight (<10%): ${summary.filter(s => s.cvLo < 10).length}   usable (10-20%): ${summary.filter(s => s.cvLo >= 10 && s.cvLo < 20).length}   volatile (>20%): ${summary.filter(s => s.cvLo >= 20).length}`);

console.log('');
console.log('DOES LEAD TIME OR SEASON EXPLAIN THE SWING?');
console.log('  Pearson r between the LOW edge and lead time, per destination (needs n>=3):');
const rs_lead = [];
for (const s of summary) {
  const r = corr(s.rs.map(x => x._lead), s.rs.map(x => x._lo));
  if (!Number.isNaN(r)) { rs_lead.push(r); }
}
rs_lead.sort((a, b) => a - b);
console.log(`    median r = ${rs_lead[Math.floor(rs_lead.length / 2)].toFixed(2)}   (r near 0 = lead time does NOT explain it)`);
console.log(`    |r| > 0.5 on ${rs_lead.filter(r => Math.abs(r) > 0.5).length} of ${rs_lead.length} destinations`);

console.log('');
console.log('  LOW edge by departure season, routes with 2+ seasons observed:');
for (const s of summary) {
  const bySeason = {};
  for (const r of s.rs) (bySeason[r._season] ||= []).push(r._lo);
  const keys = Object.keys(bySeason);
  if (keys.length < 2) continue;
  const parts = keys.sort().map(k => `${k} $${mean(bySeason[k]).toFixed(0)}(n${bySeason[k].length})`);
  const spread = Math.max(...keys.map(k => mean(bySeason[k]))) / Math.min(...keys.map(k => mean(bySeason[k])));
  console.log(`    ${s.dest.padEnd(20)} ${parts.join('  ')}   spread ${spread.toFixed(2)}x`);
}

console.log('');
console.log('SEEDED BASELINE vs GOOGLE MEAN LOW — where the hand-typed number sits');
console.log('-'.repeat(78));
for (const s of summary.sort((a, b) => (a.seeded / a.meanLo) - (b.seeded / b.meanLo))) {
  const ratio = s.seeded / s.meanLo;
  const where = s.seeded < s.meanLo ? 'BELOW Google low' : s.seeded > s.meanHi ? 'ABOVE Google high' : 'inside the band';
  console.log(`  ${s.dest.padEnd(20)} seeded $${String(s.seeded).padEnd(5)} google $${s.meanLo.toFixed(0)}-${s.meanHi.toFixed(0)}   ${ratio.toFixed(2)}x the low   ${where}`);
}
