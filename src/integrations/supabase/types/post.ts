export type Post = {
  id: string;
  creator_id: string;
  content: string;
  media_url: string[] | null;
  likes_count: number | null;
  comments_count: number | null;
  created_at: string;
  updated_at: string;
  visibility: 'public' | 'subscribers_only';
  tags: string[] | null;
  ppv_amount: number | null;
  is_ppv: boolean;
  video_urls: string[] | null;
  has_liked: boolean;
  has_purchased?: boolean;
  screenshots_count: number;
  downloads_count: number;
  creator: {
    username: string | null;
    avatar_url: string | null;
  };
};

export type PostUpdate = {
  content?: string;
  media_url?: string[];
  video_urls?: string[];
  visibility?: 'public' | 'subscribers_only';
  tags?: string[];
  ppv_amount?: number;
  is_ppv?: boolean;
  updated_at?: string;
  creator_id: string;
};