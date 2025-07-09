import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Heart, MapPin, Edit3, Trash2, MoreHorizontal, Calendar, Eye, Play, Check, X, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
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
  const [editingField, setEditingField] = useState<{adId: string, field: string} | null>(null);
  const [editValue, setEditValue] = useState('');

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

  const startEditing = (adId: string, field: string, currentValue: string) => {
    setEditingField({ adId, field });
    setEditValue(currentValue);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue('');
  };

  const saveEdit = async () => {
    if (!editingField) return;

    try {
      const updateData: any = {};
      updateData[editingField.field] = editValue;

      const { error } = await supabase
        .from('dating_ads')
        .update(updateData)
        .eq('id', editingField.adId);

      if (error) throw error;

      toast({
        title: "Ad updated",
        description: "Your dating ad has been successfully updated.",
      });

      refetch();
      setEditingField(null);
      setEditValue('');
    } catch (error) {
      console.error('Error updating dating ad:', error);
      toast({
        title: "Error",
        description: "Failed to update dating ad. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditAd = (adId: string) => {
    // This function is now replaced by inline editing
    console.log('Edit ad:', adId);
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
          initial={{ opacity: 0, y: 50, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ 
            delay: index * 0.15, 
            duration: 0.8, 
            type: "spring",
            stiffness: 100 
          }}
          whileHover={{ 
            y: -8, 
            scale: 1.02,
            transition: { duration: 0.3, type: "spring", stiffness: 400 }
          }}
          className="group relative overflow-hidden"
        >
          {/* Background Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-cyan-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Main Card */}
          <div className="relative bg-gradient-to-br from-black/40 via-gray-900/50 to-black/60 backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-purple-400/30 transition-all duration-500 overflow-hidden">
            {/* Floating Particles */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                  }}
                  animate={{
                    y: [-10, 10, -10],
                    x: [-5, 5, -5],
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Media Section - Hero Style */}
            {(ad.avatar_url || ad.video_url) && (
              <div className="relative h-64 mb-6 overflow-hidden">
                {/* Media Container */}
                <div className="absolute inset-0">
                  {ad.avatar_url && (
                    <div className="relative w-full h-full">
                      <img
                        src={ad.avatar_url}
                        alt={`${ad.title} - Profile`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-black/60 backdrop-blur-sm text-white border-0 text-xs font-medium">
                          Photo
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  {ad.video_url && (
                    <div className="relative w-full h-full">
                      <video
                        src={ad.video_url}
                        className="w-full h-full object-cover"
                        controls={false}
                        preload="metadata"
                        muted
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-black/60 backdrop-blur-sm text-white border-0 text-xs font-medium flex items-center gap-1">
                          <Play className="w-3 h-3" />
                          Video
                        </Badge>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Floating Header Info */}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-2 border-white/20">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                       <div className="flex-1">
                         {editingField?.adId === ad.id && editingField?.field === 'title' ? (
                           <div className="flex items-center gap-2">
                             <Input
                               value={editValue}
                               onChange={(e) => setEditValue(e.target.value)}
                               className="bg-black/40 border-white/20 text-white text-lg font-bold"
                               autoFocus
                             />
                             <Button size="sm" onClick={saveEdit} className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600">
                               <Check className="w-4 h-4" />
                             </Button>
                             <Button size="sm" onClick={cancelEditing} className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600">
                               <X className="w-4 h-4" />
                             </Button>
                           </div>
                         ) : (
                           <div className="flex items-center gap-2 group/title">
                             <h4 className="text-xl font-bold text-white mb-1 drop-shadow-lg">{ad.title}</h4>
                             {isOwnProfile && (
                               <Button
                                 size="sm"
                                 variant="ghost"
                                 onClick={() => startEditing(ad.id, 'title', ad.title)}
                                 className="opacity-0 group-hover/title:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-white/20"
                               >
                                 <Edit className="w-3 h-3 text-white" />
                               </Button>
                             )}
                           </div>
                         )}
                        <div className="flex items-center gap-2 text-white/90 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{ad.city}, {ad.country}</span>
                          <span>•</span>
                          <span>{getAgeRangeText(ad.age_range)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Dropdown */}
                    {isOwnProfile && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-10 h-10 bg-black/40 backdrop-blur-sm hover:bg-black/60 border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300"
                          >
                            <MoreHorizontal className="h-4 w-4 text-white" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="end" 
                          className="bg-black/95 backdrop-blur-xl border border-white/20 text-white z-50 shadow-2xl"
                          sideOffset={8}
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
                </div>
              </div>
            )}

            {/* Card Content */}
            <div className="p-6 pt-0">
              {/* Status Badges */}
              <div className="flex gap-2 mb-4">
                <Badge className={`text-xs font-medium ${getStatusColor(ad.moderation_status || 'pending')}`}>
                  {ad.moderation_status || 'Pending'}
                </Badge>
                {!ad.is_active && (
                  <Badge className="text-xs bg-gray-500/20 text-gray-400 border-gray-500/30 font-medium">
                    Inactive
                  </Badge>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                {editingField?.adId === ad.id && editingField?.field === 'description' ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="bg-black/40 border-white/20 text-white min-h-[100px]"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveEdit} className="bg-green-500 hover:bg-green-600">
                        <Check className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" onClick={cancelEditing} className="bg-red-500 hover:bg-red-600">
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="group/description">
                    <div className="flex items-start gap-2">
                      <p className="text-white/90 text-base leading-relaxed line-clamp-3 flex-1">
                        {ad.description}
                      </p>
                      {isOwnProfile && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditing(ad.id, 'description', ad.description)}
                          className="opacity-0 group-hover/description:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-white/20 mt-1"
                        >
                          <Edit className="w-3 h-3 text-white" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Looking For */}
              {ad.looking_for && ad.looking_for.length > 0 && (
                <div className="mb-6">
                  <h5 className="text-white/70 text-sm font-semibold mb-3 tracking-wide">LOOKING FOR</h5>
                  <div className="flex flex-wrap gap-2">
                    {ad.looking_for.slice(0, 3).map((item: string, i: number) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 * i }}
                        className="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-300 text-sm font-medium rounded-full backdrop-blur-sm"
                      >
                        {item}
                      </motion.span>
                    ))}
                    {ad.looking_for.length > 3 && (
                      <span className="px-3 py-1.5 text-sm text-white/50 font-medium">
                        +{ad.looking_for.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Interests */}
              {ad.interests && ad.interests.length > 0 && (
                <div className="mb-6">
                  <h5 className="text-white/70 text-sm font-semibold mb-3 tracking-wide">INTERESTS</h5>
                  <div className="flex flex-wrap gap-2">
                    {ad.interests.slice(0, 4).map((interest: string, i: number) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 * i }}
                        className="px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white/80 text-sm font-medium rounded-full border border-white/20 hover:bg-white/20 transition-colors"
                      >
                        {interest}
                      </motion.span>
                    ))}
                    {ad.interests.length > 4 && (
                      <span className="px-3 py-1.5 text-sm text-white/50 font-medium">
                        +{ad.interests.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Stats & Date Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-white/60">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
                      <Eye className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{ad.view_count || 0} views</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{ad.click_count || 0} likes</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-white/50">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">{new Date(ad.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Shimmer Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-pulse" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};