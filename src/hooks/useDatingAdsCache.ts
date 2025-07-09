import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DatingAd } from '@/types/dating';

const CACHE_KEY = 'dating_ads';
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

export const useDatingAdsCache = () => {
  const queryClient = useQueryClient();
  
  const { data: ads = [], isLoading, error, refetch } = useQuery({
    queryKey: [CACHE_KEY],
    queryFn: async (): Promise<DatingAd[]> => {
      const { data, error } = await supabase
        .from('dating_ads')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(ad => ({
        id: ad.id,
        user_id: ad.user_id,
        title: ad.title,
        description: ad.description,
        username: ad.title || `User${ad.user_id?.slice(-4)}`,
        avatarUrl: ad.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(ad.title || 'User')}&backgroundColor=6366f1`,
        videoUrl: ad.video_url,
        video_url: ad.video_url,
        avatar_url: ad.avatar_url,
        isVerified: ad.is_verified || false,
        isPremium: ad.is_premium || false,
        is_verified: ad.is_verified || false,
        is_premium: ad.is_premium || false,
        views: ad.view_count || 0,
        view_count: ad.view_count || 0,
        tags: ad.tags || [],
        location: ad.city,
        age: ad.age_range ? parseInt(ad.age_range.split(',')[0].replace('[', '')) : 25,
        gender: ad.user_type,
        seeking: ad.looking_for || [],
        looking_for: ad.looking_for || [],
        country: ad.country,
        city: ad.city,
        created_at: ad.created_at,
        last_active: ad.last_active,
      }));
    },
    staleTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Optimistic updates
  const optimisticUpdate = useCallback((updatedAd: Partial<DatingAd> & { id: string }) => {
    queryClient.setQueryData([CACHE_KEY], (oldData: DatingAd[] = []) => {
      return oldData.map(ad => 
        ad.id === updatedAd.id ? { ...ad, ...updatedAd } : ad
      );
    });
  }, [queryClient]);

  const optimisticDelete = useCallback((adId: string) => {
    queryClient.setQueryData([CACHE_KEY], (oldData: DatingAd[] = []) => {
      return oldData.filter(ad => ad.id !== adId);
    });
  }, [queryClient]);

  const optimisticAdd = useCallback((newAd: DatingAd) => {
    queryClient.setQueryData([CACHE_KEY], (oldData: DatingAd[] = []) => {
      return [newAd, ...oldData];
    });
  }, [queryClient]);

  // Invalidate cache
  const invalidateCache = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [CACHE_KEY] });
  }, [queryClient]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('dating_ads_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dating_ads'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          // Invalidate cache for real-time updates
          invalidateCache();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [invalidateCache]);

  return {
    ads,
    isLoading,
    error,
    refetch,
    optimisticUpdate,
    optimisticDelete,
    optimisticAdd,
    invalidateCache
  };
};