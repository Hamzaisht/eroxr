
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Heart, MessageCircle } from "lucide-react";
import { VideoThumbnail } from "@/components/VideoThumbnail";
import { useMediaQuery } from "@/hooks/use-mobile";
import { safeDataAccess } from "@/utils/supabase/helpers";

interface ProfileData {
  username: string;
  avatar_url: string;
}

export const VideoProfileCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Fetch video profiles
  const { data: profiles, isLoading } = useQuery({
    queryKey: ["video-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dating_ads")
        .select(`
          id,
          title,
          description,
          video_url,
          profiles:user_id(username, avatar_url)
        `)
        .neq("video_url", null)
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    }
  });
  
  // Make sure profiles is safe to use
  const safeProfiles = safeDataAccess(profiles, []);
  
  // Implement auto-scrolling
  useEffect(() => {
    const timer = setInterval(() => {
      if (safeProfiles.length > 0) {
        setActiveIndex((prev) => (prev + 1) % safeProfiles.length);
      }
    }, 10000); // Auto-advance every 10 seconds
    
    return () => clearInterval(timer);
  }, [safeProfiles.length]);
  
  // Scroll to active item when index changes
  useEffect(() => {
    if (carouselRef.current && safeProfiles.length > 0) {
      const itemWidth = carouselRef.current.scrollWidth / safeProfiles.length;
      carouselRef.current.scrollTo({
        left: activeIndex * itemWidth,
        behavior: "smooth"
      });
    }
  }, [activeIndex, safeProfiles.length]);
  
  const navigateTo = (index: number) => {
    if (index < 0) {
      setActiveIndex(safeProfiles.length - 1);
    } else if (index >= safeProfiles.length) {
      setActiveIndex(0);
    } else {
      setActiveIndex(index);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px] bg-black/20 rounded-lg">
        <div className="animate-pulse">Loading video profiles...</div>
      </div>
    );
  }
  
  if (safeProfiles.length === 0) {
    return null; // Don't show anything if no videos
  }
  
  return (
    <div className="relative group">
      <div className="overflow-hidden rounded-lg">
        <div 
          ref={carouselRef}
          className="flex snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {safeProfiles.map((profile, index) => (
            <div 
              key={profile.id}
              className="flex-shrink-0 w-full snap-center relative"
            >
              <div className="relative aspect-video overflow-hidden bg-black">
                {profile.video_url && (
                  <VideoThumbnail
                    videoUrl={profile.video_url}
                    autoplay={index === activeIndex}
                    loop={true}
                    muted={true}
                    controls={false}
                    className="w-full h-full object-cover"
                  />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-white/50">
                      <AvatarImage src={(profile.profiles as ProfileData)?.avatar_url || ''} />
                      <AvatarFallback>
                        {(profile.profiles as ProfileData)?.username?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold">{(profile.profiles as ProfileData)?.username || "User"}</h3>
                      <p className="text-sm opacity-90">{profile.title}</p>
                    </div>
                  </div>
                  
                  <p className="mt-2 text-sm line-clamp-2 opacity-80">
                    {profile.description}
                  </p>
                  
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="secondary" className="gap-1">
                      <Heart className="h-4 w-4" /> Like
                    </Button>
                    <Button size="sm" variant="secondary" className="gap-1">
                      <MessageCircle className="h-4 w-4" /> Chat
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => navigateTo(activeIndex - 1)}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => navigateTo(activeIndex + 1)}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      
      {/* Dots indicator */}
      <div className="flex justify-center gap-1 mt-2">
        {safeProfiles.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === activeIndex ? "w-4 bg-luxury-primary" : "w-2 bg-luxury-primary/30"
            }`}
            onClick={() => navigateTo(index)}
          />
        ))}
      </div>
    </div>
  );
};
