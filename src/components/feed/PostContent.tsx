
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProtectedMedia } from "@/components/security/ProtectedMedia";
import { ReliableMediaRenderer } from "@/components/media/ReliableMediaRenderer";

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
  console.log("PostContent - mediaUrls:", mediaUrls);
  console.log("PostContent - videoUrls:", videoUrls);

  // Safely check if either array has content
  const hasMedia = (mediaUrls?.length ?? 0) > 0 || (videoUrls?.length ?? 0) > 0;

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
                        if (!url) return null;
                        
                        return (
                          <motion.div
                            key={`video-${index}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative aspect-video w-full cursor-pointer"
                            onClick={() => onMediaClick(url)}
                          >
                            <ReliableMediaRenderer
                              source={url}
                              className="w-full h-full rounded-lg overflow-hidden"
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
                        if (!url) return null;
                        
                        return (
                          <motion.div
                            key={`image-${index}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative aspect-[4/3] cursor-pointer group"
                            onClick={() => onMediaClick(url)}
                          >
                            <ReliableMediaRenderer
                              source={url}
                              className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
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
