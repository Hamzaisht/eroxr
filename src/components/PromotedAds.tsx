
import { useQuery } from '@tanstack/react-query';
import { VideoProfileCard } from '@/components/ads/video-profile-card';
import { supabase } from '@/integrations/supabase/client';
import { asColumnValue, safeCast } from '@/utils/supabase/helpers';

interface ProfileData {
  username?: string;
  avatar_url?: string;
  id_verification_status?: string;
}

interface AdData {
  id: string;
  title: string;
  description: string | null;
  tags?: string[];
  avatar_url?: string | null;
  video_url?: string | null;
  profiles?: ProfileData;
  user_type?: string;
  city?: string;
  age_range?: any;
  view_count?: number;
}

interface VideoAdProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
  avatarUrl: string;
  videoUrl: string;
  username: string;
  isVerified: boolean;
  isPremium: boolean;
  location: string;
  age: number;
  views: number;
}

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
        .eq('is_active', asColumnValue(true))
        .eq('country', asColumnValue('denmark'))
        .eq('moderation_status', asColumnValue('approved'))
        .eq('user_type', asColumnValue('premium'))
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching promoted ads:', error);
        return [];
      }

      return safeCast<AdData>(data);
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
              avatarUrl: ad.avatar_url || (ad.profiles?.avatar_url || ''),
              videoUrl: ad.video_url || '',
              username: ad.profiles?.username || 'Anonymous',
              isVerified: ad.profiles?.id_verification_status === 'verified',
              isPremium: ad.user_type === 'premium',
              location: ad.city || '',
              age: ad.age_range ? (typeof ad.age_range === 'object' && 'lower' in ad.age_range ? ad.age_range.lower : 0) : 0,
              views: ad.view_count || 0
            }}
          />
        ))}
      </div>
    </div>
  );
};
