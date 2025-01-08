import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, Play } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { ShareDialog } from "@/components/feed/ShareDialog";

interface Short {
  id: number;
  creator: {
    username: string;
    avatar_url: string | null;
  };
  video_url: string;
  description: string;
  likes: number;
  comments: number;
  has_liked?: boolean;
  has_saved?: boolean;
}

export const ShortsFeed = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedShortId, setSelectedShortId] = useState<number | null>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement }>({});
  const { toast } = useToast();
  const session = useSession();

  const shorts: Short[] = [
    {
      id: 1,
      creator: {
        username: "ArtisticSoul",
        avatar_url: null,
      },
      video_url: "/path/to/video1.mp4",
      description: "Cooking my favorite recipe 👩‍🍳",
      likes: 1234,
      comments: 89,
      has_liked: false,
      has_saved: false,
    },
    {
      id: 2,
      creator: {
        username: "TravelBlogger",
        avatar_url: null,
      },
      video_url: "/path/to/video2.mp4",
      description: "Exploring the beautiful mountains 🏔️",
      likes: 567,
      comments: 34,
    },
    {
      id: 3,
      creator: {
        username: "FitnessGuru",
        avatar_url: null,
      },
      video_url: "/path/to/video3.mp4",
      description: "My daily workout routine 💪",
      likes: 890,
      comments: 45,
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

  const handleLike = async (shortId: number) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like shorts",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: existingLike } = await supabase
        .from("post_likes")
        .select()
        .eq("post_id", shortId)
        .eq("user_id", session.user.id)
        .single();

      if (existingLike) {
        await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", shortId)
          .eq("user_id", session.user.id);

        toast({
          title: "Like removed",
          description: "Your like has been removed",
        });
      } else {
        await supabase
          .from("post_likes")
          .insert([{ post_id: shortId, user_id: session.user.id }]);

        toast({
          title: "Short liked",
          description: "Added to your liked shorts",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (shortId: number) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save shorts",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: existingSave } = await supabase
        .from("post_saves")
        .select()
        .eq("post_id", shortId)
        .eq("user_id", session.user.id)
        .single();

      if (existingSave) {
        await supabase
          .from("post_saves")
          .delete()
          .eq("post_id", shortId)
          .eq("user_id", session.user.id);

        toast({
          title: "Removed from saved",
          description: "Short has been removed from your saved items",
        });
      } else {
        await supabase
          .from("post_saves")
          .insert([{ post_id: shortId, user_id: session.user.id }]);

        toast({
          title: "Short saved",
          description: "Added to your saved shorts",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update save status",
        variant: "destructive",
      });
    }
  };

  const handleShare = (shortId: number) => {
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

              {/* Action buttons */}
              <div className="absolute bottom-20 right-4 z-10 flex flex-col gap-6">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 group"
                    onClick={() => handleLike(short.id)}
                  >
                    <Heart 
                      className={`h-6 w-6 transition-colors ${
                        short.has_liked 
                          ? "text-red-500 fill-red-500" 
                          : "text-white group-hover:text-red-500"
                      }`} 
                    />
                  </Button>
                  <span className="mt-1 text-center text-xs text-white block">
                    {short.likes}
                  </span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 group"
                  >
                    <MessageCircle className="h-6 w-6 text-white group-hover:text-luxury-primary" />
                  </Button>
                  <span className="mt-1 text-center text-xs text-white block">
                    {short.comments}
                  </span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 group"
                    onClick={() => handleSave(short.id)}
                  >
                    <Bookmark 
                      className={`h-6 w-6 transition-colors ${
                        short.has_saved 
                          ? "text-luxury-primary fill-luxury-primary" 
                          : "text-white group-hover:text-luxury-primary"
                      }`} 
                    />
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 group"
                    onClick={() => handleShare(short.id)}
                  >
                    <Share2 className="h-6 w-6 text-white group-hover:text-luxury-primary" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {selectedShortId && (
        <ShareDialog
          open={isShareOpen}
          onOpenChange={setIsShareOpen}
          postId={selectedShortId.toString()}
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
