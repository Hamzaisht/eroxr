export interface LiveSession {
  id: string;
  type: 'stream' | 'call' | 'chat' | 'bodycontact';
  user_id: string;
  username: string;
  avatar_url: string | null;
  started_at: string;
  status: string;
  title?: string;
  description?: string;
  content_type: string;
  participants?: number;
  created_at: string;
  
  recipient_id?: string;
  recipient_username?: string;
  recipient_avatar?: string;
  location?: string;
  tags?: string[];
  viewer_count?: number;
  content?: string;
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
  data?: any; // Making data optional to fix the TypeScript errors
}

export interface ProfileData {
  id: string;
  username: string;
  avatar_url: string;
  email: string;
  created_at: string;
  status: string;
  user_roles: {
    role: string;
  };
  is_suspended?: boolean;
  first_name?: string;
  last_name?: string;
}

export interface Analytics {
  posts: number;
  comments: number;
  likes: number;
  followers: number;
  following: number;
  content_views: number;
  profile_views: number;
  // Fields used in implementation
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalViews: number;
  totalMessages: number;
  tipsAmount: number;
  uniqueMessageRecipients: number;
  contentDistribution: { name: string; value: number; }[];
  timeline: any[];
  topProfiles: ViewedProfile[];
  lastActive: Date | null;
}

export interface ViewedProfile {
  viewer_id: string;
  viewer_username: string;
  view_count: number;
  last_viewed: string;
  // Additional fields needed for ProfilesViewsTab
  id: string;
  username: string;
  avatar_url: string | null;
  count: number;
}

export interface ProfilesViewsTabProps {
  analytics: Analytics;
  timeRange: string;
  navigate: (path: string) => void;
  data?: any; // Making data optional to fix the TypeScript errors
}
