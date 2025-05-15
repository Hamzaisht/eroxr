
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VideoThumbnail } from "./VideoThumbnail";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Heart, MessageCircle, Star, Flag } from "lucide-react";
import { toDbValue, safeDataAccess } from "@/utils/supabase/helpers";

export const PromotedAds = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const navigate = useNavigate();
  const session = useSession();

  // Fetch promoted ads using react-query
  const { data: promotedAds, isLoading } = useQuery({
    queryKey: ["promoted-ads"],
    queryFn: async () => {
      try {
        const country = "sweden"; // Default country

        const { data, error } = await supabase
          .from("dating_ads")
          .select(`
            *,
            profiles:user_id(username, avatar_url)
          `)
          .eq("is_active", toDbValue(true))
          .eq("country", toDbValue(country))
          .eq("moderation_status", toDbValue("approved"))
          .eq("user_type", toDbValue("premium"))
          .limit(5);

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching promoted ads:", error);
        return [];
      }
    },
    staleTime: 300000, // 5 minutes
  });

  // Safely access the promoted ads
  const safePromotedAds = safeDataAccess(promotedAds, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-pulse">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="bg-muted h-[320px] rounded-md"></div>
        ))}
      </div>
    );
  }

  if (safePromotedAds.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">No promoted ads available</h3>
        <p className="text-muted-foreground">Check back later for premium content</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {safePromotedAds.map((ad) => (
        <div
          key={ad.id}
          className="bg-card rounded-md overflow-hidden shadow hover:shadow-md transition-all relative group cursor-pointer"
          onMouseEnter={() => setHoveredId(ad.id)}
          onMouseLeave={() => setHoveredId(null)}
          onClick={() => navigate(`/dating/ad/${ad.id}`)}
        >
          {/* Video Thumbnail */}
          {ad.video_url ? (
            <VideoThumbnail 
              videoUrl={ad.video_url}
              className="w-full h-48 object-cover" 
            />
          ) : (
            <div 
              className="w-full h-48 bg-gradient-to-br from-pink-500/20 to-purple-500/40 flex items-center justify-center"
            >
              <span className="text-muted-foreground">No Video</span>
            </div>
          )}
          
          {/* Content */}
          <div className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={ad.profiles?.avatar_url} />
                  <AvatarFallback>{ad.title.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm truncate max-w-[100px]">
                  {ad.profiles?.username || "User"}
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary">
                Premium
              </Badge>
            </div>
            
            <h3 className="text-sm font-medium line-clamp-1">{ad.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">{ad.description}</p>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <div className="flex items-center space-x-2">
                <span className="flex items-center">
                  <Star className="h-3 w-3 mr-1 text-amber-500" />
                  Premium
                </span>
              </div>
              <span>{ad.city}, {ad.country}</span>
            </div>
          </div>
          
          {/* Hover Actions */}
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4 ${
              hoveredId === ad.id ? "opacity-100" : ""
            }`}
          >
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20">
                <Heart className="h-4 w-4 mr-1" />
                Like
              </Button>
              <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20">
                <MessageCircle className="h-4 w-4 mr-1" />
                Contact
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
