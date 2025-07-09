import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Video, Eye, Heart, MessageCircle, Play, Edit3, Trash2, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ProfileVideosProps {
  profileId: string;
}

export const ProfileVideos = ({ profileId }: ProfileVideosProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isOwnProfile = user?.id === profileId;
  const [deleteVideoId, setDeleteVideoId] = useState<string | null>(null);

  const { data: videos, isLoading, refetch } = useQuery({
    queryKey: ['profile-videos', profileId],
    queryFn: async () => {
      console.log('🎯 ProfileVideos: Fetching videos for:', profileId);
      
      const { data, error } = await supabase
        .from('videos')
        .select(`
          id,
          title,
          description,
          video_url,
          thumbnail_url,
          created_at,
          like_count,
          comment_count,
          view_count,
          visibility
        `)
        .eq('creator_id', profileId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ ProfileVideos: Fetch failed:', error);
        throw error;
      }
      
      console.log('✅ ProfileVideos: Found videos:', data?.length || 0);
      return data || [];
    },
    staleTime: 30000, // Reduced for faster updates
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
  });

  const handleDeleteVideo = async () => {
    if (!deleteVideoId) return;

    try {
      console.log('🗑️ ProfileVideos: Deleting video:', deleteVideoId);

      // Optimistic update - immediately remove from UI
      queryClient.setQueryData(['profile-videos', profileId], (oldData: any[]) => 
        oldData?.filter(video => video.id !== deleteVideoId) || []
      );

      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', deleteVideoId);

      if (error) {
        console.error('❌ ProfileVideos: Delete failed:', error);
        // Revert optimistic update on error
        await refetch();
        throw error;
      }

      console.log('✅ ProfileVideos: Video deleted successfully');

      toast({
        title: "Video deleted",
        description: "Your video has been successfully deleted.",
      });

      setDeleteVideoId(null);
      
      // Invalidate cache to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['profile-videos', profileId] });
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: "Error",
        description: "Failed to delete video. Please try again.",
        variant: "destructive",
      });
      setDeleteVideoId(null);
    }
  };

  const handleEditVideo = (videoId: string) => {
    // Navigate to edit page or open edit modal
    // This would be implemented based on your edit flow
    toast({
      title: "Edit video",
      description: "Edit functionality coming soon!",
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-[9/16] bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <Video className="w-16 h-16 mx-auto text-white/40 mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">No Eros Content Yet</h3>
        <p className="text-white/60">
          {isOwnProfile ? "Start creating amazing short videos!" : "This creator hasn't shared any videos yet."}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.map((video, index) => (
        <motion.div
          key={video.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative aspect-[9/16] bg-black rounded-xl overflow-hidden cursor-pointer"
        >
          {/* Video Thumbnail */}
          <div className="absolute inset-0">
            {video.thumbnail_url ? (
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
                <Video className="w-12 h-12 text-white/60" />
              </div>
            )}
          </div>

          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </div>

          {/* Content Actions (only for own profile) */}
          {isOwnProfile && (
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full border border-white/20"
                  >
                    <MoreHorizontal className="h-4 w-4 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="bg-black/90 backdrop-blur-md border-white/20 text-white"
                >
                  <DropdownMenuItem 
                    onClick={() => handleEditVideo(video.id)}
                    className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Video
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setDeleteVideoId(video.id)}
                    className="hover:bg-red-500/20 focus:bg-red-500/20 text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Video
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Video Info */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
            <h4 className="text-white font-medium text-sm mb-1 line-clamp-2">
              {video.title || 'Untitled Video'}
            </h4>
            
            {/* Stats */}
            <div className="flex items-center justify-between text-white/70 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{video.view_count || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span>{video.like_count || 0}</span>
                </div>
              </div>
              
              {video.visibility === 'private' && (
                <div className="text-yellow-400 text-xs">Private</div>
              )}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteVideoId} onOpenChange={() => setDeleteVideoId(null)}>
        <AlertDialogContent className="bg-black/95 backdrop-blur-md border-white/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Video</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to delete this video? This action cannot be undone and the video will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setDeleteVideoId(null)}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteVideo}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Video
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};