// Europe-specific one-pager, built for the Paige Poprocky outreach.
//   node build-europe-onepager.mjs
//
// Glenn, 2026-10-20: the general creator sheet leads with Orlando, Charleston and Tampa, which
// does not match a pitch hooked on European travel. This version is built for that pitch.
//
// CLAIM DISCIPLINE: six European routes, every figure from the Oct 19 snapshot. London is
// included even though it is ABOVE normal - leaving it out would turn a six-route sample into a
// four-route highlight reel, which is the selection bias the master prompt (§15) warns about.
// No baseline dollar figure, no reach or subscriber claim, and the word "wine" appears nowhere:
// Dublin is not a wine region and Paris is not one either.
import fs from 'fs';
import path from 'path';

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const stats = JSON.parse(fs.readFileSync(path.join(DIR, 'baseline-stats.json'), 'utf-8'));
const csv = fs.readFileSync(path.join(DIR, 'ric-fares-FULL-aug-oct-2026.csv'), 'utf-8').trim().split('\n');
const parse = (l) => { const o = []; let c = '', q = false; for (const ch of l) { if (ch === '"') q = !q; else if (ch === ',' && !q) { o.push(c); c = ''; } else c += ch; } o.push(c); return o; };
const head = parse(csv[0]);
const rows = csv.slice(1).map(l => { const f = parse(l); const o = {}; head.forEach((k, i) => o[k] = f[i]); return o; })
  .filter(r => r.date_found <= '2026-10-19');

const EU = {
  DUB: 'Dublin', FCO: 'Rome', LIS: 'Lisbon', CDG: 'Paris',
  LHR: 'London (Heathrow)', LGW: 'London (Gatwick)',
};
const eu = Object.keys(EU).map(c => ({ ...stats.find(x => x.code === c), name: EU[c] }))
  .sort((a, b) => b.pct - a.pct);
const below = eu.filter(r => r.pct > 0);

const fmtDate = (iso) => {
  const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${M[+iso.slice(5,7) - 1]} ${+iso.slice(8)}`;
};
const cheapestRow = (code) => rows.filter(r => r.destination_code === code)
  .sort((a, b) => +a.fare_usd - +b.fare_usd)[0];

const NAVY = '#153556', ORANGE = '#F37727', INK = '#1b2733', MUTED = '#6b7a88', GRID = '#e3e7ea';

const cards = eu.filter(r => r.pct > 0).map(r => {
  const c = cheapestRow(r.code);
  return `
  <div class="card">
    <div class="dest">${r.name}</div>
    <div class="fare">$${c.fare_usd}</div>
    <div class="meta">${c.pct_below_baseline}% below normal &middot; ${fmtDate(c.date_found)}</div>
  </div>`;
}).join('');

// Horizontal bar, all six routes, orange below / navy above
const W = 880, ROW = 34, PAD_T = 30, LABEL_W = 200, AXIS_W = 500, GAP = 2;
const H = PAD_T + eu.length * ROW + 24;
const maxAbs = Math.max(...eu.map(r => Math.abs(r.pct)));
const scale = v => (v / maxAbs) * (AXIS_W / 2 - 40);
const ZERO = LABEL_W + AXIS_W / 2;
let bars = '';
eu.forEach((r, i) => {
  const y = PAD_T + i * ROW;
  const w = Math.abs(scale(r.pct));
  const good = r.pct > 0;
  const x = good ? ZERO + GAP : ZERO - w - GAP;
  const fill = good ? ORANGE : NAVY;
  bars += `
    <text x="${LABEL_W - 16}" y="${y + 18}" text-anchor="end" font-size="13.5" fill="${INK}">${r.name}</text>
    <rect x="${x}" y="${y + 6}" width="${Math.max(w, 1)}" height="17" rx="4" fill="${fill}"/>
    <text x="${good ? x + w + 9 : x - 9}" y="${y + 19}" text-anchor="${good ? 'start' : 'end'}" font-size="12.5" font-weight="700" fill="${fill}">${Math.abs(r.pct)}%</text>`;
});
const chart = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="European routes from Richmond against their normal price" font-family="Arial, Helvetica, sans-serif">
  <text x="${ZERO - 12}" y="18" text-anchor="end" font-size="11.5" font-weight="700" fill="${NAVY}">ABOVE NORMAL &#8592;</text>
  <text x="${ZERO + 12}" y="18" text-anchor="start" font-size="11.5" font-weight="700" fill="${ORANGE}">&#8594; BELOW NORMAL</text>
  <line x1="${ZERO}" y1="${PAD_T - 8}" x2="${ZERO}" y2="${H - 18}" stroke="${MUTED}" stroke-width="1.5"/>
  ${bars}
</svg>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>European fares out of Richmond</title>
<style>
  @page { size: letter portrait; margin: 0; }
  * { box-sizing: border-box; }
  body { margin:0; font-family: Arial, Helvetica, sans-serif; color:${INK}; background:#fff; }
  .sheet { width: 8.5in; margin: 0 auto; zoom: 0.96; }
  header { background:${NAVY}; color:#fff; padding: 20px 40px 18px; text-align:center; }
  header img { height: 150px; display:block; margin: 0 auto 10px; }
  h1 { font-size: 25px; margin: 0 0 7px; line-height:1.2; }
  .sub { font-size: 13px; opacity:.85; margin:0; }
  section { padding: 17px 40px 0; }
  h2 { font-size:16px; margin:0 0 4px; color:${NAVY}; }
  .note { font-size:12px; color:${MUTED}; margin:0 0 11px; line-height:1.45; }
  .grid { display:flex; gap:10px; }
  .card { flex:1; border:1.5px solid ${GRID}; border-radius:10px; padding:12px 14px; }
  .dest { font-size:12px; color:${MUTED}; text-transform:uppercase; letter-spacing:.04em; }
  .fare { font-size:29px; font-weight:bold; color:${NAVY}; line-height:1.15; }
  .meta { font-size:10.5px; color:${ORANGE}; font-weight:bold; }
  .two { display:flex; gap:26px; }
  .two div { flex:1; }
  .two h3 { font-size:11px; letter-spacing:.05em; text-transform:uppercase; color:${NAVY}; margin:0 0 6px; }
  .two p { font-size:12px; margin:0; line-height:1.5; }
  footer { margin-top:14px; padding:12px 40px 18px; border-top:2px solid ${NAVY}; font-size:10px; color:${MUTED}; line-height:1.55; }
  footer b { color:${NAVY}; }
</style></head><body><div class="sheet">
<header>
  <img src="https://rvacheapflights.com/media/rva/brand/rva-logo-white.png" alt="RVA Cheap Flights">
  <h1>European fares out of Richmond</h1>
  <p class="sub">Six routes, ${eu.reduce((a, r) => a + r.n, 0)} observed fares &middot; August 17 &ndash; October 19, 2026</p>
</header>

<section>
  <h2>The cheapest we logged on each route that beat its normal price</h2>
  <p class="note">Real round trips, observed on the dates shown, with how far below that route's normal price each landed.</p>
  <div class="grid">${cards}</div>
</section>

<section>
  <h2>All six European routes, against their own normal pricing</h2>
  <p class="note">${below.length} of the 6 averaged below normal over the period. London did not &mdash; both airports ran slightly above, which is worth knowing before booking.</p>
  ${chart}
</section>

<section>
  <div class="two">
    <div>
      <h3>Why the comparison matters</h3>
      <p>$575 to Rome and $98 to Charleston aren't comparable numbers. Every fare is measured against what that specific route normally costs, so an unusually good price is obvious and an ordinary one doesn't get called a deal.</p>
    </div>
    <div>
      <h3>Everything departs RIC</h3>
      <p>No driving to Dulles or Baltimore first. These are fares a Richmonder can book from their own airport, which is the whole point of tracking them separately.</p>
    </div>
  </div>
</section>

<footer>
  <b>About these numbers.</b> Six European routes out of RIC, ${eu.reduce((a, r) => a + r.n, 0)} observed fares, part of 255 graded between August 17 and October 19, 2026. Each fare is real and was seen on the date listed; airfare moves, so prices are accurate as of that date rather than today. 64 days is a real sample but not a seasonal one. Fare-level data available on request.<br><br>
  <b>Glenn Brown &middot; RVA Cheap Flights &middot; rvacheapflights.com &middot; 804-210-9657</b>
</footer>
</div></body></html>`;

fs.writeFileSync(path.join(DIR, 'RVA-europe-fares.html'), html, 'utf-8');
console.log(`european routes: ${eu.length} | below normal: ${below.length}`);
eu.forEach(r => console.log(`  ${r.name.padEnd(19)}${(r.pct > 0 ? r.pct + '% below' : Math.abs(r.pct) + '% above').padStart(10)}  cheapest $${r.min}`));
console.log('contains "wine":', /wine/i.test(html));
console.log('baseline dollar figure:', /baseline/i.test(html));
console.log('wrote RVA-europe-fares.html');
