
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
  profiles?: {
    id_verification_status?: string;
    is_paying_customer?: boolean;
  };
  message_count?: number;
  view_count?: number;
};
