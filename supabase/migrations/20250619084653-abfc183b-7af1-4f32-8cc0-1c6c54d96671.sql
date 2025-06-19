
-- Step 1: Create security definer functions to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 'user'::text; -- Default role, can be extended later with actual role system
$$;

-- Step 2: Create safe profile operations functions
CREATE OR REPLACE FUNCTION public.safe_profile_update(
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
  -- Update profile with conflict handling
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

-- Step 3: Create safe profile fetch function
CREATE OR REPLACE FUNCTION public.get_profile_safe(p_user_id UUID)
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

-- Step 4: Create permission check function
CREATE OR REPLACE FUNCTION public.check_profile_permissions(
  p_user_id UUID,
  p_target_profile_id UUID,
  p_operation TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Owner can always modify their own profile
  IF p_user_id = p_target_profile_id THEN
    RETURN true;
  END IF;
  
  -- Add additional permission logic here if needed
  -- For now, only allow self-modification
  RETURN false;
EXCEPTION
  WHEN OTHERS THEN
    -- Default to deny on any error
    RETURN false;
END;
$$;

-- Step 5: Drop and recreate RLS policies to avoid recursion
DROP POLICY IF EXISTS "profiles_public_select" ON profiles;
DROP POLICY IF EXISTS "profiles_user_insert" ON profiles;
DROP POLICY IF EXISTS "profiles_user_update" ON profiles;
DROP POLICY IF EXISTS "profiles_user_delete" ON profiles;

-- Create new non-recursive policies
CREATE POLICY "profiles_public_select" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_authenticated_insert" ON profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id AND 
    public.check_profile_permissions(auth.uid(), id, 'insert')
  );

CREATE POLICY "profiles_owner_update" ON profiles
  FOR UPDATE USING (
    auth.uid() = id AND 
    public.check_profile_permissions(auth.uid(), id, 'update')
  );

CREATE POLICY "profiles_owner_delete" ON profiles
  FOR DELETE USING (
    auth.uid() = id AND 
    public.check_profile_permissions(auth.uid(), id, 'delete')
  );

-- Step 6: Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 7: Create stack depth protection function
CREATE OR REPLACE FUNCTION public.detect_stack_depth()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  stack_info TEXT;
BEGIN
  GET DIAGNOSTICS stack_info = PG_CONTEXT;
  -- Count the number of function calls in the stack
  RETURN array_length(string_to_array(stack_info, 'function'), 1) - 1;
EXCEPTION
  WHEN OTHERS THEN
    RETURN 0;
END;
$$;
