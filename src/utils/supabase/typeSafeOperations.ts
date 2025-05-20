
import { supabase } from "@/integrations/supabase/client";

/**
 * Ensures the user ID is set for performance optimization with RLS policies
 * @returns Promise resolving when user ID is set
 */
export async function ensureUserIdSet(): Promise<void> {
  try {
    // Call the function to set the user ID in the session
    // This uses the secure set_request_user_id function
    await supabase.rpc('set_request_user_id');
  } catch (error) {
    console.info('User ID already set or not applicable');
  }
}

/**
 * Get active dating ads with location using the secure function
 */
export async function getActiveAdsWithLocation(options?: any) {
  return supabase.rpc('get_active_ads_with_location', options || {});
}

/**
 * Get trending content using the secure function
 */
export async function getTrendingContent(options?: any) {
  return supabase.rpc('get_trending_content', options || {});
}
