// Builds the RVA Cheap Flights press infographic from the exported fare CSV.
//   node build-infographic.mjs
// Brand palette is LOCKED (memory rva-brand-identity): navy #153556, orange #F37727, white.
// Used here as a DIVERGING pair - orange = cheaper than the route's normal floor, navy = a
// premium over it - with a neutral midpoint. Every bar is direct-labeled, which is the relief
// the palette validator requires for orange at 2.74:1 against a near-white surface.
import fs from 'fs';
import path from 'path';

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const csv = fs.readFileSync(path.join(DIR, 'ric-fares-aug-oct-2026.csv'), 'utf-8').trim().split('\n');

const parse = (line) => {
  const out = []; let cur = '', q = false;
  for (const ch of line) {
    if (ch === '"') q = !q;
    else if (ch === ',' && !q) { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur); return out;
};

const head = parse(csv[0]);
const rows = csv.slice(1).map(l => {
  const f = parse(l); const o = {};
  head.forEach((h, i) => o[h] = f[i]);
  return o;
});

// ---- aggregate by route ----
const byDest = new Map();
for (const r of rows) {
  const code = r.destination_code;
  if (!byDest.has(code)) byDest.set(code, { code, name: r.destination, fares: [], lows: [], grades: [] });
  const d = byDest.get(code);
  d.fares.push(+r.fare_usd);
  if (r.normal_range_low_usd) d.lows.push(+r.normal_range_low_usd);
  d.grades.push(+r.deal_grade);
}

const avg = a => a.reduce((x, y) => x + y, 0) / a.length;
const routes = [...byDest.values()]
  .filter(d => d.lows.length >= 3)
  .map(d => {
    const fare = avg(d.fares), low = avg(d.lows);
    return {
      code: d.code, name: d.name, n: d.fares.length,
      fare: Math.round(fare), low: Math.round(low),
      min: Math.min(...d.fares),
      // positive = cheaper than the normal floor, negative = premium over it
      pct: Math.round((1 - fare / low) * 100),
      best: Math.max(...d.grades),
    };
  })
  .sort((a, b) => b.pct - a.pct);

const total = rows.length;
const dests = byDest.size;
const cheapest = rows.reduce((m, r) => +r.fare_usd < +m.fare_usd ? r : m);
const topGrade = rows.filter(r => +r.deal_grade >= 9.5).length;

// ---- diverging bar chart ----
const NAVY = '#153556', ORANGE = '#F37727', INK = '#1b2733', MUTED = '#6b7a88', GRID = '#e3e7ea';
const W = 920, ROW = 26, PAD_T = 46, LABEL_W = 180, AXIS_W = 560, GAP = 2;
const H = PAD_T + routes.length * ROW + 34;
const maxAbs = Math.max(...routes.map(r => Math.abs(r.pct)));
const scale = v => (v / maxAbs) * (AXIS_W / 2 - 46);
const ZERO = LABEL_W + AXIS_W / 2;

let bars = '';
routes.forEach((r, i) => {
  const y = PAD_T + i * ROW;
  const w = Math.abs(scale(r.pct));
  const cheaper = r.pct >= 0;
  const x = cheaper ? ZERO + GAP : ZERO - w - GAP;
  const fill = cheaper ? ORANGE : NAVY;
  const labX = cheaper ? x + w + 8 : x - 8;
  const anchor = cheaper ? 'start' : 'end';
  bars += `
    <text x="${LABEL_W - 14}" y="${y + 13}" text-anchor="end" font-size="12.5" fill="${INK}">${r.name}</text>
    <text x="${LABEL_W - 14}" y="${y + 13}" text-anchor="end" font-size="12.5" fill="${INK}" opacity="0"></text>
    <rect x="${x}" y="${y + 4}" width="${Math.max(w, 1)}" height="14" rx="4" fill="${fill}"/>
    <text x="${labX}" y="${y + 15}" text-anchor="${anchor}" font-size="11.5" font-weight="700" fill="${fill}">${cheaper ? '' : ''}${Math.abs(r.pct)}%</text>`;
});

const chart = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Average RIC fare compared with each route's normal price floor" font-family="Arial, Helvetica, sans-serif">
  <text x="${ZERO - 10}" y="20" text-anchor="end" font-size="11" font-weight="700" fill="${NAVY}">PREMIUM OVER NORMAL &#8592;</text>
  <text x="${ZERO + 10}" y="20" text-anchor="start" font-size="11" font-weight="700" fill="${ORANGE}">&#8594; CHEAPER THAN NORMAL</text>
  <line x1="${ZERO}" y1="${PAD_T - 8}" x2="${ZERO}" y2="${H - 28}" stroke="${MUTED}" stroke-width="1.5"/>
  <text x="${ZERO}" y="${H - 12}" text-anchor="middle" font-size="10.5" fill="${MUTED}">the route's normal price floor</text>
  ${bars}
</svg>`;

// ---- Charleston recurrence strip ----
const chs = rows.filter(r => r.destination_code === 'CHS' && +r.fare_usd === 98)
  .map(r => r.date_found).sort();
const strip = chs.map(d => {
  const [, m, day] = d.split('-');
  const mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m - 1];
  return `<div class="pill"><div class="pill-date">${mon} ${+day}</div><div class="pill-price">$98</div></div>`;
}).join('');

const topRoutes = routes.filter(r => r.pct > 0).slice(0, 4);
const worstRoutes = [...routes].filter(r => r.pct < 0).slice(-3).reverse();

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>RIC Airfare Findings</title>
<style>
  @page { size: letter portrait; margin: 0; }
  * { box-sizing: border-box; }
  body { margin:0; font-family: Arial, Helvetica, sans-serif; color:${INK}; background:#fff; }
  .sheet { width: 8.5in; min-height: 11in; margin: 0 auto; }
  header { background:${NAVY}; color:#fff; padding: 24px 40px 22px; }
  /* Logo at 5x and centered (Glenn, 2026-10-19). Intrinsic art is 2172x724 (3:1),
     so 170px tall renders 510px wide - inside the 736px content width with room. */
  header img { height: 170px; display:block; margin: 0 auto 16px; }
  h1 { font-size: 25px; margin: 0 0 6px; line-height:1.18; }
  .sub { font-size: 12.5px; opacity:.85; margin:0; }
  .stats { display:flex; gap:0; border-bottom:1px solid ${GRID}; }
  .stat { flex:1; padding:16px 10px; text-align:center; border-right:1px solid ${GRID}; }
  .stat:last-child{border-right:0}
  .stat b { display:block; font-size:25px; color:${NAVY}; line-height:1.1; }
  .stat span { font-size:10.5px; color:${MUTED}; text-transform:uppercase; letter-spacing:.055em; }
  section { padding: 20px 40px 0; }
  h2 { font-size:15.5px; margin:0 0 3px; color:${NAVY}; }
  .note { font-size:11.5px; color:${MUTED}; margin:0 0 12px; line-height:1.45; }
  .pills { display:flex; gap:8px; margin:6px 0 0; }
  .pill { background:${ORANGE}; color:#fff; border-radius:7px; padding:7px 13px; text-align:center; }
  .pill-date { font-size:10.5px; opacity:.92; }
  .pill-price { font-size:16px; font-weight:700; }
  .split { display:flex; gap:26px; margin-top:4px; }
  .col { flex:1; }
  .col h3 { font-size:11px; letter-spacing:.055em; text-transform:uppercase; margin:0 0 7px; }
  .win h3 { color:${ORANGE}; } .lose h3 { color:${NAVY}; }
  .row { display:flex; justify-content:space-between; font-size:12px; padding:4px 0; border-bottom:1px solid ${GRID}; }
  .row b { font-variant-numeric: tabular-nums; }
  footer { margin-top:18px; padding:14px 40px 24px; border-top:2px solid ${NAVY}; font-size:10.5px; color:${MUTED}; line-height:1.55; }
  footer b { color:${NAVY}; }
</style></head><body><div class="sheet">
<header>
  <img src="https://rvacheapflights.com/media/rva/brand/rva-logo-white.png" alt="RVA Cheap Flights">
  <h1>Whether Richmond is a bargain depends entirely on where you're going</h1>
  <p class="sub">${total} graded fares out of RIC &middot; August 17 &ndash; October 19, 2026 &middot; ${dests} destinations</p>
</header>

<div class="stats">
  <div class="stat"><b>${total}</b><span>Fares graded</span></div>
  <div class="stat"><b>64</b><span>Days tracked</span></div>
  <div class="stat"><b>$${cheapest.fare_usd}</b><span>Cheapest fare</span></div>
  <div class="stat"><b>${topGrade}</b><span>Top-grade fares</span></div>
</div>

<section>
  <h2>Where RIC beats its reputation &mdash; and where it doesn't</h2>
  <p class="note">Average fare observed on each route, compared with the normal price floor Google reports for that same route. Orange routes came in <b>below</b> normal. Navy routes carried a <b>premium</b> over it.</p>
  ${chart}
</section>

<section>
  <h2>Charleston at $98, four separate times</h2>
  <p class="note">A fare that recurs is a different kind of fact from a one-off &mdash; it means a traveler who waits will very likely get another chance.</p>
  <div class="pills">${strip}</div>
</section>

<section>
  <h2>Same state, opposite answer</h2>
  <p class="note">"Florida is cheap from Richmond" is only half true.</p>
  <div class="split">
    <div class="col win"><h3>Cheaper than normal from RIC</h3>
      ${topRoutes.map(r => `<div class="row"><span>${r.name}</span><b>${r.pct}% below &middot; from $${r.min}</b></div>`).join('')}
    </div>
    <div class="col lose"><h3>A premium over normal from RIC</h3>
      ${worstRoutes.map(r => `<div class="row"><span>${r.name}</span><b>${Math.abs(r.pct)}% above</b></div>`).join('')}
    </div>
  </div>
</section>

<footer>
  <b>Method.</b> Each fare is graded against the normal price range for that specific route, not a flat dollar threshold &mdash; $575 to Rome and $98 to Charleston aren't comparable numbers, but they are comparable relative to what those routes normally cost. Normal-range figures come from Google's reported range per route and can be checked independently.<br>
  <b>Caveats.</b> These are fares observed over 64 days, not every fare that existed. Prices are accurate as of the date found, not today. 64 days is a real sample but not a seasonal one.<br><br>
  <b>Glenn Brown &middot; RVA Cheap Flights &middot; rvacheapflights.com &middot; 804-210-9657</b> &mdash; full row-level data available on request.
</footer>
</div></body></html>`;

fs.writeFileSync(path.join(DIR, 'RIC-airfare-findings.html'), html, 'utf-8');
console.log(`routes charted: ${routes.length}`);
console.log(`cheaper than normal: ${routes.filter(r => r.pct > 0).map(r => r.code + ' +' + r.pct + '%').join(', ')}`);
console.log(`premium over normal: ${routes.filter(r => r.pct < 0).map(r => r.code + ' ' + r.pct + '%').join(', ')}`);
console.log(`Charleston $98 dates: ${chs.join(', ')}`);
console.log('wrote RIC-airfare-findings.html');
