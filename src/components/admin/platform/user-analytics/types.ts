
import { DateRange } from "@/components/ui/date-range-picker";

export interface TabProps {
  analytics: any;
  timeRange: string;
  navigate?: (path: string) => void;
}

export interface ProfileData {
  id: string;
  username: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  created_at: string;
  is_suspended?: boolean;
  user_roles: {
    role: string;
  };
}

export interface ViewedProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  count: number;
}

export interface Analytics {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalViews: number;
  totalMessages: number;
  tipsAmount: number;
  uniqueMessageRecipients: number;
  contentDistribution: {
    name: string;
    value: number;
  }[];
  timeline: {
    date: string;
    posts: number;
    likes: number;
    comments: number;
    views: number;
    messages: number;
  }[];
  topProfiles: ViewedProfile[];
  lastActive: Date | null;
}
