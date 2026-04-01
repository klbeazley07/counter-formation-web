# Strategic Layer & Implementation Roadmap

## How This System Avoids "Aesthetic Christianity"

Three structural safeguards:

1. **Content is the product; gear is the funnel.** The QR code on every garment points inward toward devotional content. The "You're wearing the armor" welcome state reinforces this.

2. **Devotional system demands participation, not consumption.** Each track builds toward a cumulative artifact. You cannot passively consume your way to a completed arrow log.

3. **Formation Shareable creates accountability through declaration.** Public sharing of personal reflections creates mild but real accountability.

## The Product → Content → Practice → Identity Loop

1. **Product** creates first contact (someone sees the hoodie on a friend)
2. **Content** delivers depth (QR code → devotional track)
3. **Practice** creates behavior change (write the declaration, build the arrow log)
4. **Identity** is the outcome (the product now means something different)
5. **Loop repeats** (cross-links lead to next track)

## Future Drop Roadmap

- **Drop 002.5:** Belt, Breastplate, Shoes products (content already built)
- **Drop 003:** Community Pillar (third Architecture of the Soul pillar)
- **Seasonal:** Advent, Lenten, back-to-school "Armor Up" challenge tracks
- **The Collective:** Women's line adaptation of Armor framework (Collective Sage palette)
- **Licensing:** Church/small group curriculum packages once all three pillars have deep content

---

## Implementation Roadmap

### Phase 1 — Visual Assets (Week 1–2)
- [x] Generate hero images via Ideogram
- [x] Color grade hero images as unified set
- [ ] Generate armor icon drafts in Ideogram
- [ ] Vector trace icons in Figma/Illustrator
- [ ] Build "Armor Up." typographic mark in Cormorant Garamond italic
- [ ] Generate Formation Shareable card backgrounds (3 variants × 2 sizes)
- [ ] Generate social media templates (4 grid + 4 stories)

### Phase 2 — Content (Week 2–4)
- [x] Write all 6 devotional tracks (36 days) — see ArmorOfGod_AllTracks.md
- [ ] Write landing page copy (all 7 sections)
- [ ] Write product descriptions for 3 hero SKUs
- [ ] Write "You're wearing the armor" QR welcome state copy
- [ ] Review and finalize all content

### Phase 3 — Site Build (Week 3–6)
- [ ] **Session 1:** Routes + Identity landing page (`/identity`)
- [ ] **Session 2:** Individual armor piece pages (`/identity/[piece]`)
- [ ] **Session 3:** ScriptureRef popover component (system-level)
- [ ] **Session 4:** Interactive widgets (6 total, one per track)
- [ ] **Session 5:** Formation Shareable card generator
- [ ] Wire Architecture of the Soul Identity panel → `/identity`
- [ ] Add Floating Challenge Trigger equivalent for Armor tracks

### Phase 4 — Product Development (Week 4–8)
- [ ] Finalize garment specs (Helmet Hoodie, Shield Tee, Sword Tee)
- [ ] Prepare print-ready artwork (front, back, sleeve)
- [ ] Generate and test QR codes → `/identity/[piece]` pages
- [ ] Order samples and photograph
- [ ] Set up Shopify collection for Drop 002

### Phase 5 — Launch Campaign (Week 6–10)
- [ ] Build email launch sequence (announce → countdown → drop → follow-up)
- [ ] Build social content bank (15+ posts minimum)
- [ ] Launch sequence: tease content first → announce products → drop day
- [ ] Post-launch: feature Formation Shareable cards as social proof
- [ ] Cross-link from 7-Day Challenge and Rule of Life pages

### Phase 6 — Iterate
- [ ] Monitor track engagement (completions, widget usage, shareable posts)
- [ ] Retrofit Formation Shareable into existing 7-Day Challenge and Rule of Life
- [ ] Plan Drop 002.5 (content-only pieces get products)
- [ ] Begin Community pillar planning (Drop 003)

---

## Claude Code Build Sessions — Quick Reference

**Session 1 prompt focus:** Routes, App.jsx updates, Identity landing page as long-scroll cinematic single-column. Reference: `spec-landing-page.md`

**Session 2 prompt focus:** Six individual `/identity/[piece]` pages using Rule of Life two-column layout. Content source: `ArmorOfGod_AllTracks.md`

**Session 3 prompt focus:** ScriptureRef reusable component. ESV default. Bible.com deep link. System-level (all pages).

**Session 4 prompt focus:** Six interactive widgets. One at a time. Start with Arrow Log (most complex). Reference existing Rule of Life widgets for pattern.

**Session 5 prompt focus:** FormationShareable canvas-based card generator. Text input → branded PNG at 1080×1920 and 1080×1080. Web Share API with fallback.

**Key files to reference in each session:**
- `App.jsx` — routing and main site structure
- `RuleOfLife.jsx` — two-column layout pattern, sticky sidebar, widget pattern
- `Architecture.jsx` — Architecture of the Soul slider, pillar click-through
- `SevenDayChallenge.jsx` — devotional content rendering, day navigation
- `ArmorOfGod_AllTracks.md` — all 36 days of formation content
- `spec-landing-page.md` — landing page architecture
- `spec-devotional-system.md` — component specs, widget specs, ScriptureRef spec
- `spec-visual-identity.md` — colors, typography, iconography, layout rules
