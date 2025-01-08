import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ShareDialog } from "@/components/feed/ShareDialog";
import { Short } from "./types/short";
import { useShortActions } from "./hooks/useShortActions";
import { VideoPlayer } from "./components/VideoPlayer";
import { ShortContent } from "./components/ShortContent";

export const ShortsFeed = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedShortId, setSelectedShortId] = useState<string | null>(null);
  const { handleLike, handleSave } = useShortActions();
  const [isLoading, setIsLoading] = useState(true);

  const shorts: Short[] = [
    {
      id: "123e4567-e89b-12d3-a456-426614174000",
      creator: {
        username: "@ArtisticSoul",
        avatar_url: null,
      },
      video_url: "https://cdn.lovable.dev/sample-videos/mountain-aerial.mp4",
      description: "Stunning aerial view of a misty mountain landscape at sunrise 🌄",
      likes: 2345,
      comments: 156,
      has_liked: false,
      has_saved: false,
    },
    {
      id: "223e4567-e89b-12d3-a456-426614174001",
      creator: {
        username: "@TechGuru",
        avatar_url: null,
      },
      video_url: "https://cdn.lovable.dev/sample-videos/nordic-fjords.mp4",
      description: "Crystal clear waters of the Nordic fjords reflecting the sky ⛰️",
      likes: 1876,
      comments: 92,
      has_liked: false,
      has_saved: false,
    },
    {
      id: "323e4567-e89b-12d3-a456-426614174002",
      creator: {
        username: "@FitnessPro",
        avatar_url: null,
      },
      video_url: "https://cdn.lovable.dev/sample-videos/northern-lights.mp4",
      description: "Northern lights dancing across the Nordic sky 🌌",
      likes: 3421,
      comments: 187,
      has_liked: false,
      has_saved: false,
    },
  ];

  useEffect(() => {
    const preloadVideos = async () => {
      try {
        await Promise.all(
          shorts.map(short => {
            return new Promise((resolve, reject) => {
              const video = document.createElement('video');
              video.preload = "metadata";
              video.onloadedmetadata = () => resolve(true);
              video.onerror = () => reject(new Error(`Failed to load ${short.video_url}`));
              video.src = short.video_url;
            });
          })
        );
        console.log("All videos preloaded successfully");
      } catch (error) {
        console.error("Error preloading videos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    preloadVideos();
  }, []);

  const handleShare = (shortId: string) => {
    setSelectedShortId(shortId);
    setIsShareOpen(true);
  };

  if (isLoading) {
    return (
      <div className="relative h-[calc(100vh-4rem)] w-full flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-luxury-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-black">
      <div className="snap-y snap-mandatory h-full overflow-y-auto scrollbar-hide">
        <AnimatePresence>
          {shorts.map((short, index) => (
            <motion.div
              key={short.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative h-full w-full snap-start snap-always"
            >
              <VideoPlayer
                src={short.video_url}
                index={index}
                onIndexChange={setCurrentVideoIndex}
              />
              <ShortContent
                short={short}
                onShare={handleShare}
                handleLike={handleLike}
                handleSave={handleSave}
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