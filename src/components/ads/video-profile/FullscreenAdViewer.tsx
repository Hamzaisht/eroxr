
import { useEffect, useState } from 'react';
import { X, Heart, MessageCircle, Share2, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DatingAd } from '../types/dating';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { useMediaQuery } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@supabase/auth-helpers-react';

interface FullscreenAdViewerProps {
  ad: DatingAd;
  onClose: () => void;
}

export const FullscreenAdViewer = ({ ad, onClose }: FullscreenAdViewerProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { toast } = useToast();
  const session = useSession();
  
  // Handle keyboard events for closing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      } else if (e.key === 'm') {
        setIsMuted(prev => !prev);
      } else if (e.key === 'l') {
        handleLike();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  const handleLike = () => {
    if (!session) {
      toast({
        title: "Login required",
        description: "Please sign in to like profiles",
        variant: "destructive"
      });
      return;
    }
    
    setIsLiked(prev => !prev);
    
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: isLiked ? "Profile removed from your favorites" : "Profile added to your favorites",
      duration: 2000,
    });
  };
  
  const handleMessage = () => {
    if (!session) {
      toast({
        title: "Login required",
        description: "Please sign in to message users",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Message feature",
      description: "This feature will be available soon!",
      duration: 2000,
    });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: ad.title,
        text: `Check out this profile: ${ad.title}`,
        url: window.location.href
      })
      .catch(err => {
        console.error("Share failed:", err);
        toast({
          title: "Share failed",
          description: "Could not share this profile",
          variant: "destructive"
        });
      });
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Profile link copied to clipboard",
        duration: 2000,
      });
    }
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl h-[90vh] bg-luxury-dark/90 rounded-xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <button 
            className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col md:flex-row h-full">
            {/* Video section */}
            <div className="relative md:w-2/3 h-1/2 md:h-full">
              {ad.video_url ? (
                <VideoPlayer 
                  url={ad.video_url} 
                  className="w-full h-full object-cover"
                  autoPlay={isPlaying}
                  muted={isMuted}
                  loop={true}
                  controls={true}
                  onEnded={() => setIsPlaying(false)}
                  onClick={() => setIsPlaying(!isPlaying)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-luxury-darker">
                  <p className="text-luxury-neutral">No video available</p>
                </div>
              )}
            </div>
            
            {/* Details section */}
            <div className="md:w-1/3 bg-luxury-dark h-1/2 md:h-full flex flex-col">
              <ScrollArea className="flex-grow">
                <div className="p-5 space-y-4">
                  {/* Header with title and verification */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white">{ad.title}</h3>
                      {ad.user?.username && (
                        <div className="flex items-center mt-1">
                          <Avatar className="h-5 w-5 mr-2">
                            <AvatarImage src={ad.avatar_url || undefined} />
                            <AvatarFallback>{ad.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-luxury-neutral">{ad.user.username}</span>
                        </div>
                      )}
                    </div>
                    {ad.is_verified && (
                      <Badge className="bg-luxury-primary/20 text-luxury-primary flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        <span>Verified</span>
                      </Badge>
                    )}
                  </div>
                  
                  {/* Location and age */}
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-luxury-neutral">
                      {ad.city}, {ad.country}
                    </div>
                    <div className="text-sm text-luxury-neutral">
                      {ad.age_range && `${ad.age_range.lower}-${ad.age_range.upper} years`}
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="border-t border-luxury-primary/10 pt-4">
                    <h4 className="text-sm font-semibold text-luxury-primary mb-2">About</h4>
                    <p className="text-sm text-luxury-neutral whitespace-pre-line">
                      {ad.description}
                    </p>
                  </div>
                  
                  {/* Looking for */}
                  <div className="border-t border-luxury-primary/10 pt-4">
                    <h4 className="text-sm font-semibold text-luxury-primary mb-2">Looking for</h4>
                    <div className="flex flex-wrap gap-2">
                      {ad.looking_for?.map((item) => (
                        <Badge 
                          key={item} 
                          variant="secondary"
                          className="bg-luxury-primary/10 text-luxury-primary"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Tags/Interests */}
                  {ad.tags && ad.tags.length > 0 && (
                    <div className="border-t border-luxury-primary/10 pt-4">
                      <h4 className="text-sm font-semibold text-luxury-primary mb-2">Interests</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {ad.tags.map((tag) => (
                          <Badge 
                            key={tag}
                            variant="outline" 
                            className="text-xs bg-luxury-primary/5 border-luxury-primary/20 text-luxury-neutral"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Created date */}
                  <div className="text-xs text-luxury-neutral/60 flex items-center pt-2">
                    Posted {ad.created_at && formatDistanceToNow(new Date(ad.created_at), { addSuffix: true })}
                  </div>
                </div>
              </ScrollArea>
              
              {/* Action buttons */}
              <div className="p-4 border-t border-luxury-primary/10 flex justify-between">
                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-full ${isLiked ? 'bg-luxury-primary text-white' : 'bg-luxury-darker text-luxury-neutral'}`}
                  onClick={handleLike}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                </Button>
                
                <Button
                  variant="default"
                  size="sm"
                  className="bg-luxury-primary text-white rounded-full px-6"
                  onClick={handleMessage}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-luxury-darker text-luxury-neutral"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
