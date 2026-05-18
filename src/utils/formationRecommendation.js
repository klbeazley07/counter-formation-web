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

/**
 * Dashboard-mode recommendation. Picks the single highest-priority forward
 * action for a returning user across all sections. Read-only over the profile.
 *
 * Priority order:
 *  1. Resume in-progress challenge
 *  2. Resume in-progress armor piece
 *  3. Complete the Fruit Assessment if it's null
 *  4. Complete the Gifts Assessment if it's started but not finished
 *  5. Invite trusted persons if Gifts is done and none invited
 *  6. Otherwise: open Devotion Guide
 */
export function recommendForDashboard(profile) {
  if (!profile) return FALLBACK;

  // 1. Challenge in progress
  const challengeDays = profile.challenge?.completedDays || [];
  if (profile.challenge?.startedAt && !profile.challenge?.completedAt && challengeDays.length > 0) {
    const lastDay = Math.max(...challengeDays);
    const nextDay = Math.min(lastDay + 1, 7);
    return {
      destination: `/7-day-challenge/day/${nextDay}`,
      label:       `Continue Day ${nextDay}`,
      description: `Pick up the 7-Day Challenge where you left off.`,
    };
  }

  // 2. Armor piece in progress (one with progress but not in completedPieces)
  const armorProgress = profile.armor?.progress || {};
  const completedPieces = profile.armor?.completedPieces || [];
  const inProgressPiece = Object.keys(armorProgress).find((slug) => {
    if (completedPieces.includes(slug)) return false;
    const days = armorProgress[slug];
    return Array.isArray(days) ? days.length > 0 : false;
  });
  if (inProgressPiece) {
    const name = pieceLabel(inProgressPiece);
    return {
      destination: `/identity/${inProgressPiece}`,
      label:       `Continue the ${name}`,
      description: `Your formation through ${name} is underway. Return to the next day.`,
    };
  }

  // 3. Fruit Assessment incomplete
  if (!profile.assessment?.completedAt) {
    return {
      destination: "/field-guide/fruit-assessment",
      label:       "Begin the Fruit Assessment",
      description: "The first step is naming where the Spirit is forming you.",
    };
  }

  // 4. Gifts started but not done
  const giftsCompletedAt = profile.gifts?.completedAt;
  if (!giftsCompletedAt) {
    return {
      destination: "/field-guide/gifts",
      label:       "Take the Gifts Assessment",
      description: "Where is the Spirit moving through you? Twenty-five minutes to find out.",
    };
  }

  // 5. Gifts done but no trusted persons invited
  const invited = profile.gifts?.trustedPersonsInvited || 0;
  const confirmed = profile.gifts?.trustedPersonsConfirmed || 0;
  if (invited === 0) {
    return {
      destination: "/field-guide/gifts/invite",
      label:       "Invite your trusted people",
      description: "Your gifts profile is only complete when others have weighed in.",
    };
  }
  if (confirmed < invited) {
    return {
      destination: "/field-guide/gifts/results",
      label:       `View your gifts (${confirmed} of ${invited} confirmed)`,
      description: "See where your trusted people have weighed in so far.",
    };
  }

  // 6. Fallback: devotion guide
  return {
    destination: "/field-guide/devotion-guide",
    label:       "Open the Devotion Guide",
    description: "Generate a devotion grounded in where your formation is right now.",
  };
}
