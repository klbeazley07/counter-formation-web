import React, { useState, useEffect, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { CAMPAIGN } from "../config/campaign";

function CampaignBannerStyles() {
  return (
    <style>{`
      .cf-banner {
        width: 100%;
        background: #0E0C0A;
        border-bottom: 1px solid rgba(201,168,76,0.18);
        position: relative;
        z-index: 300;
        animation: cf-banner-slide 0.4s ease both;
      }
      @keyframes cf-banner-slide {
        from { opacity: 0; transform: translateY(-100%); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .cf-banner-inner {
        max-width: 1320px;
        margin: 0 auto;
        padding: 10px 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        position: relative;
      }
      .cf-banner-link {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        flex: 1;
        justify-content: center;
      }
      .cf-banner-label {
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.32em;
        text-transform: uppercase;
        color: #0A0A0A;
        background: #C9A84C;
        padding: 2px 8px;
        border-radius: 999px;
        flex-shrink: 0;
      }
      .cf-banner-message {
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 12px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: rgba(250,248,245,0.70);
      }
      .cf-banner-cta {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: #C9A84C;
        flex-shrink: 0;
        transition: color 0.2s;
      }
      .cf-banner-link:hover .cf-banner-cta {
        color: #FAF8F5;
      }
      .cf-banner-dismiss {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: rgba(250,248,245,0.28);
        cursor: pointer;
        padding: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s;
        border-radius: 4px;
      }
      .cf-banner-dismiss:hover {
        color: rgba(250,248,245,0.65);
      }
      @media (max-width: 767px) {
        .cf-banner-inner {
          padding: 9px 44px 9px 16px;
          gap: 8px;
        }
        .cf-banner-message {
          font-size: 11px;
          letter-spacing: 0.12em;
        }
        .cf-banner-cta {
          display: none;
        }
        .cf-banner-link {
          justify-content: flex-start;
        }
      }
    `}</style>
  );
}

export function CampaignBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!CAMPAIGN.active) return;
    if (CAMPAIGN.expiresAt && new Date() > new Date(CAMPAIGN.expiresAt)) return;
    const dismissed = localStorage.getItem(CAMPAIGN.storageKey);
    if (!dismissed) setVisible(true);
  }, []);

  useLayoutEffect(() => {
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
    <>
      <CampaignBannerStyles />
      <div className="cf-banner" aria-live="polite" aria-label="Campaign announcement">
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
    </>
  );
}
