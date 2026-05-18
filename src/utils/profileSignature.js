/*
 * profileSignature -- compact hash of the parts of a profile that should
 * trigger a new AI synthesis when they change.
 *
 * Strategy: collect the meaningful completion timestamps + counts + the most
 * recent devotion timestamp + declarations, JSON.stringify, then hash with a
 * small djb2-style fold so the cache key stays short and stable.
 *
 * The signature does NOT include the wall-clock time. The SynthesisCard pairs
 * it with the YYYY-MM-DD date so the cache regenerates once a day even when
 * the profile is unchanged.
 */

function djb2(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  // Coerce to unsigned 32-bit base36 for a short, URL-safe-ish string.
  return (hash >>> 0).toString(36);
}

export function profileSignature(profile) {
  if (!profile) return "empty";
  const recentDevotion = Array.isArray(profile.widgets?.devotions) && profile.widgets.devotions[0]
    ? profile.widgets.devotions[0]
    : null;

  const payload = {
    edge: profile.assessment?.formationEdge || [],
    fruitsAt: profile.assessment?.completedAt || null,
    topGifts: profile.gifts?.topGifts || [],
    giftsAt: profile.gifts?.completedAt || null,
    armorActive: Object.keys(profile.armor?.progress || {}).filter(
      (slug) => !(profile.armor?.completedPieces || []).includes(slug)
    ),
    armorDone: profile.armor?.completedPieces || [],
    challengeDays: (profile.challenge?.completedDays || []).length,
    declarations: (profile.widgets?.declarations || []).filter((d) => typeof d === "string" && d.trim()),
    devotion: recentDevotion?.generatedAt || recentDevotion?.savedAt || null,
    name: profile.identity?.displayName || null,
  };

  return djb2(JSON.stringify(payload));
}

export function todayKey(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function synthesisCacheKey(profile, now = new Date()) {
  return `cf:synth:${profileSignature(profile)}:${todayKey(now)}`;
}
