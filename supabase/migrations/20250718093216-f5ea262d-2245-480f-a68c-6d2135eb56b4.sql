-- Add new fields to profiles table for username changes and verification
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS is_age_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_username_change TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS push_notifications BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS marketing_emails BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS nsfw_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS content_warning_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS show_online_status BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS allow_tips BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS allow_direct_messages BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS allow_custom_requests BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS content_privacy_default TEXT DEFAULT 'public',
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS is_paused BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS pause_reason TEXT,
ADD COLUMN IF NOT EXISTS pause_end_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS stripe_onboarding_completed BOOLEAN DEFAULT FALSE;

-- Create creator verification requests table
CREATE TABLE IF NOT EXISTS public.creator_verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Personal Information
    full_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    registered_address JSONB NOT NULL, -- {street, city, state, postal_code, country}
    account_type TEXT NOT NULL CHECK (account_type IN ('private', 'company')),
    
    -- Identity Verification
    government_id_type TEXT NOT NULL CHECK (government_id_type IN ('passport', 'national_id', 'drivers_license')),
    government_id_url TEXT NOT NULL, -- Storage path to uploaded ID
    selfie_url TEXT NOT NULL, -- Storage path to selfie with ID
    
    -- Optional Information
    social_media_links JSONB DEFAULT '{}', -- {instagram, twitter, tiktok, etc}
    
    -- Legal Acceptance
    terms_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    terms_accepted_at TIMESTAMP WITH TIME ZONE,
    privacy_policy_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    community_guidelines_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Request Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'requires_changes')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES public.profiles(id),
    rejection_reason TEXT,
    admin_notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Enable RLS on creator verification requests
ALTER TABLE public.creator_verification_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for creator verification requests
CREATE POLICY "Users can create their own verification request" 
ON public.creator_verification_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own verification request" 
ON public.creator_verification_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending verification request" 
ON public.creator_verification_requests 
FOR UPDATE 
USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can view all verification requests" 
ON public.creator_verification_requests 
FOR SELECT 
USING (is_admin_user(auth.uid()));

CREATE POLICY "Admins can update verification requests" 
ON public.creator_verification_requests 
FOR UPDATE 
USING (is_admin_user(auth.uid()));

-- Create email verification tokens table
CREATE TABLE IF NOT EXISTS public.email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    new_email TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on email verification tokens
ALTER TABLE public.email_verification_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email verification tokens
CREATE POLICY "Users can view their own email tokens" 
ON public.email_verification_tokens 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create user roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'creator', 'admin', 'super_admin')),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    granted_by UUID REFERENCES public.profiles(id),
    
    UNIQUE(user_id, role)
);

-- Enable RLS on user roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" 
ON public.user_roles 
FOR ALL 
USING (is_admin_user(auth.uid()));

-- Create creator subscriptions table for fan subscriptions
CREATE TABLE IF NOT EXISTS public.creator_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled', 'past_due')),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, creator_id)
);

-- Enable RLS on creator subscriptions
ALTER TABLE public.creator_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for creator subscriptions
CREATE POLICY "Users can view their own subscriptions" 
ON public.creator_subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Creators can view their subscribers" 
ON public.creator_subscriptions 
FOR SELECT 
USING (auth.uid() = creator_id);

CREATE POLICY "Users can create subscriptions" 
ON public.creator_subscriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to check if user can change username
CREATE OR REPLACE FUNCTION public.can_change_username(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
    SELECT 
        CASE 
            WHEN last_username_change IS NULL THEN TRUE
            WHEN last_username_change < NOW() - INTERVAL '90 days' THEN TRUE
            ELSE FALSE
        END
    FROM public.profiles 
    WHERE id = user_id;
$$;

-- Create function to validate age (18+)
CREATE OR REPLACE FUNCTION public.is_age_valid(birth_date DATE)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
AS $$
    SELECT birth_date <= (CURRENT_DATE - INTERVAL '18 years')::DATE;
$$;

-- Create function to check if user is verified creator
CREATE OR REPLACE FUNCTION public.is_verified_creator(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.creator_verification_requests 
        WHERE user_id = is_verified_creator.user_id 
        AND status = 'approved'
    );
$$;

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers
DROP TRIGGER IF EXISTS update_creator_verification_requests_updated_at ON public.creator_verification_requests;
CREATE TRIGGER update_creator_verification_requests_updated_at
    BEFORE UPDATE ON public.creator_verification_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_creator_subscriptions_updated_at ON public.creator_subscriptions;
CREATE TRIGGER update_creator_subscriptions_updated_at
    BEFORE UPDATE ON public.creator_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();