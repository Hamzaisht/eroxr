
import { PostgrestError } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types/database.types';
import { AvailabilityStatus } from '@/utils/media/types';

/**
 * Type guard to check if the response has data
 */
export function isDataResponse<T>(
  response: { data: T; error: null } | { data: null; error: PostgrestError }
): response is { data: T; error: null } {
  return response.error === null && response.data !== null;
}

/**
 * Helper function to safely access nested properties on potentially null objects
 */
export function safelyAccessProperty<T, K extends keyof T>(obj: T | null | undefined, property: K): T[K] | undefined {
  if (obj && property in obj) {
    return obj[property];
  }
  return undefined;
}

/**
 * Type-safe conversion for status strings to our AvailabilityStatus enum
 */
export function convertToStatus(status: string | null | undefined): 'online' | 'offline' | 'away' | 'busy' {
  if (!status) return 'offline';
  
  // Ensure status is one of the allowed values
  if (['online', 'offline', 'away', 'busy'].includes(status)) {
    return status as 'online' | 'offline' | 'away' | 'busy';
  }
  
  return 'offline';
}

/**
 * Type-safe way to cast string IDs for Supabase equality operations
 * This function casts a string to the UUID type expected by Supabase
 */
export function asUUID(id: string | undefined) {
  if (!id) return undefined;
  return id as unknown as Database['public']['Tables']['profiles']['Row']['id'];
}

/**
 * Safe data access helper for Supabase query results
 * Handles error responses gracefully and provides default values
 */
export function safeDataAccess<T, K extends keyof T>(
  queryResult: { data: T | null; error: PostgrestError | null },
  property: K,
  defaultValue: T[K]
): T[K] {
  if (queryResult.error || !queryResult.data) {
    return defaultValue;
  }
  return queryResult.data[property] ?? defaultValue;
}

/**
 * Helper to check if a Supabase query result has an error
 */
export function hasQueryError(result: { error: PostgrestError | null }): boolean {
  return result.error !== null;
}

/**
 * Helper to safely extract a profile from a query result
 */
export function extractProfile<T>(result: { data: T | null; error: PostgrestError | null }): T | null {
  if (result.error || !result.data) {
    console.error("Error fetching profile:", result.error);
    return null;
  }
  return result.data;
}
