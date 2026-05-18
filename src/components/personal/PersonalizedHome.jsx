import { useFormationProfile } from "../../hooks/useFormationProfile";
import DashboardBanner from "./DashboardBanner";
import AgentEntry from "./AgentEntry";
import DashboardWorkspace from "./DashboardWorkspace";
import SaveJourneyStrip from "./SaveJourneyStrip";
import ApparelLane from "./ApparelLane";
import SignOutLink from "./SignOutLink";

/*
 * showSaveStrip: gates the SaveJourneyStrip to only appear when the user
 * is anonymous AND has meaningful formation work to save AND has not
 * already dismissed the prompt.
 *
 * Phase 3+ may reset profile.dismissed.saveJourneyStrip when the user
 * completes new meaningful work; for now a dismiss is sticky.
 */
function showSaveStrip(profile) {
  if (!profile) return false;
  if (profile.identity?.userId) return false;
  if (profile.dismissed?.saveJourneyStrip) return false;
  return true;
}

/*
 * PersonalizedHome -- the returning-user dashboard at `/`.
 *
 * Single-view workspace: slim banner above, two-column workspace below.
 * Fits in a 1024x720 viewport without scroll on desktop. The ApparelLane
 * sits below the workspace fold; on mobile it stacks as the final section
 * before the MobileTabBar's bottom padding.
 */

const STYLES = `
  .cf-ph {
    background: var(--cf-hero-bg);
    color: var(--cf-ivory);
    min-height: 100dvh;
    padding-bottom: calc(env(safe-area-inset-bottom) + 72px);
  }
`;

export default function PersonalizedHome() {
  const { profile, isLoaded } = useFormationProfile();

  if (!isLoaded || !profile) return null;

  return (
    <>
      <style>{STYLES}</style>
      <main className="cf-ph">
        {showSaveStrip(profile) && <SaveJourneyStrip />}
        <DashboardBanner profile={profile} />
        <AgentEntry profile={profile} />
        <DashboardWorkspace profile={profile} />
        <ApparelLane profile={profile} />
        <SignOutLink profile={profile} />
      </main>
    </>
  );
}
