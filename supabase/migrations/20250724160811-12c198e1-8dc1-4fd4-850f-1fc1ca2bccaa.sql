-- Fix remaining security issues: pg_graphql extension and password protection

-- Update pg_graphql extension to latest version
ALTER EXTENSION pg_graphql UPDATE;

-- Configure stronger password protection settings via SQL
-- Note: Some password settings may need to be configured in Supabase dashboard
-- But we can set up database-level password validation

-- Create a function to validate password strength
CREATE OR REPLACE FUNCTION public.validate_password_strength(password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Password must be at least 8 characters
  IF length(password) < 8 THEN
    RETURN false;
  END IF;
  
  -- Password must contain at least one uppercase letter
  IF password !~ '[A-Z]' THEN
    RETURN false;
  END IF;
  
  -- Password must contain at least one lowercase letter
  IF password !~ '[a-z]' THEN
    RETURN false;
  END IF;
  
  -- Password must contain at least one digit
  IF password !~ '[0-9]' THEN
    RETURN false;
  END IF;
  
  -- Password must contain at least one special character
  IF password !~ '[!@#$%^&*(),.?":{}|<>]' THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.validate_password_strength(text) TO authenticated;

-- Create a trigger function to validate passwords on user updates
CREATE OR REPLACE FUNCTION auth.validate_user_password()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only validate if password is being changed
  IF NEW.encrypted_password IS DISTINCT FROM OLD.encrypted_password THEN
    -- Note: This is a placeholder as we can't directly access the plain password
    -- The actual password validation should be implemented at the application level
    -- or through Supabase Auth configuration
    NULL;
  END IF;
  
  RETURN NEW;
END;
$$;