import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";

/* ─── BIBLE.COM BOOK ABBREVIATION MAP ──────────────────────────────── */

const BOOK_ABBR = {
  "Genesis": "GEN", "Exodus": "EXO", "Leviticus": "LEV", "Numbers": "NUM",
  "Deuteronomy": "DEU", "Joshua": "JOS", "Judges": "JDG", "Ruth": "RUT",
  "1 Samuel": "1SA", "2 Samuel": "2SA", "1 Kings": "1KI", "2 Kings": "2KI",
  "1 Chronicles": "1CH", "2 Chronicles": "2CH", "Ezra": "EZR", "Nehemiah": "NEH",
  "Esther": "EST", "Job": "JOB", "Psalm": "PSA", "Psalms": "PSA",
  "Proverbs": "PRO", "Ecclesiastes": "ECC", "Song of Solomon": "SNG",
  "Song of Songs": "SNG", "Isaiah": "ISA", "Jeremiah": "JER",
  "Lamentations": "LAM", "Ezekiel": "EZK", "Daniel": "DAN", "Hosea": "HOS",
  "Joel": "JOL", "Amos": "AMO", "Obadiah": "OBA", "Jonah": "JON",
  "Micah": "MIC", "Nahum": "NAM", "Habakkuk": "HAB", "Zephaniah": "ZEP",
  "Haggai": "HAG", "Zechariah": "ZEC", "Malachi": "MAL",
  "Matthew": "MAT", "Mark": "MRK", "Luke": "LUK", "John": "JHN",
  "Acts": "ACT", "Romans": "ROM",
  "1 Corinthians": "1CO", "2 Corinthians": "2CO", "Galatians": "GAL",
  "Ephesians": "EPH", "Philippians": "PHP", "Colossians": "COL",
  "1 Thessalonians": "1TH", "2 Thessalonians": "2TH",
  "1 Timothy": "1TI", "2 Timothy": "2TI", "Titus": "TIT", "Philemon": "PHM",
  "Hebrews": "HEB", "James": "JAS",
  "1 Peter": "1PE", "2 Peter": "2PE",
  "1 John": "1JN", "2 John": "2JN", "3 John": "3JN",
  "Jude": "JUD", "Revelation": "REV",
};

/* ─── REFERENCE PARSER ──────────────────────────────────────────────── */

// Handles: "Ephesians 6:14", "1 John 3:1", "Psalm 139:23-24"
function parseReference(reference) {
  // Matches "Book Chapter:Verse" and "Book Chapter:Verse-Verse"
  const withVerse = reference.match(/^(\d\s+)?([A-Za-z ]+?)\s+(\d+):\d+(?:[–\-]\d+)?$/);
  // Matches "Book Chapter" (no verse)
  const chapterOnly = reference.match(/^(\d\s+)?([A-Za-z ]+?)\s+(\d+)$/);

  const match = withVerse || chapterOnly;
  if (!match) return null;

  const prefix   = match[1] ? match[1].trim() : "";
  const bookRaw  = match[2].trim();
  const chapter  = match[3];

  const bookName = prefix ? `${prefix} ${bookRaw}` : bookRaw;
  const abbr     = BOOK_ABBR[bookName] || BOOK_ABBR[bookRaw] || bookRaw.toUpperCase().slice(0, 3);
  const url      = `https://www.bible.com/bible/59/${abbr}.${chapter}.ESV`;

  return { bookName, abbr, chapter, url };
}

/* ─── POPOVER (portal) ──────────────────────────────────────────────── */

function ScripturePopover({ reference, text, translation, triggerRef, onClose, onMouseEnter, onMouseLeave, visible }) {
  const popoverRef         = useRef(null);
  const parsed             = parseReference(reference);
  const displayTranslation = translation || "ESV";
  const [pos, setPos]      = useState({ top: 0, left: 0, placement: "below" });

  const recalcPosition = useCallback(() => {
    if (!triggerRef.current || !popoverRef.current) return;

    const trigger = triggerRef.current.getBoundingClientRect();
    const popover = popoverRef.current.getBoundingClientRect();
    const vw      = window.innerWidth;
    const vh      = window.innerHeight;
    const PAD     = 12;

    let top, placement;
    if (trigger.bottom + PAD + popover.height < vh - 8) {
      top = trigger.bottom + PAD;
      placement = "below";
    } else {
      top = trigger.top - PAD - popover.height;
      placement = "above";
    }

    let left = trigger.left;
    if (left + popover.width > vw - 8) left = vw - popover.width - 8;
    if (left < 8) left = 8;

    setPos({ top, left, placement });
  }, [triggerRef]);

  useEffect(() => {
    if (!visible) return;
    const id = requestAnimationFrame(recalcPosition);
    window.addEventListener("scroll", recalcPosition, { passive: true, capture: true });
    window.addEventListener("resize", recalcPosition);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", recalcPosition, { capture: true });
      window.removeEventListener("resize", recalcPosition);
    };
  }, [visible, recalcPosition]);

  // Click-outside + Escape
  useEffect(() => {
    if (!visible) return;
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    const handlePointer = (e) => {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target) &&
        triggerRef.current && !triggerRef.current.contains(e.target)
      ) onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
    };
  }, [visible, onClose, triggerRef]);

  return ReactDOM.createPortal(
    <div
      ref={popoverRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="dialog"
      aria-modal="false"
      aria-label={reference}
      style={{
        position:      "fixed",
        top:           pos.top,
        left:          pos.left,
        zIndex:        9999,
        maxWidth:      "min(420px, calc(100vw - 32px))",
        width:         "calc(100vw - 16px)",
        background:    "#0E0C0A",
        border:        "1px solid rgba(201,168,76,0.15)",
        borderRadius:  8,
        padding:       "20px 24px",
        boxShadow:     "0 12px 40px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.4)",
        opacity:       visible ? 1 : 0,
        transform:     visible
          ? "translateY(0)"
          : pos.placement === "below" ? "translateY(-6px)" : "translateY(6px)",
        transition:    "opacity 220ms ease, transform 220ms ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {/* Reference label */}
      <div style={{
        fontFamily:    "'Barlow Condensed', sans-serif",
        fontVariant:   "small-caps",
        letterSpacing: "0.12em",
        fontSize:      13,
        color:         "#C9A84C",
        marginBottom:  12,
        textTransform: "uppercase",
      }}>
        {reference}&nbsp;&nbsp;·&nbsp;&nbsp;{displayTranslation}
      </div>

      {/* Verse text */}
      {text && (
        <p style={{
          fontFamily:  "'Cormorant Garamond', Georgia, serif",
          fontStyle:   "italic",
          fontSize:    18,
          lineHeight:  1.75,
          color:       "#FAF8F5",
          margin:      "0 0 16px 0",
        }}>
          {text}
        </p>
      )}

      {/* Divider */}
      <div style={{
        height:       1,
        background:   "rgba(201,168,76,0.12)",
        marginBottom: 12,
      }} />

      {/* Read full chapter */}
      {parsed && (
        <a
          href={parsed.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily:     "'Barlow Condensed', sans-serif",
            fontSize:       12,
            letterSpacing:  "0.08em",
            textTransform:  "uppercase",
            color:          "rgba(201,168,76,0.6)",
            textDecoration: "none",
            transition:     "color 180ms ease",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#C9A84C"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(201,168,76,0.6)"}
        >
          Read full chapter →
        </a>
      )}
    </div>,
    document.body
  );
}

/* ─── MAIN COMPONENT ────────────────────────────────────────────────── */

export function ScriptureRef({ reference, text, translation }) {
  const [open, setOpen]       = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const triggerRef            = useRef(null);
  const closeTimerRef         = useRef(null);
  const isMobile              = useRef(false);

  useEffect(() => {
    isMobile.current = window.matchMedia("(hover: none)").matches;
  }, []);

  const openPopover = useCallback(() => {
    clearTimeout(closeTimerRef.current);
    setOpen(true);
    // Double-raf so the popover mounts before we set visible (triggers CSS transition)
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  const closePopover = useCallback(() => {
    setVisible(false);
    closeTimerRef.current = setTimeout(() => setOpen(false), 250);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimerRef.current = setTimeout(closePopover, 120);
  }, [closePopover]);

  const cancelClose = useCallback(() => {
    clearTimeout(closeTimerRef.current);
  }, []);

  // Desktop hover handlers
  const handleMouseEnter = () => { if (!isMobile.current) { setHovered(true); openPopover(); } };
  const handleMouseLeave = () => { if (!isMobile.current) { setHovered(false); scheduleClose(); } };

  // Mobile tap handler
  const handleClick = (e) => {
    if (!isMobile.current) return;
    e.preventDefault();
    open ? closePopover() : openPopover();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open ? closePopover() : openPopover();
    }
  };

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-haspopup="dialog"
        style={{
          display:        "inline",
          color:          "#C9A84C",
          cursor:         "pointer",
          fontFamily:     "inherit",
          fontSize:       "inherit",
          fontStyle:      "inherit",
          background:     "none",
          border:         "none",
          padding:        0,
          borderBottom:   open
            ? "1px solid rgba(201,168,76,0.85)"
            : hovered
              ? "1px solid rgba(201,168,76,0.6)"
              : "1px dotted rgba(201,168,76,0.30)",
          transition:     "border-color 200ms ease",
        }}
      >
        {reference}
      </span>

      {open && (
        <ScripturePopover
          reference={reference}
          text={text}
          translation={translation}
          triggerRef={triggerRef}
          onClose={closePopover}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          visible={visible}
        />
      )}
    </>
  );
}

export default ScriptureRef;
