
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
export function safeStoryFilter(column: keyof StoryRow, value: any): [string, any] {
  return [column as string, value];
}

export function safeDatingAdFilter(column: keyof DatingAdRow, value: any): [string, any] {
  return [column as string, value];
}

export function safeSubscriptionFilter(column: keyof SubscriptionRow, value: any): [string, any] {
  return [column as string, value];
}

export function safeUserSubscriptionFilter(column: keyof UserSubscriptionRow, value: any): [string, any] {
  return [column as string, value];
}

export function safeProfileFilter(column: keyof ProfileRow, value: any): [string, any] {
  return [column as string, value];
}

export function safeReportFilter(column: keyof ReportRow, value: any): [string, any] {
  return [column as string, value];
}

export function safeLiveStreamFilter(column: keyof LiveStreamRow, value: any): [string, any] {
  return [column as string, value];
}

export function safeIdVerificationFilter(column: keyof IdVerificationRow, value: any): [string, any] {
  return [column as string, value];
}

export function safeUserSubscriptionUpdate(data: Partial<UserSubscriptionUpdate>): UserSubscriptionUpdate {
  return data as UserSubscriptionUpdate;
}

// NEW FUNCTION: Apply a type-safe equals filter to a query builder
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
