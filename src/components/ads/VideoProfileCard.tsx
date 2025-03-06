
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DatingAd } from './types/dating';
import { ProfileHeader } from './video-profile/ProfileHeader';
import { ProfileTags } from './video-profile/ProfileTags';
import { VideoControls } from './video-profile/VideoControls';
import { ProfileStats } from './video-profile/ProfileStats';
import { ProfileActions } from './video-profile/ProfileActions';
import { useToast } from '@/hooks/use-toast';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface VideoProfileCardProps {
  ad: DatingAd;
  isActive: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const VideoProfileCard = ({ ad, isActive, onNext, onPrevious }: VideoProfileCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showEnlarged, setShowEnlarged] = useState(false);
  const { toast } = useToast();

  // Track view when card is shown
  useQuery({
    queryKey: ['track-ad-view', ad.id],
    queryFn: async () => {
      if (isActive && ad.id) {
        try {
          const { error } = await supabase
            .from('dating_ads')
            .update({ view_count: (ad.view_count || 0) + 1 })
            .eq('id', ad.id);
          
          if (error) throw error;
        } catch (error) {
          console.error('Error tracking ad view:', error);
        }
      }
      return null;
    },
    enabled: isActive && !!ad.id,
    staleTime: Infinity, // Only track once per session
  });

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Check out this profile",
          text: ad.description,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Profile link copied to clipboard",
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast({
          title: "Share failed",
          description: "Could not share profile",
          variant: "destructive",
        });
      }
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (!showEnlarged) {
      setShowEnlarged(true);
      
      // Track click
      if (ad.id) {
        supabase
          .from('dating_ads')
          .update({ click_count: (ad.click_count || 0) + 1 })
          .eq('id', ad.id)
          .then(({ error }) => {
            if (error) console.error('Error tracking ad click:', error);
          });
      }
    } else if (x < rect.width / 2) {
      onPrevious?.();
    } else {
      onNext?.();
    }
  };

  return (
    <>
      <motion.div
        className="relative w-full h-[85vh] rounded-xl overflow-hidden group cursor-pointer transform-gpu"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.01 }}
        onClick={handleCardClick}
      >
        {/* Video Background */}
        <div className="absolute inset-0 bg-luxury-dark/50">
          <VideoControls 
            videoUrl={ad.video_url} 
            avatarUrl={ad.avatar_url} 
            isActive={isActive && !showEnlarged} 
          />
        </div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-luxury-dark/95 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-luxury-dark/30 pointer-events-none" />
        
        <ProfileStats 
          viewCount={ad.view_count || 0}
          messageCount={ad.message_count || 0}
          clickCount={ad.click_count || 0}
          userId={ad.user_id}
        />

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <ProfileHeader ad={ad} />
            <ProfileTags ad={ad} />

            <p className="text-luxury-neutral line-clamp-2 text-lg">
              {ad.description}
            </p>

            <ProfileActions 
              userId={ad.user_id} 
              onShare={handleShare}
              source="dating"
            />
          </motion.div>
        </div>

        {/* Zoom indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute top-4 right-4 p-2 bg-luxury-dark/80 rounded-full"
        >
          <ZoomIn className="w-6 h-6 text-luxury-primary" />
        </motion.div>
      </motion.div>

      {/* Enlarged View Dialog */}
      <Dialog open={showEnlarged} onOpenChange={setShowEnlarged}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-luxury-dark/95 border-luxury-primary/20">
          <DialogTitle className="sr-only">Profile Details</DialogTitle>
          <div className="relative w-full h-full overflow-hidden">
            {/* Close button */}
            <button
              onClick={() => setShowEnlarged(false)}
              className="absolute top-4 right-4 z-50 p-2 bg-luxury-dark/80 rounded-full hover:bg-luxury-primary/20 transition-colors"
            >
              <X className="w-6 h-6 text-luxury-primary" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
              {/* Video Section */}
              <div className="relative h-full">
                <VideoControls 
                  videoUrl={ad.video_url} 
                  avatarUrl={ad.avatar_url} 
                  isActive={showEnlarged} 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-luxury-dark/30" />
              </div>

              {/* Content Section */}
              <div className="relative p-8 overflow-y-auto">
                <div className="space-y-8">
                  <ProfileHeader ad={ad} />
                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold text-luxury-primary">About</h3>
                    <p className="text-luxury-neutral text-lg leading-relaxed">
                      {ad.description}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold text-luxury-primary">Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-luxury-neutral/60">Age Range</p>
                        <p className="text-luxury-neutral">{ad.age_range.lower}-{ad.age_range.upper}</p>
                      </div>
                      <div>
                        <p className="text-luxury-neutral/60">Location</p>
                        <p className="text-luxury-neutral">{ad.city}, {ad.country}</p>
                      </div>
                      <div>
                        <p className="text-luxury-neutral/60">Status</p>
                        <p className="text-luxury-neutral">{ad.relationship_status}</p>
                      </div>
                      <div>
                        <p className="text-luxury-neutral/60">Body Type</p>
                        <p className="text-luxury-neutral">{ad.body_type}</p>
                      </div>
                    </div>
                  </div>
                  <ProfileTags ad={ad} />
                  <ProfileActions 
                    userId={ad.user_id} 
                    onShare={handleShare}
                    source="dating"
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
