/*
 * ApparelLane -- a curated three-product band that lives BELOW the workspace
 * dashboard. On desktop it sits below the workspace fold. On mobile it's the
 * final stacked section before the MobileTabBar.
 *
 * Selection is hardcoded for v1; each product is tagged to a formation area so
 * a future revision can select dynamically from the profile's formation edge,
 * top gift, or active armor piece. TODO: wire to the Shopify Storefront API
 * for live inventory and pricing.
 *
 * Mobile uses horizontal scroll with scroll-snap so each card centers as the
 * user swipes. Cards are 78vw on mobile so the next one peeks at the right edge.
 */

import EyebrowLabel from "../primitives/EyebrowLabel";

const FRUIT_LABELS = {
  love: "love", joy: "joy", peace: "peace", patience: "patience",
  kindness: "kindness", goodness: "goodness", faithfulness: "faithfulness",
  gentleness: "gentleness", self_control: "self-control",
};

const ARMOR_LABELS = {
  "belt-of-truth": "Belt of Truth",
  "breastplate-of-righteousness": "Breastplate of Righteousness",
  "gospel-of-peace": "Gospel of Peace",
  "shield-of-faith": "Shield of Faith",
  "helmet-of-salvation": "Helmet of Salvation",
  "sword-of-the-spirit": "Sword of the Spirit",
};

/*
 * Curated set. tags drive the eyebrow line on each card.
 * tier "available" = live SKU; tier "soon" = ships shopUrl to the collection.
 */
const CURATED_APPAREL = [
  {
    slug: "everyday-tee",
    name: "Everyday Tee",
    image: "/Tshirt_Studio.png",
    copy: "Premium soft-wash cotton. A daily anchor for the work.",
    eyebrow: "The Foundation",
    shopUrl: "https://shop.counterformed.com/products/everyday-tee",
    tags: { rule: "presence" },
  },
  {
    slug: "technical-hoodie",
    name: "Technical Hoodie",
    image: "/Hoodie_white.png",
    copy: "Heavyweight performance tech. Built for training and discipline.",
    eyebrow: "Battle the Drift",
    shopUrl: "https://shop.counterformed.com/products/counter-formation-technical-hoodie",
    tags: { fruit: "self_control", armor: "breastplate-of-righteousness" },
  },
  {
    slug: "trucker-hat",
    name: "Trucker Hat",
    image: "/Trucker Hat_full.png",
    copy: "Structured front. Mesh back. A worn-in reminder of who you are.",
    eyebrow: "Daily Wear",
    shopUrl: "https://shop.counterformed.com/products/counter-formation-trucker-hat",
    tags: { rule: "rest" },
  },
];

function buildUTM(slug, source = "dashboard") {
  const params = new URLSearchParams({
    utm_source: "counterformed.com",
    utm_medium: "dashboard",
    utm_campaign: "apparel_lane",
    utm_content: slug,
    utm_term: source,
  });
  return params.toString();
}

function urlWithUtm(url, slug) {
  try {
    const u = new URL(url);
    const utm = buildUTM(slug);
    const existing = u.searchParams.toString();
    u.search = existing ? `${existing}&${utm}` : utm;
    return u.toString();
  } catch {
    return url;
  }
}

function getProfileSignal(profile) {
  const formationEdge = profile?.assessment?.formationEdge?.[0] ?? null;
  const armorProgress = profile?.armor?.progress || {};
  const completedPieces = profile?.armor?.completedPieces || [];
  const activeArmor = Object.keys(armorProgress).find((slug) => !completedPieces.includes(slug)) ?? null;
  return { activeArmor, formationEdge };
}

function bandSubtitle(signal) {
  const { activeArmor, formationEdge } = signal || {};
  if (activeArmor && ARMOR_LABELS[activeArmor]) {
    return `Worn while you walk the ${ARMOR_LABELS[activeArmor]}.`;
  }
  if (formationEdge && FRUIT_LABELS[formationEdge]) {
    return `Apparel as a visual anchor for ${FRUIT_LABELS[formationEdge]}.`;
  }
  return "Apparel as a visual anchor. Battle the drift.";
}

function profileScore(product, signal) {
  if (!signal) return 0;
  const { activeArmor, formationEdge } = signal;
  if (activeArmor && product.tags.armor === activeArmor) return 3;
  if (formationEdge && product.tags.fruit === formationEdge) return 2;
  return 0;
}

function resolvedEyebrow(product, signal) {
  if (!signal) return product.eyebrow;
  const { activeArmor, formationEdge } = signal;
  if (activeArmor && product.tags.armor === activeArmor && ARMOR_LABELS[activeArmor]) {
    return `Wear the ${ARMOR_LABELS[activeArmor]}`;
  }
  if (formationEdge && product.tags.fruit === formationEdge && FRUIT_LABELS[formationEdge]) {
    return `Anchor for ${FRUIT_LABELS[formationEdge]}`;
  }
  return product.eyebrow;
}

const STYLES = `
  .cf-apparel {
    background: var(--cf-hero-bg);
    border-top: 1px solid var(--cf-gold-hairline);
    padding: 36px 0 28px;
    color: var(--cf-ivory);
  }
  .cf-apparel__inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
  }
  .cf-apparel__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 18px;
  }
  .cf-apparel__title {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-weight: 400;
    font-size: 22px;
    line-height: 1.2;
    color: var(--cf-ivory);
    margin: 6px 0 0;
  }
  .cf-apparel__shop-all {
    font-family: var(--cf-font-brand);
    font-size: 10px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--cf-ivory-62);
    text-decoration: none;
    transition: color 200ms ease;
    white-space: nowrap;
  }
  .cf-apparel__shop-all:hover { color: var(--cf-gold); }
  .cf-apparel__sub {
    font-family: var(--cf-font-body);
    font-size: 13px;
    line-height: 1.55;
    color: var(--cf-ivory-62);
    margin: 0 0 22px;
    max-width: 540px;
  }
  .cf-apparel__lane {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
  }
  .cf-apparel__card {
    background: var(--cf-obsidian);
    border: 1px solid var(--cf-gold-hairline);
    border-radius: var(--cf-radius-card);
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
  }
  .cf-apparel__card:hover {
    transform: translateY(-2px);
    border-color: var(--cf-gold-soft);
    box-shadow: 0 12px 26px rgba(0,0,0,0.32);
  }
  .cf-apparel__image-wrap {
    background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0));
    aspect-ratio: 4 / 5;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .cf-apparel__image {
    max-width: 86%;
    max-height: 86%;
    object-fit: contain;
    filter: drop-shadow(0 12px 22px rgba(0,0,0,0.42));
  }
  .cf-apparel__meta {
    padding: 16px 18px 18px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .cf-apparel__eyebrow {
    font-family: var(--cf-font-brand);
    font-size: 10px;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--cf-gold);
    margin: 0;
  }
  .cf-apparel__name {
    font-family: var(--cf-font-body);
    font-size: 15px;
    font-weight: 600;
    color: var(--cf-ivory);
    margin: 2px 0 0;
    letter-spacing: 0.02em;
  }
  .cf-apparel__copy {
    font-family: var(--cf-font-body);
    font-size: 13px;
    line-height: 1.5;
    color: var(--cf-ivory-62);
    margin: 4px 0 0;
  }

  @media (max-width: 760px) {
    .cf-apparel { padding: 28px 0 20px; }
    .cf-apparel__inner { padding: 0; }
    .cf-apparel__head,
    .cf-apparel__sub { padding-left: 20px; padding-right: 20px; }
    .cf-apparel__head { margin-bottom: 12px; }
    .cf-apparel__sub  { margin-bottom: 16px; }
    .cf-apparel__lane {
      display: flex;
      grid-template-columns: none;
      gap: 14px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      padding: 0 20px 6px;
    }
    .cf-apparel__lane::-webkit-scrollbar { display: none; }
    .cf-apparel__card {
      flex: 0 0 78vw;
      max-width: 320px;
      scroll-snap-align: center;
    }
  }
`;

export default function ApparelLane({ profile }) {
  const signal = getProfileSignal(profile);
  const subtitle = bandSubtitle(signal);
  const products = [...CURATED_APPAREL]
    .map((p, i) => ({ ...p, _score: profileScore(p, signal), _i: i }))
    .sort((a, b) => b._score - a._score || a._i - b._i);

  return (
    <>
      <style>{STYLES}</style>
      <section className="cf-apparel" aria-label="The Gear">
        <div className="cf-apparel__inner">
          <div className="cf-apparel__head">
            <div>
              <EyebrowLabel size="sm" color="gold">The Gear</EyebrowLabel>
              <h2 className="cf-apparel__title">{subtitle}</h2>
            </div>
            <a
              href={urlWithUtm("https://shop.counterformed.com/collections/the-gear", "shop-all")}
              target="_blank"
              rel="noopener noreferrer"
              className="cf-apparel__shop-all"
            >
              Shop all →
            </a>
          </div>
          <p className="cf-apparel__sub">
            Three pieces from the current collection. Each one is designed as a daily reminder that the formation work is real.
          </p>
          <div className="cf-apparel__lane">
            {products.map((product) => (
              <a
                key={product.slug}
                href={urlWithUtm(product.shopUrl, product.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="cf-apparel__card"
              >
                <div className="cf-apparel__image-wrap">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="cf-apparel__image"
                    loading="lazy"
                  />
                </div>
                <div className="cf-apparel__meta">
                  <p className="cf-apparel__eyebrow">{resolvedEyebrow(product, signal)}</p>
                  <p className="cf-apparel__name">{product.name}</p>
                  <p className="cf-apparel__copy">{product.copy}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
