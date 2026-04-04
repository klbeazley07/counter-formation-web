// campaign.js
// Set active: false to disable the banner entirely.
// Set expiresAt to null for no expiry.
// storageKey must be unique per campaign so dismissal resets between campaigns.

export const CAMPAIGN = {
  active: true,
  storageKey: "cf-campaign-7day-v1",
  expiresAt: "2026-06-01T00:00:00Z",
  label: "New",
  message: "The 7-Day Formation Challenge is now open.",
  cta: "Begin",
  href: "/7-day-challenge",
  isExternal: false,
};
