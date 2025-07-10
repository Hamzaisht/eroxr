-- Clean up and create admin system tables (avoiding conflicts)
DROP TABLE IF EXISTS admin_audit_logs CASCADE;
DROP TABLE IF EXISTS admin_logs CASCADE;
DROP TABLE IF EXISTS admin_sessions CASCADE;

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
    action_type TEXT NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT,
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

-- User activity tracking for surveillance
CREATE TABLE public.user_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    activity_data JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_user_activity_logs_user_created ON user_activity_logs(user_id, created_at);
CREATE INDEX idx_user_activity_logs_type_created ON user_activity_logs(activity_type, created_at);
CREATE INDEX idx_admin_action_logs_admin_created ON admin_action_logs(admin_id, created_at);
CREATE INDEX idx_admin_sessions_admin ON admin_sessions(admin_id, ghost_mode);

-- Enable RLS on tables
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_action_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Security definer function to check admin roles
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id UUID, min_role TEXT DEFAULT 'admin')
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
        AND user_roles.role::text IN ('super_admin', 'admin')
        AND (min_role = 'admin' OR user_roles.role::text = 'super_admin')
    );
$$;

-- RLS Policies for admin tables
CREATE POLICY "Admins can manage own sessions" ON admin_sessions
    FOR ALL USING (admin_id = auth.uid() AND public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can view action logs" ON admin_action_logs
    FOR SELECT USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can insert action logs" ON admin_action_logs
    FOR INSERT WITH CHECK (admin_id = auth.uid() AND public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can view user activity" ON user_activity_logs
    FOR SELECT USING (public.is_admin_user(auth.uid()));

-- Insert initial super admin role if not exists
INSERT INTO user_roles (user_id, role) 
SELECT id, 'super_admin'::app_role 
FROM auth.users 
WHERE email = 'hamzaishtiaq242@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;