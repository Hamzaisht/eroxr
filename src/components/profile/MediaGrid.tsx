
import { Lock, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { MediaViewer } from "@/components/media/MediaViewer";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import type { Post } from "@/integrations/supabase/types/post";

interface MediaGridProps {
  onImageClick: (url: string) => void;
}

type MediaItem = {
  id: string;
  type: 'video' | 'image';
  url: string;
  isPremium: boolean;
  width: number;
  height: number;
}

export const MediaGrid = ({ onImageClick }: MediaGridProps) => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Set up real-time subscription for posts
  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
      .channel('posts-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
          filter: `creator_id=eq.${session.user.id}`
        },
        (payload) => {
          console.log('Realtime update received:', payload);
          queryClient.invalidateQueries({ queryKey: ["profile-media", session.user.id] });
          queryClient.invalidateQueries({ queryKey: ["posts"] });
        }
      )
      .subscribe();

    console.log('Subscribed to posts channel');

    return () => {
      console.log('Unsubscribing from posts channel');
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, queryClient]);

  const { data: mediaItems, isLoading, error } = useQuery<MediaItem[], Error>({
    queryKey: ["profile-media", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error("No user ID");

      console.log('Fetching media for user:', session.user.id);

      const { data: posts, error } = await supabase
        .from("posts")
        .select(`
          id,
          media_url,
          video_urls,
          is_ppv,
          created_at
        `)
        .eq("creator_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching media:", error);
        throw error;
      }

      console.log('Fetched posts:', posts);

      if (!posts) return [];

      const media = posts.flatMap((post: Post) => {
        const mediaUrls = [
          ...(post.media_url || []), 
          ...(post.video_urls || [])
        ].filter(Boolean);

        return mediaUrls.map(url => ({
          id: post.id,
          type: url.toLowerCase().endsWith('.mp4') ? 'video' as const : 'image' as const,
          url: url,
          isPremium: post.is_ppv,
          width: 1080,
          height: 1350
        }));
      });

      console.log('Processed media items:', media);
      return media;
    },
    enabled: !!session?.user?.id,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache
    initialData: [] as MediaItem[],
  });

  const handleDelete = async (postId: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to delete posts",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Attempting to delete post:', postId);
      
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('creator_id', session.user.id);

      if (deleteError) throw deleteError;

      console.log('Post deleted successfully');

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });

      // Manually invalidate queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["profile-media", session.user.id] }),
        queryClient.invalidateQueries({ queryKey: ["posts"] })
      ]);
    } catch (err) {
      console.error('Delete error:', err);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  if (error) {
    console.error("Media fetch error:", error);
    toast({
      title: "Error",
      description: "Failed to load media content. Please try again.",
      variant: "destructive",
    });
    return (
      <div className="text-center text-red-500 p-6">
        Failed to load media content. Please try again later.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 p-2 sm:p-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} className="aspect-[4/5] rounded-lg" />
        ))}
      </div>
    );
  }

  if (!mediaItems?.length) {
    return (
      <div className="text-center text-muted-foreground p-6 sm:p-12">
        No media content yet
      </div>
    );
  }

  return (
    <>
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 p-2 sm:p-4"
      >
        {mediaItems.map((mediaItem, index) => (
          <motion.div
            key={`${mediaItem.id}-${index}`}
            variants={{
              hidden: { y: 20, opacity: 0 },
              show: { y: 0, opacity: 1 }
            }}
            className="relative aspect-[4/5] rounded-lg overflow-hidden group cursor-pointer"
          >
            <div 
              className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(mediaItem.id);
              }}
            >
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div 
              onClick={() => !mediaItem.isPremium && onImageClick(mediaItem.url)}
              className="w-full h-full"
            >
              {mediaItem.type === 'video' ? (
                <video
                  src={mediaItem.url}
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105",
                    mediaItem.isPremium ? "blur-lg" : ""
                  )}
                  muted
                  playsInline
                  onError={(e) => {
                    console.error("Video loading error:", e);
                  }}
                />
              ) : (
                <img
                  src={mediaItem.url}
                  alt="Media content"
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105",
                    mediaItem.isPremium ? "blur-lg" : ""
                  )}
                  loading="lazy"
                  onError={(e) => {
                    console.error("Image loading error:", e);
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              )}
              
              {mediaItem.isPremium && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                  <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2" />
                  <p className="text-white font-medium text-xs sm:text-sm">Premium Content</p>
                  <Button 
                    size="sm"
                    variant="secondary"
                    className="mt-2 text-xs sm:text-sm"
                  >
                    Subscribe to Unlock
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <MediaViewer 
        media={selectedMedia}
        onClose={() => setSelectedMedia(null)}
      />
    </>
  );
};
