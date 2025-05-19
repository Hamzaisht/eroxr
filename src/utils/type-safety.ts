
import { Database } from "@/integrations/supabase/types/database.types";

/**
 * Type-safe helper for creating column references
 */
export function column<T extends keyof Database["public"]["Tables"]>(
  table: T,
  column: keyof Database["public"]["Tables"][T]["Row"]
): string {
  return column as string;
}

/**
 * Type-safe helper for Supabase update operations
 */
export function createUpdatePayload<
  T extends keyof Database["public"]["Tables"]
>(
  table: T,
  data: Partial<Database["public"]["Tables"][T]["Update"]>
): Database["public"]["Tables"][T]["Update"] {
  return data as Database["public"]["Tables"][T]["Update"];
}

/**
 * Type-safe helper for Supabase insert operations
 */
export function createInsertPayload<
  T extends keyof Database["public"]["Tables"]
>(
  table: T,
  data: Partial<Database["public"]["Tables"][T]["Insert"]>
): Database["public"]["Tables"][T]["Insert"] {
  return data as Database["public"]["Tables"][T]["Insert"];
}

/**
 * Type guard for checking if a value is not null or undefined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Helper for safely accessing nested properties with type checking
 */
export function safeGetNested<
  T extends Record<string, any>, 
  K1 extends keyof T,
  K2 extends keyof NonNullable<T[K1]>
>(obj: T | null | undefined, key1: K1, key2: K2): NonNullable<T[K1]>[K2] | undefined {
  if (!obj) return undefined;
  const value = obj[key1];
  if (!value) return undefined;
  return value[key2];
}
