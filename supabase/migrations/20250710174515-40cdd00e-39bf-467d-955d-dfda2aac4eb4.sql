-- Clean up existing admin tables and create new secure admin system
DROP TABLE IF EXISTS admin_audit_logs CASCADE;
DROP TABLE IF EXISTS admin_logs CASCADE;
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS flagged_content CASCADE;
DROP TABLE IF EXISTS dmca_requests CASCADE;
DROP TABLE IF EXISTS blacklisted_content CASCADE;
DROP TABLE IF EXISTS id_verifications CASCADE;
DROP TABLE IF EXISTS payout_requests CASCADE;

-- Create app_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE app_role AS ENUM ('user', 'creator', 'moderator', 'admin', 'super_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- User roles table for RBAC
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Admin sessions for Ghost Mode tracking
CREATE TABLE public.admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    ghost_mode BOOLEAN NOT NULL DEFAULT false,
    activated_at TIMESTAMPTZ,
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ip_address INET,
    user_agent TEXT,
    session_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Admin action logs for audit trail
CREATE TABLE public.admin_action_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    action_type TEXT NOT NULL, -- 'user_action', 'content_moderation', 'ghost_surveillance', etc.
    action TEXT NOT NULL, -- 'ban_user', 'delete_content', 'view_profile', etc.
    target_type TEXT, -- 'user', 'post', 'message', 'stream', etc.
    target_id UUID,
    target_data JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT valid_action_type CHECK (action_type IN (
        'user_action', 'content_moderation', 'ghost_surveillance', 
        'verification', 'payout_management', 'system_admin'
    ))
);

-- Verification requests
CREATE TABLE public.verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    document_type TEXT NOT NULL,
    document_url TEXT NOT NULL,
    selfie_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    ai_verification_score NUMERIC(3,2),
    ai_flags JSONB DEFAULT '[]'::jsonb,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected', 'flagged'))
);

-- Flagged content system
CREATE TABLE public.flagged_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type TEXT NOT NULL, -- 'post', 'message', 'stream', 'profile'
    content_id UUID NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    reported_by UUID REFERENCES auth.users(id),
    reason TEXT NOT NULL,
    description TEXT,
    severity TEXT NOT NULL DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'pending',
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    resolution_notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT valid_severity CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    CONSTRAINT valid_flag_status CHECK (status IN ('pending', 'resolved', 'dismissed', 'escalated'))
);

-- Payout management
CREATE TABLE public.payout_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL DEFAULT 'USD',
    stripe_account_id TEXT,
    stripe_transfer_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    processed_at TIMESTAMPTZ,
    processed_by UUID REFERENCES auth.users(id),
    platform_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
    final_amount NUMERIC(10,2) NOT NULL,
    payment_method JSONB DEFAULT '{}'::jsonb,
    failure_reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    CONSTRAINT valid_payout_status CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled'))
);

-- User activity tracking for surveillance
CREATE TABLE public.user_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    activity_data JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    INDEX (user_id, created_at),
    INDEX (activity_type, created_at)
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_action_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flagged_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Security definer function to check admin roles
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id UUID, min_role app_role DEFAULT 'admin')
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM user_roles 
        WHERE user_roles.user_id = is_admin_user.user_id 
        AND user_roles.role IN ('super_admin', 'admin')
        AND (min_role = 'admin' OR user_roles.role = 'super_admin')
    );
$$;

-- RLS Policies for admin tables
CREATE POLICY "Super admins can manage user roles" ON user_roles
    FOR ALL USING (public.is_admin_user(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can manage own sessions" ON admin_sessions
    FOR ALL USING (admin_id = auth.uid() AND public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can view action logs" ON admin_action_logs
    FOR SELECT USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can insert action logs" ON admin_action_logs
    FOR INSERT WITH CHECK (admin_id = auth.uid() AND public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can manage verification requests" ON verification_requests
    FOR ALL USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can manage flagged content" ON flagged_content
    FOR ALL USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can manage payout requests" ON payout_requests
    FOR ALL USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can view user activity" ON user_activity_logs
    FOR SELECT USING (public.is_admin_user(auth.uid()));

-- Insert initial super admin role (replace with actual admin email)
INSERT INTO user_roles (user_id, role, assigned_by) 
SELECT id, 'super_admin', id 
FROM auth.users 
WHERE email = 'hamzaishtiaq242@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Trigger to automatically update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_verification_requests_updated_at 
    BEFORE UPDATE ON verification_requests 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_flagged_content_updated_at 
    BEFORE UPDATE ON flagged_content 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();