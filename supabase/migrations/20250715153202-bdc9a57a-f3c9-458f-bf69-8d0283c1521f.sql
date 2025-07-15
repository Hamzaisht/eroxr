
-- Create platform subscriptions table to track user premium status
CREATE TABLE public.platform_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'inactive',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for platform subscriptions
ALTER TABLE public.platform_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own platform subscription
CREATE POLICY "Users can view own platform subscription" ON public.platform_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for edge functions to manage platform subscriptions
CREATE POLICY "Service role can manage platform subscriptions" ON public.platform_subscriptions
  FOR ALL USING (true);

-- Create stripe_customers table to track customer relationships
CREATE TABLE public.stripe_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for stripe_customers
ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own stripe customer info
CREATE POLICY "Users can view own stripe customer info" ON public.stripe_customers
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for service role to manage stripe customers
CREATE POLICY "Service role can manage stripe customers" ON public.stripe_customers
  FOR ALL USING (true);

-- Update tips table to include real payment processing
ALTER TABLE public.tips ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;
ALTER TABLE public.tips ADD COLUMN IF NOT EXISTS platform_fee_amount NUMERIC DEFAULT 0;
ALTER TABLE public.tips ADD COLUMN IF NOT EXISTS creator_amount NUMERIC DEFAULT 0;
ALTER TABLE public.tips ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_platform_subscriptions_user_id ON public.platform_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_subscriptions_status ON public.platform_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_user_id ON public.stripe_customers(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_stripe_id ON public.stripe_customers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_tips_status ON public.tips(status);

-- Create function to check if user has premium access
CREATE OR REPLACE FUNCTION public.user_has_premium_access(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.platform_subscriptions 
    WHERE user_id = p_user_id 
    AND status = 'active' 
    AND current_period_end > NOW()
  );
END;
$$;

-- Create function to get platform subscription status
CREATE OR REPLACE FUNCTION public.get_platform_subscription_status(p_user_id UUID)
RETURNS TABLE(
  has_premium BOOLEAN,
  status TEXT,
  current_period_end TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN ps.status = 'active' AND ps.current_period_end > NOW() THEN true
      ELSE false
    END as has_premium,
    COALESCE(ps.status, 'inactive') as status,
    ps.current_period_end
  FROM public.platform_subscriptions ps
  WHERE ps.user_id = p_user_id;
  
  -- If no subscription found, return default values
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'inactive'::TEXT, NULL::TIMESTAMPTZ;
  END IF;
END;
$$;
