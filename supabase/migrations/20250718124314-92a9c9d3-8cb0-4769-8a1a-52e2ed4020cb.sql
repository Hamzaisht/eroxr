-- Add database function to check username uniqueness
CREATE OR REPLACE FUNCTION public.check_username_available(username_to_check text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE LOWER(username) = LOWER(username_to_check)
  );
$$;

-- Add constraint to ensure username uniqueness (case insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_unique_ci 
ON public.profiles (LOWER(username)) 
WHERE username IS NOT NULL;