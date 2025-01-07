export type SubscriptionTier = {
  id: string;
  name: string;
  price: number;
  features: Record<string, any>;
  created_at: string;
};

export type UserSubscription = {
  id: string;
  user_id: string | null;
  subscription_tier_id: string | null;
  status: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
};