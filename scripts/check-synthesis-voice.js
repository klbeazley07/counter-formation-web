/*
 * check-synthesis-voice.js
 *
 * Voice-guard fixture for /api/synthesize. Feeds a small set of representative
 * formation profiles to the endpoint and asserts the response avoids banned
 * phrases that violate the Counter Formation voice rules.
 *
 * Usage:
 *   node scripts/check-synthesis-voice.js [--url=https://counterformed.com]
 *
 * Defaults to http://localhost:8788 (Cloudflare Pages dev server). Override
 * with --url to hit production or a preview deployment. Exits 0 on pass, 1 on
 * any failure. Useful as a CI gate or a pre-deploy spot-check.
 */

const argUrl = process.argv.find((a) => a.startsWith("--url="));
const BASE_URL = argUrl ? argUrl.split("=")[1] : "http://localhost:8788";
const ENDPOINT = `${BASE_URL.replace(/\/$/, "")}/api/synthesize`;

const BANNED_PATTERNS = [
  { re: /—/,                                      label: "em dash"                 },
  { re: /\bIt's not [^,]+, it's\b/i,              label: '"it\'s not X, it\'s Y"'  },
  { re: /\bIts not [^,]+, its\b/i,                label: '"its not X, its Y"'      },
  { re: /\bIn this season\b/i,                    label: '"In this season"'        },
  { re: /\bIn today's world\b/i,                  label: '"In today\'s world"'     },
  { re: /\bNow more than ever\b/i,                label: '"Now more than ever"'    },
  { re: /\bLet's dive\b/i,                        label: '"let\'s dive"'           },
  { re: /\bleverage\b/i,                          label: "leverage"                },
  { re: /\butilize\b/i,                           label: "utilize"                 },
  { re: /\bharness\b/i,                           label: "harness"                 },
  { re: /\bunlock\b/i,                            label: "unlock"                  },
  { re: /\bunleash\b/i,                           label: "unleash"                 },
  { re: /\bempower\b/i,                           label: "empower"                 },
  { re: /\bfoster\b/i,                            label: "foster"                  },
  { re: /\boptimize\b/i,                          label: "optimize"                },
  { re: /\bstreamline\b/i,                        label: "streamline"              },
  { re: /\bseamless\b/i,                          label: "seamless"                },
  { re: /\brobust\b/i,                            label: "robust"                  },
  { re: /\btransformative\b/i,                    label: "transformative"          },
  { re: /\becosystem\b/i,                         label: "ecosystem"               },
  { re: /\bparadigm\b/i,                          label: "paradigm"                },
  { re: /\bsynergy\b/i,                           label: "synergy"                 },
  { re: /\bstakeholders\b/i,                      label: "stakeholders"            },
  { re: /\bmultifaceted\b/i,                      label: "multifaceted"            },
  { re: /\bvibrant\b/i,                           label: "vibrant"                 },
  { re: /\bimpactful\b/i,                         label: "impactful"               },
  // "journey" as a noun for a process is banned in CLAUDE.md. Allow when
  // clearly used as the verb (rare in synthesis output).
  { re: /\b(your|the|a|this|my) journey\b/i,      label: '"journey" (as a noun)'   },
];

const FIXTURES = [
  {
    name: "Fruit + gifts + active armor",
    profile: {
      identity: { displayName: "Luke" },
      assessment: {
        formationEdge: ["patience", "self_control", "gentleness"],
        completedAt: "2026-05-10T14:22:00.000Z",
      },
      gifts: {
        topGifts: ["teaching", "wisdom", "exhortation"],
        completedAt: "2026-05-12T10:00:00.000Z",
      },
      armor: {
        progress: { "breastplate-of-righteousness": { day: 3 } },
        completedPieces: ["belt-of-truth"],
      },
      widgets: {
        declarations: ["I am rooted in what God has said.", ""],
        devotions: [{ theme: "Stillness", generatedAt: "2026-05-17T07:14:00.000Z" }],
      },
      challenge: { completedDays: [1, 2, 3, 4] },
    },
  },
  {
    name: "Fruits only (early-stage user)",
    profile: {
      identity: { displayName: null },
      assessment: {
        formationEdge: ["peace", "joy"],
        completedAt: "2026-05-18T09:00:00.000Z",
      },
      gifts: { topGifts: [], completedAt: null },
      armor: { progress: {}, completedPieces: [] },
      widgets: { declarations: [], devotions: [] },
      challenge: { completedDays: [] },
    },
  },
  {
    name: "Gifts only, no fruit",
    profile: {
      identity: { displayName: "Sarah" },
      assessment: { formationEdge: [], completedAt: null },
      gifts: {
        topGifts: ["mercy", "shepherding", "hospitality"],
        completedAt: "2026-05-15T18:30:00.000Z",
      },
      armor: { progress: {}, completedPieces: [] },
      widgets: { declarations: [], devotions: [] },
      challenge: { completedDays: [] },
    },
  },
  {
    name: "Deep-in-armor user",
    profile: {
      identity: { displayName: null },
      assessment: {
        formationEdge: ["faithfulness"],
        completedAt: "2026-04-01T00:00:00.000Z",
      },
      gifts: { topGifts: ["faith"], completedAt: "2026-04-05T00:00:00.000Z" },
      armor: {
        progress: { "sword-of-the-spirit": { day: 4 } },
        completedPieces: ["belt-of-truth", "breastplate-of-righteousness", "gospel-of-peace", "shield-of-faith", "helmet-of-salvation"],
      },
      widgets: {
        declarations: ["The Word stands. I stand on it."],
        devotions: [{ theme: "The Word as a weapon", generatedAt: "2026-05-18T06:00:00.000Z" }],
      },
      challenge: { completedDays: [1, 2, 3, 4, 5, 6, 7] },
    },
  },
  {
    name: "Heavy declarations + first-week challenge",
    profile: {
      identity: { displayName: "James" },
      assessment: {
        formationEdge: ["kindness", "goodness"],
        completedAt: "2026-05-16T12:00:00.000Z",
      },
      gifts: { topGifts: ["serving", "giving"], completedAt: "2026-05-17T12:00:00.000Z" },
      armor: { progress: {}, completedPieces: [] },
      widgets: {
        declarations: [
          "I am God's beloved son. I have nothing to prove.",
          "My identity is hidden with Christ in God.",
        ],
        devotions: [],
      },
      challenge: { completedDays: [1, 2] },
    },
  },
];

function check(text) {
  const offenses = [];
  for (const { re, label } of BANNED_PATTERNS) {
    if (re.test(text)) {
      const match = text.match(re);
      offenses.push({ label, match: match?.[0] || "" });
    }
  }
  // Sentence count -- spec requires 2 to 4.
  const sentences = text.split(/[.!?]+\s+/).filter((s) => s.trim().length > 0);
  if (sentences.length < 2) offenses.push({ label: "too few sentences", match: `count=${sentences.length}` });
  if (sentences.length > 5) offenses.push({ label: "too many sentences", match: `count=${sentences.length}` });
  return offenses;
}

async function run() {
  console.log(`[voice-guard] hitting ${ENDPOINT}\n`);

  let failed = 0;
  for (let i = 0; i < FIXTURES.length; i++) {
    const { name, profile } = FIXTURES[i];
    process.stdout.write(`[${i + 1}/${FIXTURES.length}] ${name} ... `);
    try {
      const res = await fetch(ENDPOINT, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ profile }),
      });
      if (!res.ok) {
        const detail = await res.text();
        console.log(`FAIL (HTTP ${res.status})\n        ${detail.slice(0, 200)}`);
        failed++;
        continue;
      }
      const data = await res.json();
      const text = data?.text || "";
      if (!text) {
        console.log("FAIL (empty text)");
        failed++;
        continue;
      }
      const offenses = check(text);
      if (offenses.length === 0) {
        console.log("PASS");
        console.log(`        ${text}`);
      } else {
        console.log("FAIL");
        console.log(`        ${text}`);
        for (const off of offenses) {
          console.log(`        ✗ ${off.label}: "${off.match}"`);
        }
        failed++;
      }
    } catch (err) {
      console.log(`ERROR (${err.message})`);
      failed++;
    }
  }

  console.log("");
  if (failed === 0) {
    console.log(`[voice-guard] all ${FIXTURES.length} fixtures passed.`);
    process.exit(0);
  } else {
    console.log(`[voice-guard] ${failed}/${FIXTURES.length} fixtures failed.`);
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("[voice-guard] fatal:", err);
  process.exit(2);
});
