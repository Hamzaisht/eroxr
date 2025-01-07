import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { MediaViewer } from "@/components/media/MediaViewer";
import { getImageStyles, getAspectRatioFromDimensions } from "@/lib/image-utils";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";

interface MediaItem {
  id: number;
  type: string;
  url: string;
  isPremium: boolean;
  width?: number;
  height?: number;
}

interface MediaGridProps {
  items?: MediaItem[];
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
        .select("id, media_url, is_ppv, created_at")
        .eq("creator_id", session?.user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }

      console.log("Fetched posts:", posts);

      // Flatten media_url arrays into individual items
      const media = posts?.flatMap(post => 
        (post.media_url || []).map(url => ({
          id: post.id,
          type: url.toLowerCase().endsWith('.mp4') ? 'video' : 'image',
          url: url,
          isPremium: post.is_ppv || false,
          width: 1080,
          height: 1350
        }))
      ) || [];

      console.log("Processed media items:", media);
      return media;
    },
    enabled: !!session?.user?.id
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const handleImageClick = (url: string) => {
    if (!url) return;
    setSelectedMedia(url);
    onImageClick(url);
  };

  if (isLoading) {
    return <div className="text-center p-12">Loading media...</div>;
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
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-3 gap-1"
      >
        {mediaItems.map((mediaItem) => {
          const aspectRatio = mediaItem.width && mediaItem.height 
            ? getAspectRatioFromDimensions(mediaItem.width, mediaItem.height)
            : '4:5';

          return (
            <motion.div
              key={`${mediaItem.id}-${mediaItem.url}`}
              variants={item}
              whileHover={{ scale: 1.02 }}
              className={cn(
                "relative cursor-pointer overflow-hidden",
                aspectRatio === '1:1' ? 'aspect-square' : 
                aspectRatio === '4:5' ? 'aspect-[4/5]' : 
                'aspect-[9/16]'
              )}
              onClick={() => !mediaItem.isPremium && handleImageClick(mediaItem.url)}
            >
              <div className="relative w-full h-full">
                {mediaItem.type === 'video' ? (
                  <video
                    src={mediaItem.url}
                    className={cn(
                      "w-full h-full object-cover",
                      mediaItem.isPremium ? "blur-lg" : "",
                      "hover:opacity-90 transition-opacity duration-200"
                    )}
                    style={getImageStyles(aspectRatio)}
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={mediaItem.url}
                    alt="Media content"
                    className={cn(
                      "w-full h-full object-cover",
                      mediaItem.isPremium ? "blur-lg" : "",
                      "hover:opacity-90 transition-opacity duration-200"
                    )}
                    style={getImageStyles(aspectRatio)}
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
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <MediaViewer 
        media={selectedMedia} 
        onClose={() => setSelectedMedia(null)} 
      />
    </>
  );
};