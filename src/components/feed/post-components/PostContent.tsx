
import { motion } from "framer-motion";
import { SimpleMediaDisplay } from "@/components/media/SimpleMediaDisplay";

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
        <div className="space-y-4">
          {/* Videos */}
          {videoUrls && videoUrls.length > 0 && (
            <div className="space-y-4">
              {videoUrls.map((url, index) => (
                <motion.div
                  key={`video-${index}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-video w-full cursor-pointer"
                  onClick={() => onMediaClick(url)}
                >
                  <SimpleMediaDisplay
                    url={url}
                    className="w-full h-full rounded-lg overflow-hidden"
                    alt={`Video ${index + 1}`}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Images */}
          {mediaUrls && mediaUrls.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mediaUrls.map((url, index) => (
                <motion.div
                  key={`image-${index}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-[4/3] cursor-pointer group"
                  onClick={() => onMediaClick(url)}
                >
                  <SimpleMediaDisplay
                    url={url}
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    alt={`Image ${index + 1}`}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
