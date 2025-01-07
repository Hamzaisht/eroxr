export type Post = {
  id: string;
  creator_id: string;
  content: string;
  media_url: string[] | null;
  likes_count: number | null;
  comments_count: number | null;
  created_at: string;
  updated_at: string;
  visibility: string | null;
  tags: string[] | null;
  ppv_amount: number | null;
  is_ppv: boolean | null;
  video_urls: string[] | null;
};

export type PostLike = {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
};

export type PostPurchase = {
  id: string;
  post_id: string | null;
  user_id: string | null;
  amount: number;
  created_at: string;
};

export type PostSave = {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
};