
/**
 * Dating Ad interface - represents the core dating ad structure
 */
export interface DatingAd {
  // Core properties
  id: string;
  user_id: string;
  title: string;
  description: string;
  
  // User identifiers and profile data
  username: string;
  avatarUrl: string;  // Required for consistency
  videoUrl: string;   // Making this required
  avatar_url?: string;
  video_url?: string;
  
  // Verification and status
  isVerified: boolean; // Required with default fallback
  isPremium: boolean;  // Required with default fallback
  is_verified?: boolean;
  is_premium?: boolean;
  is_active?: boolean;
  
  // Engagement metrics
  views: number;      // Required
  likes?: number;
  likes_count?: number; // New likes count from database
  messages?: number;
  view_count?: number;
  message_count?: number;
  click_count?: number;
  
  // Profile details
  tags: string[];      // Required
  location: string;    // Required
  age: number;         // Required
  gender?: string;
  seeking?: string[];
  last_active?: string;
  relationship_status?: 'single' | 'couple' | 'other';
  looking_for?: string[];
  country?: string;
  city?: string;
  age_range?: { lower: number; upper: number } | [number, number];
  created_at?: string;
  updated_at?: string;
  body_type?: string;
  profile_completion_score?: number;
  
  // Additional profile data
  interests?: string[];
  education_level?: string;
  height?: number;
  smoking_status?: string;
  drinking_status?: string;
  languages?: string[];
  occupation?: string;
  about_me?: string;
  seeking_description?: string;
  preferred_age_range?: { lower: number; upper: number } | [number, number] | null;
  
  // Reference to user object
  user?: {
    id?: string;
    username?: string;
    avatar_url?: string;
  };
  
  // For UI integration
  onTagClick?: (tag: string, e?: React.MouseEvent) => void;
}

// Additional types for filtering and searching
export interface FilterOptions {
  ageRange?: [number, number];
  minAge?: number;
  maxAge?: number;
  gender?: string;
  relationship_status?: string;
  body_type?: string;
  height?: [number, number];
  tags?: string[];
  country?: string;
  city?: string;
  keyword?: string;
  username?: string;
  isVerified?: boolean;
  isPremium?: boolean;
  minDistance?: number;
  maxDistance?: number;
  verifiedOnly?: boolean;
  premiumOnly?: boolean;
}

export interface SearchCategoryType {
  seeker: string;
  lookingFor: string;
  label?: string;
}

export type SearchCategory = SearchCategoryType | 'all' | 'nearby' | 'popular' | 'new' | 'premium' | 'verified';

export type DatingAdAction = 'view' | 'like' | 'message' | 'report' | 'block' | 'save';

// Utility function to handle accessing age range properties safely
export function getAgeRangeValues(ageRange: { lower: number; upper: number } | [number, number] | undefined): { lower: number; upper: number } {
  if (!ageRange) {
    return { lower: 18, upper: 99 };
  }
  
  if (Array.isArray(ageRange)) {
    return { lower: ageRange[0], upper: ageRange[1] };
  }
  
  return ageRange;
}
