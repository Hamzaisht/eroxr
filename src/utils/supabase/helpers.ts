
import { Database } from "@/integrations/supabase/types/database.types";
import { AvailabilityStatus } from "@/utils/media/types";
import { PostgrestFilterBuilder } from "@supabase/supabase-js";

// Type for profile updates
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
type FollowersInsert = Database['public']['Tables']['followers']['Insert'];
type SubscriptionsInsert = Database['public']['Tables']['creator_subscriptions']['Insert'];

// Strongly typed column types for specific tables
type ProfileStatus = Database['public']['Tables']['profiles']['Row']['status'];
type DatingAdCountry = Database['public']['Tables']['dating_ads']['Row']['country'];
type DatingAdUserType = Database['public']['Tables']['dating_ads']['Row']['user_type'];
type StoryIsActive = Database['public']['Tables']['stories']['Row']['is_active'];
type ProfileIsSuspended = Database['public']['Tables']['profiles']['Row']['is_suspended'];
type ProfileIsPayingCustomer = Database['public']['Tables']['profiles']['Row']['is_paying_customer'];
type ReportStatus = Database['public']['Tables']['reports']['Row']['status'];
type IdVerificationStatus = Database['public']['Tables']['id_verifications']['Row']['status'];
type LiveStreamStatus = Database['public']['Tables']['live_streams']['Row']['status'];
type UserID = Database['public']['Tables']['profiles']['Row']['id'];
type UserSubscriptionStatus = Database['public']['Tables']['user_subscriptions']['Row']['status'];

/**
 * Generic type-safe helper for database column values
 * Use for .eq(), .in(), etc. operations with proper type assertion
 */
export function asDatabaseColumnValue<T>(value: T): T {
  return value as T;
}

/**
 * Helper that casts a column name to the correct keyof type for Supabase filters
 */
export function asColumnName<T extends Record<string, any>>(columnName: keyof T): keyof T {
  return columnName;
}

/**
 * Safely converts a UUID string for use in database queries
 */
export function asUUID(value: string): UserID {
  return value as unknown as UserID;
}

/**
 * Helper for casting boolean values for database queries
 */
export function asBooleanValue<T extends boolean>(value: T): T {
  return value as unknown as T;
}

/**
 * Helper for casting string values for database queries
 */
export function asStringValue<T extends string>(value: T): T {
  return value as unknown as T;
}

/**
 * Helper for dating_ads country enum value
 */
export function asDatingAdCountry(value: string): DatingAdCountry {
  return value as unknown as DatingAdCountry;
}

/**
 * Helper for dating_ads user_type enum value
 */
export function asDatingAdUserType(value: string): DatingAdUserType {
  return value as unknown as DatingAdUserType;
}

/**
 * Helper for profiles status value
 */
export function asProfileStatus(value: string): ProfileStatus {
  return value as unknown as ProfileStatus;
}

/**
 * Helper for user subscription status
 */
export function asUserSubscriptionStatus(value: string): UserSubscriptionStatus {
  return value as unknown as UserSubscriptionStatus;
}

// Specialized helpers for specific table columns
export function asReportStatus(value: string): ReportStatus {
  return value as unknown as ReportStatus;
}

export function asIdVerificationStatus(value: string): IdVerificationStatus {
  return value as unknown as IdVerificationStatus; 
}

export function asLiveStreamStatus(value: string): LiveStreamStatus {
  return value as unknown as LiveStreamStatus;
}

export function asProfileIsSuspended(value: boolean): ProfileIsSuspended {
  return value as unknown as ProfileIsSuspended;
}

export function asProfileIsPayingCustomer(value: boolean): ProfileIsPayingCustomer {
  return value as unknown as ProfileIsPayingCustomer;
}

export function asStoryIsActive(value: boolean): StoryIsActive {
  return value as unknown as StoryIsActive;
}

/**
 * Safely access data with fallback
 */
export function safeDataAccess<T, F>(data: T | null | undefined, fallback: F): T | F {
  return data !== null && data !== undefined ? data : fallback;
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
  return query.eq(column, value);
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
export function getStatusForProfile(status: AvailabilityStatus): ProfileStatus {
  // Convert enum value to lowercase and handle the 'invisible' case
  const statusString = status.toString().toLowerCase();
  if (statusString === 'invisible') return 'offline' as ProfileStatus;
  
  return statusString as ProfileStatus;
}

/**
 * Safe function to update profile status
 */
export function prepareProfileStatusUpdate(status: AvailabilityStatus): ProfileUpdate {
  const profileStatus = getStatusForProfile(status);
  return asProfileUpdate({
    status: profileStatus
  });
}

// Helper functions for safely extracting creator information
export function extractCreator(data: any) {
  if (!data) return null;
  return data.profiles || data.creator || null;
}

/**
 * Helper function for safely accessing nested properties
 */
export function safeGet<T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined {
  return obj ? obj[key] : undefined;
}

/**
 * Type assertion helper for database tables
 */
export function asDbUpdate<T = any>(data: any): T {
  return data as T;
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
 * Replace all instances of a string with another string
 */
export function replaceAllString(str: string, find: string, replace: string): string {
  return str.split(find).join(replace);
}

/**
 * Helper for casting database column values
 * For use with eq, in, etc. methods on supabase queries
 */
export function asColumnValue<T>(value: T): T {
  return value;
}

/**
 * Strongly-typed helper function for updating profiles
 */
export function prepareProfileUpdate(data: Partial<ProfileUpdate>): ProfileUpdate {
  return asProfileUpdate(data);
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
