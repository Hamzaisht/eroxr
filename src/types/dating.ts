
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
  username?: string;
  avatarUrl?: string;
  videoUrl?: string;
  avatar_url?: string;
  video_url?: string;
  
  // Verification and status
  isVerified?: boolean;
  isPremium?: boolean;
  is_verified?: boolean;
  is_premium?: boolean;
  is_active?: boolean;
  
  // Engagement metrics
  views?: number;
  likes?: number;
  messages?: number;
  view_count?: number;
  message_count?: number;
  click_count?: number;
  
  // Profile details
  tags?: string[];
  location?: string;
  age?: number;
  gender?: string;
  seeking?: string[];
  last_active?: string;
  relationship_status?: 'single' | 'couple' | 'other';
  looking_for?: string[];
  country?: string;
  city?: string;
  age_range?: { lower: number; upper: number };
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
  preferred_age_range?: { lower: number; upper: number } | null;
  
  // Reference to user object
  user?: {
    id?: string;
    username?: string;
    avatar_url?: string;
  };
  
  // For UI integration
  onTagClick?: (tag: string, e?: React.MouseEvent) => void;
}

/**
 * Filter options for dating ads
 */
export interface FilterOptions {
  minAge: number;
  maxAge: number;
  minDistance?: number;
  maxDistance?: number;
  verifiedOnly?: boolean;
  premiumOnly?: boolean;
  keyword?: string;
  username?: string;
  country?: string;
  city?: string;
  userType?: string;
  tags?: string[];
  isVerified?: boolean;
  isPremium?: boolean;
}

/**
 * Search category for filtering
 */
export interface SearchCategory {
  seeker: string;
  lookingFor: string;
  label?: string;
}

/**
 * Dating ad action types
 */
export interface DatingAdAction {
  type: 'like' | 'message' | 'view' | 'block';
  adId: string;
  userId: string;
}
