
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

// Type-safe filter helpers
export function safeProfileFilter<K extends keyof ProfileRow>(column: K, value: ProfileRow[K]): [string, any] {
  return [column as string, value];
}

export function safeReportFilter<K extends keyof ReportRow>(column: K, value: ReportRow[K]): [string, any] {
  return [column as string, value];
}

export function safeUserSubscriptionFilter<K extends keyof Tables['user_subscriptions']['Row']>(
  column: K, 
  value: Tables['user_subscriptions']['Row'][K]
): [string, any] {
  return [column as string, value];
}

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
