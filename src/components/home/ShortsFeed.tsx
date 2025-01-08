import { useSession } from "@supabase/auth-helpers-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Short {
  id: string;
  video_urls: string[];
  creator: {
    username: string;
    avatar_url: string;
  };
  created_at: string;
  likes_count: number;
  comments_count: number;
  content: string;
}

export const ShortsFeed = () => {
  const session = useSession();
  const { ref, inView } = useInView();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["shorts"],
    queryFn: async ({ pageParam = 0 }) => {
      const { data: shorts, error } = await supabase
        .from("posts")
        .select(`
          id,
          video_urls,
          content,
          created_at,
          likes_count,
          comments_count,
          creator:profiles(username, avatar_url)
        `)
        .eq("visibility", "public")
        .not("video_urls", "is", null)
        .order("created_at", { ascending: false })
        .range(pageParam * 5, (pageParam + 1) * 5 - 1);

      if (error) throw error;
      return shorts;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.length === 5 ? allPages.length : undefined;
    },
    initialPageParam: 0
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-220px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-primary" />
      </div>
    );
  }

  const shorts = data?.pages.flat() || [];

  if (!shorts.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-220px)] text-muted-foreground">
        <Video className="h-12 w-12 mb-4" />
        <p>No shorts available</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] snap-y snap-mandatory overflow-y-scroll">
      {shorts.map((short, index) => (
        <div
          key={short.id}
          className="h-[calc(100vh-80px)] snap-start relative flex items-center justify-center bg-black"
        >
          <video
            src={short.video_urls?.[0]}
            className="h-full w-full object-contain"
            controls
            playsInline
            loop
            autoPlay={index === currentVideoIndex}
            onPlay={() => setCurrentVideoIndex(index)}
          >
            <source src={short.video_urls?.[0]} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Overlay Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-10 w-10 border-2 border-luxury-primary">
                    <AvatarImage src={short.creator?.avatar_url} />
                    <AvatarFallback>{short.creator?.username?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-white">{short.creator?.username}</p>
                    <p className="text-sm text-white/70">{short.content}</p>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-4 items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
                >
                  <Heart className="h-6 w-6 text-white" />
                </Button>
                <span className="text-white text-sm">{short.likes_count || 0}</span>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
                >
                  <MessageCircle className="h-6 w-6 text-white" />
                </Button>
                <span className="text-white text-sm">{short.comments_count || 0}</span>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
                >
                  <Bookmark className="h-6 w-6 text-white" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
                >
                  <Share2 className="h-6 w-6 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {hasNextPage && (
        <div ref={ref} className="h-20 flex items-center justify-center">
          {isFetchingNextPage && (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-luxury-primary" />
          )}
        </div>
      )}
    </div>
  );
};