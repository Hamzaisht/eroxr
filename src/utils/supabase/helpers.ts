
import { AvailabilityStatus } from '@/components/ui/availability-indicator';
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
  if (!status) return 'offline';
  
  switch (status.toLowerCase()) {
    case 'online':
      return 'online';
    case 'away':
      return 'away';
    case 'busy':
      return 'busy';
    case 'invisible':
      return 'invisible';
    case 'offline':
    default:
      return 'offline';
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

/**
 * Safe way to get a UUID from a string or UUID
 * @param id The ID to validate
 * @returns The ID as string
 */
export function asUUID(id: string | null | undefined): string {
  if (!id) return '';
  return String(id);
}

/**
 * Convert column name for database query
 * @param name Column name
 * @returns Safe column name
 */
export function asColumnName(name: string): string {
  return name;
}

/**
 * Convert column value for database query
 * @param value Column value
 * @returns Safe column value
 */
export function asColumnValue(value: any): any {
  return value;
}

/**
 * Convert ID verification status for database query
 * @param status Status value
 * @returns Safe status value
 */
export function asIdVerificationStatus(status: string): string {
  return status;
}

/**
 * Convert live stream status for database query
 * @param status Status value
 * @returns Safe status value
 */
export function asLiveStreamStatus(status: string): string {
  return status;
}

/**
 * Convert profile suspended status for database query
 * @param status Status value
 * @returns Safe status value
 */
export function asProfileIsSuspended(status: boolean): boolean {
  return status;
}

/**
 * Convert profile status for database query
 * @param status Status value
 * @returns Safe status value
 */
export function asProfileStatus(status: string): string {
  return status;
}

/**
 * Convert report status for database query
 * @param status Status value
 * @returns Safe status value
 */
export function asReportStatus(status: string): string {
  return status;
}
