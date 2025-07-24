-- Fix password protection security issue by creating password validation function
-- The pg_graphql extension update needs to be handled by Supabase support

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