// Builds the RVA Cheap Flights press infographic.
//   node build-infographic.mjs
//
// DATA BASIS (settled 2026-10-19 after three wrong attempts):
// Fares are compared against routes.baseline_price - the SAME number the scorer uses, via
// (baseline - fare) / baseline. Earlier versions compared against Google's price range, first
// its low edge and then its midpoint. Both were proxies for a number the system already had,
// and both produced a different and wrong story. Using the real baseline also makes the chart
// internally consistent with the published grades: a reporter who checks a 10/10 fare against
// this chart will find they agree.
//
// METHOD PROTECTION (Glenn's standing rule): the grade is public, the baseline is not. This
// chart therefore publishes PERCENTAGES and FARES and never prints a baseline dollar figure.
// The route-level aggregate is deliberately coarse - an average, not per-fare.
//
// Brand palette is LOCKED (memory rva-brand-identity): navy #153556, orange #F37727, white.
// Used as a DIVERGING pair - orange = below baseline, navy = above it - with every bar direct-
// labeled, which is the relief the palette validator requires for orange at 2.74:1 on white.
import fs from 'fs';
import path from 'path';

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const stats = JSON.parse(fs.readFileSync(path.join(DIR, 'baseline-stats.json'), 'utf-8'));

const NAMES = {
  MCO: 'Orlando', CHS: 'Charleston', LAS: 'Las Vegas', PUJ: 'Punta Cana', TPA: 'Tampa',
  AUA: 'Aruba', BNA: 'Nashville', RSW: 'Fort Myers', PLS: 'Providenciales', DUB: 'Dublin',
  FCO: 'Rome', CUN: 'Cancun', CDG: 'Paris', LIS: 'Lisbon', MBJ: 'Montego Bay', DEN: 'Denver',
  BOS: 'Boston', EWR: 'Newark', LGW: 'London Gatwick', LHR: 'London Heathrow',
  ORD: "Chicago O'Hare", FLL: 'Fort Lauderdale', LGA: 'New York LaGuardia', MIA: 'Miami',
  MDW: 'Chicago Midway', JFK: 'New York JFK',
};

const routes = stats.map(s => ({ ...s, name: NAMES[s.code] || s.code })).sort((a, b) => b.pct - a.pct);
const below = routes.filter(r => r.pct > 0);
const above = routes.filter(r => r.pct <= 0);

const totalFares = routes.reduce((a, r) => a + r.n, 0);
const cheapest = routes.reduce((m, r) => r.min < m.min ? r : m);
const topGrade = routes.reduce((a, r) => a + r.tens, 0);

// ---- diverging bar chart ----
const NAVY = '#153556', ORANGE = '#F37727', INK = '#1b2733', MUTED = '#6b7a88', GRID = '#e3e7ea';
// Row height is tuned so the whole sheet lands on ONE letter page - the email promises a
// one-page summary. Verified by counting /Type /Page in the rendered PDF, not by eye.
const W = 920, ROW = 17, PAD_T = 32, LABEL_W = 196, AXIS_W = 540, GAP = 2;
const H = PAD_T + routes.length * ROW + 26;
const maxAbs = Math.max(...routes.map(r => Math.abs(r.pct)));
const scale = v => (v / maxAbs) * (AXIS_W / 2 - 40);
const ZERO = LABEL_W + AXIS_W / 2;

let bars = '';
routes.forEach((r, i) => {
  const y = PAD_T + i * ROW;
  const w = Math.abs(scale(r.pct));
  const cheaper = r.pct > 0;
  const x = cheaper ? ZERO + GAP : ZERO - w - GAP;
  const fill = cheaper ? ORANGE : NAVY;
  const labX = cheaper ? x + w + 8 : x - 8;
  bars += `
    <text x="${LABEL_W - 14}" y="${y + 12}" text-anchor="end" font-size="11" fill="${INK}">${r.name}</text>
    <rect x="${x}" y="${y + 3}" width="${Math.max(w, 1)}" height="11" rx="3.5" fill="${fill}"/>
    <text x="${labX}" y="${y + 12}" text-anchor="${cheaper ? 'start' : 'end'}" font-size="10.5" font-weight="700" fill="${fill}">${Math.abs(r.pct)}%</text>`;
});

const chart = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Average Richmond fare against what each route normally costs" font-family="Arial, Helvetica, sans-serif">
  <text x="${ZERO - 10}" y="18" text-anchor="end" font-size="11" font-weight="700" fill="${NAVY}">ABOVE NORMAL &#8592;</text>
  <text x="${ZERO + 10}" y="18" text-anchor="start" font-size="11" font-weight="700" fill="${ORANGE}">&#8594; BELOW NORMAL</text>
  <line x1="${ZERO}" y1="${PAD_T - 8}" x2="${ZERO}" y2="${H - 26}" stroke="${MUTED}" stroke-width="1.5"/>
  <text x="${ZERO}" y="${H - 10}" text-anchor="middle" font-size="10.5" fill="${MUTED}">what the route normally costs</text>
  ${bars}
</svg>`;

const CHS_DATES = ['Sep 8', 'Sep 15', 'Sep 25', 'Oct 9'];
const strip = CHS_DATES.map(d =>
  `<div class="pill"><div class="pill-date">${d}</div><div class="pill-price">$98</div></div>`).join('');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>RIC Airfare Findings</title>
<style>
  @page { size: letter portrait; margin: 0; }
  * { box-sizing: border-box; }
  body { margin:0; font-family: Arial, Helvetica, sans-serif; color:${INK}; background:#fff; }
  /* No min-height: it forced a blank second page whenever content ran even slightly over.
     The zoom is what guarantees ONE page - content measures just over 11in, and zoom (unlike
     transform) affects layout flow, so Chrome paginates against the scaled height. Verified by
     counting /Type /Page in the rendered PDF. */
  .sheet { width: 8.5in; margin: 0 auto; zoom: 0.93; }
  header { background:${NAVY}; color:#fff; padding: 18px 40px 16px; text-align:center; }
  header img { height: 170px; display:block; margin: 0 auto 10px; }
  h1 { font-size: 24px; margin: 0 0 6px; line-height:1.2; }
  .sub { font-size: 12.5px; opacity:.85; margin:0; }
  .stats { display:flex; border-bottom:1px solid ${GRID}; }
  .stat { flex:1; padding:11px 10px; text-align:center; border-right:1px solid ${GRID}; }
  .stat:last-child{border-right:0}
  .stat b { display:block; font-size:25px; color:${NAVY}; line-height:1.1; }
  .stat span { font-size:10.5px; color:${MUTED}; text-transform:uppercase; letter-spacing:.055em; }
  section { padding: 13px 40px 0; }
  h2 { font-size:15.5px; margin:0 0 3px; color:${NAVY}; }
  .note { font-size:11px; color:${MUTED}; margin:0 0 8px; line-height:1.4; }
  .pills { display:flex; gap:8px; }
  .pill { background:${ORANGE}; color:#fff; border-radius:7px; padding:5px 13px; text-align:center; }
  .pill-date { font-size:10.5px; opacity:.92; }
  .pill-price { font-size:16px; font-weight:700; }
  .split { display:flex; gap:26px; }
  .col { flex:1; }
  .col h3 { font-size:11px; letter-spacing:.055em; text-transform:uppercase; margin:0 0 7px; }
  .win h3 { color:${ORANGE}; } .lose h3 { color:${NAVY}; }
  .row { display:flex; justify-content:space-between; font-size:12px; padding:4px 0; border-bottom:1px solid ${GRID}; }
  .row b { font-variant-numeric: tabular-nums; }
  footer { margin-top:12px; padding:11px 40px 16px; border-top:2px solid ${NAVY}; font-size:9.5px; color:${MUTED}; line-height:1.55; }
  footer b { color:${NAVY}; }
</style></head><body><div class="sheet">
<header>
  <img src="https://rvacheapflights.com/media/rva/brand/rva-logo-white.png" alt="RVA Cheap Flights">
  <h1>Richmond beats the normal price on ${below.length} of the ${routes.length} routes we track</h1>
  <p class="sub">${totalFares} graded fares out of RIC &middot; August 17 &ndash; October 19, 2026</p>
</header>

<div class="stats">
  <div class="stat"><b>${totalFares}</b><span>Fares graded</span></div>
  <div class="stat"><b>64</b><span>Days tracked</span></div>
  <div class="stat"><b>$${cheapest.min}</b><span>Cheapest fare</span></div>
  <div class="stat"><b>${topGrade}</b><span>Top-grade fares</span></div>
</div>

<section>
  <h2>Average Richmond fare against what each route normally costs</h2>
  <p class="note">Orange routes came in <b>below</b> the normal price for that route. Navy routes came in <b>above</b> it. Several routes travelers might expect to be easy bargains aren't &mdash; JFK, LaGuardia, Chicago and Miami all averaged above normal, with JFK the weakest value in the set.</p>
  ${chart}
</section>

<section>
  <h2>Charleston at $98, four separate times</h2>
  <p class="note">A fare that recurs is a different kind of fact from a one-off &mdash; it means a traveler who waits will very likely get another chance.</p>
  <div class="pills">${strip}</div>
</section>

<footer>
  <b>Method.</b> Every fare is graded against what that specific route normally costs, not a flat dollar threshold &mdash; $575 to Rome and $98 to Charleston aren't comparable numbers, but they are comparable relative to their own routes. Percentages above are averages across all fares observed on each route.<br>
  <b>Caveats.</b> These are fares observed over 64 days, not every fare that existed. Prices are accurate as of the date found, not today. 64 days is a real sample but not a seasonal one.<br><br>
  <b>Glenn Brown &middot; RVA Cheap Flights &middot; rvacheapflights.com &middot; 804-210-9657</b> &mdash; fare-level data available on request.
</footer>
</div></body></html>`;

fs.writeFileSync(path.join(DIR, 'RIC-airfare-findings.html'), html, 'utf-8');
console.log(`routes: ${routes.length} (${below.length} below normal, ${above.length} above)`);
console.log(`fares: ${totalFares} | cheapest: $${cheapest.min} (${cheapest.name}) | top-grade: ${topGrade}`);
console.log(`best five: ${below.slice(0, 5).map(r => r.name + ' -' + r.pct + '%').join(', ')}`);
console.log(`worst five: ${above.slice(-5).reverse().map(r => r.name + ' +' + Math.abs(r.pct) + '%').join(', ')}`);
console.log('no baseline dollar figure printed:', !html.includes('baseline'));
console.log('wrote RIC-airfare-findings.html');
