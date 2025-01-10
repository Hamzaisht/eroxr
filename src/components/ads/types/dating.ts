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
  body_type?: string;
  smoking_status?: string;
  drinking_status?: string;
  languages?: string[];
  occupation?: string;
  education_level?: string;
  about_me?: string;
  seeking_description?: string;
  last_active?: string;
  profile_completion_score?: number;
  latitude?: number;
  longitude?: number;
  video_url?: string;
  user_type: 'couple_mf' | 'couple_ff' | 'couple_mm' | 'male' | 'female' | 'other' | 'ota';
  avatar_url?: string;
};

export type SearchCategory = {
  seeker: "couple" | "female" | "male";
  looking_for: "male" | "female" | "couple";
};