
export type DatingAd = {
  id: string;
  user_id: string | null;
  title: string;
  description: string;
  relationship_status: 'single' | 'couple' | 'other';
  looking_for: string[];
  country: 'denmark' | 'finland' | 'iceland' | 'norway' | 'sweden';
  city: string;
  age_range: [number, number];
  created_at: string | null;
  updated_at: string | null;
  is_active: boolean | null;
  views_count: number | null;
  click_count?: number | null;
  interests: string[] | null;
  preferred_age_range: [number, number] | null;
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
  // For interactivity on the UI:
  onTagClick?: (tag: string) => void;
};
