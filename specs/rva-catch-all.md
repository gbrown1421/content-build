# SPEC — RVA: unmatched URLs show Mastra's welcome page

**Raised 2026-09-22. Not started. Lower priority than `rva-newsletter-header.md`** — small and
cheap, and nobody may ever type the URL. Do not let it displace content with a slot time.

## Symptom, verified signed-out

    /newsletter                -> HTTP 200, 2465 bytes, "Welcome to Mastra"
    /newsletter/domestic       -> same
    /newsletter/international  -> same

## Diagnosis — it is NOT a stale route

There is **no `/newsletter` route in `src/`** and there never was. Every "newsletter" hit in the
source is the EMAIL tool (`src/mastra/tools/newsletterTool.ts`), not a web path.

**Any unmatched URL falls through to Mastra's built-in welcome screen.** `/newsletter` is just the
one Glenn happened to try. Mistype the address or follow a stale link from an old caption and a
stranger lands on the framework's developer page with no RVA branding on it.

So the fix is a **catch-all**, not a deletion.

## Where

`C:\Users\gbrow\rva-flight-src\RVAFlight-Web-1\src\mastra\index.ts`
`apiRoutes` opens line 175, **closes line 3106** (`],`); server block closes 3107. Last entry is
`/api/stripe/webhook`, ending 3105. Add the catch-all as the **LAST element, immediately before
3106**. Order matters — it must not shadow the ~25 real routes above it (`/`, `/deals`,
`/r/subscribe`, `/d/:id`, `/n/:id`, `/now`, `/media/*`, `/attached_assets/*`, `/public/*`,
`/health`, `/api/*`).

## Pattern to copy — already in the file at line 182

    path: "/join",
    method: "GET",
    createHandler: async () => {
      return async (c) => c.redirect("/deals", 301);
    },

**Glenn's decision: send unmatched paths to `/deals`**, the same destination `/join` uses. He
chose this over a 404 page — do not substitute one.

## Four traps

1. A greedy catch-all swallows `/media/*`, `/attached_assets/*`, `/public/*`, `/d/:id`, `/n/:id`
   and `/api/*`. Verify each still works, not just the homepage.
2. `301` is permanent and browsers cache it hard. Prefer `302` unless certain.
3. **Do NOT redirect `/api/*`** — an API path must return a JSON 404, never an HTML redirect, or
   clients silently get a page where they expect data.
4. `railway up` ships the WORKING DIRECTORY, not HEAD (memory `rva-repo-cleanup`).

## The stale build — trap 4 with teeth

`.mastra/output/mastra.mjs` is dated **30 Aug**, twelve days older than `src/mastra/index.ts`
(12 Sep). It still contains `/newsletter/domestic` and `/newsletter/international`, which survive
only there and in `index.ts.bak`. Those paths return the Mastra splash live, so they are genuinely
dead — but if that stale artifact ships, you deploy August code and could resurrect them.
**Rebuild before deploying and confirm what you actually shipped.**

## Prove it — fetch signed-out after deploy

    /newsletter   -> redirects to /deals, NOT "Welcome to Mastra"
    /             -> homepage unchanged
    /deals        -> unchanged
    /r/subscribe  -> unchanged
    /health       -> still JSON
    one /media/*  -> still 200, right bytes

And show it fails correctly: `/zzzz` redirects; `/api/zzzz` does NOT return HTML.

Post a Process Alert when it lands, with the deployed evidence.
