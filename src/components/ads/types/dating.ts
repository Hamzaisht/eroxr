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
  view_count?: number;
  message_count?: number;
  click_count?: number;
  user_id?: string;
  is_active?: boolean;
  video_url?: string;
  avatar_url?: string;
};

export type SearchCategory = {
  seeker: "couple" | "female" | "male" | "any";
  looking_for: "male" | "female" | "couple" | "any";
};