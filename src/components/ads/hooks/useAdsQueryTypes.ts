
import { DatingAd } from "../types/dating";

export interface UseAdsQueryOptions {
  verifiedOnly?: boolean;
  premiumOnly?: boolean;
  filterOptions?: any;
  includeMyPendingAds?: boolean;
  skipModeration?: boolean; // Added to bypass moderation for verified users
  userId?: string; // Added to fetch ads for a specific user
}

// Define the type for raw data from Supabase
export type RawDatingAd = Omit<DatingAd, 'age_range'> & {
  age_range: string;
  profiles?: {
    id_verification_status?: string;
    is_paying_customer?: boolean;
  };
};
