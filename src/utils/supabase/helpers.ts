
import { Database } from "@/integrations/supabase/types/database.types";
import { AvailabilityStatus } from "@/utils/media/types";

/**
 * Safely converts a UUID string to the format expected by Supabase
 */
export function toDbValue(value: string): string {
  return value;
}

/**
 * Safely converts a UUID string to the format expected by Supabase
 */
export function asUUID(value: string): string {
  return value;
}

/**
 * Safely access data with fallback
 */
export function safeDataAccess<T, F>(data: T | null | undefined, fallback: F): T | F {
  return data !== null && data !== undefined ? data : fallback;
}

/**
 * Extract a profile object safely
 */
export function extractProfile<T>(profile: T | null | undefined): T | null {
  if (!profile) return null;
  return profile;
}

/**
 * Converts status string to AvailabilityStatus enum
 */
export function convertToStatus(status?: string | null): AvailabilityStatus {
  if (!status) return AvailabilityStatus.OFFLINE;
  
  switch (status.toLowerCase()) {
    case 'online':
      return AvailabilityStatus.ONLINE;
    case 'away':
      return AvailabilityStatus.AWAY;
    case 'busy':
      return AvailabilityStatus.BUSY;
    case 'invisible':
      return AvailabilityStatus.INVISIBLE;
    default:
      return AvailabilityStatus.OFFLINE;
  }
}

/**
 * Type assertion helper for Supabase updates
 */
export function asProfileUpdate(data: any): Database['public']['Tables']['profiles']['Update'] {
  return data as Database['public']['Tables']['profiles']['Update'];
}

/**
 * Type assertion helper for database tables
 */
export function asDbUpdate<T = any>(data: any): T {
  return data as T;
}

/**
 * Replace all instances of a string with another string
 */
export function replaceAllString(str: string, find: string, replace: string): string {
  return str.split(find).join(replace);
}

/**
 * Check if object is of error type
 */
export function isErrorObject(obj: any): boolean {
  return obj && typeof obj === 'object' && 'error' in obj;
}

/**
 * Safe cast for database query results
 */
export function safeCast<T>(data: any): T[] {
  if (!data || isErrorObject(data)) return [];
  return data as T[];
}
