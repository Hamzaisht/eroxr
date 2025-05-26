
export interface Creator {
  id: string;
  username: string;
  avatar_url: string;
}

export interface Post {
  id: string;
  content: string;
  media_url: string[] | null;
  video_urls: string[] | null;
  creator_id: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  has_liked: boolean;
  creator: Creator;
  visibility: 'public' | 'subscribers_only';
  tags: string[] | null;
  ppv_amount: number | null;
  is_ppv: boolean;
  screenshots_count: number;
  downloads_count: number;
}
