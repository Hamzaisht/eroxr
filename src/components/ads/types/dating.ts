
export interface DatingAd {
  id: string;
  title: string;
  description: string;
  user_id: string;
  username: string;
  avatarUrl: string;
  videoUrl?: string;
  views?: number;
  likes?: number;
  messages?: number;
  isVerified?: boolean;
  isPremium?: boolean;
  location?: string;
  tags?: string[];
  age?: number;
  gender?: string;
  seeking?: string[];
  last_active?: string;
  avatar_url?: string; // For backward compatibility
  video_url?: string; // For backward compatibility
  is_verified?: boolean; // For backward compatibility 
  is_premium?: boolean; // For backward compatibility
}

export interface DatingAdAction {
  type: 'like' | 'message' | 'view' | 'block';
  adId: string;
  userId: string;
}
