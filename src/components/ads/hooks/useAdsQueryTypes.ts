
import { DatingAd } from "../types/dating";
import { type Database } from "@/integrations/supabase/types";

type NordicCountry = Database['public']['Enums']['nordic_country'];

export interface LocationFilters {
  country?: NordicCountry | null;
  city?: string | null;
  latitude?: number;
  longitude?: number;
}

export interface UseAdsQueryOptions {
  verifiedOnly?: boolean;
  premiumOnly?: boolean;
  filterOptions?: any;
  includeMyPendingAds?: boolean;
  skipModeration?: boolean; // Added to bypass moderation for verified users
  userId?: string; // Added to fetch ads for a specific user
  includeMsgCount?: boolean; // Added to include message counts
  tagFilter?: string; // Added to filter by specific tag
  locationFilters?: LocationFilters; // New location filters
}

// Define the type for raw data from Supabase
export type RawDatingAd = Omit<DatingAd, 'age_range'> & {
  age_range: string | { lower: number; upper: number };
  preferred_age_range?: string | { lower: number; upper: number } | null;
  profiles?: {
    id_verification_status?: string;
    is_paying_customer?: boolean;
  };
  // Additional fields that might be in the raw data
  message_count?: number;
  view_count?: number;
  avatar_url?: string | null;
  video_url?: string | null;
  is_premium?: boolean;
  is_verified?: boolean;
  moderation_status?: string;
};
