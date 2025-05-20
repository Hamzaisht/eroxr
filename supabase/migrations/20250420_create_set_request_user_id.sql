
-- Function for setting the JWT claim user_id in the Postgres session
CREATE OR REPLACE FUNCTION public.set_request_user_id()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM set_config('request.jwt.claims.user_id', auth.uid()::text, true);
END;
$$;

-- Add comment
COMMENT ON FUNCTION public.set_request_user_id IS 'Sets the current user ID from JWT for Row Level Security optimization';
