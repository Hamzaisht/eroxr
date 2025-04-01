
import { DateRange } from "@/components/ui/date-range-picker";
import { WithProfile } from "@/integrations/supabase/types/profile";

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

// Ghost Mode Surveillance Types
export interface LiveSession {
  id: string;
  type: 'stream' | 'call' | 'chat' | 'bodycontact';
  user_id: string;
  username: string;
  avatar_url?: string | null;
  started_at: string;
  participants?: number;
  status: 'active' | 'flagged' | 'reported';
  content_type?: string;
  title?: string;
}

export interface LiveAlert {
  id: string;
  type: 'flag' | 'report' | 'risk';
  user_id: string;
  username: string;
  avatar_url?: string | null;
  created_at: string;
  content_type: 'stream' | 'call' | 'message' | 'post' | 'ad';
  reason: string;
  severity: 'low' | 'medium' | 'high';
  content_id: string;
}
