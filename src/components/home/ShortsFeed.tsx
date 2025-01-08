import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShareDialog } from "@/components/feed/ShareDialog";
import { Short } from "./types/short";
import { useShortActions } from "./hooks/useShortActions";
import { ShortActions } from "./components/ShortActions";

export const ShortsFeed = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedShortId, setSelectedShortId] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement }>({});
  const { handleLike, handleSave } = useShortActions();

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
    console.log("Setting up video intersection observer");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            console.log("Video in view, attempting to play:", video.src);
            // Add a small delay to ensure the video has loaded
            setTimeout(() => {
              video.play().catch((error) => {
                console.error("Error playing video:", error);
              });
            }, 100);
            setCurrentVideoIndex(Number(video.dataset.index));
          } else {
            console.log("Video out of view, pausing:", video.src);
            video.pause();
          }
        });
      },
      { threshold: 0.7 }
    );

    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        console.log("Observing video:", video.src);
        observer.observe(video);
      }
    });

    return () => {
      console.log("Cleaning up video observer");
      observer.disconnect();
    };
  }, []);

  const handleShare = (shortId: string) => {
    setSelectedShortId(shortId);
    setIsShareOpen(true);
  };

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
              <video
                ref={(el) => {
                  if (el) {
                    console.log("Setting up video ref for index:", index);
                    videoRefs.current[index] = el;
                    el.preload = "metadata";
                    el.onerror = (e) => console.error("Video error:", e);
                  }
                }}
                data-index={index}
                className="h-full w-full object-cover"
                src={short.video_url}
                loop
                muted
                playsInline
                onClick={(e) => {
                  const video = e.target as HTMLVideoElement;
                  if (video.paused) {
                    console.log("Playing video on click");
                    video.play().catch(e => console.error("Error playing video:", e));
                  } else {
                    console.log("Pausing video on click");
                    video.pause();
                  }
                }}
              />
              
              {/* Gradient overlays for better visibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

              {/* Creator info and description */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-6 left-4 right-16 z-10 text-white"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10 ring-2 ring-white/20">
                    <AvatarImage src={short.creator.avatar_url ?? ""} />
                    <AvatarFallback className="bg-luxury-primary/20">
                      {short.creator.username[1]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-semibold">{short.creator.username}</span>
                    <p className="text-sm text-white/80">{short.description}</p>
                  </div>
                </div>
              </motion.div>

              <ShortActions
                shortId={short.id}
                likes={short.likes}
                comments={short.comments}
                hasLiked={short.has_liked}
                hasSaved={short.has_saved}
                onLike={handleLike}
                onSave={handleSave}
                onShare={handleShare}
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