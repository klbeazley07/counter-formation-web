import { Link } from "react-router-dom";
import { useFormationProfile } from "../hooks/useFormationProfile";
import { formationRecommendation } from "../utils/formationRecommendation";

/*
 * NextStep — self-contained forward-action card for transition moments.
 *
 * Reads the FormationProfile internally, calls formationRecommendation() to
 * derive destination, label, and description, and renders a styled card
 * matching the .cf7-next-step visual language from SevenDayChallenge.jsx.
 *
 * All visual styles are inline so the component is portable across pages
 * that do not load the challenge CSS block (FruitAssessment, Identity,
 * FieldGuide). When placed inside SevenDayChallenge.jsx and passed
 * className="cf7-next-step", the challenge stylesheet overrides apply on
 * top of the inline wrapper styles as expected.
 *
 * Props:
 *   context    {string}  Required. One of: "challenge-complete",
 *                        "assessment-complete", "armor-piece-complete",
 *                        "field-guide-complete"
 *   pieceSlug  {string}  Required only when context === "armor-piece-complete".
 *                        The slug of the armor piece being completed.
 *   className  {string}  Optional. Applied to the outermost wrapper div.
 *                        Use for margin overrides at specific insertion points.
 */

const CARD_STYLE = {
  marginTop: "2.5rem",
  border: "1px solid rgba(201,168,76,0.18)",
  borderRadius: "20px",
  padding: "1.7rem",
  background: "linear-gradient(to bottom right, rgba(201,168,76,0.06), rgba(255,255,255,0.02))",
};

const EYEBROW_STYLE = {
  fontSize: "9px",
  letterSpacing: ".42em",
  textTransform: "uppercase",
  color: "#C9A84C",
  marginTop: 0,
  marginBottom: ".85rem",
};

const DESCRIPTION_STYLE = {
  fontSize: "13px",
  lineHeight: "1.7",
  color: "rgba(250,248,245,0.75)",
  margin: "0 0 0.25rem 0",
};

const CTA_STYLE = {
  display: "inline-flex",
  marginTop: "1rem",
  alignItems: "center",
  gap: "8px",
  textDecoration: "none",
  color: "#0A0A0A",
  background: "#C9A84C",
  border: "1px solid #C9A84C",
  borderRadius: "999px",
  padding: "12px 18px",
  fontSize: "9px",
  letterSpacing: ".24em",
  textTransform: "uppercase",
  fontWeight: 700,
};

export default function NextStep({ context, pieceSlug, className }) {
  const { profile, isLoaded } = useFormationProfile();

  if (!isLoaded) return null;

  const recommendation = formationRecommendation(context, profile, pieceSlug);

  return (
    <div className={className}>
      <div style={CARD_STYLE}>
        <p style={EYEBROW_STYLE}>Formation Path</p>
        <p style={DESCRIPTION_STYLE}>{recommendation.description}</p>
        <Link to={recommendation.destination} style={CTA_STYLE}>
          {recommendation.label}
        </Link>
      </div>
    </div>
  );
}
