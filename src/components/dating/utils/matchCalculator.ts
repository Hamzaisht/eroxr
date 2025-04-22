
import { DatingAd } from "@/components/ads/types/dating";

/**
 * Calculate compatibility score between two profiles
 * Uses weighted factors like interests, age range, location, etc.
 */
export function calculateMatchPercentage(userProfile: DatingAd | null, otherProfile: DatingAd): number {
  // If no user profile, return a random score between 65-95%
  if (!userProfile) {
    return Math.floor(65 + Math.random() * 30);
  }
  
  let score = 70; // Base score
  let factors = 0;
  
  // Check interests overlap
  if (userProfile.interests && otherProfile.interests) {
    const userInterests = new Set(userProfile.interests);
    const sharedInterests = otherProfile.interests?.filter(interest => userInterests.has(interest)) || [];
    if (sharedInterests.length > 0) {
      score += Math.min(20, sharedInterests.length * 5); // Max 20 points
      factors++;
    }
  }
  
  // Check age range compatibility
  if (userProfile.age_range && otherProfile.preferred_age_range) {
    const userAge = (userProfile.age_range.lower + userProfile.age_range.upper) / 2;
    if (userAge >= otherProfile.preferred_age_range.lower && 
        userAge <= otherProfile.preferred_age_range.upper) {
      score += 10;
      factors++;
    }
  }
  
  // Check location proximity
  if (userProfile.country === otherProfile.country) {
    score += 5;
    if (userProfile.city === otherProfile.city) {
      score += 10;
    }
    factors++;
  }
  
  // Check relationship status compatibility
  if (userProfile.relationship_status && 
      otherProfile.looking_for.includes(userProfile.relationship_status)) {
    score += 15;
    factors++;
  }
  
  // Normalize score based on factors checked
  if (factors > 0) {
    return Math.min(98, Math.max(60, score));
  }
  
  // If we couldn't compare any factors, return a "decent" match
  return Math.floor(70 + Math.random() * 15);
}

/**
 * Get a descriptive label for a match percentage
 */
export function getMatchLabel(percentage: number): {
  label: string;
  color: string;
} {
  if (percentage >= 90) {
    return { label: "Perfect Match", color: "bg-green-500" };
  } else if (percentage >= 80) {
    return { label: "Great Match", color: "bg-emerald-500" };
  } else if (percentage >= 70) {
    return { label: "Good Match", color: "bg-blue-500" };
  } else {
    return { label: "Potential Match", color: "bg-indigo-500" };
  }
}
