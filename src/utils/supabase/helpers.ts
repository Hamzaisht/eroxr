
import { Database } from "@/integrations/supabase/types/database.types";
import { AvailabilityStatus } from "@/utils/media/types";
import { PostgrestFilterBuilder } from "@supabase/supabase-js";

// Types for database tables
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];

export type StoryRow = Database["public"]["Tables"]["stories"]["Row"];
export type StoryUpdate = Database["public"]["Tables"]["stories"]["Update"];

export type DatingAdRow = Database["public"]["Tables"]["dating_ads"]["Row"];
export type DatingAdUpdate = Database["public"]["Tables"]["dating_ads"]["Update"];

export type SubscriptionRow = Database["public"]["Tables"]["creator_subscriptions"]["Row"];
export type SubscriptionInsert = Database["public"]["Tables"]["creator_subscriptions"]["Insert"];

export type FollowersInsert = Database["public"]["Tables"]["followers"]["Insert"];

// Strongly typed column references
export type ProfileColumns = keyof ProfileRow;
export type StoryColumns = keyof StoryRow;
export type DatingAdColumns = keyof DatingAdRow;
export type SubscriptionColumns = keyof SubscriptionRow;

/**
 * Convert status string to AvailabilityStatus enum
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
 * Helper function for subscription status
 */
export function asUserSubscriptionStatus(val: string): "active" | "inactive" | "pending" {
  if (val === "active") return "active";
  if (val === "inactive") return "inactive";
  return "pending";
}

/**
 * Type-safe helper for column names
 */
export function asColumnName<T extends Record<string, any>>(columnName: keyof T): keyof T {
  return columnName;
}

/**
 * Type-safe UUID conversion
 */
export function asUUID(value: string): string {
  return value;
}

/**
 * Type-safe boolean value for database queries
 */
export function asBooleanValue(value: boolean): boolean {
  return value;
}

/**
 * Type-safe string value for database queries
 */
export function asStringValue(value: string): string {
  return value;
}

/**
 * Type-safe helper for dating_ads country enum
 */
export function asDatingAdCountry(value: string): string {
  return value;
}

/**
 * Type-safe helper for dating_ads user_type enum
 */
export function asDatingAdUserType(value: string): string {
  return value;
}

/**
 * Type-safe helper for profiles status
 */
export function asProfileStatus(value: string): ProfileRow["status"] {
  return value as ProfileRow["status"];
}

/**
 * Type-safe helper for story is_active field
 */
export function asStoryIsActive(value: boolean): boolean {
  return value;
}

/**
 * Type-safe helper for profiles is_suspended field
 */
export function asProfileIsSuspended(value: boolean): boolean {
  return value;
}

/**
 * Type-safe helper for reports status field
 */
export function asReportStatus(value: string): string {
  return value;
}

/**
 * Type-safe helper for id_verifications status field
 */
export function asIdVerificationStatus(value: string): string {
  return value;
}

/**
 * Type-safe helper for live_streams status field
 */
export function asLiveStreamStatus(value: string): string {
  return value;
}

/**
 * Type-safe helper for profiles is_paying_customer field
 */
export function asProfileIsPayingCustomer(value: boolean): boolean {
  return value;
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
export function getStatusForProfile(status: AvailabilityStatus): ProfileRow["status"] {
  // Convert enum value to lowercase and handle the 'invisible' case
  const statusString = status.toString().toLowerCase();
  if (statusString === 'invisible') return 'offline';
  
  return statusString as ProfileRow["status"];
}

/**
 * Safe function to update profile status
 */
export function prepareProfileStatusUpdate(status: AvailabilityStatus): ProfileUpdate {
  const profileStatus = getStatusForProfile(status);
  return {
    status: profileStatus
  };
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
 * Type-safe function for applying filters with proper typing
 */
export function applyEqualsFilter<T extends Record<string, any>>(
  query: PostgrestFilterBuilder<T>,
  column: keyof T,
  value: any
): PostgrestFilterBuilder<T> {
  return query.eq(column, value);
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
export function createSubscriptionData(userId: string, creatorId: string): SubscriptionInsert {
  return {
    user_id: userId,
    creator_id: creatorId
  } as SubscriptionInsert;
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
  return {
    ...data,
  } as ProfileUpdate;
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
 * Type-safe utility to validate an object before sending to Supabase
 * @param data The data to validate
 * @param schema The expected schema structure
 * @returns A validated object that matches the schema
 */
export function validateDatabaseObject<T>(data: any, schema: T): T {
  const result: any = {};
  
  // Only include keys that exist in the schema
  for (const key in schema) {
    if (key in data) {
      result[key] = data[key];
    }
  }
  
  return result as T;
}
