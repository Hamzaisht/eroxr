
import { Creator } from '@/integrations/supabase/types/profile';

export type Short = {
  id: string;
  creator_id: string;
  content?: string;
  description?: string;
  media_url?: string | null;
  video_urls?: string[] | null;
  likes_count: number | null;
  comments_count: number | null;
  created_at: string;
  updated_at?: string;
  visibility?: 'public' | 'subscribers_only';
  has_liked?: boolean;
  has_saved?: boolean;
  has_purchased?: boolean;
  video_thumbnail_url?: string;
  view_count?: number;
  video_duration?: number;
  creator?: Creator;
};
