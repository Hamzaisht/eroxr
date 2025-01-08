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
      id: "1",
      creator: {
        username: "Eros",
        avatar_url: null,
      },
      video_url: "https://player.vimeo.com/external/477721948.sd.mp4?s=eff38937a0f1748eee72d5ee4f1b123a63963e72&profile_id=165&oauth2_token_id=57447761",
      description: "Mesmerizing ocean waves crashing on the shore 🌊",
      likes: 1234,
      comments: 89,
      has_liked: false,
      has_saved: false,
    },
    {
      id: "2",
      creator: {
        username: "Eros",
        avatar_url: null,
      },
      video_url: "https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=165&oauth2_token_id=57447761",
      description: "Stunning aerial view of a forest landscape 🌲",
      likes: 567,
      comments: 34,
      has_liked: false,
      has_saved: false,
    },
    {
      id: "3",
      creator: {
        username: "Eros",
        avatar_url: null,
      },
      video_url: "https://player.vimeo.com/external/517090081.sd.mp4?s=60b46bb7d721cd06e1e6ed30e2965a31d3bc37d1&profile_id=165&oauth2_token_id=57447761",
      description: "Beautiful sunset timelapse over the city 🌅",
      likes: 890,
      comments: 45,
      has_liked: false,
      has_saved: false,
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
            setCurrentVideoIndex(Number(video.dataset.index));
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.7 }
    );

    Object.values(videoRefs.current).forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
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
                  if (el) videoRefs.current[index] = el;
                }}
                data-index={index}
                className="h-full w-full object-cover"
                src={short.video_url}
                loop
                muted
                playsInline
                onClick={(e) => {
                  const video = e.target as HTMLVideoElement;
                  video.paused ? video.play() : video.pause();
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
                      {short.creator.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-semibold">@{short.creator.username}</span>
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