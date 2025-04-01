
export interface LiveSession {
  id: string;
  type: 'stream' | 'call' | 'chat' | 'bodycontact';
  user_id: string;
  username: string;
  avatar_url: string | null;
  started_at: string;
  status: string;
  title?: string;
  content_type: string;
  participants?: number;
  created_at: string;
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
  data: any;
  timeRange: string;
}

export interface ProfileData {
  id: string;
  username: string;
  avatar_url: string;
  email: string;
  created_at: string;
  status: string;
}

export interface Analytics {
  posts: number;
  comments: number;
  likes: number;
  followers: number;
  following: number;
  content_views: number;
  profile_views: number;
}

export interface ViewedProfile {
  viewer_id: string;
  viewer_username: string;
  view_count: number;
  last_viewed: string;
}

export interface ProfilesViewsTabProps {
  timeRange: string;
  analytics: any;
}
