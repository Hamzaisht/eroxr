-- Drop the old function with conflicting parameter types
DROP FUNCTION IF EXISTS public.rls_bypass_profile_update(uuid, text, text, text, text, text, text[], text, text);

-- Recreate the function with correct parameter types
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
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  result_record RECORD;
BEGIN
  -- Update profile with security definer privileges (bypasses RLS)
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
  RETURNING * INTO result_record;
  
  IF FOUND THEN
    RETURN jsonb_build_object(
      'success', true,
      'data', row_to_json(result_record)
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