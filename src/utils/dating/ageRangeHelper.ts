
/**
 * Helper utilities for working with age range data that can be in different formats
 */

/**
 * Gets the lower value from an age range regardless of format
 */
export function getLowerAgeValue(ageRange: { lower: number; upper: number } | [number, number]): number {
  if (Array.isArray(ageRange)) {
    return ageRange[0];
  }
  return ageRange.lower;
}

/**
 * Gets the upper value from an age range regardless of format
 */
export function getUpperAgeValue(ageRange: { lower: number; upper: number } | [number, number]): number {
  if (Array.isArray(ageRange)) {
    return ageRange[1];
  }
  return ageRange.upper;
}

/**
 * Format age range as a string like "25-45"
 */
export function formatAgeRange(ageRange?: { lower: number; upper: number } | [number, number]): string {
  if (!ageRange) return "Not specified";
  
  const lower = getLowerAgeValue(ageRange);
  const upper = getUpperAgeValue(ageRange);
  
  return `${lower}-${upper}`;
}
