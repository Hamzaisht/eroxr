
import { Database } from "@/integrations/supabase/types/database.types";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

// Define commonly used types
export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type PostRow = Database['public']['Tables']['posts']['Row'];
export type StoryRow = Database['public']['Tables']['stories']['Row'];
export type SubscriptionRow = Database['public']['Tables']['creator_subscriptions']['Row'];

// Using extended syntax for optional table types
export type AdminLogRow = Database['public']['Tables']['admin_logs'] extends { Row: infer R } ? R : any;
export type FlaggedContentRow = Database['public']['Tables']['flagged_content'] extends { Row: infer R } ? R : any;

/**
 * Type guard function to check if an object is a ProfileRow
 */
export function isProfileRow(obj: any): obj is ProfileRow {
  return obj !== null && 
         typeof obj === 'object' && 
         'id' in obj;
}

/**
 * Type guard function to check if an object is a PostRow
 */
export function isPostRow(obj: any): obj is PostRow {
  return obj !== null && 
         typeof obj === 'object' && 
         'id' in obj && 
         'content' in obj;
}

/**
 * Type guard function to check if an object is a SubscriptionRow
 */
export function isSubscriptionRow(obj: any): obj is SubscriptionRow {
  return obj !== null && 
         typeof obj === 'object' && 
         'id' in obj && 
         'creator_id' in obj && 
         'user_id' in obj;
}

/**
 * Type guard function to check for SelectQueryError
 */
export function isQueryError(obj: any): boolean {
  return obj !== null && 
         typeof obj === 'object' && 
         'error' in obj;
}

/**
 * Safe string converter
 */
export function safeString(value: any): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

/**
 * Safe number converter
 */
export function safeNumber(value: any): number {
  if (value === null || value === undefined) return 0;
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

/**
 * Safe boolean converter
 */
export function safeBoolean(value: any): boolean {
  return Boolean(value);
}

/**
 * Safe date converter
 */
export function safeDate(value: any): Date | null {
  if (value === null || value === undefined) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Apply filter with proper type checking
 */
export function applyTypeCheckedFilter<T extends object>(
  query: PostgrestFilterBuilder<any, any, any>,
  column: keyof T,
  value: any
): PostgrestFilterBuilder<any, any, any> {
  return query.eq(column as string, value);
}

/**
 * Apply order with proper type checking
 */
export function applyTypeCheckedOrder<T extends object>(
  query: PostgrestFilterBuilder<any, any, any>,
  column: keyof T,
  options: { ascending: boolean }
): PostgrestFilterBuilder<any, any, any> {
  return query.order(column as string, options);
}

/**
 * Type-safe object property access
 */
export function safeGet<T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined {
  return obj ? obj[key] : undefined;
}

/**
 * Safely handle data response
 */
export function safeDataResponse<T>(data: any, error: any): T | null {
  if (error || !data) {
    console.error("Database query error:", error);
    return null;
  }
  return data as T;
}
