
export interface Short {
  id: string;
  creator: {
    username: string | null;
    avatar_url: string | null;
  };
  content: string;
  video_urls: string[] | null;
  likes_count: number | null;
  comments_count: number | null;
  has_liked: boolean;
  has_saved: boolean; // Changed from optional to required
}
