import { DatingAd, FilterOptions, SearchCategory, DatingAdAction } from '@/types/dating';

export type { DatingAd, FilterOptions, SearchCategory, DatingAdAction };

// For backward compatibility, also keep the existing interface
// This ensures both import paths work correctly
export interface DatingAd {
  id: string;
  title: string;
  description: string;
  user_id: string;
  username: string;
  avatarUrl: string;
  videoUrl?: string;
  views?: number;
  likes?: number;
  messages?: number;
  isVerified?: boolean;
  isPremium?: boolean;
  location?: string;
  tags?: string[];
  age?: number;
  gender?: string;
  seeking?: string[];
  last_active?: string;
  avatar_url?: string; 
  video_url?: string; 
  is_verified?: boolean;
  is_premium?: boolean;
  is_active?: boolean;
  view_count?: number;
  message_count?: number;
  click_count?: number;
  relationship_status?: 'single' | 'couple' | 'other';
  looking_for?: string[];
  country?: string;
  city?: string;
  age_range?: { lower: number; upper: number };
  created_at?: string;
  updated_at?: string;
  body_type?: string;
  profile_completion_score?: number;
  interests?: string[];
  education_level?: string;
  height?: number;
  smoking_status?: string;
  drinking_status?: string;
  languages?: string[];
  occupation?: string;
  about_me?: string;
  user?: {
    id?: string;
    username?: string;
    avatar_url?: string;
  };
  onTagClick?: (tag: string, e?: React.MouseEvent) => void;
}
