
import { Database } from "@/integrations/supabase/types/database.types";
import { AvailabilityStatus } from "@/utils/media/types";
import { PostgrestFilterBuilder } from "@supabase/supabase-js";

// Type for profile updates
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
type FollowersInsert = Database['public']['Tables']['followers']['Insert'];
type SubscriptionsInsert = Database['public']['Tables']['creator_subscriptions']['Insert'];

/**
 * Safely converts a value to the format expected by Supabase
 * This is a type assertion helper for column equality filters
 */
export function toDbValue<T>(value: T): T {
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
 * Safe cast for database query results
 */
export function safeCast<T>(data: any): T[] {
  if (!data || isErrorObject(data)) return [];
  return data as T[];
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
 * Type assertion helper for Supabase profile updates
 */
export function asProfileUpdate(data: Partial<ProfileUpdate>): ProfileUpdate {
  return data as ProfileUpdate;
}

/**
 * Helper to apply .eq() filter with proper typing
 */
export function applyEqualsFilter<T = any>(
  query: PostgrestFilterBuilder<T>,
  column: string,
  value: any
): PostgrestFilterBuilder<T> {
  return query.eq(column, toDbValue(value));
}

/**
 * Helper to construct typed insert data for followers
 */
export function createFollowerData(followerId: string, followingId: string): FollowersInsert {
  return {
    follower_id: followerId,
    following_id: followingId
  } as FollowersInsert;
}

/**
 * Helper to construct typed insert data for subscriptions
 */
export function createSubscriptionData(userId: string, creatorId: string): SubscriptionsInsert {
  return {
    user_id: userId,
    creator_id: creatorId
  } as SubscriptionsInsert;
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
 * Safe profile access for UI
 */
export function getSafeProfile(profile: any) {
  if (!profile || isErrorObject(profile)) {
    return {
      username: "User",
      avatar_url: null,
      is_paying_customer: false,
      id_verification_status: "pending",
      status: "offline"
    };
  }
  
  return profile;
}

/**
 * Get enum-compatible status value for profiles
 */
export function getStatusForProfile(status: AvailabilityStatus): 'online' | 'offline' | 'away' | 'busy' {
  // Convert enum value to lowercase and handle the 'invisible' case
  const statusString = status.toString().toLowerCase();
  if (statusString === 'invisible') return 'offline';
  
  return statusString as 'online' | 'offline' | 'away' | 'busy';
}

/**
 * Safe function to update profile status
 */
export function prepareProfileStatusUpdate(status: AvailabilityStatus): ProfileUpdate {
  return {
    status: getStatusForProfile(status)
  };
}

/**
 * Helper for casting database column values
 * For use with eq, in, etc. methods on supabase queries
 */
export function asColumnValue<T>(value: T): T {
  return value;
}

/**
 * Helper for casting boolean values for database queries
 * For use with eq, in, etc. methods on supabase queries
 */
export function asBooleanValue(value: boolean): boolean {
  return value;
}

/**
 * Helper for casting string values for database queries
 * For use with eq, in, etc. methods on supabase queries
 */
export function asStringValue(value: string): string {
  return value;
}

/**
 * Strongly-typed helper function for updating profiles
 */
export function prepareProfileUpdate(data: Partial<ProfileUpdate>): ProfileUpdate {
  return data as ProfileUpdate;
}

/**
 * Helper function for safely accessing nested properties
 */
export function safeGet<T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined {
  return obj ? obj[key] : undefined;
}

/**
 * Helper function for safely creating VideoCard props
 */
export function createVideoCardProps(video: any) {
  return {
    id: safeGet(video, 'id') || '',
    title: safeGet(video, 'title') || '',
    thumbnailUrl: safeGet(video, 'thumbnail_url') || '',
    duration: safeGet(video, 'duration') || 0,
    views: safeGet(video, 'view_count') || 0,
    createdAt: safeGet(video, 'created_at') || '',
    creatorId: safeGet(video, 'creator_id') || '',
    creatorName: safeGet(safeGet(video, 'profiles'), 'username') || 'Unknown',
    creatorAvatar: safeGet(safeGet(video, 'profiles'), 'avatar_url') || '',
  };
}

/**
 * Type-safe helper for database enum values
 */
export function asEnumValue<T extends string>(value: T): T {
  return value;
}

/**
 * Helper for updating records in the database with correct typing
 * @param update Object containing fields to update
 * @returns Properly typed update object
 */
export function updateRecord<T extends object>(table: string, id: string, update: T) {
  return { id, ...update };
}

/**
 * Extract creator information safely from related data
 */
export function extractCreator(data: any) {
  if (!data) return null;
  return data.profiles || data.creator || null;
}
