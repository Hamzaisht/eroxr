import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const StoryReel = () => {
  const session = useSession();
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: stories } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stories")
        .select(`
          id,
          media_url,
          creator:profiles(
            id,
            username,
            avatar_url
          )
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newPosition = direction === "left" 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth"
      });
      
      setScrollPosition(newPosition);
    }
  };

  if (!stories?.length) return null;

  return (
    <div className="relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-luxury-dark/50 text-luxury-neutral hover:bg-luxury-dark/70"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-luxury-dark/50 text-luxury-neutral hover:bg-luxury-dark/70"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide py-4 px-2"
      >
        {session && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-shrink-0"
          >
            <div className="w-28 rounded-xl border border-luxury-neutral/10 bg-luxury-dark/50 p-2 cursor-pointer hover:bg-luxury-neutral/5 transition-colors">
              <div className="relative mb-2">
                <div className="aspect-[3/4] rounded-lg bg-luxury-primary/20 flex items-center justify-center">
                  <Plus className="h-8 w-8 text-luxury-neutral/60" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-luxury-neutral/60">Add Story</p>
              </div>
            </div>
          </motion.div>
        )}

        {stories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0"
          >
            <div className="w-28 rounded-xl border border-luxury-neutral/10 bg-luxury-dark/50 p-2 cursor-pointer hover:bg-luxury-neutral/5 transition-colors">
              <div className="relative mb-2">
                <div className="ring-2 ring-luxury-primary rounded-full p-0.5 absolute -top-2 -left-2">
                  <Avatar className="h-8 w-8 border-2 border-luxury-dark">
                    <AvatarImage src={story.creator.avatar_url} />
                    <AvatarFallback>
                      {story.creator.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <img 
                  src={story.media_url} 
                  alt={`Story by ${story.creator.username}`}
                  className="aspect-[3/4] rounded-lg object-cover"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-luxury-neutral truncate">
                  {story.creator.username}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};