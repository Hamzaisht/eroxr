
export interface ErosVideo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  description?: string;
  creator: {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  hasLiked?: boolean;
  hasSaved?: boolean;
  createdAt: string;
  duration?: number;
  isProcessing?: boolean;
  sound?: {
    id: string;
    name: string;
    authorName: string;
  };
  tags?: string[];
}

export interface ErosUploadProgress {
  progress: number;
  isUploading: boolean;
  isProcessing: boolean;
  error: string | null;
}

export interface ErosComment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  likes: number;
  hasLiked?: boolean;
}
