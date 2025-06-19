
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
    console.log('🔒 SafeProfileOperations: Using RLS-bypass profile update for:', userId);
    
    // Use the new RLS-bypass function - no fallbacks, crystal clear execution
    const { data: result, error: rpcError } = await supabase.rpc('rls_bypass_profile_update', {
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

    if (!rpcError && result?.success) {
      console.log('✅ SafeProfileOperations: Profile updated successfully via RLS-bypass');
      return { success: true, data: result.data, method: 'rls_bypass' };
    }

    console.error('❌ SafeProfileOperations: RLS-bypass failed:', rpcError || result?.error);
    return { 
      success: false, 
      error: rpcError?.message || result?.error || 'Profile update failed', 
      method: 'rls_bypass_failed' 
    };
    
  } catch (error: any) {
    console.error('💥 SafeProfileOperations: Critical error:', error);
    return { success: false, error: error.message, method: 'error' };
  }
};

export const safeProfileFetch = async (userId: string) => {
  try {
    console.log('🔍 SafeProfileOperations: Fetching profile via RLS-bypass for:', userId);
    
    // Use the new RLS-bypass fetch function
    const { data: result, error: rpcError } = await supabase.rpc('rls_bypass_profile_fetch', {
      p_user_id: userId
    });

    if (!rpcError && result?.success) {
      console.log('✅ SafeProfileOperations: Profile fetched successfully via RLS-bypass');
      return { success: true, data: result.data, method: 'rls_bypass' };
    }

    console.error('❌ SafeProfileOperations: RLS-bypass fetch failed:', rpcError || result?.error);
    return { 
      success: false, 
      error: rpcError?.message || result?.error || 'Profile not found', 
      method: 'rls_bypass_failed' 
    };
    
  } catch (error: any) {
    console.error('💥 SafeProfileOperations: Critical fetch error:', error);
    return { success: false, error: error.message, method: 'error' };
  }
};
