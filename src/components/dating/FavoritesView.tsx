import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DatingAd } from '@/components/ads/types/dating';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { OptimizedAvatar } from "@/components/ui/OptimizedImage";
import { Button } from '@/components/ui/button';
import { Heart, Trash2, MessageCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { FullscreenAdViewer } from '@/components/ads/video-profile/FullscreenAdViewer';
import { getAgeRangeValues } from '@/utils/dating/ageRangeUtils';

interface FavoritesViewProps {
  userProfile: DatingAd | null;
}

export const FavoritesView = ({ userProfile }: FavoritesViewProps) => {
  const [favorites, setFavorites] = useState<DatingAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<DatingAd | null>(null);
  const { toast } = useToast();
  const session = useSession();
  
  useEffect(() => {
    console.log('FavoritesView useEffect triggered', { sessionExists: !!session?.user?.id });
    
    if (!session?.user?.id) {
      console.log('No session user ID, skipping favorites fetch');
      setLoading(false);
      return;
    }
    
    const fetchFavorites = async () => {
      console.log('Fetching favorites for user:', session.user.id);
      setLoading(true);
      
      try {
        // Get favorite profile IDs
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('profile_favorites')
          .select('dating_ad_id, created_at')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
          
        if (favoritesError) throw favoritesError;
        
        console.log('Favorites data:', favoritesData);
        
        if (favoritesData && favoritesData.length > 0) {
          // Get the actual profile data
          const profileIds = favoritesData.map(fav => fav.dating_ad_id);
          
          const { data: profilesData, error: profilesError } = await supabase
            .from('dating_ads')
            .select('*')
            .in('id', profileIds);
            
          if (profilesError) throw profilesError;
          
          console.log('Profiles data:', profilesData);
          
          // Sort profiles in the same order as favorites
          const sortedProfiles = profileIds
            .map(id => profilesData?.find(profile => profile.id === id))
            .filter(profile => profile !== undefined) as DatingAd[];
          
          setFavorites(sortedProfiles);
        } else {
          console.log('No favorites found');
          setFavorites([]);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load favorites",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavorites();
  }, [session?.user?.id]); // Only depend on the user ID, not the whole session or toast
  
  const handleRemoveFavorite = async (profileId: string) => {
    if (!session?.user?.id) return;
    
    try {
      const { error } = await supabase
        .from('profile_favorites')
        .delete()
        .eq('user_id', session.user.id)
        .eq('dating_ad_id', profileId);
        
      if (error) throw error;
      
      // Update state
      setFavorites(favorites.filter(fav => fav.id !== profileId));
      
      toast({
        title: "Removed from favorites",
        description: "Profile has been removed from your favorites",
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove favorite",
      });
    }
  };
  
  const handleMessageProfile = (profile: DatingAd) => {
    // This would typically open a message dialog or navigate to a chat page
    toast({
      title: "Messaging",
      description: `Opening conversation with ${profile.title}`,
    });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-primary"></div>
      </div>
    );
  }
  
  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-black/20 rounded-xl min-h-[300px]">
        <Heart className="h-12 w-12 text-luxury-primary/40 mb-4" />
        <h3 className="text-xl font-bold text-luxury-primary mb-2">No Favorites Yet</h3>
        <p className="text-luxury-neutral/60 max-w-md text-center">
          You haven't added any profiles to your favorites yet. Use the heart icon when browsing to save profiles you're interested in.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-luxury-primary">Your Favorites</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((profile) => {
          const ageRange = getAgeRangeValues(profile.age_range);
          
          return (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-luxury-darker/50 backdrop-blur-sm border border-luxury-primary/10 rounded-xl overflow-hidden"
            >
              <div 
                className="cursor-pointer"
                onClick={() => setSelectedProfile(profile)}
              >
                <div className="relative h-40 bg-gradient-to-b from-luxury-primary/5 to-luxury-dark/30">
                  <OptimizedAvatar
                    src={profile.avatar_url}
                    username={profile.title}
                    size="xl"
                    className="absolute top-4 left-4 w-20 h-20 border-2 border-luxury-primary/20"
                  />
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-white">{profile.title}</h3>
                      <p className="text-sm text-luxury-neutral">{profile.city}, {profile.country}</p>
                      <div className="flex items-center mt-1 text-xs text-luxury-neutral">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{profile.last_active ? formatDistanceToNow(new Date(profile.last_active), { addSuffix: true }) : 'Unknown'}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-medium bg-luxury-primary/10 text-luxury-primary px-2 py-1 rounded-full">
                        {profile.relationship_status}
                      </span>
                      <span className="text-xs font-medium bg-luxury-primary/10 text-luxury-primary px-2 py-1 rounded-full">
                        {ageRange.lower}-{ageRange.upper}
                      </span>
                    </div>
                  </div>
                  
                  {profile.tags && profile.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {profile.tags.slice(0, 3).map((tag, i) => (
                        <span 
                          key={i} 
                          className="text-xs bg-luxury-primary/5 border border-luxury-primary/10 text-luxury-neutral px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {profile.tags.length > 3 && (
                        <span className="text-xs bg-luxury-primary/5 border border-luxury-primary/10 text-luxury-neutral px-2 py-0.5 rounded-full">
                          +{profile.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex border-t border-luxury-primary/10">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 rounded-none py-3 text-luxury-neutral hover:text-red-500 hover:bg-red-500/10"
                  onClick={() => handleRemoveFavorite(profile.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 rounded-none py-3 text-luxury-neutral hover:text-luxury-primary hover:bg-luxury-primary/10"
                  onClick={() => handleMessageProfile(profile)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {selectedProfile && (
        <FullscreenAdViewer 
          ad={selectedProfile} 
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>
  );
};
