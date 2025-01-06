export type Post = {
  id: string;
  content: string;
  created_at: string;
  creator_id: string;
  creator: {
    username: string | null;
    avatar_url: string | null;
  };
  likes_count: number | null;
  comments_count: number | null;
  media_url: string[] | null;
  has_liked: boolean;
  visibility: 'public' | 'subscribers_only';
  tags: string[] | null;
  is_ppv: boolean;
  ppv_amount: number | null;
  has_purchased?: boolean;
};