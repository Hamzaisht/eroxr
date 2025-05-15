
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { AdCard } from './ads/AdCard';
import { Skeleton } from './ui/skeleton';
import { DatingAd } from './ads/types/dating';
import { asUUID } from '@/utils/supabase/helpers';

export const PromotedAds = () => {
  const [ads, setAds] = useState<DatingAd[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const session = useSession();

  useEffect(() => {
    const fetchPromotedAds = async () => {
      try {
        setLoading(true);
        
        const queryBuilder = supabase
          .from('dating_ads')
          .select(`
            id,
            title,
            description,
            city,
            age_range,
            video_url,
            avatar_url,
            tags,
            is_active,
            relationship_status,
            body_type,
            looking_for,
            country,
            created_at,
            user_id,
            user:user_id (
              id,
              username,
              avatar_url
            )
          `)
          .eq('is_active', true)
          .eq('country', 'sweden')
          .limit(6);
          
        // If user is logged in, filter out their own ads
        if (session?.user?.id) {
          queryBuilder.neq('user_id', asUUID(session.user.id));
        }
        
        const { data, error } = await queryBuilder.order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching promoted ads:", error);
          return;
        }

        if (data) {
          const formattedAds = data.map(ad => ({
            ...ad,
            age_range: {
              lower: ad.age_range ? parseInt(ad.age_range.replace(/[\[\]]/g, '').split(',')[0]) : 18,
              upper: ad.age_range ? parseInt(ad.age_range.replace(/[\[\]]/g, '').split(',')[1]) : 99
            },
            location: ad.city,
          })) as DatingAd[];

          setAds(formattedAds);
        }
      } catch (error) {
        console.error("Error in promoted ads fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotedAds();
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  if (ads.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Promoted Profiles</h2>
        <Button 
          variant="link" 
          onClick={() => navigate('/dating')}
          className="text-sm"
        >
          View all
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ads.map(ad => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>
    </div>
  );
};
