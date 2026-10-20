// Builds the BizSense business-travel cut of the RIC fare dataset.
//   node build-bizsense-infographic.mjs
//
// Same brand and method as build-infographic.mjs, different slice: only the routes a Richmond
// company actually sends people on. Compared against routes.baseline_price, the same number the
// published grades come from. Percentages only - no baseline dollar figure is printed.
import fs from 'fs';
import path from 'path';

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const stats = JSON.parse(fs.readFileSync(path.join(DIR, 'baseline-stats.json'), 'utf-8'));

const BIZ = {
  JFK: 'New York (JFK)', LGA: 'New York (LaGuardia)', EWR: 'Newark', BOS: 'Boston',
  ORD: "Chicago (O'Hare)", MDW: 'Chicago (Midway)', DEN: 'Denver', LAS: 'Las Vegas',
  LHR: 'London (Heathrow)', LGW: 'London (Gatwick)',
};
const LEISURE = { MCO: 'Orlando', CHS: 'Charleston', TPA: 'Tampa', BNA: 'Nashville', RSW: 'Fort Myers' };

const pick = (map) => Object.keys(map)
  .map(c => { const r = stats.find(x => x.code === c); return { ...r, name: map[c] }; })
  .sort((a, b) => b.pct - a.pct);

const biz = pick(BIZ);
const leisure = pick(LEISURE);
// biz is sorted best-first, so reverse here or the "worst offenders" table shows the mildest
// ones. Caught on the first render: it led with Newark +2% instead of JFK +26%.
const above = biz.filter(r => r.pct <= 0).reverse();
const totalFares = stats.reduce((a, r) => a + r.n, 0);

const NAVY = '#153556', ORANGE = '#F37727', INK = '#1b2733', MUTED = '#6b7a88', GRID = '#e3e7ea';
const W = 920, ROW = 30, PAD_T = 36, LABEL_W = 230, AXIS_W = 520, GAP = 2;
const H = PAD_T + biz.length * ROW + 28;
const maxAbs = Math.max(...biz.map(r => Math.abs(r.pct)));
const scale = v => (v / maxAbs) * (AXIS_W / 2 - 44);
const ZERO = LABEL_W + AXIS_W / 2;

let bars = '';
biz.forEach((r, i) => {
  const y = PAD_T + i * ROW;
  const w = Math.abs(scale(r.pct));
  const cheaper = r.pct > 0;
  const x = cheaper ? ZERO + GAP : ZERO - w - GAP;
  const fill = cheaper ? ORANGE : NAVY;
  const labX = cheaper ? x + w + 9 : x - 9;
  bars += `
    <text x="${LABEL_W - 16}" y="${y + 16}" text-anchor="end" font-size="13" fill="${INK}">${r.name}</text>
    <rect x="${x}" y="${y + 5}" width="${Math.max(w, 1)}" height="16" rx="4" fill="${fill}"/>
    <text x="${labX}" y="${y + 18}" text-anchor="${cheaper ? 'start' : 'end'}" font-size="12.5" font-weight="700" fill="${fill}">${Math.abs(r.pct)}%</text>`;
});

const chart = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Richmond business routes against what each route normally costs" font-family="Arial, Helvetica, sans-serif">
  <text x="${ZERO - 12}" y="20" text-anchor="end" font-size="11.5" font-weight="700" fill="${NAVY}">PAYING ABOVE NORMAL &#8592;</text>
  <text x="${ZERO + 12}" y="20" text-anchor="start" font-size="11.5" font-weight="700" fill="${ORANGE}">&#8594; BELOW NORMAL</text>
  <line x1="${ZERO}" y1="${PAD_T - 8}" x2="${ZERO}" y2="${H - 22}" stroke="${MUTED}" stroke-width="1.5"/>
  <text x="${ZERO}" y="${H - 6}" text-anchor="middle" font-size="10.5" fill="${MUTED}">what the route normally costs</text>
  ${bars}
</svg>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Richmond Business Travel — RIC Fare Analysis</title>
<style>
  @page { size: letter portrait; margin: 0; }
  * { box-sizing: border-box; }
  body { margin:0; font-family: Arial, Helvetica, sans-serif; color:${INK}; background:#fff; }
  .sheet { width: 8.5in; margin: 0 auto; zoom: 0.95; }
  header { background:${NAVY}; color:#fff; padding: 18px 40px 16px; text-align:center; }
  header img { height: 150px; display:block; margin: 0 auto 10px; }
  h1 { font-size: 23px; margin: 0 0 6px; line-height:1.22; }
  .sub { font-size: 12.5px; opacity:.85; margin:0; }
  .stats { display:flex; border-bottom:1px solid ${GRID}; }
  .stat { flex:1; padding:12px 8px; text-align:center; border-right:1px solid ${GRID}; }
  .stat:last-child{border-right:0}
  .stat b { display:block; font-size:24px; color:${NAVY}; line-height:1.1; }
  .stat span { font-size:10px; color:${MUTED}; text-transform:uppercase; letter-spacing:.05em; }
  section { padding: 14px 40px 0; }
  h2 { font-size:15.5px; margin:0 0 3px; color:${NAVY}; }
  .note { font-size:11.5px; color:${MUTED}; margin:0 0 9px; line-height:1.45; }
  .split { display:flex; gap:24px; }
  .col { flex:1; }
  .col h3 { font-size:10.5px; letter-spacing:.05em; text-transform:uppercase; margin:0 0 6px; }
  .win h3 { color:${ORANGE}; } .lose h3 { color:${NAVY}; }
  .row { display:flex; justify-content:space-between; font-size:12px; padding:3.5px 0; border-bottom:1px solid ${GRID}; }
  .row b { font-variant-numeric: tabular-nums; }
  footer { margin-top:12px; padding:11px 40px 16px; border-top:2px solid ${NAVY}; font-size:9.5px; color:${MUTED}; line-height:1.55; }
  footer b { color:${NAVY}; }
</style></head><body><div class="sheet">
<header>
  <img src="https://rvacheapflights.com/media/rva/brand/rva-logo-white.png" alt="RVA Cheap Flights">
  <h1>Seven of 10 business-relevant routes came in above<br>what those routes normally cost</h1>
  <p class="sub">Prepared for Richmond BizSense &middot; ${totalFares} graded fares out of RIC &middot; August 17 &ndash; October 19, 2026</p>
</header>

<div class="stats">
  <div class="stat"><b>${totalFares}</b><span>Fares graded</span></div>
  <div class="stat"><b>64</b><span>Days tracked</span></div>
  <div class="stat"><b>${biz.length}</b><span>Business-relevant</span></div>
  <div class="stat"><b>${above.length}</b><span>Above normal</span></div>
</div>

<section>
  <h2>Business-relevant routes out of RIC, against their own normal price</h2>
  <p class="note">Every fare is compared with what that specific route normally costs, so a $289 New York ticket and an $837 London ticket can be judged on the same scale. Navy means the observed fares averaged above that route's normal price.</p>
  ${chart}
</section>

<section>
  <h2>The contrast with leisure-oriented routes</h2>
  <p class="note">Several leisure-oriented routes produced stronger values than the business-relevant routes in this analysis.</p>
  <div class="split">
    <div class="col lose"><h3>Business-relevant &mdash; above normal</h3>
      ${above.slice(0, 5).map(r => `<div class="row"><span>${r.name}</span><b>${Math.abs(r.pct)}% above</b></div>`).join('')}
    </div>
    <div class="col win"><h3>Leisure-oriented &mdash; below normal</h3>
      ${leisure.slice(0, 5).map(r => `<div class="row"><span>${r.name}</span><b>${r.pct}% below &middot; from $${r.min}</b></div>`).join('')}
    </div>
  </div>
</section>

<footer>
  <b>Method.</b> Each fare is graded against what that specific route normally costs, not a flat dollar threshold. Figures above are averages across every fare observed on each route between August 17 and October 19, 2026. The 10 routes shown were selected as business-relevant for this analysis; the dataset does not identify which routes any company books. Fare-level data available on request, including the normal price for each route so any figure here can be checked.<br>
  <b>Caveats.</b> These are fares observed over 64 days, not every fare that existed. Prices are accurate as of the date each was found. 64 days is a real sample but not a seasonal one, and these routes may price differently around holidays.<br><br>
  <b>Glenn Brown &middot; RVA Cheap Flights &middot; rvacheapflights.com &middot; 804-210-9657</b>
</footer>
</div></body></html>`;

fs.writeFileSync(path.join(DIR, 'RIC-business-travel-bizsense.html'), html, 'utf-8');
console.log(`business routes: ${biz.length} | above normal: ${above.length}`);
console.log(`worst: ${above.slice(0, 3).map(r => r.name + ' +' + Math.abs(r.pct) + '%').join(', ')}`);
console.log(`only real bargain: ${biz[0].name} ${biz[0].pct}% below`);
console.log('baseline dollar figure printed:', /baseline/i.test(html));
console.log('wrote RIC-business-travel-bizsense.html');
