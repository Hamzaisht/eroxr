
import { AvailabilityStatus } from "@/utils/media/types";

/**
 * Converts a UUID string to PostgreSQL UUID type
 */
export const asUUID = (id: string) => {
  if (!id) return id;
  return id as unknown as `${string}-${string}-${string}-${string}-${string}`;
};

/**
 * Extract profile data safely with type guards
 */
export const extractProfile = (profile: any) => {
  if (!profile) return null;
  
  return {
    id: profile.id,
    username: profile.username,
    avatar_url: profile.avatar_url,
    banner_url: profile.banner_url,
    bio: profile.bio,
    status: profile.status,
    is_paying_customer: profile.is_paying_customer,
    email: profile.email
  };
};

/**
 * Safely access data from query results
 */
export const safeDataAccess = <T,>(data: any, defaultValue: T): T => {
  if (!data) return defaultValue;
  
  // Handle potential error responses from Supabase
  if ('error' in data) return defaultValue;
  
  return data as T;
};

/**
 * Convert status string to AvailabilityStatus enum
 */
export const convertToStatus = (status: string): AvailabilityStatus => {
  switch (status?.toLowerCase()) {
    case 'online':
      return AvailabilityStatus.ONLINE;
    case 'away':
      return AvailabilityStatus.AWAY;
    case 'busy':
      return AvailabilityStatus.BUSY;
    case 'invisible':
      return AvailabilityStatus.INVISIBLE;
    default:
      return AvailabilityStatus.OFFLINE;
  }
};

/**
 * Convert data to database-compatible format
 * This helps with type casting for Supabase operations
 */
export const toDbValue = <T,>(value: T): any => {
  return value;
};

/**
 * Extract creator data safely with type guards
 */
export const extractCreator = (creator: any) => {
  if (!creator) return null;
  
  return {
    id: creator.id,
    username: creator.username,
    avatar_url: creator.avatar_url,
    banner_url: creator.banner_url,
    bio: creator.bio
  };
};
