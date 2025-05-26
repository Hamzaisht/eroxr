
export interface EroboardPost {
  id: string;
  title: string;
  content: string;
  creator: {
    id: string;
    username: string;
    isVerified?: boolean;
  };
  createdAt: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  category?: string;
  tags?: string[];
}

export interface EroboardCategory {
  id: string;
  name: string;
  description: string;
  postCount: number;
  isNSFW?: boolean;
}
