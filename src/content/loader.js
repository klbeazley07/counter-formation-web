import armorData from './armor.json';
import rhythmData from './rule-of-life.json';
import fieldGuideData from './field-guide.json';
import fieldGuideLandingData from './field-guide-landing.json';
import fruitsData from './fruits.json';

// Canonical sequences — source of truth for ordering in getAllArmorPieces() and getAllFruits()
const PIECE_ORDER = [
  'belt-of-truth',
  'breastplate-of-righteousness',
  'gospel-of-peace',
  'shield-of-faith',
  'helmet-of-salvation',
  'sword-of-the-spirit',
];

const FRUIT_ORDER = [
  'love',
  'joy',
  'peace',
  'patience',
  'kindness',
  'goodness',
  'faithfulness',
  'gentleness',
  'self_control',
];

// Dev-only count assertion — warns on mismatch but never throws
function assertCount(value, expected, name) {
  if (process.env.NODE_ENV !== 'production') {
    const count = Array.isArray(value) ? value.length : Object.keys(value).length;
    if (count !== expected) {
      console.error(
        `[loader] Content count mismatch: ${name} has ${count} entries, expected ${expected}`
      );
    }
  }
}

assertCount(armorData, 6, 'armor.json');
assertCount(rhythmData, 5, 'rule-of-life.json');
assertCount(fieldGuideData, 7, 'field-guide.json');
assertCount(fruitsData, 9, 'fruits.json');

export function getArmorPiece(slug) {
  const piece = armorData.find((p) => p.slug === slug);
  if (!piece && process.env.NODE_ENV !== 'production') {
    throw new Error(`[loader] getArmorPiece: no armor piece found with slug "${slug}"`);
  }
  return piece;
}

export function getAllArmorPieces() {
  return PIECE_ORDER.map((slug) => armorData.find((p) => p.slug === slug)).filter(Boolean);
}

export function getRhythm(slug) {
  const rhythm = rhythmData.find((r) => r.slug === slug);
  if (!rhythm && process.env.NODE_ENV !== 'production') {
    throw new Error(`[loader] getRhythm: no rhythm found with slug "${slug}"`);
  }
  return rhythm;
}

export function getAllRhythms() {
  return rhythmData;
}

export function getFieldGuideDay(n) {
  const day = fieldGuideData.find((d) => d.day === n);
  if (!day && process.env.NODE_ENV !== 'production') {
    throw new Error(`[loader] getFieldGuideDay: no field guide day found for day ${n}`);
  }
  return day;
}

export function getFieldGuidePath() {
  return fieldGuideData;
}

export function getFieldGuideLanding() {
  return fieldGuideLandingData;
}

export function getFruit(slug) {
  const fruit = fruitsData[slug];
  if (!fruit && process.env.NODE_ENV !== 'production') {
    throw new Error(`[loader] getFruit: no fruit found with slug "${slug}"`);
  }
  return fruit;
}

export function getAllFruits() {
  return FRUIT_ORDER.map((slug) => fruitsData[slug]).filter(Boolean);
}
