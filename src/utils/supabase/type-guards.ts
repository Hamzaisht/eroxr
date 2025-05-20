
import { Database } from "@/integrations/supabase/types/database.types";
import { PostgrestFilterBuilder } from "@supabase/supabase-js";

// Type definitions for database tables
export type Tables = Database['public']['Tables'];

// Type-safe table row types
export type ProfileRow = Tables['profiles']['Row'];
export type ProfileUpdate = Tables['profiles']['Update'];
export type ProfileInsert = Tables['profiles']['Insert'];

export type PostRow = Tables['posts']['Row'];
export type PostUpdate = Tables['posts']['Update'];
export type PostInsert = Tables['posts']['Insert'];

export type ReportRow = Tables['reports']['Row'];
export type ReportUpdate = Tables['reports']['Update'];
export type ReportInsert = Tables['reports']['Insert'];

export type AdminLogRow = Tables['admin_logs']['Row'];
export type AdminLogInsert = Tables['admin_logs']['Insert'];

// Additional table types needed by components
export type DatingAdRow = Tables['dating_ads']['Row'];
export type DatingAdUpdate = Tables['dating_ads']['Update'];

export type StoryRow = Tables['stories']['Row'];
export type StoryUpdate = Tables['stories']['Update'];

export type LiveStreamRow = Tables['live_streams']['Row'];
export type LiveStreamUpdate = Tables['live_streams']['Update'];

export type IdVerificationRow = Tables['id_verifications']['Row'];
export type IdVerificationUpdate = Tables['id_verifications']['Update'];

export type UserSubscriptionRow = Tables['user_subscriptions']['Row'];
export type UserSubscriptionUpdate = Tables['user_subscriptions']['Update'];

export type CreatorSubscriptionRow = Tables['creator_subscriptions']['Row'];
export type CreatorSubscriptionUpdate = Tables['creator_subscriptions']['Update'];

// Profile status type definition
export type ProfileStatus = 'online' | 'offline' | 'away' | 'busy';

// Type-safe helpers for database operations
export function safeProfileUpdate(data: ProfileUpdate): ProfileUpdate {
  return data;
}

export function safePostInsert(data: PostInsert): PostInsert {
  return data;
}

export function safeReportUpdate(data: ReportUpdate): ReportUpdate {
  return data;
}

export function safeAdminLogInsert(data: AdminLogInsert): AdminLogInsert {
  return data;
}

// Additional safe operation helpers
export function safeDatingAdUpdate(data: DatingAdUpdate): DatingAdUpdate {
  return data;
}

export function safeStoryUpdate(data: StoryUpdate): StoryUpdate {
  return data;
}

export function safeLiveStreamUpdate(data: LiveStreamUpdate): LiveStreamUpdate {
  return data;
}

export function safeIdVerificationUpdate(data: IdVerificationUpdate): IdVerificationUpdate {
  return data;
}

// Type-safe filter helpers
export function safeProfileFilter<K extends keyof ProfileRow>(column: K, value: ProfileRow[K]): [string, any] {
  return [column as string, value];
}

export function safeReportFilter<K extends keyof ReportRow>(column: K, value: ReportRow[K]): [string, any] {
  return [column as string, value];
}

export function safeDatingAdFilter<K extends keyof DatingAdRow>(column: K, value: DatingAdRow[K]): [string, any] {
  return [column as string, value];
}

export function safeStoryFilter<K extends keyof StoryRow>(column: K, value: StoryRow[K]): [string, any] {
  return [column as string, value];
}

export function safeLiveStreamFilter<K extends keyof LiveStreamRow>(column: K, value: LiveStreamRow[K]): [string, any] {
  return [column as string, value];
}

export function safeIdVerificationFilter<K extends keyof IdVerificationRow>(column: K, value: IdVerificationRow[K]): [string, any] {
  return [column as string, value];
}

export function safeUserSubscriptionFilter<K extends keyof Tables['user_subscriptions']['Row']>(
  column: K, 
  value: Tables['user_subscriptions']['Row'][K]
): [string, any] {
  return [column as string, value];
}

export function safeCreatorSubscriptionFilter<K extends keyof Tables['creator_subscriptions']['Row']>(
  column: K, 
  value: Tables['creator_subscriptions']['Row'][K]
): [string, any] {
  return [column as string, value];
}

// Adding alias for creator_subscriptions filter since this is being used in the code
export const safeSubscriptionFilter = safeCreatorSubscriptionFilter;

export function safeUserSubscriptionUpdate(data: Tables['user_subscriptions']['Update']): Tables['user_subscriptions']['Update'] {
  return data;
}

// Apply a type-safe equals filter to a query builder
export function applyEqualsFilter<T extends object, K extends keyof T>(
  query: PostgrestFilterBuilder<any, any, any>,
  column: K,
  value: T[K]
): PostgrestFilterBuilder<any, any, any> {
  return query.eq(column as string, value);
}

// Helper for safely converting values to database values
export function toDbValue<T>(value: T): T {
  return value;
}

// Safely handle database query results
export function safeDatabaseQuery<T>(data: any): T | null {
  if (!data || typeof data === 'object' && 'error' in data) {
    return null;
  }
  return data as T;
}

// Helper function to check if a value exists
export function exists<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

// Safely access data
export function safeDataAccess<T>(data: T | null | undefined): T | null {
  return data !== null && data !== undefined ? data : null;
}

// Helper to safely access properties from potentially unknown objects
export function safeGet<T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined {
  if (!obj) return undefined;
  return obj[key];
}

// Convert string to valid profile status with type safety
export function toValidProfileStatus(status: string): ProfileStatus {
  const validStatuses: ProfileStatus[] = ['online', 'offline', 'away', 'busy'];
  if (validStatuses.includes(status as ProfileStatus)) {
    return status as ProfileStatus;
  }
  return 'offline'; // Default fallback
}

// Helper for user subscription status
export function asUserSubscriptionStatus(val: string): "active" | "inactive" | "pending" {
  if (val === "active") return "active";
  if (val === "inactive") return "inactive";
  return "pending";
}

// Helper for safely checking if data is an array
export function isArrayData<T>(data: unknown): data is T[] {
  return Array.isArray(data);
}
