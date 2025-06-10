
export interface MediaAsset {
  id: string;
  storage_path: string;
  media_type: string;
  mime_type: string;
  original_name: string;
  alt_text?: string;
}

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
  media_assets?: MediaAsset[];
  creator: {
    id: string;
    username: string;
    avatar_url: string;
    isVerified?: boolean;
  };
}

export interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onLike: (postId: string) => Promise<void>;
  onDelete: (postId: string, creatorId: string) => Promise<void>;
}
