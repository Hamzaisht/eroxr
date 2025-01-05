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
};