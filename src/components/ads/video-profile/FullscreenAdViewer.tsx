
import { useState, useEffect } from 'react';
import { X, MessageCircle, Eye, Map, Clock, Calendar, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DatingAd } from '../types/dating';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@/hooks/use-mobile';

interface FullscreenAdViewerProps {
  ad: DatingAd;
  onClose: () => void;
}

export const FullscreenAdViewer = ({ ad, onClose }: FullscreenAdViewerProps) => {
  const [viewCount, setViewCount] = useState(ad.view_count || 0);
  const [replyCount, setReplyCount] = useState(ad.message_count || 0);
  const { toast } = useToast();
  const session = useSession();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Update view count on open
  useEffect(() => {
    const updateViewCount = async () => {
      try {
        const { data, error } = await supabase
          .from('dating_ads')
          .update({ view_count: (ad.view_count || 0) + 1 })
          .eq('id', ad.id)
          .select('view_count');
          
        if (!error && data && data[0]) {
          setViewCount(data[0].view_count);
        }
      } catch (error) {
        console.error('Error updating view count:', error);
      }
    };
    
    updateViewCount();
  }, [ad.id, ad.view_count]);
  
  // Format age range for display
  const ageRangeDisplay = `${ad.age_range.lower}-${ad.age_range.upper}`;
  
  // Handle message button click
  const handleMessageClick = () => {
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please sign in to message BD ad creators",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user is premium (this will need to be implemented)
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
  
  // Close on escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Close Button - Always Visible */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="fixed top-4 right-4 text-white hover:bg-white/10 z-[60] bg-black/30 backdrop-blur-sm"
        >
          <X size={24} />
        </Button>
        
        {/* Back to Browse Button - Mobile Only */}
        {isMobile && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="fixed top-4 left-4 text-white hover:bg-white/10 z-[60] bg-black/30 backdrop-blur-sm flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            Back
          </Button>
        )}
        
        <div className={`container h-[90vh] ${isMobile ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-[2fr,1fr] gap-6'}`}>
          {/* Left side - Video Container */}
          <div className="relative h-full flex flex-col">
            <div className="flex-1 overflow-hidden rounded-xl bg-black">
              {ad.video_url ? (
                <VideoPlayer 
                  url={ad.video_url} 
                  className="w-full h-full"
                  autoPlay
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-luxury-darker/50">
                  <p className="text-luxury-neutral">No video available</p>
                </div>
              )}
            </div>
            
            {/* Engagement Metrics */}
            <div className="mt-4 flex items-center justify-between bg-luxury-dark/40 backdrop-blur-sm p-3 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-white/80">
                  <Eye className="h-5 w-5" />
                  <span>{viewCount} views</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/80">
                  <MessageCircle className="h-5 w-5" />
                  <span>{replyCount} replies</span>
                </div>
              </div>
              
              {/* Message CTA Button */}
              <Button 
                onClick={handleMessageClick}
                className="bg-gradient-to-r from-luxury-primary to-luxury-secondary hover:from-luxury-secondary hover:to-luxury-primary"
                size={isMobile ? "lg" : "default"}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Message
              </Button>
            </div>
          </div>
          
          {/* Right side - Profile Info */}
          <div className="bg-luxury-dark/60 backdrop-blur-md rounded-xl p-6 flex flex-col h-full overflow-y-auto">
            <div className="flex items-center gap-4 mb-6">
              {ad.avatar_url ? (
                <img 
                  src={ad.avatar_url} 
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-luxury-primary"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-luxury-darker flex items-center justify-center">
                  <span className="text-xl text-luxury-neutral">?</span>
                </div>
              )}
              
              <div>
                <h2 className="text-2xl font-bold text-white">{ad.title}</h2>
                <p className="text-luxury-neutral/80">{ad.user?.username || "Anonymous"}</p>
              </div>
            </div>
            
            <div className="space-y-5 mb-6">
              {/* Profile Information with Clear Spacing */}
              <div className="bg-black/20 rounded-lg p-4">
                <h3 className="text-sm font-medium text-luxury-neutral/80 mb-2">Relationship Status</h3>
                <p className="text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-luxury-primary" />
                  {ad.relationship_status}
                </p>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4">
                <h3 className="text-sm font-medium text-luxury-neutral/80 mb-2">Looking For</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(ad.looking_for) && ad.looking_for.map(type => (
                    <Badge key={type} className="bg-luxury-primary/80 text-white px-3 py-1 text-sm">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4">
                <h3 className="text-sm font-medium text-luxury-neutral/80 mb-2">Age Range</h3>
                <p className="text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-luxury-primary" />
                  {ageRangeDisplay}
                </p>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4">
                <h3 className="text-sm font-medium text-luxury-neutral/80 mb-2">Location</h3>
                <p className="text-white flex items-center gap-2">
                  <Map className="h-4 w-4 text-luxury-primary" />
                  {ad.city}, {ad.country}
                </p>
              </div>
              
              {ad.tags && ad.tags.length > 0 && (
                <div className="bg-black/20 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-luxury-neutral/80 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {ad.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="bg-luxury-dark/50 text-luxury-neutral border-none px-2 py-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-auto">
              <div className="bg-black/20 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium text-luxury-neutral/80 mb-2">Description</h3>
                <p className="text-white/90 whitespace-pre-line">{ad.description}</p>
              </div>
              
              {/* Mobile-optimized Message Button */}
              {isMobile && (
                <Button 
                  onClick={handleMessageClick}
                  className="w-full bg-gradient-to-r from-luxury-primary to-luxury-secondary hover:from-luxury-secondary hover:to-luxury-primary py-4 text-lg"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Message
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
