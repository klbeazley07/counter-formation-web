import React from "react";
import { Link, useParams } from "react-router-dom";


function Frame({ eyebrow, title, route, children }) {
  return (
    <main
      style={{
        background: "var(--cf-hero-bg)",
        color: "var(--cf-ivory)",
        minHeight: "100vh",
        padding: "120px 24px 80px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: 720, width: "100%" }}>
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 11,
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: "var(--cf-gold)",
            marginBottom: 18,
          }}
        >
          {eyebrow}
        </div>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 44,
            lineHeight: 1.15,
            margin: 0,
            marginBottom: 24,
          }}
        >
          {title}
        </h1>
        <code
          style={{
            display: "inline-block",
            padding: "4px 10px",
            border: "1px solid rgba(201,168,76,0.30)",
            color: "var(--cf-ivory-58)",
            fontSize: 13,
            marginBottom: 32,
          }}
        >
          {route}
        </code>
        <div style={{ color: "var(--cf-ivory-58)", lineHeight: 1.7, fontSize: 16 }}>
          {children}
        </div>
        <div style={{ marginTop: 40 }}>
          <Link
            to="/field-guide/scripture-before-scroll"
            style={{ color: "var(--cf-gold)", textDecoration: "none", letterSpacing: "0.05em" }}
          >
            ← Back to Field Guide
          </Link>
        </div>
      </div>
    </main>
  );
}

export function GiftsIntro() {
  return (
    <Frame
      eyebrow="Field Guide · Assessment 02"
      title="The Spiritual Gifts Assessment"
      route="/field-guide/gifts"
    >
      Intro screen with two CTAs (Begin Assessment / Explore the gifts first).
      Constellation visualization renders here as a state within this route.
    </Frame>
  );
}

export function GiftsTake() {
  return (
    <Frame eyebrow="Assessment" title="Take the Assessment" route="/field-guide/gifts/take">
      72-question flow: 17 core gifts (3 inclination + 1 fruitfulness each) + 2 charismatic gifts (1 direct experience + 1 fruitfulness each). One question per screen.
    </Frame>
  );
}

export function GiftsProcessing() {
  return (
    <Frame eyebrow="Weighing your responses" title="Processing" route="/field-guide/gifts/processing">
      Brief pause screen before results — 4-5 seconds of intentional pacing.
    </Frame>
  );
}

export function GiftsResults() {
  return (
    <Frame eyebrow="Your formation gifts" title="Where the Spirit is at work through you" route="/field-guide/gifts/results">
      Active / Emerging / Quiet tier display. Trusted-person invitation CTA. Gap detection section appears after community responses arrive.
    </Frame>
  );
}

export function GiftsInvite() {
  return (
    <Frame eyebrow="Complete the picture" title="Invite trusted people" route="/field-guide/gifts/invite">
      Send the brief companion assessment to two or three people who know you well. Their responses integrate into your results.
    </Frame>
  );
}

export function GiftsObserve() {
  const { token } = useParams();
  return (
    <Frame eyebrow="Counter Formation" title="You've been invited to weigh in" route={`/field-guide/gifts/observe/${token || ":token"}`}>
      Trusted-person assessment — one question per gift, with an "I haven't been in a position to see this" option for honesty. Approximately 5-7 minutes.
    </Frame>
  );
}

export function FormationPicture() {
  return (
    <Frame eyebrow="Your formation picture" title="How the Spirit is at work in you right now" route="/field-guide/formation">
      Integrated view of Fruit assessment and Gifts assessment. Requires both completed.
    </Frame>
  );
}
