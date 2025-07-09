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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProfileVideosProps {
  profileId: string;
}

export const ProfileVideos = ({ profileId }: ProfileVideosProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isOwnProfile = user?.id === profileId;
  const [deleteVideoId, setDeleteVideoId] = useState<string | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Helper function to format video titles
  const formatVideoTitle = (title: string) => {
    if (!title) return 'Untitled Video';
    
    // If it's a filename, clean it up
    if (title.includes('.mp4') || title.includes('-')) {
      // Remove file extension and timestamp-like patterns
      return title
        .replace(/\.(mp4|mov|avi|mkv)$/i, '')
        .replace(/^\d+-/, '') // Remove timestamp prefix
        .replace(/[_-]/g, ' ')
        .replace(/\w+/g, word => word.charAt(0).toUpperCase() + word.slice(1))
        .trim() || 'Eros Video';
    }
    
    return title;
  };

  const handleVideoClick = (video: any) => {
    setPlayingVideoId(video.id);
  };

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
    <div className="h-screen overflow-y-auto snap-y snap-mandatory">
      {videos.map((video, index) => (
        <motion.div
          key={video.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="h-screen w-full snap-start bg-black flex flex-col items-center relative"
        >
          <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              {video.video_url ? (
                <video
                  src={video.video_url}
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                />
              ) : (
                <p className="text-white">Content Coming Soon</p>
              )}
            </div>
            
            <div className="absolute bottom-16 left-4 right-12 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-lg">
              <h3 className="font-medium text-white mb-2">@creator</h3>
              <p className="text-white/90 text-sm line-clamp-2">{formatVideoTitle(video.title)}</p>
              <p className="text-white/60 text-xs mt-1">
                {new Date(video.created_at).toLocaleDateString()}
              </p>
            </div>
            
            <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6">
              <button className="flex flex-col items-center">
                <div className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <span className="text-white text-xs mt-1">{video.like_count || 0}</span>
              </button>
              
              <button className="flex flex-col items-center">
                <div className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <span className="text-white text-xs mt-1">{video.comment_count || 0}</span>
              </button>
              
              <button className="flex flex-col items-center">
                <div className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <span className="text-white text-xs mt-1">{video.view_count || 0}</span>
              </button>

              {isOwnProfile && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center">
                        <MoreHorizontal className="h-6 w-6 text-white" />
                      </div>
                    </button>
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

      {/* Video Player Modal */}
      <Dialog open={!!playingVideoId} onOpenChange={() => setPlayingVideoId(null)}>
        <DialogContent className="max-w-4xl bg-black/95 backdrop-blur-md border-white/20 p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-white">
              {playingVideoId && videos?.find(v => v.id === playingVideoId) && 
                formatVideoTitle(videos.find(v => v.id === playingVideoId)!.title)
              }
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full">
            {playingVideoId && videos?.find(v => v.id === playingVideoId) && (
              <video
                src={videos.find(v => v.id === playingVideoId)!.video_url}
                className="w-full h-full rounded-b-lg"
                controls
                autoPlay
                playsInline
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};