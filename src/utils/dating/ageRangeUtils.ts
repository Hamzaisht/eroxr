
/**
 * Utility functions for working with age ranges in dating filters
 */

// Extract lower and upper values from age range regardless of its format
export function getAgeRangeBounds(ageRange: { lower: number; upper: number } | [number, number] | undefined): { lower: number; upper: number } {
  if (!ageRange) {
    return { lower: 18, upper: 99 };
  }
  
  if (Array.isArray(ageRange)) {
    return { lower: ageRange[0], upper: ageRange[1] };
  }
  
  return ageRange;
}

// Format the age range for display
export function formatAgeRange(ageRange: { lower: number; upper: number } | [number, number] | undefined): string {
  const { lower, upper } = getAgeRangeBounds(ageRange);
  return `${lower}-${upper}`;
}

// Check if an age falls within a range
export function isAgeInRange(age: number, ageRange: { lower: number; upper: number } | [number, number] | undefined): boolean {
  const { lower, upper } = getAgeRangeBounds(ageRange);
  return age >= lower && age <= upper;
}
