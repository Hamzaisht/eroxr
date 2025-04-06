
import { ProtectedMedia } from "@/components/security/ProtectedMedia";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import '../../../styles/watermark.css';

interface PostContentProps {
  content: string;
  mediaUrls?: string[] | null;
  videoUrls?: string[] | null;
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
  // Safely check if either array has content
  const hasMedia = (mediaUrls?.length ?? 0) > 0 || (videoUrls?.length ?? 0) > 0;

  const getPublicUrl = (url: string) => {
    if (!url) return '';
    
    // If it's already a public URL, return it
    if (url.startsWith('http')) {
      return url;
    }

    // Get the bucket name and file path
    const [bucketName, ...pathParts] = url.split('/');
    const filePath = pathParts.join('/');

    // Get public URL using Supabase storage
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    console.log('Generated public URL:', data.publicUrl);
    return data.publicUrl;
  };

  const handleMediaError = (url: string) => {
    console.error('Media load error for URL:', url);
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
      {content && (
        <p className="text-luxury-neutral/90 leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </p>
      )}
      
      {hasMedia && (
        <ProtectedMedia contentOwnerId={creatorId}>
          <div className="relative w-full overflow-hidden rounded-xl bg-luxury-darker/50">
            <AnimatePresence mode="wait">
              <div className="overflow-x-auto scrollbar-hide w-full">
                <div className="flex flex-col gap-4 p-2">
                  {/* Videos */}
                  {videoUrls && videoUrls.length > 0 && (
                    <div className="space-y-4">
                      {videoUrls.map((url, index) => {
                        const publicUrl = getPublicUrl(url);
                        return !loadError[url] && (
                          <motion.div
                            key={`video-${index}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative aspect-video w-full"
                          >
                            <VideoPlayer
                              url={publicUrl}
                              poster={mediaUrls?.[0] ? getPublicUrl(mediaUrls[0]) : undefined}
                              className="w-full h-full rounded-lg overflow-hidden"
                              onError={() => handleMediaError(url)}
                              creatorId={creatorId}
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {/* Images */}
                  {mediaUrls && mediaUrls.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {mediaUrls.map((url, index) => {
                        const publicUrl = getPublicUrl(url);
                        return !loadError[url] && (
                          <motion.div
                            key={`image-${index}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative aspect-[4/3] cursor-pointer group"
                            onClick={() => onMediaClick(publicUrl)}
                          >
                            <div className="relative w-full h-full">
                              <img
                                src={publicUrl}
                                alt={`Post media ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                                loading="eager"
                                crossOrigin="anonymous"
                                onError={() => handleMediaError(url)}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                              
                              {/* Watermark overlay */}
                              <div className="watermark-overlay">
                                www.eroxr.com/@{creatorId}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
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
