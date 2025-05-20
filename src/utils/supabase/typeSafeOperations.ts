
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { Database } from '@/integrations/supabase/types/database.types';

/**
 * Type-safe helper to cast column names for Supabase queries
 */
export function asColumn<T extends Record<string, any>>(columnName: keyof T): string {
  return columnName as string;
}

/**
 * Type-safe helper for handling Supabase query results
 */
export function handleQueryResult<T>(result: PostgrestSingleResponse<T[]>): T[] {
  const { data, error } = result;
  
  if (error) {
    console.error("Database query error:", error);
    return [];
  }
  
  if (!data) {
    return [];
  }
  
  // Filter out any invalid data entries
  return data.filter((item): item is T => item !== null && typeof item === 'object');
}

/**
 * Type safely check if an object is a valid database row by checking for required properties
 */
export function isValidRow<T extends object>(obj: any, requiredProps: (keyof T)[]): obj is T {
  if (!obj || typeof obj !== 'object') return false;
  
  return requiredProps.every(prop => prop in obj);
}

/**
 * Type guard for checking if a row has an ID
 */
export function hasId<T extends { id: string }>(row: any): row is T {
  return row && typeof row === 'object' && 'id' in row && typeof row.id === 'string';
}

/**
 * Safely transform raw database rows to typed objects
 */
export function mapToTypedRows<T extends object, R>(
  rows: any[] | null, 
  mapper: (row: T) => R,
  validator: (row: any) => row is T
): R[] {
  if (!rows) return [];
  
  return rows
    .filter(validator)
    .map(mapper);
}

/**
 * Type predicate for profile rows
 */
export function isProfileRow(row: any): row is Database['public']['Tables']['profiles']['Row'] {
  return row && 
    typeof row === 'object' && 
    'id' in row;
}

/**
 * Type predicate for subscription rows
 */
export function isSubscriptionRow(row: any): row is Database['public']['Tables']['creator_subscriptions']['Row'] {
  return row && 
    typeof row === 'object' && 
    'id' in row && 
    'creator_id' in row &&
    'user_id' in row;
}

/**
 * Get a safe string value from a potentially undefined or null value
 */
export function safeString(value: string | null | undefined): string {
  return value ?? "";
}
