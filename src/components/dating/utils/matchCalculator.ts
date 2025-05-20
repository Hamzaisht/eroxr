
import { DatingAd } from '@/types/dating';
import { getLowerAgeValue, getUpperAgeValue } from '@/utils/dating/ageRangeHelper';

/**
 * Calculate percentage match between two dating profiles
 */
export function calculateMatchPercentage(userProfile: DatingAd | null, ad: DatingAd): number {
  if (!userProfile) return 50; // Default match percentage for users without profiles
  
  let score = 0;
  let totalCriteria = 0;
  
  // Match by relationship status
  if (userProfile.relationship_status && ad.relationship_status) {
    totalCriteria++;
    if (userProfile.relationship_status === ad.relationship_status) {
      score++;
    }
  }
  
  // Match by interests overlap
  if (userProfile.interests?.length && ad.interests?.length) {
    totalCriteria++;
    const userInterests = new Set(userProfile.interests);
    const adInterests = new Set(ad.interests);
    const commonInterests = [...userInterests].filter(x => adInterests.has(x));
    if (commonInterests.length > 0) {
      score += commonInterests.length / Math.max(userInterests.size, adInterests.size);
    }
  }
  
  // Match by age range preferences
  if (userProfile.preferred_age_range && ad.age) {
    totalCriteria++;
    const lowerAge = getLowerAgeValue(userProfile.preferred_age_range);
    const upperAge = getUpperAgeValue(userProfile.preferred_age_range);
    if (ad.age >= lowerAge && ad.age <= upperAge) {
      score++;
    }
  }
  
  if (userProfile.age && ad.preferred_age_range) {
    totalCriteria++;
    const lowerAge = getLowerAgeValue(ad.preferred_age_range);
    const upperAge = getUpperAgeValue(ad.preferred_age_range);
    if (userProfile.age >= lowerAge && userProfile.age <= upperAge) {
      score++;
    }
  }
  
  // Calculate percentage
  const matchPercentage = totalCriteria > 0
    ? Math.round((score / totalCriteria) * 100)
    : 50; // Default to 50% if no criteria matched
    
  // Ensure matchPercentage is within bounds
  return Math.max(20, Math.min(100, matchPercentage));
}

/**
 * Get a descriptive label based on match percentage
 */
export function getMatchLabel(matchPercentage: number): { label: string; color: string } {
  if (matchPercentage >= 90) {
    return { label: 'Perfect Match', color: 'text-green-500' };
  } else if (matchPercentage >= 75) {
    return { label: 'Great Match', color: 'text-emerald-400' };
  } else if (matchPercentage >= 60) {
    return { label: 'Good Match', color: 'text-blue-400' };
  } else if (matchPercentage >= 40) {
    return { label: 'Fair Match', color: 'text-yellow-400' };
  } else {
    return { label: 'Low Match', color: 'text-gray-400' };
  }
}
