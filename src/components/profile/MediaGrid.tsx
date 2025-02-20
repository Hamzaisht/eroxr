
import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { MediaViewer } from "@/components/media/MediaViewer";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface MediaGridProps {
  onImageClick: (url: string) => void;
}

export const MediaGrid = ({ onImageClick }: MediaGridProps) => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const session = useSession();
  const { toast } = useToast();

  const { data: mediaItems = [], isLoading, error } = useQuery({
    queryKey: ["profile-media", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error("No user ID");

      const { data: posts, error } = await supabase
        .from("posts")
        .select("id, media_url, video_urls, is_ppv, created_at")
        .eq("creator_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching media:", error);
        throw error;
      }

      const media = posts?.flatMap(post => {
        const mediaUrls = [...(post.media_url || []), ...(post.video_urls || [])];
        return mediaUrls.map(url => ({
          id: post.id,
          type: url.toLowerCase().endsWith('.mp4') ? 'video' : 'image',
          url: url,
          isPremium: post.is_ppv || false,
          width: 1080,
          height: 1350
        }));
      }) || [];

      return media;
    },
    enabled: !!session?.user?.id,
    onError: (error) => {
      console.error("Media fetch error:", error);
      toast({
        title: "Error",
        description: "Failed to load media content. Please try again.",
        variant: "destructive",
      });
    }
  });

  if (error) {
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

  if (!mediaItems.length) {
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
            onClick={() => !mediaItem.isPremium && onImageClick(mediaItem.url)}
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
