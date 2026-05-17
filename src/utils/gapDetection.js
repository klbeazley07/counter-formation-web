// Gap detection for the Spiritual Gifts Assessment.
// Run after computeScores() to surface inclination-confirmation and confirmation-inclination gaps.
// Only applies to core gifts with at least 2 trusted-person non-null responses.

/**
 * @param {Object} scores - result of computeScores().scores
 * @returns {{ [giftKey]: { inclinationConfirmationGap: boolean, confirmationInclinationGap: boolean } }}
 *
 * inclinationConfirmationGap: user claims high inclination (≥70) but community sees it low (≤40).
 * confirmationInclinationGap: community sees it high (≥70) but user did not claim it (≤50).
 */
export function detectGaps(scores) {
  const gaps = {};
  for (const [giftKey, score] of Object.entries(scores)) {
    if (score.isCharismatic) continue;
    if (score.confirmation === null || score.confirmationCount < 2) continue;

    const inclinationConfirmationGap =
      score.inclination >= 70 && score.confirmation <= 40;
    const confirmationInclinationGap =
      score.confirmation >= 70 && score.inclination <= 50;

    if (inclinationConfirmationGap || confirmationInclinationGap) {
      gaps[giftKey] = { inclinationConfirmationGap, confirmationInclinationGap };
    }
  }
  return gaps;
}
