import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { CAMPAIGN } from "../config/campaign";

export function CampaignBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!CAMPAIGN.active) return;
    if (CAMPAIGN.expiresAt && new Date() > new Date(CAMPAIGN.expiresAt)) return;
    const dismissed = localStorage.getItem(CAMPAIGN.storageKey);
    if (!dismissed) setVisible(true);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--banner-height",
      visible ? "40px" : "0px"
    );
    return () => document.documentElement.style.setProperty("--banner-height", "0px");
  }, [visible]);

  const dismiss = () => {
    localStorage.setItem(CAMPAIGN.storageKey, "1");
    setVisible(false);
  };

  if (!visible) return null;

  const Inner = (
    <>
      {CAMPAIGN.label && (
        <span className="cf-banner-label">{CAMPAIGN.label}</span>
      )}
      <span className="cf-banner-message">{CAMPAIGN.message}</span>
      <span className="cf-banner-cta">
        {CAMPAIGN.cta}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1 5h8M5.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </span>
    </>
  );

  return (
    <div className="cf-banner" role="banner" aria-label="Campaign announcement">
      <div className="cf-banner-inner">
        {CAMPAIGN.isExternal ? (
          <a href={CAMPAIGN.href} target="_blank" rel="noopener noreferrer" className="cf-banner-link">
            {Inner}
          </a>
        ) : (
          <Link to={CAMPAIGN.href} className="cf-banner-link" onClick={dismiss}>
            {Inner}
          </Link>
        )}
        <button className="cf-banner-dismiss" onClick={dismiss} aria-label="Dismiss announcement">
          <X size={12} />
        </button>
      </div>
    </div>
  );
}
