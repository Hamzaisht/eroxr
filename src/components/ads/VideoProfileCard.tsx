
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DatingAd } from './types/dating';
import { Video, Play, Pause, Volume2, VolumeX, Shield, Info, Award, Clock, Map, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ModerationBadge } from './body-contact/components/ModerationBadge';

interface VideoProfileCardProps {
  ad: DatingAd;
  isActive?: boolean;
}

export const VideoProfileCard = ({ ad, isActive = false }: VideoProfileCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Format age range for display
  const ageRangeDisplay = `${ad.age_range.lower}-${ad.age_range.upper}`;
  
  // Auto-play video when card becomes active
  useEffect(() => {
    if (isActive && videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(e => console.error("Autoplay failed:", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, isPlaying]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(e => console.error("Play failed:", e));
    }
    
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <motion.div 
      className="w-full max-w-4xl rounded-xl overflow-hidden relative glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      layout
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10 pointer-events-none" />
      
      {/* Premium Indicator - Top Right */}
      {ad.is_premium && (
        <motion.div 
          className="absolute top-3 right-3 z-30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Badge className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-3 py-1 flex items-center gap-1 shadow-lg">
            <Award className="w-3.5 h-3.5" />
            <span>Premium</span>
          </Badge>
        </motion.div>
      )}
      
      {/* Video */}
      <div className="relative aspect-video w-full h-[60vh] overflow-hidden bg-black">
        {ad.video_url ? (
          <video
            ref={videoRef}
            src={ad.video_url}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              isPlaying ? "opacity-100" : "opacity-90 scale-[1.01]"
            )}
            loop
            muted={isMuted}
            playsInline
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-luxury-darker/50">
            <Video className="w-16 h-16 text-luxury-neutral/30" />
          </div>
        )}
        
        {/* Video controls */}
        <motion.div 
          className="absolute bottom-4 left-4 z-20 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered || isPlaying ? 1 : 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-luxury-primary/80 backdrop-blur-sm flex items-center justify-center hover:bg-luxury-primary transition-colors shadow-lg"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white ml-0.5" />
            )}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMute}
            className="w-10 h-10 rounded-full bg-luxury-dark/80 backdrop-blur-sm flex items-center justify-center hover:bg-luxury-dark transition-colors shadow-lg"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </motion.button>
        </motion.div>
      </div>
      
      {/* Profile Information */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold text-white">{ad.title}</h2>
              
              {/* Status Badges */}
              <div className="flex gap-1.5">
                {ad.is_verified && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className="bg-blue-500 text-white flex items-center gap-1">
                          <Shield className="w-3 h-3" /> Verified
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>ID Verified User</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                {ad.is_premium && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className="bg-gradient-to-r from-purple-500 to-purple-700 text-white flex items-center gap-1">
                          <Award className="w-3 h-3" /> Premium
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Premium User</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                {/* Moderation Status - Show only for pending ads */}
                {ad.moderation_status === 'pending' && (
                  <ModerationBadge status="pending" />
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 text-sm text-white/80">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {ad.relationship_status}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {ageRangeDisplay}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Map className="w-3.5 h-3.5" />
                {ad.city}, {ad.country}
              </span>
            </div>
            
            <p className="text-white/70 line-clamp-2 max-w-2xl">{ad.description}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {ad.tags && ad.tags.map(tag => (
                <Badge key={tag} variant="outline" className="bg-luxury-dark/50 text-luxury-neutral border-none">
                  {tag}
                </Badge>
              ))}
              
              {Array.isArray(ad.looking_for) && ad.looking_for.map(seekingType => (
                <Badge key={seekingType} className="bg-luxury-primary/80 text-white">
                  Seeking {seekingType}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Profile Image */}
          {ad.avatar_url && (
            <motion.div 
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(155, 135, 245, 0.5)" }}
              className="w-16 h-16 rounded-full overflow-hidden border-2 border-luxury-primary"
            >
              <img 
                src={ad.avatar_url} 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
