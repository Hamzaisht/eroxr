
/**
 * Extract values from age range union type
 * @param ageRange Age range as object or tuple
 * @returns Consistent object with lower and upper values
 */
export function getAgeRangeValues(ageRange?: { lower: number; upper: number } | [number, number]): { lower: number; upper: number } {
  if (!ageRange) {
    return { lower: 18, upper: 99 };
  }
  
  if (Array.isArray(ageRange)) {
    return { lower: ageRange[0], upper: ageRange[1] };
  }
  
  return ageRange;
}
