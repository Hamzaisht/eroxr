import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { MediaViewer } from "@/components/media/MediaViewer";
import { getImageStyles, getAspectRatioFromDimensions } from "@/lib/image-utils";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface MediaGridProps {
  onImageClick: (url: string) => void;
}

export const MediaGrid = ({ onImageClick }: MediaGridProps) => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const session = useSession();

  const { data: mediaItems = [], isLoading } = useQuery({
    queryKey: ["profile-media", session?.user?.id],
    queryFn: async () => {
      console.log("Fetching media for user:", session?.user?.id);
      const { data: posts, error } = await supabase
        .from("posts")
        .select("id, media_url, video_urls, is_ppv, created_at")
        .eq("creator_id", session?.user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
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
    enabled: !!session?.user?.id
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="aspect-[4/5] rounded-lg" />
        ))}
      </div>
    );
  }

  if (!mediaItems.length) {
    return (
      <div className="text-center text-muted-foreground p-12">
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {mediaItems.map((mediaItem, index) => (
          <motion.div
            key={`${mediaItem.id}-${mediaItem.url}`}
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
              />
            )}
            
            {mediaItem.isPremium && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                <Lock className="w-8 h-8 text-primary mb-2" />
                <p className="text-white font-medium text-sm">Premium Content</p>
                <Button 
                  size="sm"
                  variant="secondary"
                  className="mt-2"
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