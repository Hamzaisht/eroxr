
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
    userId,
    tagFilter
  } = options;

  // Main query to get dating ads
  let adsQuery = supabase
    .from("dating_ads")
    .select("*");
  
  // If fetching for a specific profile
  if (userId) {
    console.log("Fetching ads for specific user ID:", userId);
    adsQuery = adsQuery.eq("user_id", userId);
  } else {
    // For the main dating page
    
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

    // Filter by specific tag if provided
    if (tagFilter) {
      adsQuery = adsQuery.contains('tags', [tagFilter]);
    }
    
    // Filter for verified users only
    if (verifiedOnly) {
      adsQuery = adsQuery.eq("is_verified", true);
    }
    
    // Filter for premium users only
    if (premiumOnly) {
      adsQuery = adsQuery.eq("is_premium", true);
    }
  }

  // Filter to show only active ads
  adsQuery = adsQuery.eq("is_active", true);

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
    .select("*")
    .eq("is_active", true)
    .eq("user_id", currentUserId)
    .order("created_at", { ascending: false });
    
  if (pendingError) {
    console.error("Error fetching pending ads:", pendingError);
    return [];
  }
  
  return pendingAds || [];
};
