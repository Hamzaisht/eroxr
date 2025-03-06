
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DatingAd } from "../types/dating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { FullscreenAdViewer } from "../video-profile/FullscreenAdViewer";
import { AdActions } from "../video-profile-card/AdActions";
import { MapPin, MessageCircle, Eye } from "lucide-react";

interface GridViewModeProps {
  ads: DatingAd[];
}

export const GridViewMode = ({ ads }: GridViewModeProps) => {
  const [selectedAd, setSelectedAd] = useState<DatingAd | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle clicking on a tag
  const handleTagClick = (tag: string, e: React.MouseEvent, ad: DatingAd) => {
    e.stopPropagation(); // Prevent opening the full view
    
    if (ad.onTagClick) {
      ad.onTagClick(tag);
    }
  };

  return (
    <>
      <div 
        ref={containerRef} 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {ads.map((ad) => (
          <motion.div
            key={ad.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            className="bg-luxury-dark/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-luxury-primary/10 cursor-pointer group relative"
            onClick={() => setSelectedAd(ad)}
          >
            <AdActions ad={ad} />
            
            {/* Video Content */}
            <div className="aspect-video w-full">
              {ad.video_url ? (
                <VideoPlayer 
                  url={ad.video_url} 
                  className="w-full h-full"
                  playOnHover={true}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-luxury-darker">
                  <p className="text-luxury-neutral">No video</p>
                </div>
              )}
            </div>
            
            {/* Profile Info */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border-2 border-luxury-primary/30">
                    <AvatarImage src={ad.avatar_url || undefined} />
                    <AvatarFallback className="bg-luxury-darker text-luxury-neutral">
                      {ad.user?.username?.charAt(0).toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-sm text-white truncate max-w-[150px]">{ad.title}</h3>
                    <p className="text-xs text-luxury-neutral">{ad.user?.username || "Anonymous"}</p>
                  </div>
                </div>
                <div className="text-xs text-luxury-neutral flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate max-w-[80px]">{ad.city}</span>
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-luxury-neutral/80 mt-3">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{ad.view_count || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>{ad.message_count || 0}</span>
                </div>
              </div>
              
              {/* Tags */}
              {ad.tags && ad.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {ad.tags.slice(0, 3).map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="bg-luxury-darker/50 text-[10px] cursor-pointer hover:bg-luxury-primary/20"
                      onClick={(e) => handleTagClick(tag, e, ad)}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {ad.tags.length > 3 && (
                    <Badge 
                      variant="outline" 
                      className="bg-luxury-darker/50 text-[10px]"
                    >
                      +{ad.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Fullscreen Ad Viewer */}
      <AnimatePresence>
        {selectedAd && (
          <FullscreenAdViewer 
            ad={selectedAd} 
            onClose={() => setSelectedAd(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};
