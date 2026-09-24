# RVA — re-arm the newsletter send-time validation

**Status:** not started · **Approved by Glenn 2026-09-24 11:49 ET** ("5) turn it back on")
**Priority:** high — it is the only thing standing between a broken build and subscribers' inboxes.

> Written here on 2026-09-24 13:1x ET by the implementation review. The handover was given to
> Glenn as an inline message at 11:50 ET and never written down; the session that held it has
> since closed. This file is that message, verbatim, plus its provenance.

---

## What is wrong

**FILE:** `C:\Users\gbrow\rva-flight-src\RVAFlight-Web-1\src\mastra\tools\newsletterTool.ts`
At ~line 1793 (shifted since the header change — grep for the comment):

```ts
// TEMPORARY: Allow testing with relaxed validation to verify email formatting
if (!validationResult.isValid) {
  logger?.warn('⚠️ ... proceeding for testing', ...);
  // Continue execution for testing - validation is too strict
}
```

It logs and proceeds. A newsletter that builds broken — no deals, missing prices, a template
failure — goes to subscribers anyway. Make it stop the send.

## The trap — DO NOT FLIP IT BLIND

Before changing behavior, run the **current** validator against the **last 3–5 real newsletters**
and report what it says. The header patterns now pass (commit `e0ec8b9`), but the deal-section
checks are untested in anger:

```
/Richmond → \w+/
/From \$\d+/
/Book This Deal/
/Weather & Travel Info/
/Destination Spotlight/
plus expectedDealCount
```

If any of those are stale the same way `View All Deals` was, re-arming stops every send tomorrow
morning and **RVA goes dark**.

**Fix any stale check FIRST, then re-arm. Report what you found either way.**

## What it must prove

Show a good newsletter **passing and sending**, and a deliberately broken one (strip the deals
block) being **refused**. Both, with output.

## Deploy

`npm run build` **before** `railway up` — `railway up` ships the working directory, not HEAD.
See memory `rva-repo-cleanup`.

Post a **Process Alert** when it lands, with the pushed SHA and both outputs.

---

*Delete this file once its Process Alert has passed a review (see `README.md`).*
