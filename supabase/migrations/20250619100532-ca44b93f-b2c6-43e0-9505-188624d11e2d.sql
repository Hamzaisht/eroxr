
-- Step 1: Create a new RLS-bypass profile update function that completely disables RLS
CREATE OR REPLACE FUNCTION public.rls_bypass_profile_update(
  p_user_id UUID,
  p_username TEXT DEFAULT NULL,
  p_bio TEXT DEFAULT NULL,
  p_location TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL,
  p_banner_url TEXT DEFAULT NULL,
  p_interests TEXT[] DEFAULT NULL,
  p_profile_visibility BOOLEAN DEFAULT NULL,
  p_status TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result_record RECORD;
BEGIN
  -- Completely bypass RLS by using a direct UPDATE with no policy checks
  -- This function runs with elevated privileges and bypasses all RLS
  UPDATE profiles 
  SET 
    username = COALESCE(p_username, username),
    bio = COALESCE(p_bio, bio),
    location = COALESCE(p_location, location),
    avatar_url = COALESCE(p_avatar_url, avatar_url),
    banner_url = COALESCE(p_banner_url, banner_url),
    interests = COALESCE(p_interests, interests),
    profile_visibility = COALESCE(p_profile_visibility, profile_visibility),
    status = COALESCE(p_status, status),
    updated_at = NOW()
  WHERE id = p_user_id
  RETURNING *
  INTO result_record;
  
  -- Return success with updated data
  RETURN jsonb_build_object(
    'success', true,
    'data', row_to_json(result_record)
  );
EXCEPTION
  WHEN OTHERS THEN
    -- Return error details
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'code', SQLSTATE
    );
END;
$$;

-- Step 2: Simplify RLS policies on profiles table - remove all recursive policies
DROP POLICY IF EXISTS "profiles_public_select" ON profiles;
DROP POLICY IF EXISTS "profiles_authenticated_insert" ON profiles;
DROP POLICY IF EXISTS "profiles_owner_update" ON profiles;
DROP POLICY IF EXISTS "profiles_owner_delete" ON profiles;

-- Create minimal, non-recursive policies
CREATE POLICY "profiles_public_read" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_owner_write" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Step 3: Create a simplified profile fetch function
CREATE OR REPLACE FUNCTION public.rls_bypass_profile_fetch(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_record RECORD;
BEGIN
  SELECT * INTO profile_record
  FROM profiles
  WHERE id = p_user_id;
  
  IF FOUND THEN
    RETURN jsonb_build_object(
      'success', true,
      'data', row_to_json(profile_record)
    );
  ELSE
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Profile not found'
    );
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'code', SQLSTATE
    );
END;
$$;
