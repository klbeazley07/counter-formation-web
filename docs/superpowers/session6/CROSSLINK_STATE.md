# CROSSLINK_STATE.md
## Session 6 Cross-Link Audit — Agent 0-C
**Date:** 2026-04-02

---

## 1. WIDGET CROSS-LINKS (Identity → Rule of Life)

### Summary Table

| Widget | Armor Piece | Expected Link | Current State |
|---|---|---|---|
| ExamenWidget | Belt of Truth | `/rule-of-life/presence` | MISSING — no rule-of-life link |
| PeacePauseWidget | Gospel of Peace | `/rule-of-life/sabbath` | MISSING — no rule-of-life link |
| ArrowLogWidget | Shield of Faith | `/rule-of-life/community` | MISSING — no rule-of-life link |
| FirstFifteenWidget | Helmet of Salvation | `/rule-of-life/scripture` | MISSING — no rule-of-life link |
| VerseTrackerWidget | Sword of the Spirit | `/rule-of-life/scripture` | MISSING — no rule-of-life link |
| DeclarationWidget | Breastplate | none expected | n/a — no link needed |

### Detail

**ArrowLogWidget** (`src/widgets/ArrowLogWidget.jsx`)
- No `/rule-of-life/` link anywhere in file.
- File contains only widget UI: header, entry form, entry list.
- Expected wiring: Shield of Faith → `/rule-of-life/community`

**DeclarationWidget** (`src/widgets/DeclarationWidget.jsx`)
- No `/rule-of-life/` link anywhere in file.
- No link expected per spec.

**ExamenWidget** (`src/widgets/ExamenWidget.jsx`)
- No `/rule-of-life/` link anywhere in file.
- Expected wiring: Belt of Truth → `/rule-of-life/presence`

**FirstFifteenWidget** (`src/widgets/FirstFifteenWidget.jsx`)
- No `/rule-of-life/` link anywhere in file.
- Expected wiring: Helmet of Salvation → `/rule-of-life/scripture`

**PeacePauseWidget** (`src/widgets/PeacePauseWidget.jsx`)
- No `/rule-of-life/` link anywhere in file.
- Expected wiring: Gospel of Peace → `/rule-of-life/sabbath`

**VerseTrackerWidget** (`src/widgets/VerseTrackerWidget.jsx`)
- No `/rule-of-life/` link anywhere in file.
- Expected wiring: Sword of the Spirit → `/rule-of-life/scripture`

---

## 2. RULE OF LIFE → IDENTITY CARDS

### Current State
RuleOfLife.jsx (`src/RuleOfLife.jsx`) does **NOT** currently contain any "Connected Armor" cards, `/identity` cross-links, or sidebar cards linking to identity pages.

### Existing Sidebar Structure
The sidebar (`div.rl-sidebar`) at line 921 contains only two sections:
1. **Key Scriptures** — rendered as `.rl-scripture` blocks
2. **Reflection** — rendered as `.rl-reflect-q` blocks inside `.rl-reflections`

```jsx
<div className="rl-sidebar">
  <div className="rl-section">
    <p className="rl-sec-label">Key Scriptures</p>
    {data.scriptures.map((s, i) => (
      <div key={i} className="rl-scripture">
        <p>"{s.t}"</p>
        <cite><ScriptureRef reference={s.r} text={s.t} /></cite>
      </div>
    ))}
  </div>
  <div className="rl-section">
    <p className="rl-sec-label">Reflection</p>
    <div className="rl-reflections">
      {data.reflection.map((q, i) => (
        <div key={i} className="rl-reflect-q">{q}</div>
      ))}
    </div>
  </div>
</div>
```

### Existing "Go Deeper" Book Card Pattern (GoDeeperSection)
The closest existing "further reading" card pattern is the `.rl-book` card used in `GoDeeperSection` (lines 554–599). This is the pattern to **match** for new Connected Armor cards:

**JSX render:**
```jsx
<Link key={i} to={`${RULE_BASE}/${rhythm}/book/${i}`} className="rl-book">
  <img src={b.cover} alt={b.title} className="rl-book-img"
    onError={e => { e.target.style.background = "#17140F"; e.target.style.opacity = "0.4"; }} />
  <div className="rl-book-body">
    <div>
      <p className="rl-book-title">{b.title}</p>
      <p className="rl-book-author">{b.author}</p>
      <p className="rl-book-desc">{b.desc}</p>
    </div>
    <span className="rl-book-cta">
      Why we recommend it
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M1 5h8M5.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    </span>
  </div>
</Link>
```

**CSS class definitions (lines 754–763):**

| Class | Style |
|---|---|
| `.rl-book` | `background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; overflow: hidden; transition: border-color .3s, transform .3s; text-decoration: none; display: grid; grid-template-columns: 120px 1fr; cursor: pointer; align-items: stretch;` |
| `.rl-book:hover` | `border-color: rgba(201,168,76,0.45); transform: translateX(4px);` |
| `.rl-book-img` | `width: 100%; height: 100%; min-height: 130px; object-fit: cover; display: block; filter: grayscale(.35); opacity: .8;` |
| `.rl-book-body` | `padding: 1rem 1.25rem; display: flex; flex-direction: column; justify-content: space-between; min-height: 130px;` |
| `.rl-book-title` | `font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #FAF8F5; margin-bottom: .25rem; line-height: 1.2;` |
| `.rl-book-author` | `font-size: 9px; letter-spacing: .25em; text-transform: uppercase; color: rgba(201,168,76,0.65); margin-bottom: .5rem;` |
| `.rl-book-desc` | `font-family: 'Cormorant Garamond',serif; font-size: 13px; line-height: 1.6; color: rgba(250,248,245,0.45); margin-bottom: .75rem; flex: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;` |
| `.rl-book-cta` | `display: inline-flex; align-items: center; gap: 6px; font-size: 8px; letter-spacing: .28em; text-transform: uppercase; color: rgba(201,168,76,0.7);` |

**Section label pattern:**
```jsx
<p className="rl-sec-label">Connected Armor</p>
```
CSS: `font-size: 9px; letter-spacing: .42em; text-transform: uppercase; color: #C9A84C; margin-bottom: 1.25rem; padding-bottom: .75rem; border-bottom: 1px solid rgba(255,255,255,0.06);`

**Link component used:** React Router `<Link>` (imported at top of file). The `RULE_BASE` constant is `/rule-of-life`. For Connected Armor cards linking to `/identity`, a `<Link to="/identity/[slug]">` pattern should be used.

**Section container pattern:** wrap in `<div className="rl-section">` (applies `margin-bottom: 3rem`). Add inside `.rl-sidebar` or in the main content flow.

---

## 3. SEVEN-DAY CHALLENGE — Day 7 Completion State

### Current State
SevenDayChallenge.jsx does **NOT** have any cross-link to `/identity` in the Day 7 completion state.

### Existing Day 7 Completion JSX (lines 1081–1096)
The Day 7 end section (`d.n === 7`) at the bottom of the devotion content reads:

```jsx
{d.n === 7 && (
  <div className="cf7-next-step">
    <p className="cf7-dev-sec-lbl">This Is Not The End</p>
    <div className="cf7-dev-body" style={{ fontSize: "clamp(15px,3.6vw,18px)" }}>
      <p>This week was not meant to be a spike of inspiration. It was meant to begin a different pattern.</p>
      <p>Keep the rule. Protect your attention. Stay in community. Return to these seven days when the pace picks up and the drift starts again.</p>
      <p>Counter Formation is not a moment. It is a way of living.</p>
    </div>
    <Link to={CHALLENGE_BASE} className="cf7-next-step-cta">
      Return to the Challenge
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M1 6h10M6.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </Link>
  </div>
)}
```

The `CHALLENGE_BASE` constant is `/7-day-challenge` (line 7).
The `cf7-next-step-cta` class is the CTA link style to follow for any new `/identity` link added here.
There is currently **one CTA** — "Return to the Challenge" — linking back to `CHALLENGE_BASE`. No `/identity` link exists.

---

## 4. ARCHITECTURE.JSX — Identity Panel Link

### Current State
The Identity panel in Architecture.jsx links to `/identity` via the PILLARS data object.

**PILLARS definition (line 11):**
```js
{ num: "I", slug: "identity", title: "Identity", route: "/identity",
  img: "/Identity_wide.png",
  // ...
  cta: "Enter Identity",
  // ...
}
```

**CTA Button/Link JSX (lines 839–846):**
```jsx
<Link to={p.route} className="arch-cta-enter">
  {p.cta}
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M1 6h10M6.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
</Link>
```

For the Identity panel, `p.route` resolves to `/identity` and `p.cta` resolves to `"Enter Identity"`.

The Identity panel links directly to `/identity` (the `IdentityPage` component). It does **NOT** link to a `CampaignPage` component directly — `IdentityPage` is defined at line 993 as a thin wrapper:
```js
export function IdentityPage() { return <CampaignPage pillar={PILLARS[0]} />; }
```
So the route `/identity` renders `CampaignPage` with the Identity pillar, but the link target is `/identity`, not a component reference.

---

## 5. IDENTITY.JSX — CTA Section G Tertiary Link

### Current State
Identity.jsx's `CTASection` (Section G, lines 1868–1929) does **NOT** have a tertiary link to `/7-day-challenge`.

### Full CTASection JSX
```jsx
function CTASection() {
  return (
    <section
      className="py-24 md:py-48 px-4 text-center"
      style={{ backgroundColor: C.heroBg }}
    >
      <div className="max-w-2xl mx-auto">

        <div className="flex flex-col items-center gap-4 mb-20">
          {/* PRIMARY CTA */}
          <Link
            to="/identity/belt-of-truth"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-[11px] tracking-[0.28em] uppercase transition-all hover:scale-105"
            style={{
              backgroundColor: C.gold,
              color: "#0A0A0A",
              boxShadow: `0 4px 32px ${C.gold}44`,
              textDecoration: "none",
            }}
          >
            Begin Formation
            <ArrowRight size={14} />
          </Link>
          {/* SECONDARY CTA */}
          <a
            href={SHOPIFY_URL}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-[11px] tracking-[0.28em] uppercase transition-all hover:bg-white/5"
            style={{ color: C.gold, border: `1px solid ${C.gold}44`, textDecoration: "none" }}
          >
            Explore the Collection
          </a>
        </div>

        {/* Scripture + footer mark ... */}
      </div>
    </section>
  );
}
```

There are **two CTAs** currently:
1. **Primary** — `<Link to="/identity/belt-of-truth">` — "Begin Formation" (gold filled pill)
2. **Secondary** — `<a href={SHOPIFY_URL}>` — "Explore the Collection" (gold bordered pill)

There is **no tertiary link** to `/7-day-challenge`. The slot is open for addition after "Explore the Collection".

---

## WIRING STATUS SUMMARY

### Already Wired
- Architecture.jsx Identity panel → `/identity` via `<Link to={p.route}>` ✓
- RuleOfLife.jsx floating trigger → `/7-day-challenge` via `<Link to="/7-day-challenge">` ✓
- SevenDayChallenge.jsx Day 7 bottom → `CHALLENGE_BASE` (return link) ✓

### Missing (need to be added)
1. **ExamenWidget** — no link to `/rule-of-life/presence`
2. **PeacePauseWidget** — no link to `/rule-of-life/sabbath`
3. **ArrowLogWidget** — no link to `/rule-of-life/community`
4. **FirstFifteenWidget** — no link to `/rule-of-life/scripture`
5. **VerseTrackerWidget** — no link to `/rule-of-life/scripture`
6. **RuleOfLife.jsx sidebar** — no "Connected Armor" cards linking to `/identity` pages
7. **SevenDayChallenge.jsx Day 7** — no link to `/identity` in completion block
8. **Identity.jsx CTASection** — no tertiary link to `/7-day-challenge`
