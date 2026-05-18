import { useFormationProfile } from "../../hooks/useFormationProfile";
import PersonalizedHome from "./PersonalizedHome";

/*
 * HomeRouter -- the gate at `/`.
 *
 * Renders PersonalizedHome for users with meaningful formation activity and
 * the marketing site (passed as a child component) for everyone else.
 *
 * "Meaningful activity" is conservative: any completed assessment, started
 * challenge, completed armor piece, completed field guide day, completed
 * rhythm, filled declaration, saved devotion, or arrow log entry. Profile
 * creation alone does not count, since cf:profile is created on any first
 * visit by the FormationProfileProvider.
 */

export function hasMeaningfulActivity(profile) {
  if (!profile) return false;
  if (profile.assessment?.completedAt) return true;
  if (profile.gifts?.completedAt) return true;
  if (profile.challenge?.startedAt) return true;
  if (profile.armor?.completedPieces?.length > 0) return true;
  if (profile.fieldGuide?.completedDays?.length > 0) return true;
  if (profile.ruleOfLife?.completedRhythms?.length > 0) return true;
  const decls = profile.widgets?.declarations || [];
  if (decls.some((d) => d && d.trim())) return true;
  if (profile.widgets?.devotions?.length > 0) return true;
  if (profile.widgets?.arrowLog?.length > 0) return true;
  return false;
}

export default function HomeRouter({ marketingSite }) {
  const { profile, isLoaded } = useFormationProfile();

  if (!isLoaded) {
    // Render nothing while we load the profile -- avoids a flash of marketing
    // content that then snaps to the dashboard.
    return null;
  }

  if (hasMeaningfulActivity(profile)) {
    return <PersonalizedHome />;
  }
  return marketingSite;
}
