/**
 * formationRecommendation.js
 *
 * Pure recommendation engine for the Counter Formation app.
 * No side effects, no React imports, no localStorage access.
 *
 * All exported constants are sourced directly from contracts.md (Phase 2, FINALIZED).
 * Do not modify mappings without updating contracts.md in the same commit.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const FRUIT_TO_ARMOR = {
  love:         "gospel-of-peace",
  joy:          "helmet-of-salvation",
  peace:        "gospel-of-peace",
  patience:     "shield-of-faith",
  kindness:     "breastplate-of-righteousness",
  goodness:     "belt-of-truth",
  faithfulness: "sword-of-the-spirit",
  gentleness:   "breastplate-of-righteousness",
  self_control: "helmet-of-salvation",
};

export const FRUIT_TO_RULE_OF_LIFE = {
  love:         { slug: "community", path: "/rule-of-life/community", label: "Community" },
  joy:          { slug: "presence",  path: "/rule-of-life/presence",  label: "Presence"  },
  peace:        { slug: "prayer",    path: "/rule-of-life/prayer",    label: "Prayer"    },
  patience:     { slug: "sabbath",   path: "/rule-of-life/sabbath",   label: "Sabbath"   },
  kindness:     { slug: "community", path: "/rule-of-life/community", label: "Community" },
  goodness:     { slug: "scripture", path: "/rule-of-life/scripture", label: "Scripture" },
  faithfulness: { slug: "sabbath",   path: "/rule-of-life/sabbath",   label: "Sabbath"   },
  gentleness:   { slug: "community", path: "/rule-of-life/community", label: "Community" },
  self_control: { slug: "presence",  path: "/rule-of-life/presence",  label: "Presence"  },
};

export const ARMOR_PIECE_SEQUENCE = [
  "belt-of-truth",
  "breastplate-of-righteousness",
  "gospel-of-peace",
  "shield-of-faith",
  "helmet-of-salvation",
  "sword-of-the-spirit",
];

export const ARMOR_PIECE_CROSS_LINKS = {
  "belt-of-truth":                { slug: "presence",  path: "/rule-of-life/presence",  label: "Presence"  },
  "breastplate-of-righteousness": { slug: "prayer",    path: "/rule-of-life/prayer",    label: "Prayer"    },
  "gospel-of-peace":              { slug: "sabbath",   path: "/rule-of-life/sabbath",   label: "Sabbath"   },
  "shield-of-faith":              { slug: "community", path: "/rule-of-life/community", label: "Community" },
  "helmet-of-salvation":          { slug: "scripture", path: "/rule-of-life/scripture", label: "Scripture" },
  "sword-of-the-spirit":          { slug: "scripture", path: "/rule-of-life/scripture", label: "Scripture" },
};

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const PIECE_LABELS = {
  "belt-of-truth":                "Belt of Truth",
  "breastplate-of-righteousness": "Breastplate of Righteousness",
  "gospel-of-peace":              "Gospel of Peace",
  "shield-of-faith":              "Shield of Faith",
  "helmet-of-salvation":          "Helmet of Salvation",
  "sword-of-the-spirit":          "Sword of the Spirit",
};

const FALLBACK = {
  destination: "/identity/belt-of-truth",
  label:       "Begin the Armor of God",
  description: "Start with the piece that grounds all the others.",
};

function pieceLabel(slug) {
  return PIECE_LABELS[slug] || slug;
}

// ---------------------------------------------------------------------------
// Recommendation engine
// ---------------------------------------------------------------------------

/**
 * Returns a forward-action recommendation based on the user's current context
 * and formation profile.
 *
 * @param {string}  context   - One of the four NextStepContext values.
 * @param {object}  profile   - FormationProfile snapshot (v1 schema).
 * @param {string}  [pieceSlug] - Required when context === "armor-piece-complete".
 * @returns {{ destination: string, label: string, description: string }}
 */
export function formationRecommendation(context, profile, pieceSlug) {
  switch (context) {
    case "challenge-complete": {
      const edge = profile?.assessment?.formationEdge;
      if (!edge || edge.length === 0) return FALLBACK;

      const fruit     = edge[0];
      const armorSlug = FRUIT_TO_ARMOR[fruit];
      if (!armorSlug) return FALLBACK;

      const name = pieceLabel(armorSlug);
      return {
        destination: `/identity/${armorSlug}`,
        label:       `Begin the ${name}`,
        description: `Your formation edge calls you toward ${name}. Walk the next six days.`,
      };
    }

    case "assessment-complete": {
      const edge = profile?.assessment?.formationEdge;
      if (!edge || edge.length === 0) return FALLBACK;

      const fruit  = edge[0];
      const rhythm = FRUIT_TO_RULE_OF_LIFE[fruit];
      if (!rhythm) return FALLBACK;

      return {
        destination: rhythm.path,
        label:       `Explore ${rhythm.label}`,
        description: "The rhythm that addresses your formation edge. Start there.",
      };
    }

    case "armor-piece-complete": {
      if (!pieceSlug || !ARMOR_PIECE_SEQUENCE.includes(pieceSlug)) return FALLBACK;

      const completedPieces = profile?.armor?.completedPieces ?? [];

      if (completedPieces.length === 6) {
        // All pieces complete -- point to the Rule of Life rhythm for this piece.
        const crossLink = ARMOR_PIECE_CROSS_LINKS[pieceSlug];
        if (!crossLink) return FALLBACK;

        return {
          destination: crossLink.path,
          label:       `Explore ${crossLink.label} in the Rule of Life`,
          description: "You've walked all six pieces. Now build the rhythm that holds them.",
        };
      }

      // Find the next piece in sequence after the current one.
      const currentIndex = ARMOR_PIECE_SEQUENCE.indexOf(pieceSlug);
      const nextSlug     = ARMOR_PIECE_SEQUENCE[currentIndex + 1];

      if (!nextSlug) {
        // pieceSlug is the last in sequence but completedPieces.length < 6.
        // This is an edge case (profile may not yet reflect the just-completed piece).
        // Return Belt of Truth rather than an invalid recommendation.
        return FALLBACK;
      }

      const name = pieceLabel(nextSlug);
      return {
        destination: `/identity/${nextSlug}`,
        label:       `Begin the ${name}`,
        description: "Continue through the Armor of God.",
      };
    }

    case "field-guide-complete": {
      const completedDays = profile?.challenge?.completedDays ?? [];

      if (completedDays.length < 7) {
        return {
          destination: "/7-day-challenge",
          label:       "Begin the 7-Day Challenge",
          description: "Seven days to interrupt drift and begin a different pattern of life.",
        };
      }

      return {
        destination: "/field-guide/devotion-guide",
        label:       "Enter the Devotion Guide",
        description: "Ongoing formation -- where the pattern you've built continues.",
      };
    }

    default:
      return FALLBACK;
  }
}
