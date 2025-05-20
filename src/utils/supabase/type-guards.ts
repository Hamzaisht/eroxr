
import { Database } from '@/integrations/supabase/types/database.types';

// Type definitions for database tables
export type Tables = Database['public']['Tables'];

// Type-safe table row types
export type ProfileRow = Tables['profiles']['Row'];
export type ProfileUpdate = Tables['profiles']['Update'];
export type ProfileInsert = Tables['profiles']['Insert'];

export type PostRow = Tables['posts']['Row'];
export type PostUpdate = Tables['posts']['Update'];
export type PostInsert = Tables['posts']['Insert'];

// Type-safe helpers for database operations
export function safeProfileUpdate(data: ProfileUpdate): ProfileUpdate {
  return data;
}

export function safePostInsert(data: PostInsert): PostInsert {
  return data;
}

// Additional safe operation helpers

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
export function toValidProfileStatus(status: string): 'online' | 'offline' | 'away' | 'busy' {
  const validStatuses: ('online' | 'offline' | 'away' | 'busy')[] = ['online', 'offline', 'away', 'busy'];
  if (validStatuses.includes(status as any)) {
    return status as 'online' | 'offline' | 'away' | 'busy';
  }
  return 'offline'; // Default fallback
}

// Helper for safely checking if data is an array
export function isArrayData<T>(data: unknown): data is T[] {
  return Array.isArray(data);
}
