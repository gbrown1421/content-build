# A `--platform` repair does not write back, so the sweep keeps reporting it

Found by `producer-sweep`, 2026-09-24 14:17 ET, immediately after using the repair path for the
first time. Small, but it will bite the next person who repairs a half-published row.

> ## ★ CORRECTION, `producer-sweep` 2026-09-24 15:58 ET — THE FIX BELOW IS NOT ENOUGH
>
> This spec is still worth doing, but **as written it would look fixed and then regress within 15
> minutes.** The reason: a writeback to `publish_results` is not durable. **The reconciler owns that
> column and rebuilds it from the ORIGINAL GHL post every ~15 minutes.**
>
> The hand SQL patch this spec describes was erased 13 minutes after it was made:
>
> ```
> 18:10:55Z  FB repair post 6ab567a09a234aed09d95cee publishes (error: null)
> ~18:17Z    hand patch: repaired/repairNote/repairedFrom added, status='posted'
>            -> the 14:17 sweep came back clean, which is what closed this out
> 18:30:03Z  publish-reconcile OVERWRITES: status posted -> booked,
>            facebook back to FAILED, publish_state back to partially_published,
>            all three repair keys gone
> ```
>
> Evidence — `workflow_activity` on `14b06b7f-31bb-4a06-a2a7-15e1c6f25970`:
>
> ```
> publish-reconcile  2026-09-24 18:30:03.440178+00  posted -> booked
>   "Publish result (partially_published) — facebook: FAILED — Social Account token has expired…"
> ```
>
> The 15:54 ET sweep duly reported the row as *"still unrepaired"* again, 104 minutes after the reel
> went live. So the worked example at the bottom of this file **no longer exists on the row** — do
> not go looking for those keys to copy, they are gone.
>
> Meanwhile the Facebook reel is genuinely live. Read back from GHL at 15:57 ET:
>
> ```
> _id 6ab567a09a234aed09d95cee | platform facebook | deleted false
>   accountId   693e24210e00d05959dcf81b_…_987031901151211_page   (PixFix page)
>   publishedAt 2026-09-24T18:10:55.124Z
>   error       null
>   previewLink https://www.facebook.com/reel/2238329910046686/
>   parentPostId 6ab5650b2930c59be10da637
> ```
>
> ### What this changes about the fix
>
> `record_repair` as specified below patches the column the reconciler is about to rewrite. Patching
> it harder does not help. Two ways out, and the first is the right one:
>
> **(a) Make the reconciler aware of the repair post — recommended.** Persist the repair post id on
> the row (a `repair_refs` column, or append it to `publish_ref`) together with the platform it
> covers. The reconciler then polls the repair post for that platform instead of the dead original,
> and `publish_results` stays **derived from live GHL truth** rather than patched. Nothing to
> overwrite, so nothing regresses. It also self-heals: if the repair post is later deleted, the row
> correctly goes back to failed.
>
> **(b) Make the reconciler refuse to downgrade a `repaired` element.** Fewer moving parts, but it
> freezes a claim the reconciler can no longer verify, and a deleted repair post would leave the row
> permanently lying. Only take this if (a) proves impractical.
>
> ### The proof step below is also unsound
>
> "Run the sweep, the row must be gone" passes for up to 15 minutes on a patch that is about to be
> reverted — that is exactly how this got closed the first time. **Re-run the sweep AFTER a
> reconcile pass has touched the row**, i.e. confirm a newer `publish-reconcile` row exists in
> `workflow_activity` for that entry and the sweep is still clean. Anything less proves nothing.

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

~~Until this ships, a `--platform` repair is **two steps**, and the second one is not optional. The
worked example is the PixFix row `14b06b7f-31bb-4a06-a2a7-15e1c6f25970` — see the `repaired`,
`repairNote` and `repairedFrom` keys now on its Facebook element, and copy that shape.~~

**Superseded 15:58 ET — the second step does not hold.** The reconciler reverts it within 15
minutes (see the correction at the top), and the keys are no longer on that row.

So until this ships, a repaired row **will keep showing in the sweep's half-published list** and
there is no hand patch that survives. Handle it by record, not by SQL:

1. Repair with `post-ghl.js --no-calendar --brand <b> --platform fb|ig`, and **read the post back
   from GHL** (`ghl-social-post` `action:"get"` on the returned id) so `error: null` and
   `publishedAt` are on the record.
2. Mark the `content_misfires` row `resolved=true, reposted=true` and put the GHL post id and the
   preview link in `outcome`. **That table is not touched by the reconciler, so it is the only
   durable place the repair is recorded** — which is why the PixFix repair is still traceable at all.
3. Expect the calendar row to stay `partially_published`, and expect every sweep to list it until it
   ages out of the 7-day window. Before repairing anything on that list, **check
   `content_misfires` for a resolved row naming a GHL post id first** — that is now the real signal
   of whether a half-published row has already been fixed. Repairing on the sweep line alone is what
   double-posts.
