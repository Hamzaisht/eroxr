
export interface Post {
  id: string;
  content: string;
  media_url?: string;
  video_urls?: string[];
  creator_id: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  visibility: string;
  tags?: string[];
  ppv_amount?: number;
  is_ppv: boolean;
  screenshots_count: number;
  downloads_count: number;
  has_liked: boolean;
  creator: {
    id: string;
    username: string;
    avatar_url: string;
  };
}

export interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onLike: (postId: string) => Promise<void>;
  onDelete: (postId: string, creatorId: string) => Promise<void>;
}
