
import { DatingAd } from "@/components/ads/types/dating";

/**
 * Enhanced match calculation algorithm that takes into account more factors:
 * - Location proximity
 * - Age preference matching
 * - Tags/interests overlap
 * - Relationship type compatibility
 * - Drinking/smoking preferences
 * - Education/occupation compatibility
 * - Body type preference compatibility
 * - Language compatibility
 * 
 * This provides a more holistic matching score based on comprehensive profile data
 */
export const calculateMatchPercentage = (userProfile: DatingAd | null, otherProfile: DatingAd): number => {
  if (!userProfile) return 50; // Default match percentage
  
  let score = 0;
  let totalFactors = 0;
  
  // Location matching (30 points max)
  if (userProfile.city && otherProfile.city) {
    if (userProfile.city.toLowerCase() === otherProfile.city.toLowerCase()) {
      score += 30; // Perfect match for same city
    } else if (userProfile.country === otherProfile.country) {
      score += 15; // Partial match for same country
    }
    totalFactors += 30;
  }
  
  // Tags/interests matching (30 points max)
  if (userProfile.tags && otherProfile.tags && 
      userProfile.tags.length > 0 && otherProfile.tags.length > 0) {
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
  
  // Age preferences matching (20 points max)
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
  
  // Relationship compatibility (20 points max)
  if (userProfile.looking_for && otherProfile.relationship_status) {
    const lookingFor = Array.isArray(userProfile.looking_for) 
      ? userProfile.looking_for 
      : [userProfile.looking_for];
    
    if (lookingFor.includes(otherProfile.relationship_status) || lookingFor.includes('any')) {
      score += 20;
    }
    totalFactors += 20;
  }
  
  // Body type preference (10 points max)
  if (userProfile.body_type && otherProfile.body_type) {
    // Simple exact match check - this could be enhanced with preference matrices
    if (userProfile.body_type === otherProfile.body_type) {
      score += 10;
    } else {
      // Partial match for related body types
      const relatedBodyTypes = {
        'athletic': ['fit', 'muscular', 'toned'],
        'average': ['normal', 'medium'],
        'slim': ['slender', 'thin'],
        'curvy': ['full figured', 'voluptuous']
      };
      
      const userBodyType = userProfile.body_type.toLowerCase();
      const otherBodyType = otherProfile.body_type.toLowerCase();
      
      // @ts-ignore - Safely check if body types are related
      if (relatedBodyTypes[userBodyType]?.includes(otherBodyType) || 
          // @ts-ignore - Check the reverse relationship
          relatedBodyTypes[otherBodyType]?.includes(userBodyType)) {
        score += 5; // Partial match for related body types
      }
    }
    totalFactors += 10;
  }
  
  // Lifestyle compatibility (10 points max)
  let lifestyleScore = 0;
  let lifestyleFactors = 0;
  
  // Smoking preferences
  if (userProfile.smoking_status && otherProfile.smoking_status) {
    if (userProfile.smoking_status === otherProfile.smoking_status) {
      lifestyleScore += 5;
    } else if ((userProfile.smoking_status === "occasionally" && otherProfile.smoking_status === "never") ||
               (userProfile.smoking_status === "never" && otherProfile.smoking_status === "occasionally")) {
      lifestyleScore += 2; // Partial compatibility
    }
    lifestyleFactors += 5;
  }
  
  // Drinking preferences
  if (userProfile.drinking_status && otherProfile.drinking_status) {
    if (userProfile.drinking_status === otherProfile.drinking_status) {
      lifestyleScore += 5;
    } else if ((userProfile.drinking_status === "occasionally" && otherProfile.drinking_status === "never") ||
               (userProfile.drinking_status === "never" && otherProfile.drinking_status === "occasionally")) {
      lifestyleScore += 2; // Partial compatibility
    }
    lifestyleFactors += 5;
  }
  
  if (lifestyleFactors > 0) {
    score += lifestyleScore;
    totalFactors += lifestyleFactors;
  }
  
  // Educational/occupational compatibility (10 points max)
  let eduOccScore = 0;
  let eduOccFactors = 0;
  
  // Education level
  if (userProfile.education_level && otherProfile.education_level) {
    if (userProfile.education_level === otherProfile.education_level) {
      eduOccScore += 5;
    } else {
      // Create an education hierarchy
      const eduLevels = ["high_school", "some_college", "associates", "bachelors", "masters", "phd", "professional"];
      const userEduIndex = eduLevels.indexOf(userProfile.education_level);
      const otherEduIndex = eduLevels.indexOf(otherProfile.education_level);
      
      if (userEduIndex !== -1 && otherEduIndex !== -1) {
        // If they're within one level of each other
        if (Math.abs(userEduIndex - otherEduIndex) <= 1) {
          eduOccScore += 3; // Good compatibility
        } else if (Math.abs(userEduIndex - otherEduIndex) <= 2) {
          eduOccScore += 2; // Fair compatibility
        }
      }
    }
    eduOccFactors += 5;
  }
  
  // Languages compatibility (new factor - 10 points max)
  if (userProfile.languages && otherProfile.languages &&
      userProfile.languages.length > 0 && otherProfile.languages.length > 0) {
      
    const userLangs = new Set(userProfile.languages.map(lang => lang.toLowerCase()));
    const otherLangs = otherProfile.languages.map(lang => lang.toLowerCase());
    
    let commonLanguages = 0;
    for (const lang of otherLangs) {
      if (userLangs.has(lang)) {
        commonLanguages++;
      }
    }
    
    if (commonLanguages > 0) {
      score += Math.min(10, commonLanguages * 5); // 5 points per common language, max 10
      totalFactors += 10;
    }
  }
  
  if (eduOccFactors > 0) {
    score += eduOccScore;
    totalFactors += eduOccFactors;
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
