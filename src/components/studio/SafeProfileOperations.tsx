
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
    console.log('🔒 SafeProfileOperations: Using safe profile update RPC for:', userId);
    
    // Use safe profile update function with proper error handling
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
      console.log('✅ SafeProfileOperations: Profile updated successfully via safe RPC');
      return { success: true, data: safeResult.data, method: 'safe_rpc' };
    }

    console.error('❌ SafeProfileOperations: Safe RPC failed:', rpcError || safeResult?.error);
    return { 
      success: false, 
      error: rpcError?.message || safeResult?.error || 'RPC function failed', 
      method: 'safe_rpc_failed' 
    };
    
  } catch (error: any) {
    console.error('💥 SafeProfileOperations: Critical error:', error);
    return { success: false, error: error.message, method: 'error' };
  }
};

export const safeProfileFetch = async (userId: string) => {
  try {
    console.log('🔍 SafeProfileOperations: Fetching profile safely for:', userId);
    
    // Use safe profile fetch function
    const { data: safeResult, error: rpcError } = await supabase.rpc('get_profile_safe', {
      p_user_id: userId
    });

    if (!rpcError && safeResult?.success) {
      console.log('✅ SafeProfileOperations: Profile fetched successfully via safe RPC');
      return { success: true, data: safeResult.data, method: 'safe_rpc' };
    }

    console.error('❌ SafeProfileOperations: Safe fetch failed:', rpcError || safeResult?.error);
    return { 
      success: false, 
      error: rpcError?.message || safeResult?.error || 'Profile not found', 
      method: 'safe_rpc_failed' 
    };
    
  } catch (error: any) {
    console.error('💥 SafeProfileOperations: Critical fetch error:', error);
    return { success: false, error: error.message, method: 'error' };
  }
};
