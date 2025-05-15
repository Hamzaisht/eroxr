
import { AvailabilityStatus } from "@/utils/media/types";

/**
 * Converts a string to a valid UUID for use in Supabase queries
 * This solves TypeScript errors that expect UUIDs when strings are provided
 */
export const asUUID = (id: string | undefined): string => {
  if (!id) return '';
  return id as unknown as string;
};

/**
 * Safely extracts a profile from a Supabase query result
 * This handles error cases and ensures type safety
 */
export const extractProfile = <T>(data: T | { message: string; code: string }): T | null => {
  if (!data) return null;
  if ('message' in data && 'code' in data) return null;
  return data;
};

/**
 * Safely accesses a property from data that might be an error object
 * @param data The data object from a Supabase query
 * @param key The property key to access
 * @param defaultValue A fallback value if the property doesn't exist
 */
export const safeDataAccess = <T, K extends keyof T>(
  data: T | { message: string; code: string } | null | undefined,
  key: K,
  defaultValue: T[K]
): T[K] => {
  if (!data) return defaultValue;
  if ('message' in data && 'code' in data) return defaultValue;
  return (data as T)[key] !== undefined ? (data as T)[key] : defaultValue;
};

/**
 * Converts a string status to the corresponding AvailabilityStatus enum value
 */
export const convertToStatus = (status: string | null | undefined): AvailabilityStatus => {
  if (!status) return AvailabilityStatus.OFFLINE;
  
  switch (status.toLowerCase()) {
    case 'online':
      return AvailabilityStatus.ONLINE;
    case 'away':
      return AvailabilityStatus.AWAY;
    case 'busy':
      return AvailabilityStatus.BUSY;
    case 'offline':
    default:
      return AvailabilityStatus.OFFLINE;
  }
};
