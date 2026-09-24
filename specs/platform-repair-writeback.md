# A `--platform` repair does not write back, so the sweep keeps reporting it

Found by `producer-sweep`, 2026-09-24 14:17 ET, immediately after using the repair path for the
first time. Small, but it will bite the next person who repairs a half-published row.

## What happens

`post-ghl.js --platform fb` (content-kit `65031d0`) re-sends the failed half of a half-published
post. It requires `--no-calendar`, because the row is already booked and re-booking it would
double-post the half that landed.

`--no-calendar` means **nothing is written back to the calendar row.** So after a successful
repair:

- the post is genuinely live on Facebook,
- the row still reads `publish_state = 'partially_published'` with `facebook: failed`,
- and `health` therefore still returns it in `partial[]`.

Every sweep from then on prints it as *"still unrepaired"*. The obvious response to that line is
to repair it again — **which double-posts.** The tool that exists to prevent a double post sets up
a double post one step later.

Proven live: the PixFix 2026-09-23 reel published to Facebook at 18:10:55Z and the 14:17 sweep
still listed it. The row had to be corrected by hand in SQL before the 2:17 sweep came back clean
(2 half-published → 1).

## The fix

The repair needs a write-back step. `--platform` already knows the row it is repairing is not
`--entry` only because we force `--no-calendar` to avoid the booking path — the two concerns are
tangled. Separate them:

Give the **producer** edge function a `record_repair` action taking `entryId`, `platform`,
`postId`, `link`, and have `post-ghl.js --platform` call it after a successful send when given a
row id. It must:

1. Replace only that platform's element in `publish_results` — never the other one.
2. Preserve the original failure inside it (the hand-patch used `repairedFrom` plus a
   `repairNote`; keep that shape, the history is why anyone believes the row).
3. Recompute `publish_state` from the elements, and set `status='posted'` only when every
   platform reads `published`.
4. **Refuse to book anything.** This is the one thing that must not regress — it is a writeback,
   not a publish.

Then `--platform` can take a row id without `--no-calendar`, and the "requires --no-calendar"
guard becomes "refuses to BOOK", which is what was actually meant.

Note the deploy route: the Content Hub's Supabase is Lovable's backend, so an edge function ships
only via Lovable `send_message` — a git push deploys the frontend alone (memory
`edge-function-deploy-route`).

## How to prove it

Repair a half-published row end to end and then run, from `C:/Users/gbrow/Downloads/content-kit`:

    node health/sweep.mjs

The repaired row must be **gone from the half-published list with no SQL touched by hand**, and
`publish_results` must still carry the original failure inside the repaired element.

Make it fail too: point `record_repair` at a row with a `publish_ref` and no failed platform, and
it must refuse rather than overwrite a clean row.

## Meanwhile

Until this ships, a `--platform` repair is **two steps**, and the second one is not optional. The
worked example is the PixFix row `14b06b7f-31bb-4a06-a2a7-15e1c6f25970` — see the `repaired`,
`repairNote` and `repairedFrom` keys now on its Facebook element, and copy that shape.
