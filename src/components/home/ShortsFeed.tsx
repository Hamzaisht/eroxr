import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ShareDialog } from "@/components/feed/ShareDialog";
import { Short } from "./types/short";
import { useShortActions } from "./hooks/useShortActions";
import { VideoPlayer } from "./components/VideoPlayer";
import { ShortContent } from "./components/ShortContent";
import { useSession } from "@supabase/auth-helpers-react";
import { useFeedQuery } from "../feed/useFeedQuery";

export const ShortsFeed = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedShortId, setSelectedShortId] = useState<string | null>(null);
  const { handleLike, handleSave } = useShortActions();
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();
  const { data } = useFeedQuery(session?.user?.id, 'shorts');

  const shorts = data?.pages.flatMap(page => page) ?? [];

  useEffect(() => {
    const preloadVideos = async () => {
      try {
        await Promise.all(
          shorts.map(short => {
            return new Promise((resolve) => {
              if (!short.video_urls?.[0]) return resolve(true);
              const video = document.createElement('video');
              video.preload = "auto";
              video.onloadeddata = () => resolve(true);
              video.onerror = () => {
                console.error(`Failed to load ${short.video_urls?.[0]}`);
                resolve(false);
              };
              video.src = short.video_urls[0];
            });
          })
        );
        console.log("Videos preloaded");
      } catch (error) {
        console.error("Error during preload:", error);
      } finally {
        setIsLoading(false);
      }
    };

    preloadVideos();
  }, [shorts]);

  const handleShare = (shortId: string) => {
    setSelectedShortId(shortId);
    setIsShareOpen(true);
  };

  if (isLoading) {
    return (
      <div className="relative h-[calc(100vh-4rem)] w-full flex items-center justify-center bg-gradient-to-b from-luxury-dark to-black">
        <div className="w-12 h-12 border-4 border-luxury-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-gradient-to-b from-luxury-dark to-black">
      <div className="snap-y snap-mandatory h-full overflow-y-auto scrollbar-hide">
        <AnimatePresence mode="wait">
          {shorts.map((short, index) => (
            <motion.div
              key={short.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative h-full w-full snap-start snap-always"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10" />
              <VideoPlayer
                src={short.video_urls?.[0] ?? ""}
                index={index}
                onIndexChange={setCurrentVideoIndex}
                className="h-full w-full object-cover"
              />
              <ShortContent
                short={{
                  id: short.id,
                  creator: short.creator,
                  description: short.content,
                  likes: short.likes_count ?? 0,
                  comments: short.comments_count ?? 0,
                  has_liked: short.has_liked,
                  has_saved: false
                }}
                onShare={handleShare}
                handleLike={handleLike}
                handleSave={handleSave}
                className="absolute bottom-0 left-0 right-0 z-20 p-6"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {selectedShortId && (
        <ShareDialog
          open={isShareOpen}
          onOpenChange={setIsShareOpen}
          postId={selectedShortId}
        />
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};