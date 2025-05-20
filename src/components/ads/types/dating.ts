
// DatingAd interface with all required properties
export interface DatingAd {
  // Core properties
  id: string;
  title: string;
  description: string;
  user_id: string;
  username: string;
  views: number;
  
  // Age properties
  age_range: {
    lower: number;
    upper: number;
  };
  preferred_age_range?: {
    lower: number;
    upper: number;
  };
  age?: number;
  
  // Location properties
  location?: string;
  location_type?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  
  // Relationship info
  relationship_status: string;
  looking_for: string[];
  
  // Media & visuals
  tags: string[];
  media_url?: string[] | string;
  video_url?: string;
  videoUrl?: string;
  avatar_url?: string;
  avatarUrl?: string;
  
  // Profile completion
  profile_completion_score?: number;
  interests?: string[];
  body_type?: string;
  education_level?: string;
  height?: number;
  smoking_status?: string;
  drinking_status?: string;
  languages?: string[];
  occupation?: string;
  about_me?: string;
  seeking_description?: string;
  
  // Status fields
  created_at?: string;
  updated_at?: string;
  status?: string;
  is_active?: boolean;
  is_premium?: boolean;
  isPremium?: boolean;
  is_verified?: boolean;
  isVerified?: boolean;
  online?: boolean;
  last_active?: string;
  view_count?: number;
  message_count?: number;
  click_count?: number;
  
  // Extended functionality
  user?: {
    username?: string;
    avatar_url?: string;
  };
  onTagClick?: (tag: string) => void;
}

// Define FilterOptions type
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

// Define SearchCategory type
export interface SearchCategory {
  seeker: string;
  lookingFor: string;
  label?: string;
}
