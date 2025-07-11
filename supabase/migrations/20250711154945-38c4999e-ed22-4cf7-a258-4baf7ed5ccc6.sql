-- ===== PART 1: CLEANUP / LEGACY PURGE =====
-- Remove all legacy subscription tables and start fresh

-- Drop existing subscription-related tables
DROP TABLE IF EXISTS public.user_subscriptions CASCADE;
DROP TABLE IF EXISTS public.subscription_tiers CASCADE;
DROP TABLE IF EXISTS public.creator_subscriptions CASCADE;

-- Remove old subscription-related columns from profiles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS subscription_price;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS auto_renew_subscriptions;

-- Clean up any old functions related to subscriptions
DROP FUNCTION IF EXISTS public.get_subscriber_analytics CASCADE;
DROP FUNCTION IF EXISTS public.get_revenue_breakdown CASCADE;