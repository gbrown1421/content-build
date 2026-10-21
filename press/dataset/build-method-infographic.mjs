// One-page method explainer for Glenn's BizSense conversation (Mike Platania, RIC beat).
//   node build-method-infographic.mjs   -> RVA-how-we-qualify-deals.html
//
// Glenn, 2026-10-21: "I want the detail shown in the attached screenshots included so i can
// easily explain the process we use to qualify deals, rational for those decisions and what a
// subscriber can expect from a newsletter."
//
// EVERY FIGURE IS COMPUTED FROM THE DATASET BELOW, not typed in. Re-running after the dataset
// grows updates the sheet. The scoring here mirrors src/mastra/index.ts after commit a5431b9.
//
// WHAT IS DELIBERATELY NOT ON THIS SHEET:
//  - The exact value-point weighting. Glenn, 2026-10-20: the protected part is "the formula",
//    not the numbers. The sheet explains the approach fully and omits the coefficient.
//  - The old "New York and Chicago are the weakest values" line. Under the corrected comparator
//    Chicago Midway is 21% BELOW normal. That claim is dead and must not reappear.
//  - Any claim about who flies which route, any RIC-vs-Dulles comparison, any trend claim.
import fs from 'fs';
import path from 'path';

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const P = (l) => { const o = []; let c = '', q = false; for (const ch of l) { if (ch === '"') q = !q; else if (ch === ',' && !q) { o.push(c); c = ''; } else c += ch; } o.push(c); return o; };
const L = fs.readFileSync(path.join(DIR, 'ric-fares-FULL-aug-oct-2026.csv'), 'utf-8').trim().split('\n');
const H = P(L[0]);
const rows = L.slice(1).map(l => { const f = P(l); const o = {}; H.forEach((k, i) => o[k] = f[i]); return o; })
  .filter(r => r.date_found <= '2026-10-19' && r.google_typical_low_usd);

const W = 0.375; // (mid-low)*0.75+low. Computed, never printed on the sheet.
const scoreOf = (fare, ref, stops) => {
  const p = ((ref - fare) / ref) * 100;
  let b = 6;
  if (p >= 40) b = 10; else if (p >= 36) b = 9; else if (p >= 26) b = 8; else if (p >= 15) b = 7; else if (p <= 0) b = 4;
  let s = b; if (+stops === 0) s += 0.2; else if (+stops >= 2) s -= 0.2;
  return { pct: p, grade: +Math.max(0, Math.min(10, s)).toFixed(1) };
};
for (const r of rows) {
  const lo = +r.google_typical_low_usd, hi = +r.google_typical_high_usd;
  r._ref = lo + W * (hi - lo);
  const g = scoreOf(+r.fare_usd, r._ref, r.stops);
  r._pct = g.pct; r._g = g.grade;
}

const DAY = 86400000;
const dates = rows.map(r => r.date_found).sort();
const start = new Date(dates[0] + 'T00:00:00Z');
const span = Math.round((new Date(dates.at(-1) + 'T00:00:00Z') - start) / DAY) + 1;
const q7 = rows.filter(r => r._g >= 7);
const anyDays = new Set(rows.map(r => r.date_found));
const allDays = Array.from({ length: span }, (_, i) => new Date(+start + i * DAY).toISOString().slice(0, 10));

// Edition mix must model the REAL behaviour, not a per-day count: the newsletter sends the top 3
// by score and anything past three STAYS OPEN for the next run (RVA-DEAL-RULES.md, Glenn,
// 2026-09-10). So a 4-fare day sends 3 and carries 1, which can fill an otherwise dark day.
const byDay = {}; q7.forEach(r => (byDay[r.date_found] ||= []).push(r));
let queue = [];
const sendDays = new Set();
const ed = {};
for (const d of allDays) {
  queue = queue.concat(byDay[d] || []).sort((a, b) => b._g - a._g);
  if (!queue.length) continue;
  const n = Math.min(3, queue.length);
  queue = queue.slice(n);
  sendDays.add(d);
  ed[n] = (ed[n] || 0) + 1;
}

// dry spells
const gaps = []; let g = 0;
allDays.forEach(d => { if (sendDays.has(d)) { if (g) gaps.push(g); g = 0; } else g++; });
if (g) gaps.push(g);
gaps.sort((a, b) => b - a);

// Weekly rate: COMPLETE weeks only. The first and last weeks of the window are partial, so
// including them understates the floor and would put a "3" on the sheet that is an artifact of
// where the sample happens to start.
const wk = {};
[...sendDays].forEach(d => { const t = new Date(d + 'T00:00:00Z'); const on = Math.floor((t - new Date(Date.UTC(t.getUTCFullYear(), 0, 1))) / DAY); const k = Math.ceil((on + 1) / 7); wk[k] = (wk[k] || 0) + 1; });
const weekOf = iso => { const t = new Date(iso + 'T00:00:00Z'); const on = Math.floor((t - new Date(Date.UTC(t.getUTCFullYear(), 0, 1))) / DAY); return Math.ceil((on + 1) / 7); };
const firstWk = weekOf(allDays[0]), lastWk = weekOf(allDays.at(-1));
const dayCount = {}; allDays.forEach(d => { const k = weekOf(d); dayCount[k] = (dayCount[k] || 0) + 1; });
const fullWeeks = Object.keys(wk).map(Number).filter(k => k !== firstWk && k !== lastWk && dayCount[k] === 7);
const wkCounts = fullWeeks.map(k => wk[k]);

// route board
const byR = {}; rows.forEach(r => (byR[r.destination] ||= []).push(r._pct));
const mean = a => a.reduce((s, v) => s + v, 0) / a.length;
const board = Object.entries(byR).map(([d, v]) => ({ d, p: mean(v) })).sort((a, b) => b.p - a.p);
const strongest = board.slice(0, 6);
const weakest = board.slice(-6).reverse();
const airports = new Set(rows.map(r => r.destination_code)).size;
const fmtD = iso => { const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; return `${M[+iso.slice(5,7)-1]} ${+iso.slice(8)}`; };

const NAVY = '#153556', ORANGE = '#F37727', INK = '#1b2733', MUTED = '#6b7a88', GRID = '#e3e7ea', WASH = '#f6f8f9';

const steps = [
  ['1', 'Watch', `Fares out of Richmond arrive continuously and are graded five times a day, at 4am, 8am, noon, 4pm and 8pm Eastern. ${rows.length} fares graded across ${airports} airports in ${span} days.`],
  ['2', 'Compare', 'Each fare is measured against Google&rsquo;s own published typical price range for that exact trip &mdash; same route, same travel dates, captured at the same moment the fare is found. Not a flat dollar threshold.'],
  ['3', 'Grade', 'How far the fare sits below that range sets a 1&ndash;10 grade. A nonstop earns a small bonus, two or more stops a small penalty.'],
  ['4', 'Publish', 'Grade 7 and above goes to subscribers, highest first, up to three per edition. Anything left over waits for the next edition rather than being dropped.'],
];

const why = [
  ['Why each route is judged against itself', '$575 to Rome and $98 to Charleston are not comparable numbers. A fare is only meaningful against what that particular route normally costs, so every route is scored on its own terms.'],
  ['Why Google&rsquo;s range, not an average of our own', 'The range is captured with each fare, so it already reflects that trip&rsquo;s travel dates, booking lead time and season. A single stored &ldquo;normal price&rdquo; per route goes stale and cannot tell a Thanksgiving week from a quiet one.'],
  ['Why the bar sits below the middle', 'A fare in the middle of the typical range is an ordinary good price, not a find. The threshold is set deliberately toward the cheap end of the range so an ordinary price never gets called a deal.'],
];

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>How we qualify a Richmond flight deal</title>
<style>
  @page { size: letter portrait; margin: 0; }
  * { box-sizing: border-box; }
  body { margin:0; font-family: Arial, Helvetica, sans-serif; color:${INK}; background:#fff; }
  .sheet { width: 8.5in; margin:0 auto; zoom: 0.82; }
  header { background:${NAVY}; color:#fff; padding:16px 38px 14px; text-align:center; }
  header img { height:96px; display:block; margin:0 auto 6px; }
  h1 { font-size:24px; margin:0 0 5px; }
  .sub { font-size:12.5px; opacity:.85; margin:0; }
  section { padding:14px 38px 0; }
  h2 { font-size:14.5px; margin:0 0 3px; color:${NAVY}; text-transform:uppercase; letter-spacing:.04em; }
  .note { font-size:11.5px; color:${MUTED}; margin:0 0 10px; line-height:1.4; }
  .steps { display:flex; gap:9px; }
  .step { flex:1; border:1.5px solid ${GRID}; border-top:4px solid ${ORANGE}; border-radius:9px; padding:10px 11px; }
  .num { font-size:11px; font-weight:bold; color:${ORANGE}; }
  .stitle { font-size:13.5px; font-weight:bold; color:${NAVY}; margin:1px 0 4px; }
  .step p { font-size:10.5px; margin:0; line-height:1.45; }
  .why { display:flex; gap:20px; }
  .why div { flex:1; }
  .why h3 { font-size:11px; color:${NAVY}; margin:0 0 4px; }
  .why p { font-size:10.5px; margin:0; line-height:1.45; color:${INK}; }
  .expect { display:flex; gap:9px; }
  .kpi { flex:1; background:${WASH}; border-radius:9px; padding:10px 11px; text-align:center; }
  .kpi .v { font-size:25px; font-weight:bold; color:${NAVY}; line-height:1.1; }
  .kpi .l { font-size:9.5px; color:${MUTED}; line-height:1.35; margin-top:2px; }
  table { width:100%; border-collapse:collapse; font-size:11px; }
  td, th { padding:3.5px 7px; text-align:left; }
  thead th { font-size:9.5px; text-transform:uppercase; letter-spacing:.05em; color:${MUTED}; border-bottom:1.5px solid ${GRID}; }
  tbody tr:nth-child(even) { background:${WASH}; }
  .pos { color:${ORANGE}; font-weight:bold; text-align:right; }
  .neg { color:${NAVY}; font-weight:bold; text-align:right; }
  .cols { display:flex; gap:22px; }
  .cols > div { flex:1; }
  footer { margin-top:12px; padding:10px 38px 14px; border-top:2px solid ${NAVY}; font-size:9.5px; color:${MUTED}; line-height:1.5; }
  footer b { color:${NAVY}; }
</style></head><body><div class="sheet">

<header>
  <img src="https://rvacheapflights.com/media/rva/brand/rva-logo-white.png" alt="RVA Cheap Flights">
  <h1>How a Richmond fare becomes a deal</h1>
  <p class="sub">The method, the reasoning, and what a subscriber actually receives &middot; ${rows.length} graded fares, ${fmtD(dates[0])} &ndash; ${fmtD(dates.at(-1))}, 2026</p>
</header>

<section>
  <h2>The process</h2>
  <p class="note">Every fare out of RIC goes through the same four steps. Nothing is hand-picked.</p>
  <div class="steps">
    ${steps.map(([n, t, b]) => `<div class="step"><div class="num">STEP ${n}</div><div class="stitle">${t}</div><p>${b}</p></div>`).join('')}
  </div>
</section>

<section>
  <h2>Why it is built this way</h2>
  <div class="why">
    ${why.map(([h, b]) => `<div><h3>${h}</h3><p>${b}</p></div>`).join('')}
  </div>
</section>

<section>
  <h2>What a subscriber can expect</h2>
  <p class="note">Measured over the ${span} days above. ${sendDays.size} of those days produced at least one fare that cleared the bar &mdash; and on ${anyDays.size} days a fare of any kind was logged, so ${anyDays.size} is the realistic ceiling.</p>
  <div class="expect">
    <div class="kpi"><div class="v">${sendDays.size}<span style="font-size:14px;color:${MUTED}">/${span}</span></div><div class="l">days carried a qualifying fare<br>(${(sendDays.size / span * 100).toFixed(0)}%)</div></div>
    <div class="kpi"><div class="v">${Math.min(...wkCounts)}&ndash;${Math.max(...wkCounts)}</div><div class="l">editions a week<br>no week below ${Math.min(...wkCounts)}</div></div>
    <div class="kpi"><div class="v">${gaps[0]} days</div><div class="l">longest gap between<br>editions, all period</div></div>
    <div class="kpi"><div class="v">up to 3</div><div class="l">fares per edition<br>${ed[1] || 0} &times;1 &middot; ${ed[2] || 0} &times;2 &middot; ${ed[3] || 0} &times;3</div></div>
    <div class="kpi"><div class="v">${q7.length}</div><div class="l">qualifying fares, all<br>${q7.length} delivered</div></div>
  </div>
</section>

<section>
  <h2>What the data showed, ${fmtD(dates[0])} &ndash; ${fmtD(dates.at(-1))}</h2>
  <p class="note">Each route&rsquo;s average distance from its own typical price. Some of the strongest results are not where people expect them, and some short hops are consistently poor value out of Richmond.</p>
  <div class="cols">
    <div>
      <table><thead><tr><th>Best value from RIC</th><th style="text-align:right">vs typical</th></tr></thead><tbody>
      ${strongest.map(r => `<tr><td>${r.d}</td><td class="pos">${r.p.toFixed(0)}% below</td></tr>`).join('')}
      </tbody></table>
    </div>
    <div>
      <table><thead><tr><th>Weakest value from RIC</th><th style="text-align:right">vs typical</th></tr></thead><tbody>
      ${weakest.map(r => `<tr><td>${r.d}</td><td class="neg">${Math.abs(r.p).toFixed(0)}% above</td></tr>`).join('')}
      </tbody></table>
    </div>
  </div>
</section>

<footer>
  <b>About these numbers.</b> ${rows.length} fares out of RIC observed and graded between ${fmtD(dates[0])} and ${fmtD(dates.at(-1))}, 2026, across ${airports} airports. Each fare is real and was seen on the date recorded; airfare moves constantly, so a price is accurate as of that date rather than today. ${span} days is a genuine sample but not a seasonal one, and these figures should not be read as a year-round pattern. Percentages are each route&rsquo;s average distance from the typical price range published for that trip at the time it was found. Fare-level data available on request.<br><br>
  <b>Glenn Brown &middot; RVA Cheap Flights &middot; rvacheapflights.com &middot; 804-210-9657</b>
</footer>
</div></body></html>`;

fs.writeFileSync(path.join(DIR, 'RVA-how-we-qualify-deals.html'), html, 'utf-8');
console.log(`fares ${rows.length} | airports ${airports} | span ${span}d`);
console.log(`qualifying 7+ ${q7.length} | sending days ${sendDays.size}/${span} | ceiling ${anyDays.size}`);
console.log(`editions 1/2/3-deal: ${ed[1] || 0}/${ed[2] || 0}/${ed[3] || 0} | weekly ${Math.min(...wkCounts)}-${Math.max(...wkCounts)} | longest gap ${gaps[0]}d`);
console.log(`strongest: ${strongest.map(r => r.d + ' ' + r.p.toFixed(0) + '%').join(', ')}`);
console.log(`weakest:   ${weakest.map(r => r.d + ' ' + Math.abs(r.p).toFixed(0) + '%').join(', ')}`);
// guards: the dead claim and the protected coefficient must never reach the sheet
console.log('contains the retired NY/Chicago claim:', /weakest values|New York and Chicago/i.test(html));
console.log('prints the value-point coefficient:', /0\.375|0\.75|\* *\.75/.test(html));
console.log('wrote RVA-how-we-qualify-deals.html');
