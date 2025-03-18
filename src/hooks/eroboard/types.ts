
import { DateRange } from "date-fns";

export type EroboardStats = {
  totalEarnings: number;
  totalSubscribers: number;
  totalViews: number;
  engagementRate: number;
  timeOnPlatform: number;
  revenueShare: number;
  followers: number;
  totalContent: number;
  earningsPercentile: number | null;
  newSubscribers: number;
  returningSubscribers: number;
  churnRate: number;
  vipFans: number;
};

export type RevenueBreakdown = {
  subscriptions: number;
  tips: number;
  liveStreamPurchases: number;
  messages: number;
};

export type DateRange = {
  from: Date;
  to: Date;
};

export type PayoutInfo = {
  status: string;
  processed_at: string | null;
};

export type ContentItem = {
  id: string;
  earnings: number;
  likes: number;
  comments: number;
  views: number;
  engagement: number;
  created_at: string;
  type: string;
};
