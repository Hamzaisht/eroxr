
import { useQuery } from '@tanstack/react-query';
import { VideoProfileCard } from '@/components/ads/video-profile-card';
import { supabase } from '@/integrations/supabase/client';
import { asUUID } from '@/utils/supabase/helpers';

export const PromotedAds = () => {
  const { data: ads, isLoading } = useQuery({
    queryKey: ['promoted-ads'],
    queryFn: async () => {
      // Get promoted ads for the current country (Denmark is default)
      const { data, error } = await supabase
        .from('dating_ads')
        .select(`
          *,
          profiles:user_id(
            username,
            avatar_url,
            id_verification_status
          )
        `)
        .eq('is_active', true)
        .eq('country', 'denmark')
        .eq('moderation_status', 'approved')
        .eq('user_type', 'premium')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching promoted ads:', error);
        return [];
      }

      return data || [];
    },
  });

  if (isLoading || !ads || ads.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <h2 className="text-2xl font-bold text-luxury-light/80">Promoted Profiles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ads.map((ad) => (
          <VideoProfileCard
            key={ad.id}
            ad={{
              id: ad.id,
              title: ad.title,
              description: ad.description || '',
              tags: ad.tags || [],
              avatar: ad.avatar_url || ad.profiles?.avatar_url,
              videoUrl: ad.video_url || '',
              username: ad.profiles?.username || 'Anonymous',
              isVerified: ad.profiles?.id_verification_status === 'verified',
              isPremium: ad.user_type === 'premium',
              location: ad.city,
              age: ad.age_range ? (ad.age_range as any)[0] : 0,
              views: ad.view_count || 0
            }}
          />
        ))}
      </div>
    </div>
  );
};
