# QA FAILURE CASE — BizSense pitch, 2026-10-20

**Severity: complete failure.** Six unsupported claims in one email plus two in the attached PDF,
and a numerical mismatch between them. Caught by Glenn before sending.

**What makes this the worst one so far:** the Copywrite Master Operating Prompt was saved to this
directory **the same day**, and §15 lists two of my exact sentences as its examples of what not to
write. I read the standard, stored it, pointed the charter at it, and then committed the errors it
names — within hours.

---

## The claims, and what the data actually supports

| What I wrote | What the dataset establishes |
|---|---|
| "Richmond companies are **overpaying** on the exact routes **they fly most**" | 10 routes **we selected** as business-relevant averaged above **their own** normal RIC price. Nothing about what companies fly, and nothing about overpaying. |
| "most are **picking an airport on instinct** rather than numbers" | Nothing. No source of any kind. Invented. |
| "the corridor routes **companies actually fly**" | Our selection, restated as corporate booking behavior. |
| "very likely **paying a premium to depart locally**" | Would require RIC vs IAD/DCA/BWI. We compared each RIC route **to itself**. |
| "a **growing line item** for a lot of local employers" | Plausible. Not established. Stated as fact. |
| "the ten routes **Richmond companies actually fly**" | Same as above, in the attachment sentence. |
| "Las Vegas prices like a leisure route **because it mostly is one**" | A causal claim. The data shows a price, not a reason. |
| PDF headline: "Seven of the ten routes **Richmond companies fly most**" | Our selection. |
| PDF: "the ones **companies rarely book**" | Our selection, again as booking behavior. |
| Email said **258** fares; PDF said **255** | The PDF read a stats file cut at Oct 19; the email used the live count. |

---

## The standard named these before I made them

§15, verbatim, written by Glenn and stored by me hours earlier:

> Do not turn "26% above that route's normal observed price" into **"Richmond companies are
> overpaying 26%."**
>
> Do not turn "Several business-relevant routes performed poorly" into **"The routes companies fly
> most are the worst."**
>
> Do not confuse **relative-to-route-normal pricing** with **airport-to-airport price
> comparisons.**

I wrote all three.

---

## Root cause

**Not ignorance of the rule. A missing step between drafting and presenting.**

The errors share one mechanic: each converts a *selection* or a *measurement* into a *behavioral
or comparative claim* because the stronger version reads better. "Business-relevant routes we
chose" is accurate and flat. "The routes companies fly most" is punchy and false. Every single
substitution moved in the direction of a better sentence.

That is §42 exactly — choosing the dramatic version over the defensible one — and it happened
because nothing forced me to check each claim against a source before presenting the draft.
Reading the standard did not prevent it. Only a mechanical pass would have.

**Secondary cause of the 255/258 mismatch:** the PDF and the email drew from two different
snapshots. Any figure appearing in both a document and its covering email has to come from one
source computed once.

---

## What changed as a result

1. **Email replaced with Glenn's rewrite.** Every claim now names its own limits: "several routes
   important to business travel," "10 business-relevant routes," "compared with what that specific
   route normally costs."
2. **PDF headline** → "Seven of 10 business-relevant routes came in above what those routes
   normally cost."
3. **PDF comparison line** → "Several leisure-oriented routes produced stronger values than the
   business-relevant routes in this analysis."
4. **PDF footer** now states plainly: *"The 10 routes shown were selected as business-relevant for
   this analysis; the dataset does not identify which routes any company books."*
5. **One snapshot.** `baseline-stats.json` is cut at Oct 19 so the PDF, the email and the Axios
   pitch all say 255 and every percentage derives from the same 255 fares.
6. **VERIFICATION NOTES added to the pitch** per §35 — each claim with its source, including the
   explicit line that the 10-route selection is ours.

---

## The check that would have caught it

Before presenting any external copy, take each factual-sounding sentence and ask: **what table,
row or primary source makes this true?** If the answer is "it follows from" rather than a source,
it is an inference and must be labeled or cut.

Three tells, all present here:
- A sentence about **what someone else does** ("companies fly," "companies book," "picking an
  airport") when the data only describes prices.
- A **comparative** ("premium to depart locally") when the measurement was internal to one route.
- A **causal** ("because it mostly is one") when the data is a single number.

This is §34's pre-flight list. It exists. I did not run it.
