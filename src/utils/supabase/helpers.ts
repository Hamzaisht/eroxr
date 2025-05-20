import { Database } from "@/integrations/supabase/types/database.types";
import { AvailabilityStatus } from "@/utils/media/types";

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
export function asColumnName<T extends Record<string, any>>(columnName: keyof T): string {
  return columnName as string;
}

/**
 * Helper function to call the set_request_user_id RPC function
 * This should be called before making authenticated database queries
 */
export async function ensureUserIdSet(): Promise<void> {
  try {
    const { data, error } = await supabase.rpc('set_request_user_id');
    if (error) {
      console.error("Failed to set user ID for RLS optimization:", error);
    }
  } catch (error) {
    console.error("Exception setting user ID for RLS:", error);
  }
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
  return (data as any[]).filter(item => item && typeof item === 'object') as T[];
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

/**
 * Helper function for safely accessing nested properties
 */
export function safeGet<T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined {
  return obj ? obj[key] : undefined;
}

/**
 * Helper for casting database column values
 * Ensures type safety when using column values in Supabase queries
 */
export function asColumnValue<T>(value: T): T {
  return value;
}
