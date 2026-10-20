// Builds the creator-facing one-pager for RVA Cheap Flights outreach.
//   node build-creator-onepager.mjs
//
// A creator is not a reporter. They do not want a methodology defense - they want to judge in
// ten seconds whether these fares are worth putting in front of their audience. So this sheet
// leads with the actual fares and their dates, not with averages.
//
// CLAIM DISCIPLINE (master prompt §4, §15, §24): every fare, date and percentage below comes
// from the fare-level dataset cut at 2026-10-19. No subscriber count, no reach figure, no claim
// about what any audience does. Percentages only - no baseline dollar figure is printed.
import fs from 'fs';
import path from 'path';

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const csv = fs.readFileSync(path.join(DIR, 'ric-fares-FULL-aug-oct-2026.csv'), 'utf-8').trim().split('\n');
const parse = (l) => { const o = []; let c = '', q = false; for (const ch of l) { if (ch === '"') q = !q; else if (ch === ',' && !q) { o.push(c); c = ''; } else c += ch; } o.push(c); return o; };
const head = parse(csv[0]);
const rows = csv.slice(1).map(l => { const f = parse(l); const o = {}; head.forEach((k, i) => o[k] = f[i]); return o; })
  .filter(r => r.date_found <= '2026-10-19');

const top = rows.filter(r => +r.deal_grade >= 9.5)
  .sort((a, b) => +b.pct_below_baseline - +a.pct_below_baseline);

// One row per destination for the headline table - a creator does not need Charleston four times.
const seen = new Set();
const showcase = top.filter(r => { if (seen.has(r.destination)) return false; seen.add(r.destination); return true; });

const fmtDate = (iso) => {
  const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${M[+iso.slice(5,7) - 1]} ${+iso.slice(8)}`;
};

const NAVY = '#153556', ORANGE = '#F37727', INK = '#1b2733', MUTED = '#6b7a88', GRID = '#e3e7ea';

const cards = showcase.map(r => `
  <div class="card">
    <div class="dest">${r.destination}</div>
    <div class="fare">$${r.fare_usd}</div>
    <div class="meta">${r.pct_below_baseline}% below normal &middot; ${fmtDate(r.date_found)}</div>
  </div>`).join('');

const chsDates = rows.filter(r => r.destination === 'Charleston' && +r.fare_usd === 98)
  .map(r => fmtDate(r.date_found));

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>RVA Cheap Flights — what we find</title>
<style>
  @page { size: letter portrait; margin: 0; }
  * { box-sizing: border-box; }
  body { margin:0; font-family: Arial, Helvetica, sans-serif; color:${INK}; background:#fff; }
  .sheet { width: 8.5in; margin: 0 auto; zoom: 0.96; }
  header { background:${NAVY}; color:#fff; padding: 20px 40px 18px; text-align:center; }
  header img { height: 150px; display:block; margin: 0 auto 10px; }
  h1 { font-size: 25px; margin: 0 0 7px; line-height:1.2; }
  .sub { font-size: 13px; opacity:.85; margin:0; }
  section { padding: 18px 40px 0; }
  h2 { font-size:16px; margin:0 0 4px; color:${NAVY}; }
  .note { font-size:12px; color:${MUTED}; margin:0 0 12px; line-height:1.45; }
  .grid { display:flex; flex-wrap:wrap; gap:10px; }
  .card { flex:1 1 calc(33.333% - 7px); border:1.5px solid ${GRID}; border-radius:10px; padding:12px 14px; }
  .dest { font-size:12.5px; color:${MUTED}; text-transform:uppercase; letter-spacing:.05em; }
  .fare { font-size:30px; font-weight:bold; color:${NAVY}; line-height:1.15; }
  .meta { font-size:11px; color:${ORANGE}; font-weight:bold; }
  .band { background:${ORANGE}; color:#fff; border-radius:10px; padding:16px 20px; margin-top:4px; }
  .band h3 { margin:0 0 5px; font-size:16px; }
  .band p { margin:0; font-size:12.5px; line-height:1.5; opacity:.96; }
  .pills { display:flex; gap:7px; margin-top:9px; }
  .pill { background:rgba(255,255,255,.22); border-radius:6px; padding:5px 11px; font-size:12px; font-weight:bold; }
  .two { display:flex; gap:26px; }
  .two div { flex:1; }
  .two h3 { font-size:11px; letter-spacing:.05em; text-transform:uppercase; color:${NAVY}; margin:0 0 6px; }
  .two p { font-size:12px; margin:0; line-height:1.5; color:${INK}; }
  footer { margin-top:16px; padding:12px 40px 18px; border-top:2px solid ${NAVY}; font-size:10px; color:${MUTED}; line-height:1.55; }
  footer b { color:${NAVY}; }
</style></head><body><div class="sheet">
<header>
  <img src="https://rvacheapflights.com/media/rva/brand/rva-logo-white.png" alt="RVA Cheap Flights">
  <h1>What we actually find out of Richmond</h1>
  <p class="sub">${rows.length} graded fares &middot; August 17 &ndash; October 19, 2026</p>
</header>

<section>
  <h2>The strongest fares we logged, one per destination</h2>
  <p class="note">Every one is a real round trip observed on the date shown, with how far below that route's normal price it landed.</p>
  <div class="grid">${cards}</div>
</section>

<section>
  <div class="band">
    <h3>Charleston hit $98 four separate times</h3>
    <p>A fare that keeps coming back is worth more to an audience than a one-off, because someone who misses it gets another chance.</p>
    <div class="pills">${chsDates.map(d => `<div class="pill">${d}</div>`).join('')}</div>
  </div>
</section>

<section>
  <h2>Why this isn't just another cheap-flights feed</h2>
  <div class="two">
    <div>
      <h3>Graded against its own route</h3>
      <p>$98 to Charleston and $575 to Rome aren't comparable numbers. Every fare is measured against what that specific route normally costs, so a genuinely unusual price is obvious and an ordinary one doesn't get dressed up as a deal.</p>
    </div>
    <div>
      <h3>Built for Richmond only</h3>
      <p>Every fare departs RIC. Nothing here asks your audience to drive to Dulles or Baltimore first, which is what makes it immediately usable for people who live here.</p>
    </div>
  </div>
</section>

<footer>
  <b>About these numbers.</b> ${rows.length} fares observed and graded between August 17 and October 19, 2026. Each is a real fare seen on the date listed; airfare moves, so prices are accurate as of that date, not today. 64 days is a real sample but not a seasonal one. Fare-level data available on request.<br><br>
  <b>Glenn Brown &middot; RVA Cheap Flights &middot; rvacheapflights.com &middot; 804-210-9657</b>
</footer>
</div></body></html>`;

fs.writeFileSync(path.join(DIR, 'RVA-what-we-find-creators.html'), html, 'utf-8');
console.log(`fares in sample: ${rows.length}`);
console.log(`showcase cards: ${showcase.length} — ${showcase.map(r => r.destination + ' $' + r.fare_usd).join(', ')}`);
console.log(`Charleston $98 dates: ${chsDates.join(', ')}`);
console.log('subscriber/reach claim present:', /subscriber|readers|audience of|followers reach/i.test(html));
console.log('baseline dollar figure printed:', /baseline/i.test(html));
console.log('wrote RVA-what-we-find-creators.html');
