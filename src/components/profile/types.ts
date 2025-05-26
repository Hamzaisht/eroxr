
export interface ProfileFormData {
  username: string;
  title?: string;
  bio?: string;
  location?: string;
  interests: string[];
  visibility: 'public' | 'private';
}

export interface ProfileHeaderProps {
  profile: {
    id: string;
    username: string;
    title?: string;
    bio?: string;
    avatar_url?: string;
    follower_count?: number;
    following_count?: number;
    post_count?: number;
  };
  isOwnProfile: boolean;
  onEdit?: () => void;
}
