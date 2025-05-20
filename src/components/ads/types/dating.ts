
// Add or update the DatingAd interface to include all required properties
export interface DatingAd {
  id: string;
  title: string;
  description: string;
  user_id: string;
  username?: string;
  avatarUrl?: string;
  videoUrl?: string;
  isVerified?: boolean;
  age_range: {
    lower: number;
    upper: number;
  };
  location?: string;
  location_type?: string;
  relationship_status: string;
  looking_for: string[];
  preferred_age_range?: {
    lower: number;
    upper: number;
  };
  tags?: string[];
  media_url?: string[] | string;
  video_url?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
  is_active?: boolean;
  is_premium?: boolean;
  views?: number;
  likes?: number;
  matches?: number;
  online?: boolean;
  last_active?: string;
  latitude?: number;
  longitude?: number;
}
