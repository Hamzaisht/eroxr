
export type DatingAd = {
  id: string;
  user_id: string | null;
  title: string;
  description: string;
  relationship_status: 'single' | 'couple' | 'other';
  looking_for: string[];
  country: 'denmark' | 'finland' | 'iceland' | 'norway' | 'sweden';
  city: string;
  age_range: {
    lower: number;
    upper: number;
  };
  created_at: string | null;
  updated_at: string | null;
  is_active: boolean | null;
  views_count: number | null;
  click_count?: number | null;
  interests: string[] | null;
  preferred_age_range: {
    lower: number;
    upper: number;
  } | null;
  height: number | null;
  body_type: string | null;
  smoking_status: string | null;
  drinking_status: string | null;
  languages: string[] | null;
  occupation: string | null;
  education_level: string | null;
  about_me: string | null;
  seeking_description: string | null;
  last_active: string | null;
  profile_completion_score: number | null;
  tags?: string[];
  view_count?: number;
  location?: string;
  is_premium?: boolean;
  is_verified?: boolean;
  video_url?: string;
  avatar_url?: string;
  message_count?: number;
  user?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  onTagClick?: (tag: string) => void;
};

export interface SearchCategory {
  seeker: string; // Changed from restricted type to allow any string value
  looking_for: string; // Changed from restricted type to allow any string value
  label?: string;
}

export interface FilterOptions {
  minAge?: number;
  maxAge?: number;
  minDistance?: number;
  maxDistance?: number;
  bodyType?: string[];
  educationLevel?: string[];
  verifiedOnly?: boolean;
  premiumOnly?: boolean;
  keyword?: string;
  username?: string;
  sortBy?: 'newest' | 'lastActive' | 'profileScore';
  lastActive?: 'today' | 'week' | 'month' | 'all';
  isVerified?: boolean;
  isPremium?: boolean;
}

export type LegacyDatingAd = {
  id: string;
  title: string;
  description: string;
  relationship_status: "single" | "couple" | "other";
  looking_for: string[];
  country: string;
  city: string;
  age_range: { lower: number; upper: number };
  created_at: string;
  is_premium?: boolean;
  is_verified?: boolean;
};
