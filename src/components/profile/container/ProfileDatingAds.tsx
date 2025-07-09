import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Heart, MapPin, Edit3, Trash2, MoreHorizontal, Calendar, Eye, Play } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProfileDatingAdsProps {
  profileId: string;
}

export const ProfileDatingAds = ({ profileId }: ProfileDatingAdsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isOwnProfile = user?.id === profileId;

  const { data: datingAds, isLoading, refetch } = useQuery({
    queryKey: ['profile-dating-ads', profileId],
    queryFn: async () => {
      console.log('🎯 ProfileDatingAds: Fetching dating ads for:', profileId);
      
      const { data, error } = await supabase
        .from('dating_ads')
        .select(`
          id,
          title,
          description,
          avatar_url,
          video_url,
          city,
          country,
          age_range,
          relationship_status,
          looking_for,
          interests,
          tags,
          view_count,
          click_count,
          created_at,
          is_active,
          moderation_status
        `)
        .eq('user_id', profileId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ ProfileDatingAds: Fetch failed:', error);
        throw error;
      }
      
      console.log('✅ ProfileDatingAds: Found ads:', data?.length || 0);
      return data || [];
    },
    staleTime: 60000,
  });

  const handleDeleteAd = async (adId: string) => {
    if (!window.confirm('Are you sure you want to delete this dating ad? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('dating_ads')
        .delete()
        .eq('id', adId);

      if (error) throw error;

      toast({
        title: "Dating ad deleted",
        description: "Your dating ad has been successfully deleted.",
      });

      refetch();
    } catch (error) {
      console.error('Error deleting dating ad:', error);
      toast({
        title: "Error",
        description: "Failed to delete dating ad. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditAd = (adId: string) => {
    // Navigate to edit page or open edit modal
    toast({
      title: "Edit dating ad",
      description: "Edit functionality coming soon!",
    });
  };

  const getAgeRangeText = (ageRange: any) => {
    if (!ageRange) return 'Age not specified';
    if (typeof ageRange === 'string') {
      const match = ageRange.match(/\[(\d+),(\d+)\]/);
      if (match) {
        return `${match[1]}-${match[2]} years`;
      }
    }
    return 'Age not specified';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl p-6 animate-pulse">
            <div className="flex gap-4 mb-4">
              <div className="w-16 h-16 bg-white/10 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-white/10 rounded mb-2 w-3/4" />
                <div className="h-3 bg-white/10 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-white/10 rounded" />
              <div className="h-3 bg-white/10 rounded w-4/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!datingAds || datingAds.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <Heart className="w-16 h-16 mx-auto text-white/40 mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">No Dating Ads Yet</h3>
        <p className="text-white/60">
          {isOwnProfile ? "Create your first dating ad to meet new people!" : "This user hasn't created any dating ads yet."}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {datingAds.map((ad, index) => (
        <motion.div
          key={ad.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center border-2 border-white/20">
                <Heart className="w-8 h-8 text-white/60" />
              </div>
              
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white mb-1">{ad.title}</h4>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{ad.city}, {ad.country}</span>
                  <span>•</span>
                  <span>{getAgeRangeText(ad.age_range)}</span>
                </div>
              </div>
            </div>

            {/* Content Actions (only for own profile) */}
            {isOwnProfile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="bg-black/90 backdrop-blur-md border-white/20 text-white"
                >
                  <DropdownMenuItem 
                    onClick={() => handleEditAd(ad.id)}
                    className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Ad
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDeleteAd(ad.id)}
                    className="hover:bg-red-500/20 focus:bg-red-500/20 text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Ad
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Media Section */}
          {(ad.avatar_url || ad.video_url) && (
            <div className="mb-4">
              <div className="grid gap-3">
                {ad.avatar_url && (
                  <div className="relative">
                    <img
                      src={ad.avatar_url}
                      alt={`${ad.title} - Profile`}
                      className="w-full h-48 object-cover rounded-lg border border-white/20"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="text-xs bg-black/60 text-white border-0">
                        Photo
                      </Badge>
                    </div>
                  </div>
                )}
                
                {ad.video_url && (
                  <div className="relative">
                    <video
                      src={ad.video_url}
                      className="w-full h-48 object-cover rounded-lg border border-white/20"
                      controls
                      preload="metadata"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="text-xs bg-black/60 text-white border-0 flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        Video
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Status Badges */}
          <div className="flex gap-2 mb-3">
            <Badge className={`text-xs ${getStatusColor(ad.moderation_status || 'pending')}`}>
              {ad.moderation_status || 'Pending'}
            </Badge>
            {!ad.is_active && (
              <Badge className="text-xs bg-gray-500/20 text-gray-400 border-gray-500/30">
                Inactive
              </Badge>
            )}
          </div>

          {/* Description */}
          <p className="text-white/80 text-sm mb-4 line-clamp-3 leading-relaxed">
            {ad.description}
          </p>

          {/* Looking For */}
          {ad.looking_for && ad.looking_for.length > 0 && (
            <div className="mb-4">
              <h5 className="text-white/60 text-xs font-medium mb-2">Looking for:</h5>
              <div className="flex flex-wrap gap-1">
                {ad.looking_for.slice(0, 3).map((item: string, i: number) => (
                  <span
                    key={i}
                    className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-lg"
                  >
                    {item}
                  </span>
                ))}
                {ad.looking_for.length > 3 && (
                  <span className="text-xs text-white/40">
                    +{ad.looking_for.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Interests */}
          {ad.interests && ad.interests.length > 0 && (
            <div className="mb-4">
              <h5 className="text-white/60 text-xs font-medium mb-2">Interests:</h5>
              <div className="flex flex-wrap gap-1">
                {ad.interests.slice(0, 4).map((interest: string, i: number) => (
                  <span
                    key={i}
                    className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded-lg"
                  >
                    {interest}
                  </span>
                ))}
                {ad.interests.length > 4 && (
                  <span className="text-xs text-white/40">
                    +{ad.interests.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Stats & Date */}
          <div className="flex items-center justify-between text-white/50 text-xs pt-4 border-t border-white/10">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{ad.view_count || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span>{ad.click_count || 0}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(ad.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};