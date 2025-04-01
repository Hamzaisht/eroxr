
import { Dispatch, SetStateAction } from "react";

export interface ProfileData {
  username?: string;
  avatar_url?: string | null;
  first_name?: string;
  last_name?: string;
  created_at: string;
  is_suspended?: boolean;
  user_roles: {
    role: string;
  };
}

export interface ViewedProfile {
  id: string;
  count: number;
  username: string;
  avatar_url: string | null;
}

export interface ActivityTimeline {
  date: string;
  posts: number;
  likes: number;
  comments: number;
  views: number;
  messages: number;
}

export interface ContentDistribution {
  name: string;
  value: number;
}

export interface Analytics {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalViews: number;
  totalMessages: number;
  tipsAmount: number;
  uniqueMessageRecipients: number;
  contentDistribution: ContentDistribution[];
  timeline: ActivityTimeline[];
  topProfiles: ViewedProfile[];
  lastActive: Date | null;
}

export interface TabProps {
  analytics: Analytics;
  timeRange: string;
}

export interface UserAnalyticsProps {
  userId?: string;
  profile?: ProfileData;
  analytics?: Analytics;
  isLoading: boolean;
  timeRange: string;
  setTimeRange: Dispatch<SetStateAction<string>>;
  selectedTab: string;
  setSelectedTab: Dispatch<SetStateAction<string>>;
  navigate: (path: string) => void;
}
