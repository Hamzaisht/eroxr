
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { StudioProfile } from '@/components/studio/types';

export const useStudioProfile = (profileId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['studio-profile', profileId],
    queryFn: async () => {
      console.log('🎨 Studio: Fetching profile for ID:', profileId);
      
      try {
        // Primary: Use safe profile fetch function
        const { data: safeResult, error: rpcError } = await supabase.rpc('get_profile_safe', {
          p_user_id: profileId
        });

        if (!rpcError && safeResult?.success) {
          console.log('✅ Studio: Profile fetched via safe function:', safeResult.data);
          return safeResult.data as StudioProfile;
        }

        console.warn('⚠️ Studio: Safe function failed, trying direct query:', rpcError);
        
        // Fallback: Direct query with error handling
        const { data: directData, error: directError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .maybeSingle();
        
        if (directError) {
          console.error('❌ Studio: Direct query failed:', directError);
          throw directError;
        }
        
        if (!directData) {
          throw new Error('Profile not found');
        }
        
        console.log('✅ Studio: Profile fetched via fallback:', directData);
        return directData as StudioProfile;
        
      } catch (error) {
        console.error('❌ Studio: All profile fetch methods failed:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    enabled: !!profileId,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<StudioProfile>) => {
      console.log('🎨 Studio: Updating profile with:', updates);
      
      try {
        // Primary: Use safe profile update function
        const { data: safeResult, error: rpcError } = await supabase.rpc('safe_profile_update', {
          p_user_id: profileId,
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
          console.log('✅ Studio: Profile updated via safe function');
          return safeResult.data;
        }

        console.warn('⚠️ Studio: Safe update failed, trying fallback:', rpcError || safeResult?.error);
        
        // Fallback 1: Try the existing studio_update_profile function
        try {
          const { error: studioError } = await supabase.rpc('studio_update_profile', {
            p_username: updates.username || null,
            p_bio: updates.bio || null,
            p_location: updates.location || null,
            p_avatar_url: updates.avatar_url || null,
            p_banner_url: updates.banner_url || null,
            p_interests: updates.interests || null,
          });

          if (!studioError) {
            console.log('✅ Studio: Profile updated via studio RPC');
            return;
          }
        } catch (studioErr) {
          console.warn('⚠️ Studio: Studio RPC failed:', studioErr);
        }

        // Fallback 2: Direct update with minimal data
        const updateData: any = {};
        if (updates.username !== undefined) updateData.username = updates.username;
        if (updates.bio !== undefined) updateData.bio = updates.bio;
        if (updates.location !== undefined) updateData.location = updates.location;
        if (updates.avatar_url !== undefined) updateData.avatar_url = updates.avatar_url;
        if (updates.banner_url !== undefined) updateData.banner_url = updates.banner_url;
        if (updates.interests !== undefined) updateData.interests = updates.interests;
        
        updateData.updated_at = new Date().toISOString();

        const { error: directError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', profileId);

        if (directError) {
          console.error('❌ Studio: Direct update failed:', directError);
          throw directError;
        }

        console.log('✅ Studio: Profile updated via direct query');

      } catch (error) {
        console.error('💥 Studio: All profile update methods failed:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studio-profile', profileId] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully!",
      });
    },
    onError: (error: any) => {
      console.error('💥 Studio: Profile update failed:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isLoading,
  };
};
