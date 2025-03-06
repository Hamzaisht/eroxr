
import { DatingAd } from "../types/dating";
import { RawDatingAd } from "../hooks/useAdsQueryTypes";

/**
 * Transforms raw dating ads from Supabase into the proper DatingAd format
 */
export const transformRawAds = (rawAds: RawDatingAd[]): DatingAd[] => {
  // Remove duplicates (when merging results)
  const uniqueAds = Array.from(new Map(rawAds.map(ad => [ad.id, ad])).values());

  // Transform data to match DatingAd type with proper age_range conversion
  return uniqueAds.map(ad => {
    // Parse age_range from string to object if necessary
    const ageRange = typeof ad.age_range === 'string' 
      ? { 
          lower: parseInt(ad.age_range.replace(/[\[\]\(\)]/g, '').split(',')[0]),
          upper: parseInt(ad.age_range.replace(/[\[\]\(\)]/g, '').split(',')[1])
        }
      : ad.age_range;
    
    return {
      ...ad,
      age_range: ageRange,
      isUserVerified: ad.profiles?.id_verification_status === 'verified',
      isUserPremium: ad.profiles?.is_paying_customer === true,
      is_verified: ad.profiles?.id_verification_status === 'verified',
      is_premium: ad.profiles?.is_paying_customer === true
    } as DatingAd;
  });
};
