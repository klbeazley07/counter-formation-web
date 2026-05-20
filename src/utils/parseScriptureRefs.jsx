import React from "react";
import { ScriptureRef } from "../ScriptureRef";
import { lookupVerse } from "./verseIndex";

// Matches scripture references like:
//   "John 1:14", "1 Thessalonians 5:17", "Psalm 139:23–24", "Genesis 2", "1 Corinthians 12"
const SCRIPTURE_PATTERN =
  /\b((?:(?:1|2|3)\s+)?(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|Samuel|Kings|Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs?|Ecclesiastes|Song of (?:Solomon|Songs)|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|Corinthians|Galatians|Ephesians|Philippians|Colossians|Thessalonians|Timothy|Titus|Philemon|Hebrews|James|Peter|Jude|Revelation)\s+\d+(?::\d+(?:[–\-]\d+)?)?)\b/g;

/**
 * Takes a plain text string and returns JSX with scripture references wrapped
 * in interactive ScriptureRef popovers. If no references found, returns the
 * original string unchanged.
 */
export function parseScriptureRefs(text) {
  if (!text || typeof text !== "string") return text;

  SCRIPTURE_PATTERN.lastIndex = 0;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = SCRIPTURE_PATTERN.exec(text)) !== null) {
    const ref = match[1];
    const start = match.index;

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    parts.push(<ScriptureRef key={`sr-${start}`} reference={ref} text={lookupVerse(ref)} />);
    lastIndex = start + match[0].length;
  }

  if (parts.length === 0) return text;

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}

/**
 * Walks React children recursively. Replaces any string child with the result
 * of parseScriptureRefs() and recurses into any element children, preserving
 * the original element type and props.
 *
 * Use this to add interactive scripture references to rendered Markdown or
 * any tree of React children where the text is unknown at author time
 * (e.g., AI-generated content). Skips `<a>` elements so existing links are
 * not re-wrapped.
 */
export function withScriptureRefs(children) {
  return React.Children.map(children, (child) => {
    if (typeof child === "string") return parseScriptureRefs(child);
    if (!React.isValidElement(child)) return child;
    if (child.type === "a" || child.props?.children === undefined) return child;
    return React.cloneElement(child, undefined, withScriptureRefs(child.props.children));
  });
}

/**
 * Like parseScriptureRefs but handles HTML strings containing <em> tags.
 * Splits on <em>...</em> segments, applies scripture ref parsing to each
 * text node, and returns JSX. Replaces dangerouslySetInnerHTML usage.
 */
export function renderHtmlWithScriptureRefs(html) {
  if (!html || typeof html !== "string") return html;

  const segments = html.split(/(<em>[\s\S]*?<\/em>)/g);

  return segments.map((seg, i) => {
    if (seg.startsWith("<em>")) {
      const inner = seg.slice(4, -5);
      return <em key={i}>{parseScriptureRefs(inner)}</em>;
    }
    return <React.Fragment key={i}>{parseScriptureRefs(seg)}</React.Fragment>;
  });
}
