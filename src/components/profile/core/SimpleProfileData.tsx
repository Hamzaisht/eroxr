
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
      
      // Use direct Supabase query instead of RLS bypass function
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id, username, bio, location, avatar_url, banner_url, interests, created_at')
        .eq('id', profileId)
        .single();

      if (fetchError) {
        console.error('❌ SimpleProfile: Fetch failed:', fetchError);
        setError(fetchError.message || 'Profile not found');
        setProfile(null);
        return;
      }

      console.log('✅ SimpleProfile: Profile fetched successfully');
      setProfile(data as SimpleProfile);
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
      
      // Use direct Supabase query instead of RLS bypass function
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          username: updates.username,
          bio: updates.bio,
          location: updates.location,
          avatar_url: updates.avatar_url,
          banner_url: updates.banner_url,
          interests: updates.interests,
          updated_at: new Date().toISOString()
        })
        .eq('id', profileId)
        .select()
        .single();

      if (updateError) {
        console.error('❌ SimpleProfile: Update failed:', updateError);
        throw new Error(updateError.message || 'Update failed');
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
