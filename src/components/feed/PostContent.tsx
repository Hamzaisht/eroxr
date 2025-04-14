
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProtectedMedia } from "@/components/security/ProtectedMedia";
import { UniversalMedia } from "@/components/media/UniversalMedia";

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
  const [retries, setRetries] = useState<Record<string, number>>({});
  const { toast } = useToast();
  
  // Safely check if either array has content
  const hasMedia = (mediaUrls?.length ?? 0) > 0 || (videoUrls?.length ?? 0) > 0;

  const handleMediaError = (url: string) => {
    console.error('Media load error for URL:', url);
    setLoadError(prev => ({ ...prev, [url]: true }));
    
    // Track retry count
    const currentRetries = retries[url] || 0;
    if (currentRetries < 2) {
      setRetries(prev => ({ ...prev, [url]: currentRetries + 1 }));
    } else {
      toast({
        title: "Error loading media",
        description: "Failed to load media content after multiple attempts",
        variant: "destructive",
      });
    }
  };

  const handleRetry = (url: string) => {
    setLoadError(prev => ({ ...prev, [url]: false }));
  };

  // Error fallback component
  const ErrorFallback = ({ message, url }: { message: string, url?: string }) => (
    <div className="w-full h-full flex items-center justify-center bg-luxury-darker rounded-lg">
      <div className="flex flex-col items-center justify-center text-luxury-neutral/70 p-8">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p className="mb-3">{message}</p>
        {url && (
          <button 
            onClick={() => handleRetry(url)}
            className="flex items-center gap-2 px-3 py-1.5 bg-luxury-primary/80 hover:bg-luxury-primary text-white rounded-md"
          >
            <RefreshCw className="h-4 w-4" /> 
            Retry
          </button>
        )}
      </div>
    </div>
  );

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
                        if (!url) return <ErrorFallback key={`video-error-${index}`} message="Video not available" />;
                        if (loadError[url] && retries[url] >= 2) return <ErrorFallback key={`video-error-${index}`} message="Failed to load video" url={url} />;
                        
                        return (
                          <motion.div
                            key={`video-${index}-${retries[url] || 0}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative aspect-video w-full cursor-pointer"
                            onClick={() => onMediaClick(url)}
                          >
                            <UniversalMedia
                              item={{ video_url: url, creator_id: creatorId }}
                              className="w-full h-full rounded-lg overflow-hidden"
                              onError={() => handleMediaError(url)}
                              controls={true}
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
                        if (!url) return <ErrorFallback key={`image-error-${index}`} message="Image not available" />;
                        if (loadError[url] && retries[url] >= 2) return <ErrorFallback key={`image-error-${index}`} message="Failed to load image" url={url} />;
                        
                        return (
                          <motion.div
                            key={`image-${index}-${retries[url] || 0}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative aspect-[4/3] cursor-pointer group"
                            onClick={() => onMediaClick(url)}
                          >
                            <UniversalMedia
                              item={{ media_url: url, creator_id: creatorId }}
                              className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                              onError={() => handleMediaError(url)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
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
