
import { AvailabilityStatus } from '@/utils/media/types';
import { Database } from '@/integrations/supabase/types';

/**
 * Safe cast of data to expected type
 * @param data Data to cast
 * @returns Typed data
 */
export function safeCast<T>(data: any): T {
  return data as T;
}

/**
 * Convert database profile status to AvailabilityStatus enum
 * @param status Profile status string from database
 * @returns AvailabilityStatus enum value
 */
export function convertToStatus(status: string | null): AvailabilityStatus {
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
    case 'offline':
    default:
      return AvailabilityStatus.OFFLINE;
  }
}

/**
 * Safe data access with fallback
 * @param data Data to access safely
 * @param fallback Fallback value if data is null/undefined
 * @returns The data or fallback
 */
export function safeDataAccess<T>(data: T | null | undefined, fallback: T): T {
  return data !== null && data !== undefined ? data : fallback;
}

/**
 * Safely get a profile object with default values
 * @param profile The profile to extract data from
 * @returns A safe profile object
 */
export function getSafeProfile(profile: any) {
  if (!profile) return null;
  
  return {
    id: profile.id || '',
    username: profile.username || '',
    avatar_url: profile.avatar_url || '',
    bio: profile.bio || '',
    status: profile.status || 'offline',
    location: profile.location || '',
    banner_url: profile.banner_url || '',
    verified: Boolean(profile.is_verified || profile.id_verification_status === 'verified'),
    premium: Boolean(profile.is_premium || profile.is_paying_customer)
  };
}

/**
 * Convert a value to safe database value
 * @param value Value to convert
 * @returns Safe database value
 */
export function toDbValue<T>(value: T): T {
  return value;
}
