import { Database } from "@/integrations/supabase/types/database.types";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { supabase } from "@/integrations/supabase/client";

// Define commonly used types
export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type PostRow = Database['public']['Tables']['posts']['Row'];
export type StoryRow = Database['public']['Tables']['stories']['Row'];
export type SubscriptionRow = Database['public']['Tables']['creator_subscriptions']['Row'];

// Using extended syntax for optional table types - this handles tables that may not exist in the schema
export type AdminLogRow = 'admin_logs' extends keyof Database['public']['Tables'] 
  ? Database['public']['Tables']['admin_logs']['Row'] 
  : { id: string; admin_id: string; action: string; action_type: string; created_at: string; target_id?: string; target_type?: string; details?: Record<string, any>; };

export type FlaggedContentRow = 'flagged_content' extends keyof Database['public']['Tables'] 
  ? Database['public']['Tables']['flagged_content']['Row'] 
  : { id: string; content_id: string; content_type: string; reason: string; severity: string; status: string; };

/**
 * Helper function to call the set_request_user_id RPC function
 * This should be called before making authenticated database queries
 */
export async function ensureUserIdSet(): Promise<void> {
  try {
    const { error } = await supabase.rpc('set_request_user_id');
    if (error) {
      console.error("Failed to set user ID for RLS optimization:", error);
    }
  } catch (error) {
    console.error("Exception setting user ID for RLS:", error);
  }
}

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
 * Type-safe key helper for Supabase queries
 */
export function asColumnKey<T extends object>(key: keyof T): string {
  return key as string;
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
  if (error || !data || isQueryError(data)) {
    console.error("Database query error:", error || (isQueryError(data) ? data.error : "Unknown error"));
    return null;
  }
  return data as T;
}

/**
 * Cast value to correct column value type
 */
export function asColumnValue<T, K extends keyof T>(table: string, column: K, value: any): any {
  return value;
}

/**
 * Type-safe eq filter for Supabase queries
 */
export function safeEq<T>(query: PostgrestFilterBuilder<any, any, any>, column: keyof T, value: any): PostgrestFilterBuilder<any, any, any> {
  return query.eq(column as string, value);
}

/**
 * Type-guard to check if data is a valid response
 */
export function isValidData<T>(data: any): data is T {
  return data !== null && 
         typeof data === 'object' && 
         !isQueryError(data);
}
