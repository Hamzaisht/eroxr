export interface Short {
  id: string;
  creator: {
    username: string;
    avatar_url: string | null;
  };
  video_url: string;
  description: string;
  likes: number;
  comments: number;
  has_liked?: boolean;
  has_saved?: boolean;
}