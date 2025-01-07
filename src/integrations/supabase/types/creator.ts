export type CreatorContentPrice = {
  id: string;
  creator_id: string | null;
  monthly_price: number;
  description: string | null;
  features: Record<string, any> | null;
  created_at: string;
  updated_at: string;
};

export type CreatorLike = {
  id: string;
  user_id: string;
  creator_id: string;
  created_at: string;
};

export type CreatorSubscription = {
  id: string;
  user_id: string;
  creator_id: string;
  created_at: string;
};