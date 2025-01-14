import { ProtectedMedia } from "@/components/security/ProtectedMedia";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PostContentProps {
  content: string;
  mediaUrls?: string[];
  creatorId: string;
  onMediaClick: (url: string) => void;
}

export const PostContent = ({
  content,
  mediaUrls,
  creatorId,
  onMediaClick,
}: PostContentProps) => {
  const [loadError, setLoadError] = useState<Record<string, boolean>>({});
  const hasMedia = mediaUrls && mediaUrls.length > 0;

  const handleImageError = (url: string) => {
    setLoadError(prev => ({ ...prev, [url]: true }));
    console.error(`Failed to load image: ${url}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <p className="text-luxury-neutral/90 leading-relaxed">{content}</p>
      
      {hasMedia && (
        <ProtectedMedia contentOwnerId={creatorId}>
          <div className="relative w-full overflow-hidden rounded-xl bg-luxury-darker/50">
            <AnimatePresence mode="wait">
              <div className="overflow-x-auto scrollbar-hide w-full">
                <div className="flex gap-2 p-2">
                  {mediaUrls.map((url, index) => (
                    !loadError[url] && (
                      <motion.div
                        key={url}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative min-w-[300px] max-w-[500px] aspect-[4/3] cursor-pointer group"
                        onClick={() => onMediaClick(url)}
                      >
                        <img
                          src={url}
                          alt={`Post media ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                          loading="eager"
                          decoding="sync"
                          onError={() => handleImageError(url)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                      </motion.div>
                    )
                  ))}
                </div>
              </div>
            </AnimatePresence>
          </div>
        </ProtectedMedia>
      )}
    </motion.div>
  );
};