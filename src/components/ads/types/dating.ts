
export interface Ad {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  profile: {
    id: string;
    username: string;
    avatarUrl: string;
  };
}

export interface DatingAd {
  id: string;
  user_id: string;
  title: string;
  description: string;
  video_url: string;
  created_at: string;
  city: string;
  country: string;
  age_range: { lower: number; upper: number };
  relationship_status: string;
  looking_for: string[];
  tags: string[];
  user: {
    id: string;
    username: string;
    avatar_url: string;
  };
  // Additional properties used in components
  view_count?: number;
  message_count?: number;
  click_count?: number;
  is_active?: boolean;
  is_premium?: boolean;
  is_verified?: boolean;
  avatar_url?: string;
  body_type?: string;
  education_level?: string;
  interests?: string[];
  profile_completion_score?: number;
  last_active?: string;
  preferred_age_range?: { lower: number; upper: number };
}

export interface FilterOptions {
  minAge?: number;
  maxAge?: number;
  bodyType?: string[];
  isVerified?: boolean;
  isPremium?: boolean;
  maxDistance?: number;
  [key: string]: string | string[] | number | boolean | undefined;
}

export interface SearchCategory {
  seeker: "male" | "female" | "couple";
  looking_for: "male" | "female" | "couple" | "trans" | "any";
}
