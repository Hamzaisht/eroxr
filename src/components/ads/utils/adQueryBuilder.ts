
import { SupabaseClient } from "@supabase/supabase-js";
import { UseAdsQueryOptions } from "../hooks/useAdsQueryTypes";

/**
 * Builds the Supabase query for dating ads based on the provided options
 */
export const buildAdsQuery = (
  supabase: SupabaseClient, 
  options: UseAdsQueryOptions,
  currentUserId?: string
) => {
  const { 
    verifiedOnly, 
    premiumOnly, 
    filterOptions, 
    skipModeration, 
    userId 
  } = options;

  // Main query to get dating ads
  let adsQuery = supabase
    .from("dating_ads")
    .select(`
      *,
      profiles!dating_ads_user_id_fkey(
        is_paying_customer,
        id_verification_status
      )
    `)
    .eq("is_active", true);
  
  // If fetching for a specific profile
  if (userId) {
    console.log("Fetching ads for specific user ID:", userId);
    adsQuery = adsQuery.eq("user_id", userId);
    // When viewing someone's profile, we should see all their ads
    // No longer filtering by moderation status
  } else {
    // For the main dating page
    
    // No longer filtering by moderation status to show all ads
    
    // Only return verified profiles if requested
    if (verifiedOnly) {
      adsQuery = adsQuery.eq("profiles.id_verification_status", "verified");
    }
    
    // Only return premium profiles if requested
    if (premiumOnly) {
      adsQuery = adsQuery.eq("profiles.is_paying_customer", true);
    }
    
    // Apply any additional filters from filterOptions
    if (filterOptions?.country) {
      adsQuery = adsQuery.eq("country", filterOptions.country);
    }
    
    if (filterOptions?.userType) {
      adsQuery = adsQuery.eq("user_type", filterOptions.userType);
    }
    
    if (filterOptions?.minAge && filterOptions?.maxAge) {
      // Using PostgreSQL's range operators for age filtering
      adsQuery = adsQuery.overlaps("age_range", `[${filterOptions.minAge},${filterOptions.maxAge}]`);
    }
  }

  return adsQuery;
};

/**
 * Fetch pending ads for the current user
 */
export const fetchPendingUserAds = async (
  supabase: SupabaseClient,
  currentUserId: string
) => {
  if (!currentUserId) return [];

  const { data: pendingAds, error: pendingError } = await supabase
    .from("dating_ads")
    .select(`
      *,
      profiles!dating_ads_user_id_fkey(
        is_paying_customer,
        id_verification_status
      )
    `)
    .eq("is_active", true)
    .eq("moderation_status", "pending")
    .eq("user_id", currentUserId)
    .order("created_at", { ascending: false });
    
  if (pendingError) {
    console.error("Error fetching pending ads:", pendingError);
    return [];
  }
  
  return pendingAds || [];
};
