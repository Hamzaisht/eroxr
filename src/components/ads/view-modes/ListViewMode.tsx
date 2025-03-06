
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Eye, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DatingAd } from "../types/dating";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { FullscreenAdViewer } from "../video-profile/FullscreenAdViewer";
import { AdActions } from "../video-profile-card/AdActions";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ListViewModeProps {
  ads: DatingAd[];
}

export const ListViewMode = ({ ads }: ListViewModeProps) => {
  const [selectedAd, setSelectedAd] = useState<DatingAd | null>(null);
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Format age range for display
  const formatAgeRange = (ad: DatingAd) => {
    if (!ad.age_range) return "N/A";
    return `${ad.age_range.lower}-${ad.age_range.upper}`;
  };
  
  // Convert "looking_for" array to a readable format
  const formatLookingFor = (ad: DatingAd) => {
    if (!ad.looking_for || ad.looking_for.length === 0) return "Anyone";
    
    // Map common terms to more user-friendly versions
    const lookingForMap: Record<string, string> = {
      "female": "Women",
      "male": "Men",
      "couple": "Couples",
      "trans": "Trans People",
      "any": "Anyone"
    };
    
    return ad.looking_for.map(type => lookingForMap[type] || type).join(", ");
  };
  
  // Handle message button click
  const handleMessageClick = (ad: DatingAd, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the full view
    
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please sign in to message BD ad creators",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user is premium (this needs to be implemented)
    const isPremium = session?.user?.email && ["hamzaishtiaq242@gmail.com"].includes(session.user.email.toLowerCase());
    
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Messaging BD ad creators is a premium feature. Upgrade for 59 SEK/month to unlock messaging & more.",
        duration: 5000,
      });
      return;
    }
    
    // Navigate to messages with this user
    navigate(`/messages?user=${ad.user_id}`);
  };
  
  // Handle clicking on a tag
  const handleTagClick = (tag: string, e: React.MouseEvent, adToTag: DatingAd) => {
    e.stopPropagation(); // Prevent opening the full view
    
    if (adToTag.onTagClick) {
      adToTag.onTagClick(tag);
    }
  };

  return (
    <>
      <div ref={containerRef} className="space-y-4">
        {ads.map((ad) => (
          <motion.div
            key={ad.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="bg-luxury-dark/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-md border border-luxury-primary/10 group relative"
            onClick={() => setSelectedAd(ad)}
          >
            <AdActions ad={ad} />
            
            <div className="flex flex-col sm:flex-row h-full">
              {/* Left side: Video thumbnail */}
              <div className="sm:w-80 h-48 sm:h-auto relative flex-shrink-0">
                {ad.video_url ? (
                  <VideoPlayer 
                    url={ad.video_url} 
                    className="w-full h-full"
                    playOnHover={true}
                    autoPlay={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-luxury-darker">
                    <p className="text-luxury-neutral">No video</p>
                  </div>
                )}
              </div>
              
              {/* Right side: Ad info */}
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-luxury-primary/30">
                        <AvatarImage src={ad.avatar_url || undefined} />
                        <AvatarFallback className="bg-luxury-darker text-luxury-neutral">
                          {ad.user?.username?.charAt(0).toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-semibold text-white">{ad.title}</h3>
                        <p className="text-sm text-luxury-neutral">{ad.user?.username || "Anonymous"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-luxury-neutral">
                      <MapPin className="h-4 w-4" />
                      <span>{ad.city}, {ad.country}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                    <div className="flex items-center gap-1 text-sm text-luxury-neutral">
                      <Calendar className="h-4 w-4" />
                      <span>Age: {formatAgeRange(ad)}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-luxury-neutral">
                      <span className="font-medium">Looking for:</span>
                      <span>{formatLookingFor(ad)}</span>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  {ad.tags && ad.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {ad.tags.slice(0, 4).map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="bg-luxury-darker/50 text-xs cursor-pointer hover:bg-luxury-primary/20"
                          onClick={(e) => handleTagClick(tag, e, ad)}
                        >
                          {tag}
                        </Badge>
                      ))}
                      {ad.tags.length > 4 && (
                        <Badge variant="outline" className="bg-luxury-darker/50 text-xs">
                          +{ad.tags.length - 4} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-luxury-neutral/80">
                      <Eye className="h-4 w-4" />
                      <span>{ad.view_count || 0} views</span>
                    </div>
                    <div className="flex items-center gap-1 text-luxury-neutral/80">
                      <MessageCircle className="h-4 w-4" />
                      <span>{ad.message_count || 0} replies</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={(e) => handleMessageClick(ad, e)}
                    size="sm"
                    className="bg-gradient-to-r from-luxury-primary to-luxury-secondary hover:from-luxury-secondary hover:to-luxury-primary"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Fullscreen Ad Viewer */}
      {selectedAd && (
        <FullscreenAdViewer 
          ad={selectedAd} 
          onClose={() => setSelectedAd(null)} 
        />
      )}
    </>
  );
};
