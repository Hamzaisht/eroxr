
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
    
    // Create a user object from available data
    const user = {
      id: ad.user_id || '',
      username: "User", // Fallback username
      avatar_url: ad.avatar_url || null
    };
    
    return {
      ...ad,
      age_range: ageRange,
      user: user,
      // Set defaults for optional fields if they don't exist
      is_verified: ad.is_verified || false,
      is_premium: ad.is_premium || false,
      view_count: ad.view_count || 0,
      message_count: ad.message_count || 0,
      moderation_status: ad.moderation_status || 'approved',
      avatar_url: ad.avatar_url || null,
      video_url: ad.video_url || null
    } as DatingAd;
  });
};
