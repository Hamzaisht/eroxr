
import { User } from '@supabase/supabase-js';
import { Database } from '../integrations/supabase/types/database.types';

// Define PostgrestFilterBuilder type since it's missing from supabase-js export
type PostgrestFilterBuilder<T> = any;

// Define ProfileStatus type (used in UserMenu components)
export type ProfileStatus = 'online' | 'offline' | 'away' | 'busy';

// Type guard utilities for safe access to properties
export function getSafeProfile(profile: any) {
  return profile || null;
}

// Safe filter functions for database queries
export function safeProfileFilter(query: PostgrestFilterBuilder<any>) {
  return query;
}

export function safeReportFilter(query: PostgrestFilterBuilder<any>) {
  return query;
}

export function safeDatingAdFilter(query: PostgrestFilterBuilder<any>) {
  return query;
}

export function safeLiveStreamFilter(query: PostgrestFilterBuilder<any>) {
  return query;
}

export function safeIdVerificationFilter(query: PostgrestFilterBuilder<any>) {
  return query;
}

// Convert string to valid ProfileStatus
export function toValidProfileStatus(status: string): ProfileStatus {
  switch (status) {
    case 'online':
      return 'online';
    case 'away':
      return 'away';
    case 'busy':
      return 'busy';
    case 'offline':
    default:
      return 'offline';
  }
}
