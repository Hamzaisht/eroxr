
import { v4 as uuidv4 } from "uuid";
import { AvailabilityStatus } from "@/utils/media/types";

// Safely cast a string to UUID - for Supabase queries
export const asUUID = (id: string) => {
  try {
    // Validate if it's a valid UUID
    if (typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return id as unknown as any; // Cast to any to satisfy Supabase's UUID type requirement
    }
    console.warn('Invalid UUID format:', id);
    return id as unknown as any; // Still cast to satisfy types, but logged warning
  } catch (error) {
    console.error('Error processing UUID:', error);
    return id as unknown as any; // Fallback
  }
};

// Extract profile data safely
export const extractProfile = (data: any) => {
  if (!data) return { is_paying_customer: false };
  
  // Handle error cases
  if (data.error || data.code) return { is_paying_customer: false };
  
  // Safe extraction with defaults
  return {
    id: data.id || '',
    username: data.username || '',
    avatar_url: data.avatar_url || null,
    status: data.status || 'offline',
    is_paying_customer: !!data.is_paying_customer,
    bio: data.bio || '',
    location: data.location || '',
    website: data.website || '',
  };
};

// Safe data access
export const safeDataAccess = <T,>(data: T | null | undefined, defaultValue: T): T => {
  return data !== null && data !== undefined ? data : defaultValue;
};

// Convert string to status
export const convertToStatus = (status: string | null | undefined): AvailabilityStatus => {
  if (!status) return AvailabilityStatus.OFFLINE;
  
  switch(status.toLowerCase()) {
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

// Safe database value converter
export const toDbValue = (value: any): any => {
  return value as any;
};

// Extract creator data safely
export const extractCreator = (data: any) => {
  if (!data) return null;
  
  // Handle error cases
  if (data.error || data.code) return null;
  
  // If the data is in a nested structure (common with joins)
  if (data.creator) {
    return {
      id: data.creator.id || '',
      username: data.creator.username || '',
      avatar_url: data.creator.avatar_url || null,
    };
  }
  
  // Direct data format
  return {
    id: data.id || '',
    username: data.username || '',
    avatar_url: data.avatar_url || null,
  };
};
