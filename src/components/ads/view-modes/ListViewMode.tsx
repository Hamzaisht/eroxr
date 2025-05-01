import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Eye, MapPin, Calendar, User, Clock } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useMediaQuery } from "@/hooks/use-mobile";
import { getPlayableMediaUrl } from "@/utils/media/getPlayableMediaUrl";
import { MediaSource } from "@/utils/media/types";
import { calculateMatchPercentage } from "@/components/dating/utils/matchCalculator";

interface ListViewModeProps {
  ads: DatingAd[];
  isLoading?: boolean;
  onMediaClick?: (url: string) => void;
  userProfile?: DatingAd | null;
}

export const ListViewMode = ({ ads, isLoading = false, onMediaClick, userProfile }: ListViewModeProps) => {
  const [selectedAd, setSelectedAd] = useState<DatingAd | null>(null);
  const [hoveredAdId, setHoveredAdId] = useState<string | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const formatAgeRange = (ad: DatingAd) => {
    if (!ad.age_range) return "N/A";
    return `${ad.age_range.lower}-${ad.age_range.upper}`;
  };
  
  const formatLookingFor = (ad: DatingAd) => {
    if (!ad.looking_for || ad.looking_for.length === 0) return "Anyone";
    
    const lookingForMap: Record<string, string> = {
      "female": "Women",
      "male": "Men",
      "couple": "Couples",
      "trans": "Trans People",
      "any": "Anyone"
    };
    
    return ad.looking_for.map(type => lookingForMap[type] || type).join(", ");
  };
  
  const handleMessageClick = (ad: DatingAd, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please sign in to message BD ad creators",
        variant: "destructive",
      });
      return;
    }
    
    const isPremium = session?.user?.email && ["hamzaishtiaq242@gmail.com"].includes(session.user.email.toLowerCase());
    
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Messaging BD ad creators is a premium feature. Upgrade for 59 SEK/month to unlock messaging & more.",
        duration: 5000,
      });
      return;
    }
    
    navigate(`/messages?user=${ad.user_id}`);
  };
  
  const handleTagClick = (tag: string, e: React.MouseEvent, adToTag: DatingAd) => {
    e.stopPropagation();
    
    if (adToTag.onTagClick) {
      adToTag.onTagClick(tag);
    }
  };

  const toggleDescription = (adId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedDescriptions(prev => ({
      ...prev,
      [adId]: !prev[adId]
    }));
  };

  const handleMediaUrl = (url: string | string[]): string => {
    if (Array.isArray(url)) {
      return url.length > 0 ? getPlayableMediaUrl(url[0]) : '';
    }
    return getPlayableMediaUrl(url);
  };

  const handleMediaClick = (media: string | MediaSource) => {
    const url = typeof media === 'string' ? media : (
      media.media_url || 
      (Array.isArray(media.media_url) && media.media_url[0]) ||
      media.video_url || 
      (Array.isArray(media.video_url) && media.video_url[0]) || 
      media.url || 
      media.src
    );
    if (url && onMediaClick) onMediaClick(handleMediaUrl(url));
  };

  const getMatchPercentage = (ad: DatingAd): number | null => {
    if (!userProfile) return null;
    return calculateMatchPercentage(userProfile, ad);
  };

  const getMatchLabel = (percentage: number): { color: string } => {
    if (percentage >= 80) return { color: "bg-luxury-primary" };
    if (percentage >= 60) return { color: "bg-luxury-secondary" };
    return { color: "bg-luxury-darker" };
  };

  useEffect(() => {
    return () => setHoveredAdId(null);
  }, [ads]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((item) => (
          <div 
            key={item} 
            className="h-40 sm:h-48 rounded-xl overflow-hidden bg-luxury-dark/40 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!ads || ads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-luxury-neutral">No ads found matching your criteria</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div ref={containerRef} className="space-y-4">
        {ads.map((ad) => {
          const matchPercentage = getMatchPercentage(ad);
          const matchInfo = matchPercentage ? getMatchLabel(matchPercentage) : null;
          
          return (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
              transition={{ duration: 0.2 }}
              className="bg-luxury-dark/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-md border border-luxury-primary/10 group relative"
              onClick={() => setSelectedAd(ad)}
              onMouseEnter={() => !isMobile && setHoveredAdId(ad.id)}
              onMouseLeave={() => !isMobile && setHoveredAdId(null)}
              onTouchStart={() => isMobile && setHoveredAdId(ad.id === hoveredAdId ? null : ad.id)}
            >
              <AdActions ad={ad} />
              
              <div className="flex flex-col sm:flex-row h-full">
                <div className="sm:w-80 h-48 sm:h-auto relative flex-shrink-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="absolute inset-0 z-20 opacity-0" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to view full ad</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  {matchInfo && (
                    <div className="absolute top-2 left-2 z-10">
                      <div className={`text-xs font-medium ${matchInfo.color} text-white px-2 py-1 rounded-md`}>
                        {matchPercentage}% Match
                      </div>
                    </div>
                  )}
                  
                  {!isMobile ? (
                    <>
                      {ad.video_url ? (
                        <>
                          {hoveredAdId !== ad.id && (
                            <div className="absolute inset-0 z-10 bg-black">
                              <img
                                src={ad.video_url ? getPlayableMediaUrl(ad.video_url) : undefined}
                                alt={ad.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          
                          <VideoPlayer 
                            url={ad.video_url} 
                            className="w-full h-full"
                            playOnHover={true}
                            autoPlay={hoveredAdId === ad.id}
                          />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-luxury-darker">
                          <p className="text-luxury-neutral">No video</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {ad.video_url ? (
                        <VideoPlayer 
                          url={ad.video_url}
                          className="w-full h-full"
                          autoPlay={hoveredAdId === ad.id}
                          playOnHover={false}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-luxury-darker">
                          <p className="text-luxury-neutral">No video</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
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
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-1">
                      <div className="flex items-center gap-1 text-sm text-luxury-neutral">
                        <Calendar className="h-4 w-4" />
                        <span>Age: {formatAgeRange(ad)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-luxury-neutral">
                        <User className="h-4 w-4" />
                        <span className="font-medium">Looking for:</span>
                        <span>{formatLookingFor(ad)}</span>
                      </div>
                    </div>
                    
                    {ad.description && (
                      <div className="mt-2">
                        <p className={`text-sm text-luxury-neutral/90 ${isMobile && !expandedDescriptions[ad.id] ? 'line-clamp-2' : ''}`}>
                          {ad.description}
                        </p>
                        {isMobile && ad.description.length > 120 && (
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="text-[10px] text-luxury-primary p-0 h-auto mt-1"
                            onClick={(e) => toggleDescription(ad.id, e)}
                          >
                            {expandedDescriptions[ad.id] ? 'Show less' : 'Read more'}
                          </Button>
                        )}
                      </div>
                    )}
                    
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
                      {ad.created_at && (
                        <div className="hidden md:flex items-center gap-1 text-luxury-neutral/80">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(ad.created_at).toLocaleDateString()}</span>
                        </div>
                      )}
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
          );
        })}
      </div>
      
      <AnimatePresence>
        {selectedAd && (
          <FullscreenAdViewer 
            ad={selectedAd} 
            onClose={() => setSelectedAd(null)} 
          />
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
};
