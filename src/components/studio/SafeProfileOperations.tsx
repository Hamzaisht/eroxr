
import { supabase } from '@/integrations/supabase/client';

export interface SafeProfileUpdateParams {
  userId: string;
  username?: string;
  bio?: string;
  location?: string;
  avatar_url?: string;
  banner_url?: string;
  interests?: string[];
  profile_visibility?: boolean;
  status?: string;
}

export const safeProfileUpdate = async (params: SafeProfileUpdateParams) => {
  const { userId, ...updates } = params;
  
  try {
    // Primary: Use safe profile update function
    const { data: safeResult, error: rpcError } = await supabase.rpc('safe_profile_update', {
      p_user_id: userId,
      p_username: updates.username || null,
      p_bio: updates.bio || null,
      p_location: updates.location || null,
      p_avatar_url: updates.avatar_url || null,
      p_banner_url: updates.banner_url || null,
      p_interests: updates.interests || null,
      p_profile_visibility: updates.profile_visibility || null,
      p_status: updates.status || null,
    });

    if (!rpcError && safeResult?.success) {
      return { success: true, data: safeResult.data, method: 'safe_rpc' };
    }

    console.warn('Safe profile update failed, trying fallback:', rpcError || safeResult?.error);
    
    // Fallback: Direct update with minimal data
    const updateData: any = {};
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        updateData[key] = value;
      }
    });
    
    updateData.updated_at = new Date().toISOString();

    const { data, error: directError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (directError) {
      return { success: false, error: directError.message, method: 'direct_fallback' };
    }

    return { success: true, data, method: 'direct_fallback' };
    
  } catch (error: any) {
    return { success: false, error: error.message, method: 'error' };
  }
};

export const safeProfileFetch = async (userId: string) => {
  try {
    // Primary: Use safe profile fetch function
    const { data: safeResult, error: rpcError } = await supabase.rpc('get_profile_safe', {
      p_user_id: userId
    });

    if (!rpcError && safeResult?.success) {
      return { success: true, data: safeResult.data, method: 'safe_rpc' };
    }

    console.warn('Safe profile fetch failed, trying fallback:', rpcError);
    
    // Fallback: Direct query
    const { data, error: directError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (directError) {
      return { success: false, error: directError.message, method: 'direct_fallback' };
    }
    
    if (!data) {
      return { success: false, error: 'Profile not found', method: 'direct_fallback' };
    }

    return { success: true, data, method: 'direct_fallback' };
    
  } catch (error: any) {
    return { success: false, error: error.message, method: 'error' };
  }
};
