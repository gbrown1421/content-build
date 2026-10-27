# Rotating the 15 secrets leaked in `.rv.json`

**Found 2026-10-26.** `.rv.json`, a complete environment dump, was committed to
`gbrown1421/rva-flight` on 2026-08-31 in `d510a99` and pushed to `origin/main`. It was untracked
the same day in `a26670a`, which removed it from HEAD but **not from history** — the blob still
resolves at `d510a99`. Exposure window: ~8 weeks. OpenAI's scanner found their key in it and
disabled it; everything else in the file is still live.

The hole is already closed: `.rv.json` is gitignored at `.gitignore:33`, so `git add -A` cannot
sweep it back in. **Rotation is the fix. History cleanup is optional housekeeping** — once a
credential is rotated the leaked copy is worthless.

Contained to this one repo. ugh-content-hub, desire-confidant-craft, content-build,
scheduled-tasks, content-kit and brandbybrown-site are all clean for these patterns.

## Order, by blast radius

### 1. STRIPE_SECRET_KEY — `sk_live_51…fj3YTB`  ← do this first
Live money, and **one Stripe account serves RVA and PixFix** (memory `stripe-shared-account`).
- Roll at dashboard.stripe.com → Developers → API keys → roll the secret key.
- **Update in TWO places:** Railway `balanced-purpose/production`, and
  `C:\Users\gbrow\ugh-content-hub\.env`.
- Also check the Studio/Hub Lovable projects for a Stripe secret if PixFix checkout reads its own.
- Verify: an RVA `/r/subscribe` checkout session still opens, and a PixFix order still takes payment.
- `STRIPE_WEBHOOK_SECRET` (`whsec_m2rU…1svgGN`) is separate — roll it in the same visit under
  Developers → Webhooks, and update Railway.

### 2. DATABASE_URL + NEON_API_KEY
`NEON_API_KEY` (`napi_qccwi…zq30lk`) can create and delete databases, not just read them.
- Runbook already exists: memory `neon-credential-rotation-runbook`.
- Update Railway `DATABASE_URL`. Anything else holding the old connection string will fail closed.
- Verify: the RVA app boots and `/health` answers.

### 3. GOOGLE_REFRESH_TOKEN (+ GOOGLE_CLIENT_SECRET)
A refresh token does not expire — it is the longest-lived item on this list.
- Revoke at myaccount.google.com → Security → Third-party access, then re-issue.
- Verify: the Gmail deal-alert ingest still pulls.

### 4. SENDGRID_API_KEY and RESEND_API_KEY
Both can send mail as you, which is a deliverability and reputation risk, not just a cost one.
- Resend sends the RVA newsletter (memory `rva-subscriber-list`).
- Roll `RESEND_WEBHOOK_SECRET` at the same time.

### 5. CONTENT_PIPELINE_KEY — `cpk_067d67…8fc2d2`  ← breaks publishing if done carelessly
**This one is consumed in FOUR places. Miss one and content goes dark silently.**
1. Railway `balanced-purpose/production`
2. `C:\Users\gbrow\ugh-content-hub\.env`
3. The Supabase edge-function secret for Content Hub `f42abd5c` (every function reads it from
   `Deno.env` — `producer`, `health`, `media-url`, `ghl-social-post`)
4. **Hardcoded inside four `pg_cron` job commands.** SQL is below.

### 6. The rest
`BEEHIIV_API_KEY`, `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`. Railway only.

## The four cron jobs — paste once, with the new key substituted

Run against Content Hub `f42abd5c`. Replace `NEWKEY` in all four, nothing else changes.

```sql
-- jobid 2  ugh-publish-reconcile   */15 * * * *
-- jobid 13 ugh-producer-sweep      0 12,14,16,18,20,22,0,2 * * *
-- jobid 14 ugh-daily-driver-v2     0 10,11 * * *
-- jobid 15 ugh-library-cycle       0 9 * * 1
update cron.job
   set command = replace(command,
       'OLDKEY', 'NEWKEY')
 where jobid in (2, 13, 14, 15);

-- then confirm none still carries the old value:
select jobid, jobname,
       command like '%OLDKEY%' as still_leaked
from cron.job order by jobid;
```

Every row must read `still_leaked = false`.

## Verify the window

The credentials were reachable for eight weeks, so this is a check, not a hypothetical:
Stripe payments and payouts, OpenAI usage, and Neon compute hours for anything unrecognized
since 2026-08-31.

## After rotation

`OPENAI_API_KEY` is item 7 only because nothing else depends on it — but it is what is holding
the two UGH Friday reels (30 Oct "the dog had other plans", 6 Nov "it said fragile"). Both are
staged: stills fetched, `spec.json` validated, `vo-script/` written. They build with one command
each once a key exists. Memory `openai-key-dead-railway`.

---

## Correction, 2026-10-27

The first version of this file pasted the **literal** `CONTENT_PIPELINE_KEY` into the SQL above and
was committed and pushed — the same mistake this document exists to clean up. It is now `OLDKEY`,
to be substituted at the terminal and never written into a tracked file. Caught by scanning all
six repos for the literal value rather than the variable name; the variable name is harmless, the
value is not.

**Substitute both placeholders yourself when you run it. Do not paste either value back into any
file in a repo.**
