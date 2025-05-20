
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { ChevronRight } from 'lucide-react';
import { DatingAd } from '@/types/dating';
import { safeDatingAdFilter } from '@/utils/supabase/type-guards';

const PromotedAds = () => {
  const [ads, setAds] = useState<DatingAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotedAds = async () => {
      try {
        setLoading(true);
        
        // Apply safety filters and then database query
        const query = safeDatingAdFilter(
          supabase
            .from('dating_ads')
            .select('*')
            .eq('is_active', true)
            .eq('is_premium', true)
            .limit(3)
        );
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        const promotedAdsData = data?.map(ad => ({
          id: ad.id,
          user_id: ad.user_id || '',
          title: ad.title,
          description: ad.description,
          username: ad.title.split(' ')[0], // Placeholder
          avatarUrl: ad.avatar_url || '/placeholder-avatar.jpg',
          videoUrl: ad.video_url || '',
          isVerified: !!ad.is_verified,
          isPremium: !!ad.is_premium,
          views: ad.view_count || 0,
          tags: ad.tags || [],
          location: `${ad.city}, ${ad.country}`,
          age: ad.age_range ? 
            (Array.isArray(ad.age_range) ? 
              Math.floor((ad.age_range[0] + ad.age_range[1]) / 2) : 
              Math.floor((ad.age_range.lower + ad.age_range.upper) / 2)) : 30
        })) as DatingAd[];
        
        setAds(promotedAdsData || []);
      } catch (err) {
        console.error('Error fetching promoted ads:', err);
        setError('Failed to load promoted ads');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPromotedAds();
  }, []);

  if (loading) {
    return (
      <div className="py-8">
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Premium Profiles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-800 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-black/30">
      <div className="container">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
            Premium Profiles
          </h2>
          <Button variant="ghost" className="text-luxury-primary hover:text-luxury-accent">
            See all <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        {error ? (
          <p className="text-red-400 text-center">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ads.map(ad => (
              <div 
                key={ad.id}
                className="relative h-64 rounded-lg overflow-hidden group cursor-pointer"
              >
                <img
                  src={ad.avatarUrl}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-medium text-lg">{ad.title}</h3>
                  <p className="text-white/70 text-sm">{ad.location}</p>
                  {ad.isPremium && (
                    <span className="absolute top-3 right-3 bg-yellow-500 text-black font-semibold px-2 py-0.5 rounded text-xs">
                      PREMIUM
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotedAds;
