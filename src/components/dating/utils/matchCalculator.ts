
import { DatingAd } from '@/components/ads/types/dating';

/**
 * Calculates a match percentage between two dating profiles
 * based on common interests, preferences, and compatibility factors
 */
export const calculateMatchPercentage = (userProfile: DatingAd | null, targetProfile: DatingAd | null): number => {
  if (!userProfile || !targetProfile) return 0;
  
  let score = 0;
  let possiblePoints = 0;
  
  // Match on interests (max 40 points)
  if (userProfile.interests && targetProfile.interests) {
    const commonInterests = userProfile.interests.filter(
      interest => targetProfile.interests?.includes(interest)
    );
    
    // Award points based on percentage of common interests
    const interestScore = Math.min(
      40, 
      Math.floor((commonInterests.length / Math.max(1, userProfile.interests.length)) * 40)
    );
    
    score += interestScore;
    possiblePoints += 40;
  }
  
  // Match on relationship preferences (max 30 points)
  if (userProfile.looking_for.includes(targetProfile.relationship_status) || 
      userProfile.looking_for.includes('any')) {
    score += 30;
  }
  possiblePoints += 30;
  
  // Match on age range (max 20 points)
  const userAgePreference = userProfile.preferred_age_range || { lower: 18, upper: 99 };
  const targetAgeRange = targetProfile.age_range;
  
  if (targetAgeRange.lower <= userAgePreference.upper && 
      targetAgeRange.upper >= userAgePreference.lower) {
    // Calculate how well the ranges overlap
    const overlap = Math.min(userAgePreference.upper, targetAgeRange.upper) - 
                   Math.max(userAgePreference.lower, targetAgeRange.lower);
    const userRange = userAgePreference.upper - userAgePreference.lower;
    const overlapPercent = Math.min(1, overlap / Math.max(1, userRange));
    
    score += Math.floor(overlapPercent * 20);
    possiblePoints += 20;
  }
  
  // Match on location (max 10 points)
  if (userProfile.country === targetProfile.country) {
    score += 5;
    
    // Additional points for same city
    if (userProfile.city === targetProfile.city) {
      score += 5;
    }
  }
  possiblePoints += 10;
  
  // Calculate percentage
  const percentage = Math.round((score / Math.max(1, possiblePoints)) * 100);
  
  return percentage;
};

/**
 * Returns a label describing the match quality
 */
export const getMatchLabel = (percentage: number): { label: string; color: string } => {
  if (percentage >= 90) {
    return { label: 'Perfect Match', color: 'text-green-500' };
  } else if (percentage >= 75) {
    return { label: 'Great Match', color: 'text-emerald-500' };
  } else if (percentage >= 60) {
    return { label: 'Good Match', color: 'text-blue-500' };
  } else if (percentage >= 40) {
    return { label: 'Fair Match', color: 'text-yellow-500' };
  } else {
    return { label: 'Low Compatibility', color: 'text-red-500' };
  }
};
