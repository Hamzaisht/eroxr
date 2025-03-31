
export interface Post {
  id: string;
  creator_id: string;
  content: string;
  media_url: string[];
  video_urls?: string[];
  video_thumbnail_url?: string;
  likes_count: number;
  comments_count: number;
  view_count?: number;
  created_at: string;
  updated_at: string;
  visibility: string;
  is_premium?: boolean;
  post_type?: string;
  has_saved?: boolean;
  price?: number;
  tags?: string[];
}
