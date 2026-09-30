# PixFix: a website order has no order_class, and defaults to Asset

**Found 2026-09-29 on PF009, the first real paid order ever put through pixfixstudio.com.**
Glenn placed it; the whole path worked. This is the one gap it exposed.

**Owner: PRODUCER / code lane.** The Copywriter wrote this spec and changes no code. Glenn's
words: *"No option was provided for internal asset vs customer order. This is actually an internal
asset, but we need to look at that piece later on."* So it is **not urgent** — PF009's
classification happens to be correct. It is filed because the next order may not be.

---

## What happens now

`order.html` and `netlify/functions/create-checkout.js` collect nothing about order class. The
order arrives in the Studio and lands as **`Asset`**, whose card reads *"Internal asset — archived
to the library for reuse."*

That path is not the customer path. `Asset` routes the output into the asset library and skips the
sequence a paying customer needs: **Proofs Sent → Approve → Final Delivery**. Those buttons exist
on the order card and an `Asset` order never travels through them.

**So the first genuine customer order will silently take the internal route.** Nobody will be sent
proofs, nothing will be delivered, and the order will look complete from the inside. PixFix's whole
constraint is landing a first paid customer ([[growth-targets-q4]]) — losing that one to a default
would be an expensive way to find this out.

## Evidence

| | |
|---|---|
| Order | **PF009** — Website (PF), 1 character, "Lil Bobby" |
| Checkout session | `cs_live_b149C0rjifmNSx9WxyMaUSP45yG5z3TIxnSomo0Wa4aFSyLOseJH7acD9u` |
| Charge | `ch_3ULBYCC1xSoJPTqE1y3e6hpT` — $12.90 captured, succeeded |
| Amounts | subtotal $129.00 → total $12.90 (TEST90, 90% off, coupon `PvrWGc98`) |
| Description | `PixFix Single character turnaround — Standard (120 hr)` |
| State on arrival | `Asset` · In production · 0/8 shots · $0.00 spent |

## The fix — one of two, Glenn's call, not the Producer's

1. **Default `PF###` (website) orders to `Cust`.** Anything arriving through Stripe was paid for by
   somebody, so the customer path is the safe default. Internal assets are created by hand and can
   be set to `Asset` deliberately.
2. **Collect it at intake**, as a field on `order.html` — more explicit, more to build, and it asks
   a customer a question that means nothing to them.

Recommendation is 1. A paid checkout is strong evidence of a customer.

## Must prove before it is called done

Per charter §4 — state the outcome first, run the real path, capture evidence, show it can fail:

1. A new website order lands as **`Cust`**, and its card shows Proofs Sent / Approve / Final
   Delivery as the live sequence.
2. An order created by hand as an internal asset still lands as **`Asset`** — i.e. the change did
   not simply reclassify everything.
3. A row from the Studio DB showing `order_class` for both, pasted.

## What was proven working on this same order — do not regress it

- **The pre-pay intake scan gate holds.** Glenn: *"scan passed the image before going to
  payment."* The PF003 fix ([[pixfix-prepay-image-gate]]) is verified in production on real money
  for the first time.
- **The spend cap holds.** `0/8 shots · $0.00 spent` on arrival — generation stays behind Start
  Production and the $5/run cap.
- **The Stripe path is exact.** 90% applied to the cent, and the tier survived into the charge
  description.
