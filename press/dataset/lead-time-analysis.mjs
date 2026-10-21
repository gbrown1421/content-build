// Lead time from date_found to DEPARTURE for every fare we logged.
//   node lead-time-analysis.mjs
//
// Glenn, 2026-10-21: "so the flights we post as deals, can we calculate the average (lead-time)
// for departure on those?" Yes. This is that calculation.
//
// WHY IT MATTERS: Google Flights' "typical price range" is conditioned on the travel dates AND
// the booking lead time - verified 2026-10-21, RIC-JFK reads $240-445 for Thanksgiving week and
// $160-240 for a quiet February week. So any Google-sourced comparator has to be sampled at the
// SAME lead time our fares arrive at, or we are comparing a 60-day-out fare to a 300-day-out band.
//
// The source column is `travel_dates`, e.g. "Thu, Sep 17 - Sun, Sep 20". It carries NO YEAR, so
// the year is inferred: the first date on/after date_found. That is safe here because every lead
// time lands in 6..203 days - no row needed a 2-year rollover.
import fs from 'fs';
import path from 'path';

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const CSV = path.join(DIR, 'ric-fares-FULL-aug-oct-2026.csv');

const parseLine = (l) => { const o = []; let c = '', q = false; for (const ch of l) { if (ch === '"') q = !q; else if (ch === ',' && !q) { o.push(c); c = ''; } else c += ch; } o.push(c); return o; };
const lines = fs.readFileSync(CSV, 'utf-8').trim().split('\n');
const head = parseLine(lines[0]);
const rows = lines.slice(1).map(l => { const f = parseLine(l); const o = {}; head.forEach((k, i) => o[k] = f[i]); return o; });

const MONTH = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const DAY = 86400000;

let unparsed = 0;
for (const r of rows) {
  const parts = (r.travel_dates || '').split(/\s*[–—-]\s*/);
  const grab = (s) => { const m = (s || '').match(/([A-Z][a-z]{2})\s+(\d{1,2})/); return m ? { mo: MONTH[m[1]], d: +m[2] } : null; };
  const out = grab(parts[0]), back = grab(parts[1]);
  if (!out) { unparsed++; continue; }
  const found = new Date(r.date_found + 'T00:00:00Z');
  // first occurrence of this month/day at or after `base`
  const after = (x, base) => { const y = base.getUTCFullYear(); let d = new Date(Date.UTC(y, x.mo, x.d)); if (d < base) d = new Date(Date.UTC(y + 1, x.mo, x.d)); return d; };
  const dep = after(out, found);
  r._lead = Math.round((dep - found) / DAY);
  r._departure = dep.toISOString().slice(0, 10);
  if (back) r._nights = Math.round((after(back, dep) - dep) / DAY);
}

const ok = rows.filter(r => Number.isFinite(r._lead) && r._lead >= 0);
const stats = (arr) => {
  const s = [...arr].sort((a, b) => a - b);
  const q = (p) => s[Math.min(s.length - 1, Math.floor(s.length * p))];
  return { n: s.length, mean: +(s.reduce((a, v) => a + v, 0) / s.length).toFixed(1), median: q(.5), min: s[0], max: s[s.length - 1], p10: q(.1), p25: q(.25), p75: q(.75), p90: q(.9) };
};

const lead = stats(ok.map(r => r._lead));
console.log(`parsed ${ok.length}/${rows.length} rows (unparsed: ${unparsed})\n`);
console.log('LEAD TIME — days from date_found to departure');
console.log(`  mean ${lead.mean}   median ${lead.median}   range ${lead.min}-${lead.max}`);
console.log(`  p10 ${lead.p10}   p25 ${lead.p25}   p75 ${lead.p75}   p90 ${lead.p90}\n`);

const nights = stats(ok.filter(r => r._nights > 0).map(r => r._nights));
console.log(`TRIP LENGTH — mean ${nights.mean} nights, median ${nights.median}, range ${nights.min}-${nights.max}\n`);

console.log('LEAD TIME by grade band');
const bands = [[9.5, 10.1, 'grade 9.5-10 (best)'], [7, 9.5, 'grade 7-9.4 (paid)'], [5, 7, 'grade 5-6.9 (free)'], [0, 5, 'below 5 (dropped)']];
for (const [lo, hi, label] of bands) {
  const sub = ok.filter(r => +r.deal_grade >= lo && +r.deal_grade < hi).map(r => r._lead);
  if (sub.length) { const s = stats(sub); console.log(`  ${label.padEnd(21)} n=${String(s.n).padStart(3)}  mean ${String(s.mean).padStart(6)}  median ${String(s.median).padStart(4)}`); }
}

// ⚠ The band above is a CORRELATION and very likely a SCORING ARTIFACT, not a finding.
// Fares booked further out are naturally cheaper. Every fare is scored against ONE flat
// baseline_price that knows nothing about lead time, so a far-out fare scores higher
// automatically. "Our best deals are found 96 days out" may say nothing about the world and
// everything about the scorer. Do NOT put this in public copy.

console.log('\nLEAD TIME by destination (median)');
const byDest = {};
for (const r of ok) (byDest[r.destination] ||= []).push(r._lead);
Object.entries(byDest).sort((a, b) => a[0].localeCompare(b[0]))
  .forEach(([d, v]) => { const s = stats(v); console.log(`  ${d.padEnd(21)} n=${String(s.n).padStart(3)}  median ${String(s.median).padStart(4)}  range ${s.min}-${s.max}`); });

console.log('\nSAMPLING TARGET for a matched Google comparator:');
console.log(`  depart ~${lead.median} days out, ${nights.median}-night round trip (our median deal).`);
console.log(`  To cover the spread, sample lead buckets around p25/p75: ${lead.p25} and ${lead.p75} days.`);
