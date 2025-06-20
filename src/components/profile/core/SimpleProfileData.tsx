
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SimpleProfile {
  id: string;
  username: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  interests: string[] | null;
  created_at: string;
}

export const useSimpleProfile = (profileId: string) => {
  const [profile, setProfile] = useState<SimpleProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      console.log('🎯 SimpleProfile: Fetching profile for:', profileId);
      
      const { data: result, error: rpcError } = await supabase.rpc('rls_bypass_profile_fetch', {
        p_user_id: profileId
      });

      if (rpcError || !result?.success) {
        console.error('❌ SimpleProfile: Fetch failed:', rpcError || result?.error);
        setError(rpcError?.message || result?.error || 'Profile not found');
        setProfile(null);
        return;
      }

      console.log('✅ SimpleProfile: Profile fetched successfully');
      setProfile(result.data as SimpleProfile);
      setError(null);
    } catch (err: any) {
      console.error('💥 SimpleProfile: Critical error:', err);
      setError(err.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<SimpleProfile>) => {
    try {
      console.log('🎯 SimpleProfile: Updating profile with:', updates);
      
      const { data: result, error: rpcError } = await supabase.rpc('rls_bypass_profile_update', {
        p_user_id: profileId,
        p_username: updates.username || null,
        p_bio: updates.bio || null,
        p_location: updates.location || null,
        p_avatar_url: updates.avatar_url || null,
        p_banner_url: updates.banner_url || null,
        p_interests: updates.interests || null,
        p_profile_visibility: null,
        p_status: null,
      });

      if (rpcError || !result?.success) {
        console.error('❌ SimpleProfile: Update failed:', rpcError || result?.error);
        throw new Error(rpcError?.message || result?.error || 'Update failed');
      }

      console.log('✅ SimpleProfile: Profile updated successfully');
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (err: any) {
      console.error('💥 SimpleProfile: Update error:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (profileId) {
      fetchProfile();
    }
  }, [profileId]);

  return { profile, loading, error, updateProfile, refetch: fetchProfile };
};
