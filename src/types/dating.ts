
/**
 * Dating Ad interface
 */
export interface DatingAd {
  id: string;
  title: string;
  description: string;
  user_id: string;
  avatarUrl?: string;
  videoUrl?: string;
  isVerified: boolean;
  isPremium: boolean;
  tags: string[];
  views: number;
  user_type?: string;
  [key: string]: any;
}

/**
 * Filter options for dating ads
 */
export interface FilterOptions {
  minAge: number;
  maxAge: number;
  minDistance: number;
  maxDistance: number;
  verifiedOnly: boolean;
  premiumOnly: boolean;
  keyword: string;
  username: string;
  isVerified?: boolean;
  isPremium?: boolean;
  tags?: string[];
}

/**
 * Search category for filtering
 */
export interface SearchCategory {
  seeker: string;
  lookingFor: string;
  label?: string;
}
