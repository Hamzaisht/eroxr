
import { PostgrestError } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types/database.types';

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
 */
export function asUUID(id: string) {
  return id as unknown as Database['public']['Tables']['profiles']['Row']['id'];
}
