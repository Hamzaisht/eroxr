export interface LiveSession {
  id: string;
  type: 'stream' | 'call' | 'chat' | 'bodycontact';
  user_id: string;
  username?: string;
  avatar_url?: string | null;
  started_at: string;
  status?: string;
  title?: string;
  description?: string;
  viewer_count?: number;
  participants?: any[];
  recipient_username?: string;
  sender_username?: string;
  content?: string;
  content_type?: string;
  location?: string;
  tags?: string[];
  created_at?: string;
  // New fields for better profile handling
  sender_profiles?: {
    username: string;
    avatar_url: string | null;
  };
  receiver_profiles?: {
    username: string;
    avatar_url: string | null;
  };
  // Fields needed for MediaPreviewDialog
  media_url?: string[];
  video_url?: string;
  about_me?: string;
}

export interface LiveAlert {
  id: string;
  type: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
  content_type: string;
  reason: string;
  severity: string;
  content_id: string;
}

export interface TabProps {
  analytics: Analytics;
  timeRange: string;
}

export interface ProfileData {
  id: string;
  username: string;
  first_name?: string;
  last_name?: string;
  avatar_url: string | null;
  created_at: string;
  user_roles: {
    role: string;
  };
  is_suspended: boolean;
}

export interface ViewedProfile {
  id: string;
  viewer_id: string;
  viewer_username: string;
  username: string;
  avatar_url: string | null;
  count: number;
  view_count: number;
  last_viewed: string;
}

export interface Analytics {
  // Base fields
  posts: number;
  comments: number;
  likes: number;
  followers: number;
  following: number;
  content_views: number;
  profile_views: number;
  
  // Additional fields for analytics visualization
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalViews: number; // This is the only occurrence of totalViews
  totalMessages: number;
  tipsAmount: number;
  uniqueMessageRecipients: number;
  contentDistribution: Array<{name: string; value: number}>;
  timeline: Array<{
    date: string;
    posts: number;
    likes: number;
    comments: number;
    views: number;
    messages: number;
  }>;
  topProfiles: ViewedProfile[];
  lastActive: Date | null;
}
