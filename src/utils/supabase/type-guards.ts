
import { Database } from "@/integrations/supabase/types/database.types";
import { PostgrestFilterBuilder } from "@supabase/supabase-js";

// Type definitions for database tables
export type Tables = Database['public']['Tables'];

// Type-safe table row types
export type ProfileRow = Tables['profiles']['Row'];
export type ProfileUpdate = Tables['profiles']['Update'];
export type ProfileInsert = Tables['profiles']['Insert'];

export type StoryRow = Tables['stories']['Row'];
export type StoryUpdate = Tables['stories']['Update'];
export type StoryInsert = Tables['stories']['Insert'];

export type DatingAdRow = Tables['dating_ads']['Row'];
export type DatingAdUpdate = Tables['dating_ads']['Update'];
export type DatingAdInsert = Tables['dating_ads']['Insert'];

export type SubscriptionRow = Tables['creator_subscriptions']['Row'];
export type SubscriptionInsert = Tables['creator_subscriptions']['Insert'];

export type UserSubscriptionRow = Tables['user_subscriptions']['Row'];
export type UserSubscriptionUpdate = Tables['user_subscriptions']['Update'];
export type UserSubscriptionInsert = Tables['user_subscriptions']['Insert'];

export type PostRow = Tables['posts']['Row'];
export type PostUpdate = Tables['posts']['Update'];
export type PostInsert = Tables['posts']['Insert'];

export type ReportRow = Tables['reports']['Row'];
export type ReportUpdate = Tables['reports']['Update'];
export type ReportInsert = Tables['reports']['Insert'];

export type LiveStreamRow = Tables['live_streams']['Row'];
export type IdVerificationRow = Tables['id_verifications']['Row'];
export type AdminLogRow = Tables['admin_logs']['Row'];
export type AdminLogInsert = Tables['admin_logs']['Insert'];

// Type-safe helpers for database operations
export function safeProfileUpdate(data: Partial<ProfileUpdate>): ProfileUpdate {
  return data as ProfileUpdate;
}

export function safePostInsert(data: Partial<PostInsert>): PostInsert {
  return data as PostInsert;
}

export function safeReportUpdate(data: Partial<ReportUpdate>): ReportUpdate {
  return data as ReportUpdate;
}

export function safeAdminLogInsert(data: Partial<AdminLogInsert>): AdminLogInsert {
  return data as AdminLogInsert;
}

// Type-safe filter helpers
export function safeStoryFilter<K extends keyof StoryRow>(column: K, value: StoryRow[K]): [string, any] {
  return [column as string, value];
}

export function safeDatingAdFilter<K extends keyof DatingAdRow>(column: K, value: DatingAdRow[K]): [string, any] {
  return [column as string, value];
}

export function safeSubscriptionFilter<K extends keyof SubscriptionRow>(column: K, value: SubscriptionRow[K]): [string, any] {
  return [column as string, value];
}

export function safeUserSubscriptionFilter<K extends keyof UserSubscriptionRow>(column: K, value: UserSubscriptionRow[K]): [string, any] {
  return [column as string, value];
}

export function safeProfileFilter<K extends keyof ProfileRow>(column: K, value: ProfileRow[K]): [string, any] {
  return [column as string, value];
}

export function safeReportFilter<K extends keyof ReportRow>(column: K, value: ReportRow[K]): [string, any] {
  return [column as string, value];
}

export function safeLiveStreamFilter<K extends keyof LiveStreamRow>(column: K, value: LiveStreamRow[K]): [string, any] {
  return [column as string, value];
}

export function safeIdVerificationFilter<K extends keyof IdVerificationRow>(column: K, value: IdVerificationRow[K]): [string, any] {
  return [column as string, value];
}

export function safeUserSubscriptionUpdate(data: Partial<UserSubscriptionUpdate>): UserSubscriptionUpdate {
  return data as UserSubscriptionUpdate;
}

// Apply a type-safe equals filter to a query builder
export function applyEqualsFilter<T extends object>(
  query: PostgrestFilterBuilder<any, any, any>,
  column: keyof T,
  value: any
): PostgrestFilterBuilder<any, any, any> {
  return query.eq(column as string, value);
}

// Helper for safely getting properties
export function safeGet<T, K extends keyof T>(obj: T | null | undefined, key: K, fallback: T[K]): T[K] {
  return obj && obj[key] !== undefined ? obj[key] : fallback;
}

// Type-safe access to nested data
export function safeNestedGet<T, K extends keyof T, S extends keyof NonNullable<T[K]>>(
  obj: T | null | undefined,
  key1: K,
  key2: S,
  fallback: NonNullable<T[K]>[S]
): NonNullable<T[K]>[S] {
  if (!obj || obj[key1] === undefined || obj[key1] === null) return fallback;
  return (obj[key1] as any)[key2] ?? fallback;
}

// Helper function to check if an object is null or undefined
export function isNullOrUndefined(value: any): value is null | undefined {
  return value === null || value === undefined;
}

// Helper for database value conversions
export function toDbValue(value: any): any {
  return value;
}

// Safely handle possible errors in data responses
export function safeDataAccess<T>(data: T | null | undefined): T | null {
  return data !== null && data !== undefined ? data : null;
}

// Helper to safely access nested properties that may not exist
export function safePropertyAccess<T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined {
  return obj ? obj[key] : undefined;
}

// Type-safe helper for creating update payloads
export function createUpdatePayload<T>(data: T): T {
  return data;
}

// Type-safe error handling for Supabase queries
export function isSafeData<T>(data: any): data is T {
  return data && !('error' in data) && data !== null;
}

// Type-safe profile status conversion
export type ProfileStatus = 'online' | 'offline' | 'away' | 'busy';

// Convert string to valid profile status
export function toValidProfileStatus(status: string): ProfileStatus {
  if (status === 'online' || status === 'offline' || status === 'away' || status === 'busy') {
    return status as ProfileStatus;
  }
  return 'offline'; // Default fallback
}

// Safe wrapper for database data
export function safeDatabaseQuery<T>(data: any): T | null {
  if (data && !('error' in data)) {
    return data as T;
  }
  return null;
}

// Safe array access
export function safeArrayAccess<T>(arr: T[] | null | undefined, index: number): T | undefined {
  if (!arr || !Array.isArray(arr)) return undefined;
  return arr[index];
}
