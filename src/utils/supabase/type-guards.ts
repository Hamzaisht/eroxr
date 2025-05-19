
import { Database } from "@/integrations/supabase/types/database.types";

// Type definitions for database tables
export type Tables = Database['public']['Tables'];

// Type-safe table row types
export type ProfileRow = Tables['profiles']['Row'];
export type ProfileUpdate = Tables['profiles']['Update'];
export type ProfileInsert = Tables['profiles']['Insert'];

export type StoryRow = Tables['stories']['Row'];
export type StoryUpdate = Tables['stories']['Update'];

export type DatingAdRow = Tables['dating_ads']['Row'];
export type DatingAdUpdate = Tables['dating_ads']['Update'];

export type SubscriptionRow = Tables['creator_subscriptions']['Row'];
export type UserSubscriptionRow = Tables['user_subscriptions']['Row'];
export type UserSubscriptionUpdate = Tables['user_subscriptions']['Update'];

// Type-safe helpers for database operations
export function safeProfileUpdate(data: Partial<ProfileUpdate>): ProfileUpdate {
  return data as ProfileUpdate;
}

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

export function safeUserSubscriptionUpdate(data: Partial<UserSubscriptionUpdate>): UserSubscriptionUpdate {
  return data as UserSubscriptionUpdate;
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
