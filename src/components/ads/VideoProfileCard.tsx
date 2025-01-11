import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DatingAd } from './types/dating';
import { ProfileHeader } from './video-profile/ProfileHeader';
import { ProfileTags } from './video-profile/ProfileTags';
import { ProfileActions } from './video-profile/ProfileActions';
import { Eye, MessageCircle, MousePointer, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface VideoProfileCardProps {
  ad: DatingAd;
  isActive: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const VideoProfileCard = ({ ad, isActive, onNext, onPrevious }: VideoProfileCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive]);

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

  const handleLike = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to like profiles",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('creator_likes')
        .upsert([
          {
            user_id: user.id,
            creator_id: ad.user_id,
          }
        ]);

      if (error) throw error;

      setIsLiked(true);
      toast({
        title: "Profile liked",
        description: "This profile has been added to your likes",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not like profile",
        variant: "destructive",
      });
    }
  };

  const handleContact = () => {
    navigate(`/messages?recipient=${ad.user_id}`);
  };

  return (
    <motion.div
      className="relative w-full h-[85vh] rounded-xl overflow-hidden group cursor-pointer transform-gpu bg-luxury-dark/50 backdrop-blur-xl"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.01 }}
    >
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        {ad.video_url ? (
          <video
            ref={videoRef}
            src={ad.video_url}
            className="h-full w-full object-cover"
            loop
            muted
            playsInline
            autoPlay={isActive}
            poster={ad.avatar_url || undefined}
          />
        ) : (
          <div className="h-full w-full bg-luxury-dark/50 backdrop-blur-xl flex items-center justify-center">
            <p className="text-luxury-neutral">No video available</p>
          </div>
        )}
      </div>
      
      {/* Navigation Buttons */}
      <AnimatePresence>
        {isHovered && (
          <>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30"
            >
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onPrevious?.();
                }}
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30"
            >
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onNext?.();
                }}
              >
                <ArrowRight className="h-6 w-6" />
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-luxury-dark/95" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-luxury-dark/30" />
      
      {/* Stats Overlay */}
      <div className="absolute top-6 right-6 flex items-center gap-4 px-4 py-2 rounded-full bg-luxury-dark/40 backdrop-blur-sm border border-luxury-primary/20">
        <div className="flex items-center gap-2 text-sm text-luxury-neutral">
          <Eye className="w-4 h-4 text-luxury-primary" />
          <span>{ad.view_count || 0}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-luxury-neutral">
          <MessageCircle className="w-4 h-4 text-luxury-primary" />
          <span>{ad.message_count || 0}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-luxury-neutral">
          <MousePointer className="w-4 h-4 text-luxury-primary" />
          <span>{ad.click_count || 0}</span>
        </div>
      </div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <ProfileHeader ad={ad} />
          <ProfileTags ad={ad} />

          {/* Description */}
          <p className="text-luxury-neutral line-clamp-2 text-lg">
            {ad.description}
          </p>

          <div className="flex items-center justify-between pt-4">
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-luxury-primary hover:text-luxury-primary/80 hover:bg-luxury-primary/10"
                onClick={handleShare}
              >
                <Eye className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className={`${isLiked ? 'text-red-500' : 'text-luxury-primary'} hover:text-luxury-primary/80 hover:bg-luxury-primary/10`}
                onClick={handleLike}
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>
            <Button 
              variant="default"
              className="bg-gradient-to-r from-luxury-primary to-luxury-secondary hover:from-luxury-secondary hover:to-luxury-primary text-white"
              onClick={handleContact}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};