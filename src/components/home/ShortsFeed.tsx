import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const ShortsFeed = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const shorts = [
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

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-black">
      <div className="snap-y snap-mandatory h-full overflow-y-auto scrollbar-hide">
        {shorts.map((short, index) => (
          <div
            key={short.id}
            className="relative h-full w-full snap-start snap-always"
          >
            <video
              className="h-full w-full object-cover"
              src={short.video_url}
              autoPlay={currentVideoIndex === index}
              loop
              muted
              playsInline
              onClick={(e) => {
                const video = e.target as HTMLVideoElement;
                video.paused ? video.play() : video.pause();
              }}
            />
            
            {/* Overlay with gradient for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

            {/* Creator info and description */}
            <div className="absolute bottom-6 left-4 right-16 z-10 text-white">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarImage src={short.creator.avatar_url} />
                  <AvatarFallback className="bg-primary/20">
                    {short.creator.username[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold">@{short.creator.username}</span>
              </div>
              <p className="text-sm">{short.description}</p>
            </div>

            {/* Action buttons */}
            <div className="absolute bottom-20 right-4 z-10 flex flex-col gap-6">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
                >
                  <Heart className="h-6 w-6 text-white" />
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
                  className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
                >
                  <MessageCircle className="h-6 w-6 text-white" />
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
                  className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
                >
                  <Bookmark className="h-6 w-6 text-white" />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
                >
                  <Share2 className="h-6 w-6 text-white" />
                </Button>
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
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