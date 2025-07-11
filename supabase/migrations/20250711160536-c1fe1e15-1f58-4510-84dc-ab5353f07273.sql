-- ===== PART 2: NEW STRIPE SUBSCRIPTION SYSTEM =====
-- Create all necessary tables for robust Stripe subscription system

-- 1. Stripe Connect accounts for creators
CREATE TABLE public.stripe_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_account_id TEXT UNIQUE NOT NULL,
  account_enabled BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  capabilities_card_payments TEXT DEFAULT 'inactive',
  capabilities_transfers TEXT DEFAULT 'inactive',
  country TEXT,
  default_currency TEXT DEFAULT 'sek',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Subscription plans that creators can create
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_product_id TEXT UNIQUE NOT NULL,
  stripe_price_id_monthly TEXT UNIQUE,
  stripe_price_id_yearly TEXT UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  monthly_price_sek INTEGER NOT NULL, -- In øre/cents
  yearly_price_sek INTEGER, -- In øre/cents, optional
  yearly_discount_percentage INTEGER DEFAULT 0,
  ppv_enabled BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Active subscriptions from fans to creators
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_plan_id UUID REFERENCES subscription_plans(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active, canceled, incomplete, past_due
  interval_type TEXT NOT NULL, -- monthly, yearly
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(subscriber_id, creator_id) -- One subscription per fan-creator pair
);

-- 4. PPV (Pay-Per-View) content unlocks
CREATE TABLE public.ppv_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content_id UUID NOT NULL, -- Could reference posts, videos, etc.
  content_type TEXT NOT NULL, -- 'post', 'video', 'story', etc.
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  amount_sek INTEGER NOT NULL, -- In øre/cents
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ, -- Optional expiration for temporary access
  UNIQUE(user_id, content_id, content_type)
);

-- 5. Creator payouts tracking
CREATE TABLE public.creator_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_transfer_id TEXT UNIQUE,
  amount_sek INTEGER NOT NULL, -- In øre/cents
  platform_fee_sek INTEGER NOT NULL, -- Platform fee in øre/cents
  net_amount_sek INTEGER NOT NULL, -- Amount after platform fee
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, failed
  payout_date TIMESTAMPTZ,
  failure_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Webhook events log for debugging and reliability
CREATE TABLE public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  processed BOOLEAN DEFAULT false,
  processing_error TEXT,
  event_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ
);

-- Add NSFW content flag to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS nsfw_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS age_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stripe_onboarding_completed BOOLEAN DEFAULT false;