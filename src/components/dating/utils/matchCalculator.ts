
import { DatingAd } from "@/components/ads/types/dating";

/**
 * Calculate match percentage between user profile and another profile
 */
export const calculateMatchPercentage = (userProfile: DatingAd | null, otherProfile: DatingAd): number => {
  if (!userProfile) return 50; // Default match percentage
  
  let score = 0;
  let totalFactors = 0;
  
  // Location matching
  if (userProfile.city && otherProfile.city) {
    if (userProfile.city.toLowerCase() === otherProfile.city.toLowerCase()) {
      score += 30;
    } else if (userProfile.country === otherProfile.country) {
      score += 15;
    }
    totalFactors += 30;
  }
  
  // Tags/interests matching
  if (userProfile.tags && otherProfile.tags && userProfile.tags.length > 0 && otherProfile.tags.length > 0) {
    const userTags = new Set(userProfile.tags.map(tag => tag.toLowerCase()));
    const otherTags = otherProfile.tags.map(tag => tag.toLowerCase());
    
    let matchingTags = 0;
    for (const tag of otherTags) {
      if (userTags.has(tag)) {
        matchingTags++;
      }
    }
    
    const tagMatchScore = Math.min(30, (matchingTags / Math.max(1, userTags.size)) * 30);
    score += tagMatchScore;
    totalFactors += 30;
  }
  
  // Age preferences matching
  if (userProfile.preferred_age_range && otherProfile.age_range) {
    const userMinAge = userProfile.preferred_age_range.lower || userProfile.preferred_age_range[0];
    const userMaxAge = userProfile.preferred_age_range.upper || userProfile.preferred_age_range[1];
    const otherMinAge = otherProfile.age_range.lower || otherProfile.age_range[0];
    const otherMaxAge = otherProfile.age_range.upper || otherProfile.age_range[1];
    
    // If the age ranges overlap
    if (userMinAge <= otherMaxAge && userMaxAge >= otherMinAge) {
      // Calculate how much they overlap
      const overlap = Math.min(userMaxAge, otherMaxAge) - Math.max(userMinAge, otherMinAge);
      const userRange = userMaxAge - userMinAge;
      const overlapScore = Math.min(20, (overlap / Math.max(1, userRange)) * 20);
      score += overlapScore;
    }
    totalFactors += 20;
  }
  
  // Relationship compatibility
  if (userProfile.looking_for && otherProfile.relationship_status) {
    const lookingFor = Array.isArray(userProfile.looking_for) ? userProfile.looking_for : [userProfile.looking_for];
    
    if (lookingFor.includes(otherProfile.relationship_status) || lookingFor.includes('any')) {
      score += 20;
    }
    totalFactors += 20;
  }
  
  // Calculate final percentage
  const finalScore = totalFactors > 0 ? Math.round((score / totalFactors) * 100) : 50;
  
  // Cap between 30 and 100
  return Math.min(100, Math.max(30, finalScore));
};

/**
 * Get label information based on match percentage
 */
export const getMatchLabel = (percentage: number) => {
  if (percentage >= 90) {
    return { label: "Perfect Match", color: "bg-green-500", textColor: "text-white" };
  } else if (percentage >= 75) {
    return { label: "Great Match", color: "bg-emerald-500", textColor: "text-white" };
  } else if (percentage >= 60) {
    return { label: "Good Match", color: "bg-blue-500", textColor: "text-white" };
  } else if (percentage >= 45) {
    return { label: "Moderate Match", color: "bg-amber-500", textColor: "text-white" };
  } else {
    return { label: "Low Match", color: "bg-red-500", textColor: "text-white" };
  }
};
