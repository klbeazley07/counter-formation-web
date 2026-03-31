# Rule of Life — Rhythm Card Summary Sentences Update

## Overview

Add an impactful summary sentence to each of the five Rule of Life rhythm cards in the RuleOfLifeSection on the homepage. These appear on hover (desktop) and are always visible at reduced opacity (mobile).

## File to Edit

`App.jsx` — the RuleOfLifeSection component, specifically the rhythm card grid.

Also reference `RuleOfLife.jsx` for the data structure if the rhythm data object lives there.

## The Five Summary Sentences

Add a `summary` field to each rhythm in the data:

```
presence:  "Learning to abide in Christ so deeply that His presence overflows from your life into everything you touch."
scripture: "The world has a script for your day. So does God. Only one of them is true."
prayer:    "You were never meant to figure this out alone. Prayer is the admission that you can't."
sabbath:   "A life that cannot stop is a life that does not trust. Sabbath is how you prove you believe God is in control."
community: "You cannot be formed alone. The practices that change your life require people who will hold you to them."
```

## Desktop Behavior (min-width: 768px)

- **Default state:** Summary sentence is hidden (opacity: 0, translateY: 8px)
- **Hover state:** Summary fades in beneath the existing "before" tagline phrase (e.g., "Attention before God")
  - Transition: opacity 0 → 1, translateY 8px → 0
  - Duration: 300ms ease-out
  - The existing tagline (e.g., "Attention before God") remains visible; the summary appears directly below it
- **Card behavior on hover:** Image dims slightly further (if not already), creating more contrast for the text

## Mobile Behavior (max-width: 767px)

- Summary sentence is **always visible** beneath the "before" tagline
- Opacity: 0.45 (reduced so it doesn't compete with the rhythm name)
- No animation, no hover interaction
- Should not make the card feel crowded — if needed, slightly increase card height on mobile to accommodate

## Typography

- **Font:** Cormorant Garamond, italic
- **Size:** ~13px desktop, ~12px mobile (slightly smaller than the "before" tagline)
- **Color:** Ivory (`#FAF8F5`)
- **Line height:** 1.5
- **Max width:** Constrain to card width with ~12px horizontal padding so text doesn't touch edges

## Layout Position

The summary sits in this hierarchy within each card:

```
[Card]
  [Image with overlay]
  [RHYTHM 01 — eyebrow label]
  [PRESENCE — rhythm name, large]
  [Attention before God — tagline, existing]
  [Summary sentence — NEW, below tagline]
```

## Important Constraints

- Do NOT change the existing card dimensions, image treatment, or hover animations that are already in place
- Do NOT change the "before" tagline text or styling
- The summary sentence is an additive layer, not a replacement
- Keep the card clickable/tappable — the summary should not interfere with the link to the rhythm page
- The summary text should not wrap to more than 2–3 lines on desktop or 3–4 lines on mobile

## CSS Approach

Add a `.rhythm-card-summary` class (or equivalent styled element) with:

```css
/* Desktop default */
.rhythm-card-summary {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 13px;
  line-height: 1.5;
  color: rgba(250, 248, 245, 0);
  transform: translateY(8px);
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
  padding: 0 12px;
  max-width: 100%;
}

/* Desktop hover */
.rhythm-card:hover .rhythm-card-summary {
  opacity: 1;
  color: rgba(250, 248, 245, 0.85);
  transform: translateY(0);
}

/* Mobile — always visible at reduced opacity */
@media (max-width: 767px) {
  .rhythm-card-summary {
    opacity: 1;
    color: rgba(250, 248, 245, 0.45);
    transform: translateY(0);
    font-size: 12px;
  }
}
```

Adapt this to however the existing cards are styled (Tailwind classes, inline styles, or CSS-in-JS). Match the existing pattern in the codebase.

## Test Checklist

- [ ] Desktop: summary hidden by default, fades in on hover with 300ms transition
- [ ] Desktop: summary appears below the "before" tagline, does not overlap other elements
- [ ] Mobile: summary always visible at ~45% opacity
- [ ] Mobile: cards are not visually crowded — text has room to breathe
- [ ] All five cards show their correct summary sentence
- [ ] Card links still work (clicking navigates to rhythm page)
- [ ] No layout shift on hover (card dimensions stay stable)
