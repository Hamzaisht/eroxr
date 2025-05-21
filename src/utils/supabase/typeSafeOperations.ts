
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if a query error occurred
 * @param result Potential error object
 * @returns Whether the error is a query error
 */
export function isQueryError<T>(
  result: PostgrestSingleResponse<T> | null | undefined
): result is PostgrestSingleResponse<T> & { error: Error } {
  return !!result && 'error' in result && result.error !== null;
}

/**
 * Ensures a string value is returned, handling nulls and undefined
 * @param value The value to convert to string
 * @returns A safe string value
 */
export function safeString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}

/**
 * Helper to create type-safe column keys for Supabase queries
 * @param key The column key
 * @returns The same key with type assertion
 */
export function createKey<T extends string>(key: T): T {
  return key;
}

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
