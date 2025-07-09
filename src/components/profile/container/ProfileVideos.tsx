import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Video, Eye, Heart, MessageCircle, Play, Edit3, Trash2, MoreHorizontal, Plus, Folder, Bookmark } from 'lucide-react';
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
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);
  const [bookmarkVideoId, setBookmarkVideoId] = useState<string | null>(null);
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);
  const [showCreateInBookmark, setShowCreateInBookmark] = useState(false);
  const [newBookmarkFolderName, setNewBookmarkFolderName] = useState('');

  // Helper function to format video titles
  const formatVideoTitle = (title: string) => {
    if (!title) return 'Untitled Video';
    
    if (title.includes('.mp4') || title.includes('-')) {
      return title
        .replace(/\.(mp4|mov|avi|mkv)$/i, '')
        .replace(/^\d+-/, '')
        .replace(/[_-]/g, ' ')
        .replace(/\w+/g, word => word.charAt(0).toUpperCase() + word.slice(1))
        .trim() || 'Eros Video';
    }
    
    return title;
  };

  // Track video views per device
  const trackVideoView = async (videoId: string) => {
    const viewedVideosKey = 'eros_viewed_videos';
    const viewedVideos = JSON.parse(localStorage.getItem(viewedVideosKey) || '[]');
    
    if (!viewedVideos.includes(videoId)) {
      // Add to viewed list
      viewedVideos.push(videoId);
      localStorage.setItem(viewedVideosKey, JSON.stringify(viewedVideos));
      
      // Increment view count in database
      try {
        await supabase.rpc('increment_counter', { 
          row_id: videoId, 
          counter_name: 'view_count',
          table_name: 'videos'
        });
        
        // Refresh video data to show updated count
        queryClient.invalidateQueries({ queryKey: ['profile-videos', profileId, selectedFolderId] });
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    }
  };

  const handleVideoHover = (videoId: string, isHovering: boolean) => {
    setHoveredVideoId(isHovering ? videoId : null);
    
    if (isHovering) {
      // Track view when user hovers
      trackVideoView(videoId);
    }
  };

  const handleVideoClick = (video: any) => {
    setPlayingVideoId(video.id);
  };

  // Fetch video folders
  const { data: folders } = useQuery({
    queryKey: ['video-folders', profileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('video_folders')
        .select('*')
        .eq('creator_id', profileId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch videos based on selected folder
  const { data: videos, isLoading, refetch } = useQuery({
    queryKey: ['profile-videos', profileId, selectedFolderId],
    queryFn: async () => {
      console.log('🎯 ProfileVideos: Fetching videos for folder:', selectedFolderId);
      
      if (selectedFolderId) {
        // Fetch videos in specific folder
        const { data, error } = await supabase
          .from('video_folder_items')
          .select(`
            video_id,
            videos (
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
            )
          `)
          .eq('folder_id', selectedFolderId);

        if (error) throw error;
        return data?.map((item: any) => item.videos).filter(Boolean) || [];
      } else {
        // Fetch all videos
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

        if (error) throw error;
        return data || [];
      }
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
    enabled: !!profileId, // Only run query when profileId is available
  });

  const handleDeleteVideo = async () => {
    if (!deleteVideoId) return;

    try {
      console.log('🗑️ ProfileVideos: Deleting video:', deleteVideoId);

      queryClient.setQueryData(['profile-videos', profileId, selectedFolderId], (oldData: any[]) => 
        oldData?.filter(video => video.id !== deleteVideoId) || []
      );

      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', deleteVideoId);

      if (error) {
        console.error('❌ ProfileVideos: Delete failed:', error);
        await refetch();
        throw error;
      }

      toast({
        title: "Video deleted",
        description: "Your video has been successfully deleted.",
      });

      setDeleteVideoId(null);
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

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const { error } = await supabase
        .from('video_folders')
        .insert({
          creator_id: profileId,
          name: newFolderName.trim(),
        });

      if (error) throw error;

      toast({
        title: "Folder created",
        description: `"${newFolderName}" has been created successfully.`,
      });

      setNewFolderName('');
      setShowCreateFolder(false);
      queryClient.invalidateQueries({ queryKey: ['video-folders', profileId] });
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: "Error",
        description: "Failed to create folder. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBookmarkVideo = async (folderId: string) => {
    if (!bookmarkVideoId) return;

    try {
      // Check if video is already in folder
      const { data: existing } = await supabase
        .from('video_folder_items')
        .select('id')
        .eq('video_id', bookmarkVideoId)
        .eq('folder_id', folderId)
        .single();

      if (existing) {
        toast({
          title: "Already bookmarked",
          description: "This video is already in the selected folder.",
          variant: "destructive",
        });
        return;
      }

      // Add video to folder
      const { error } = await supabase
        .from('video_folder_items')
        .insert({
          video_id: bookmarkVideoId,
          folder_id: folderId,
        });

      if (error) throw error;

      const folderName = folders?.find(f => f.id === folderId)?.name || 'folder';
      toast({
        title: "Video bookmarked",
        description: `Video added to "${folderName}" successfully.`,
      });

      setBookmarkVideoId(null);
      setShowBookmarkDialog(false);
    } catch (error) {
      console.error('Error bookmarking video:', error);
      toast({
        title: "Error",
        description: "Failed to bookmark video. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateFolderInBookmark = async () => {
    if (!newBookmarkFolderName.trim()) return;

    try {
      const { data, error } = await supabase
        .from('video_folders')
        .insert({
          creator_id: profileId,
          name: newBookmarkFolderName.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Folder created",
        description: `"${newBookmarkFolderName}" has been created successfully.`,
      });

      // Refresh folders list
      queryClient.invalidateQueries({ queryKey: ['video-folders', profileId] });
      
      // Auto-bookmark to the new folder
      if (bookmarkVideoId && data) {
        await handleBookmarkVideo(data.id);
      }

      setNewBookmarkFolderName('');
      setShowCreateInBookmark(false);
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: "Error",
        description: "Failed to create folder. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 w-20 bg-white/5 rounded animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="aspect-[9/16] bg-white/5 rounded animate-pulse" />
          ))}
        </div>
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
    <div className="space-y-4">
      {/* Folder Navigation */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto">
        <Button
          variant={selectedFolderId === null ? "default" : "outline"}
          size="sm"
          onClick={() => {
            console.log('🔄 Setting folder to null (All Videos)');
            setSelectedFolderId(null);
          }}
          className="whitespace-nowrap"
        >
          All Videos
        </Button>
        
        {folders?.map((folder) => (
          <Button
            key={folder.id}
            variant={selectedFolderId === folder.id ? "default" : "outline"}
            size="sm"
            onClick={() => {
              console.log('🔄 Setting folder to:', folder.id, folder.name);
              setSelectedFolderId(folder.id);
            }}
            className="whitespace-nowrap"
          >
            <Folder className="w-3 h-3 mr-1" />
            {folder.name}
          </Button>
        ))}

        {isOwnProfile && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log('📁 Opening create folder dialog');
              setShowCreateFolder(true);
            }}
            className="whitespace-nowrap"
          >
            <Plus className="w-3 h-3 mr-1" />
            New Folder
          </Button>
        )}
      </div>

      {/* Video Grid - TikTok Style */}
      <div className="grid grid-cols-3 gap-1">
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="group relative aspect-[9/16] bg-black rounded cursor-pointer overflow-hidden"
            onClick={() => handleVideoClick(video)}
            onMouseEnter={() => handleVideoHover(video.id, true)}
            onMouseLeave={() => handleVideoHover(video.id, false)}
          >
            {/* Video Element - Always Present for Hover Play */}
            <div className="absolute inset-0">
              <video
                src={video.video_url}
                className="w-full h-full object-cover"
                muted
                playsInline
                preload="metadata"
                loop
                ref={(el) => {
                  if (el) {
                    // Set thumbnail frame
                    el.currentTime = 1;
                    
                    // Play/pause based on hover state
                    if (hoveredVideoId === video.id) {
                      el.play().catch(console.error);
                    } else {
                      el.pause();
                      el.currentTime = 1; // Reset to thumbnail frame
                    }
                  }
                }}
                onLoadedData={(e) => {
                  const videoElement = e.target as HTMLVideoElement;
                  videoElement.currentTime = 1;
                }}
              />

              {/* Thumbnail Overlay (hidden when playing) */}
              {video.thumbnail_url && hoveredVideoId !== video.id && (
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </div>

            {/* View Count Overlay */}
            <div className="absolute bottom-1 left-1 flex items-center gap-1 bg-black/60 rounded px-1 py-0.5 z-10">
              <Play className="w-3 h-3 text-white" />
              <span className="text-white text-xs font-medium">
                {video.view_count ? (
                  video.view_count > 1000 
                    ? `${(video.view_count / 1000).toFixed(1)}K`
                    : video.view_count
                ) : '0'}
              </span>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10" />

            {/* Actions Menu (Own Profile Only) */}
            {isOwnProfile && (
              <div 
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 bg-black/60 hover:bg-black/80 text-white border-none"
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="bg-black/90 backdrop-blur-md border-white/20 text-white z-50"
                  >
                    <DropdownMenuItem 
                      onClick={() => {
                        setBookmarkVideoId(video.id);
                        setShowBookmarkDialog(true);
                      }}
                      className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                    >
                      <Bookmark className="w-4 h-4 mr-2" />
                      Bookmark to Folder
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
          </motion.div>
        ))}
      </div>

      {/* Create Folder Dialog */}
      <Dialog open={showCreateFolder} onOpenChange={setShowCreateFolder}>
        <DialogContent className="bg-black/95 backdrop-blur-md border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowCreateFolder(false)}
                className="bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="bg-luxury-primary hover:bg-luxury-primary/80"
              >
                Create Folder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bookmark to Folder Dialog */}
      <Dialog open={showBookmarkDialog} onOpenChange={() => {
        setShowBookmarkDialog(false);
        setShowCreateInBookmark(false);
        setNewBookmarkFolderName('');
      }}>
        <DialogContent className="bg-black/95 backdrop-blur-md border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Bookmark to Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!showCreateInBookmark ? (
              <>
                <p className="text-white/70">Select a folder to bookmark this video:</p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {folders?.map((folder) => (
                    <Button
                      key={folder.id}
                      variant="outline"
                      onClick={() => handleBookmarkVideo(folder.id)}
                      className="w-full justify-start bg-transparent border-white/20 text-white hover:bg-white/10"
                    >
                      <Folder className="w-4 h-4 mr-2" />
                      {folder.name}
                    </Button>
                  ))}
                  
                  {/* Create New Folder Button */}
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateInBookmark(true)}
                    className="w-full justify-start bg-transparent border-white/20 text-white hover:bg-white/10 border-dashed"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Folder
                  </Button>
                  
                  {(!folders || folders.length === 0) && (
                    <p className="text-white/50 text-center py-4">
                      No folders available. Create your first folder above.
                    </p>
                  )}
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowBookmarkDialog(false)}
                    className="bg-transparent border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-white/70">Create a new folder and bookmark this video:</p>
                <input
                  type="text"
                  placeholder="Enter folder name"
                  value={newBookmarkFolderName}
                  onChange={(e) => setNewBookmarkFolderName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateFolderInBookmark()}
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateInBookmark(false)}
                    className="bg-transparent border-white/20 text-white hover:bg-white/10"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleCreateFolderInBookmark}
                    disabled={!newBookmarkFolderName.trim()}
                    className="bg-luxury-primary hover:bg-luxury-primary/80"
                  >
                    Create & Bookmark
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

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
              {(() => {
                const currentVideo = videos?.find((v: any) => v.id === playingVideoId);
                return currentVideo ? formatVideoTitle(currentVideo.title) : '';
              })()}
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full">
            {(() => {
              const currentVideo = videos?.find((v: any) => v.id === playingVideoId);
              return currentVideo ? (
                <video
                  src={currentVideo.video_url}
                  className="w-full h-full rounded-b-lg"
                  controls
                  autoPlay
                  playsInline
                />
              ) : null;
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};