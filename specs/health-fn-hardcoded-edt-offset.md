# health edge function hardcodes EDT (-04:00) — false OVERDUE / false P0 since DST ended

Found by `ugh-charter-review-3x-daily`, 2026-11-01 16:38Z (11:38am EST). Owner: Producer
(pipeline code). Not applied from the review: Content Hub edge functions deploy only through
Lovable `send_message` on `f42abd5c` (memory `edge-function-deploy-route`), which a scheduled run
may not call.

## What is wrong, with evidence

`ugh-content-hub/supabase/functions/health/index.ts`

- line 163: `Date.parse(\`${d0}T${t0}-04:00\`)` (partial-publish age)
- line 190–191: comment "-04:00 is Eastern Daylight" and `Date.parse(\`${d}T${t}-04:00\`)` (overdue)

DST ended 2026-11-01 02:00 ET. From then on, every slot reads one hour earlier than it really is.

Live reading, `node health/channels.mjs --json`, checkedAt 2026-11-01T16:38:40Z:

- `p0: true`, raised solely by `overdue`:
  `UGH Tails EP 012 — episode announcement`, 2026-11-01 12:00, `lateHours: 1`,
  "GHL accepted it but it has not reported published".
- GHL (`ugh/ghl-post-status.mjs --hours 6`) has that post `6adf2f23f4da8d10f9f3929f` scheduled
  for **2026-11-01T17:00:00Z** = 12:00 EST. It was not late; it was 22 minutes early.

Effect until March: every slot on every brand flags OVERDUE and trips P0 an hour before it is
due, and a slot that is really 1h late reads 2h late (the 2-hour dead-slot rule).

## Fix

Replace both fixed offsets with a real America/New_York conversion. Deno supports Intl:

```ts
// ET wall-clock → epoch ms, correct across DST.
function etWallToMs(d: string, t: string): number {
  const guess = Date.parse(`${d}T${t}Z`);
  if (!Number.isFinite(guess)) return NaN;
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", hourCycle: "h23",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(new Date(guess)).map((x) => [x.type, x.value]));
  const asEt = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return guess + (guess - asEt);
}
```

- line 163 → `const dueMs0 = d0 ? etWallToMs(d0, t0) : NaN;`
- line 191 → `const dueMs = etWallToMs(d, t);` and drop the "-04:00 is Eastern Daylight" comment.

Grep the other functions for the same literal before closing: `grep -rn "\-04:00" supabase/functions`.

## What it must prove (charter §4)

1. Outcome that can fail: a 12:00 ET slot on 2026-11-02 reads due at 17:00Z, not 16:00Z; a
   12:00 ET slot on 2026-10-30 still reads 16:00Z.
2. Deploy through Lovable `send_message` on `f42abd5c`; a git push alone does not deploy it.
3. Proof: `node health/channels.mjs --json` at ~11:30 EST with a 12:00 slot pending shows it NOT
   in `overdue`.
4. Can fail: the old `-04:00` line, given the same row after DST, does put it in `overdue`
   (the 2026-11-01 16:38Z reading above is that failure, already captured).

Post a Process Alert with the Lovable deploy evidence.
