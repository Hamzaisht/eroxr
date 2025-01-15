import { ProtectedMedia } from "@/components/security/ProtectedMedia";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PostContentProps {
  content: string;
  mediaUrls?: string[];
  videoUrls?: string[];
  creatorId: string;
  onMediaClick: (url: string) => void;
}

export const PostContent = ({
  content,
  mediaUrls = [],
  videoUrls = [],
  creatorId,
  onMediaClick,
}: PostContentProps) => {
  const [loadError, setLoadError] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const hasMedia = mediaUrls.length > 0 || videoUrls.length > 0;

  const getPublicUrl = async (url: string) => {
    if (!url) return null;
    
    try {
      // If it's already a public URL, return it
      if (url.startsWith('http')) {
        return url;
      }
      
      // Otherwise get the public URL from storage
      const { data: { publicUrl } } = supabase.storage
        .from('posts')
        .getPublicUrl(url);
        
      return publicUrl;
    } catch (error) {
      console.error('Error getting public URL:', error);
      return null;
    }
  };

  const handleMediaError = (url: string) => {
    setLoadError(prev => ({ ...prev, [url]: true }));
    toast({
      title: "Error loading media",
      description: "Failed to load media content. Please try again later.",
      variant: "destructive",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <p className="text-luxury-neutral/90 leading-relaxed whitespace-pre-wrap break-words">
        {content}
      </p>
      
      {hasMedia && (
        <ProtectedMedia contentOwnerId={creatorId}>
          <div className="relative w-full overflow-hidden rounded-xl bg-luxury-darker/50">
            <AnimatePresence mode="wait">
              <div className="overflow-x-auto scrollbar-hide w-full">
                <div className="flex flex-col gap-4 p-2">
                  {/* Videos */}
                  {videoUrls && videoUrls.length > 0 && (
                    <div className="space-y-4">
                      {videoUrls.map((url, index) => (
                        !loadError[url] && (
                          <motion.div
                            key={`video-${url}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative aspect-video w-full"
                          >
                            <VideoPlayer
                              url={url}
                              poster={mediaUrls?.[0]}
                              className="w-full h-full rounded-lg overflow-hidden"
                              onError={() => handleMediaError(url)}
                            />
                          </motion.div>
                        )
                      ))}
                    </div>
                  )}

                  {/* Images */}
                  {mediaUrls && mediaUrls.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {mediaUrls.map((url, index) => (
                        !loadError[url] && (
                          <motion.div
                            key={`image-${url}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative aspect-[4/3] cursor-pointer group"
                            onClick={() => onMediaClick(url)}
                          >
                            <motion.img
                              src={url}
                              alt={`Post media ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                              loading="eager"
                              decoding="sync"
                              onError={() => handleMediaError(url)}
                              layoutId={`post-media-${url}`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                          </motion.div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </AnimatePresence>
          </div>
        </ProtectedMedia>
      )}
    </motion.div>
  );
};
