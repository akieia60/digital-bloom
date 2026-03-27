# Digital Bloom — Checkout Flow Spec
**Source:** Gamble's epiphany (March 23, 2026)
**Transcribed & cleaned up by:** Claude (Cowork)
**For:** OpenClaw to implement on digitabloom.com

> Gamble laid out a 5-screen step-by-step customization + checkout flow. The core idea: the customer sees their bloom at the top of every screen, and every choice they make shows up on the bloom in real time. No surprises at checkout — they see exactly what they're buying the whole time.

---

## THE CORE PRINCIPLE

**Live preview on every screen.** As the customer makes each choice — their name, the frame color, the overlay effect — the bloom video at the top of the screen updates to reflect it. By the time they hit "Buy," they've already seen the finished product multiple times.

---

## SCREEN 1 — PERSONALIZE IT

**Layout:**
- **Top half:** The chosen bloom video (playing, with no overlays yet)
- **Bottom half:** Three input fields:
  - **To:** (recipient's name)
  - **From:** (sender's name)
  - **Short Message:** (brief personal note)

**Real-time behavior:**
As the customer types in those fields, the text appears directly on the bloom in real time — they see exactly how it will look on the final product while they're typing it.

**CTA:** Next →

---

## SCREEN 2 — CHOOSE YOUR FRAME

**Layout:**
- **Top half:** The bloom — now showing the To/From/Message already entered in Screen 1
- **Bottom half:** Frame/border color selector

**Options:** A palette of frame/border styles and colors to choose from (gold, white, black, floral — TBD based on brand options)

**Real-time behavior:**
As the customer taps each frame option, the bloom preview at the top immediately shows what the bloom looks like with that frame applied. They're shopping with their eyes.

**CTA:** Next →

---

## SCREEN 3 — CHOOSE YOUR EFFECT

**Layout:**
- **Top half:** The bloom — now showing To/From/Message AND the chosen frame
- **Bottom half:** Effect overlay selector

**Options:**
- ⭐ Stars
- 🦋 Butterflies
- ❄️ Snowflakes
- 🎊 Confetti

**Real-time behavior:**
When the customer taps an effect, the bloom preview immediately shows the effect playing over the video — they see exactly how it looks with their specific bloom. The preview should show all three layers together: the bloom + the frame + the effect.

**CTA:** Next →

---

## SCREEN 4 — FINAL PREVIEW (Review Your Order)

**Layout:**
- **Full screen (or top half):** The complete, finished bloom — playing with ALL choices applied:
  - ✅ Their To/From/Message text
  - ✅ Their chosen frame
  - ✅ Their chosen effect

This is the "this is exactly what you're getting" moment. No hidden changes at checkout.

**Below the preview:** A clean summary of selections:
- To: [name]
- From: [name]
- Message: [text]
- Frame: [color/style chosen]
- Effect: [stars / butterflies / snowflakes / confetti]
- Price: [tier price]

**CTA:** Proceed to Checkout →

---

## SCREEN 5 — CHECKOUT

**Layout:**
- **Top:** Brief order summary (bloom thumbnail + price — keep it light, they've already seen the full preview)
- **Bottom:** Three payment options presented as clear, tappable choices:

### Option A — New Credit / Debit Card
> "Pay with a new card"
Standard card entry form (name, card number, expiration, CVV).
Powered by Stripe.

### Option B — Express Pay
> "Pay instantly"
One-tap payment buttons:
- Apple Pay
- Google Pay
- PayPal
- (Any other express options Stripe supports)

These should appear as large, familiar brand buttons. One tap = done.

### Option C — Use Credits / Buy Credits
> "Pay with Digital Bloom credits"
If the customer already has credits in their account, show their balance and let them apply it.
If they don't have enough (or any), give them the option to buy a credit bundle — they pick an amount, pay once, and can use the credits now or save them for future orders.

---

## FLOW DIAGRAM

```
[Product Page — Customer picks a bloom]
            ↓
[Screen 1] Personalize — To / From / Message
  → Live preview: text appears on bloom
            ↓
[Screen 2] Choose Frame / Border
  → Live preview: frame appears on bloom
            ↓
[Screen 3] Choose Effect — Stars / Butterflies / Snowflakes / Confetti
  → Live preview: effect plays over bloom
            ↓
[Screen 4] Final Preview — See everything together
  → Full playback of the finished product
            ↓
[Screen 5] Checkout
  → Option A: Credit/Debit Card (Stripe)
  → Option B: Express Pay (Apple Pay, Google Pay, PayPal)
  → Option C: Credits (use existing balance or buy a bundle)
```

---

## NOTES FOR OPENCLAW

- The bloom video should be the anchor of every screen — it stays at the top throughout the entire flow. The customer should never lose sight of their product.
- The live preview on each screen is the most important feature here. Gamble's whole vision is that the customer is never surprised — they see the product being built in front of them.
- The "credits" system in Screen 5 is a new concept — it needs a `user_credits` table in the website Supabase project (`yhdbeblowolfinxxhsnt`), not the PWA project.
- The effect overlay (Screen 3) means the video needs to support a compositing layer — stars/butterflies/snowflakes/confetti rendered on top of the bloom video in real time. This may be CSS animation, canvas overlay, or a pre-rendered overlay layer. Worth discussing the best technical approach before building.
- "Short message" on Screen 1 — establish a character limit (suggested: 100–120 characters max) so it fits cleanly on the bloom.
- Frame styles and effect details are not yet fully defined — AK and Gamble need to confirm the exact frame options and what the effect animations look like.

---

## OPEN QUESTIONS (AK to confirm)

1. What are the exact frame/border options? (Colors? Styles? Gold only for now?)
2. What do the effect animations look like — CSS particles? Pre-rendered overlays? Video compositing?
3. Is there a character limit on the short message?
4. For credits — what are the bundle sizes? (e.g., $5 = 3 credits, $10 = 7 credits?)
5. Does the To/From text always appear in the same position on the bloom, or does it vary by product?
6. Is there a "skip" option for any of the customization steps (e.g., no frame, no effect)?

---

*Spec written March 23, 2026 — based on Gamble's voice message, transcribed and structured by Claude (Cowork)*
