
export interface Short {
  id: string;
  creator: {
    username: string;
    avatar_url: string | null;
    id?: string;
  };
  creator_id?: string;
  content: string;
  video_urls: string[];
  likes_count: number;
  comments_count: number;
  has_liked?: boolean;
  has_saved?: boolean;
  created_at?: string;
}
