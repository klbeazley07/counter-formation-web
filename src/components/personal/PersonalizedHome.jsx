import { useFormationProfile } from "../../hooks/useFormationProfile";
import DashboardBanner from "./DashboardBanner";
import DashboardWorkspace from "./DashboardWorkspace";

/*
 * PersonalizedHome -- the returning-user dashboard at `/`.
 *
 * Single-view workspace: slim banner above, two-column workspace below.
 * Fits in a 1024x720 viewport without scroll on desktop; stacks vertically
 * on mobile.
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
        <DashboardBanner profile={profile} />
        <DashboardWorkspace profile={profile} />
      </main>
    </>
  );
}
