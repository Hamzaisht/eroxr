export type DatingAd = {
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
  interests?: string[];
  preferred_age_range?: { lower: number; upper: number };
  height?: number;
  body_type?: 'athletic' | 'average' | 'slim' | 'curvy' | 'muscular' | 'plus_size';
  smoking_status?: 'non_smoker' | 'occasional' | 'regular';
  drinking_status?: 'non_drinker' | 'occasional' | 'regular';
  languages?: string[];
  occupation?: string;
  education_level?: 'high_school' | 'college' | 'bachelor' | 'master' | 'phd';
  about_me?: string;
  seeking_description?: string;
  last_active?: string;
  profile_completion_score?: number;
};

export type SearchCategory = {
  seeker: "couple" | "female" | "male";
  looking_for: "male" | "female" | "couple";
};

export type FilterOptions = {
  minAge?: number;
  maxAge?: number;
  minHeight?: number;
  maxHeight?: number;
  bodyType?: string[];
  smokingStatus?: string[];
  drinkingStatus?: string[];
  languages?: string[];
  educationLevel?: string[];
  hasPhoto?: boolean;
  isVerified?: boolean;
  isPremium?: boolean;
  lastActive?: 'today' | 'week' | 'month' | 'all';
  sortBy?: 'newest' | 'lastActive' | 'profileScore';
};