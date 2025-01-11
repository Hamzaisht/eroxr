import { useState } from 'react';
import { motion } from 'framer-motion';
import type { DatingAd } from './types/dating';
import { ProfileHeader } from './video-profile/ProfileHeader';
import { ProfileTags } from './video-profile/ProfileTags';
import { VideoControls } from './video-profile/VideoControls';
import { ProfileStats } from './video-profile/ProfileStats';
import { ProfileActions } from './video-profile/ProfileActions';
import { useToast } from '@/hooks/use-toast';

interface VideoProfileCardProps {
  ad: DatingAd;
  isActive: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const VideoProfileCard = ({ ad, isActive, onNext, onPrevious }: VideoProfileCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

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

  return (
    <motion.div
      className="relative w-full h-[85vh] rounded-xl overflow-hidden group cursor-pointer transform-gpu bg-luxury-dark/50 backdrop-blur-xl"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.01 }}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (x < rect.width / 2) {
          onPrevious?.();
        } else {
          onNext?.();
        }
      }}
    >
      <VideoControls 
        videoUrl={ad.video_url} 
        avatarUrl={ad.avatar_url} 
        isActive={isActive} 
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-luxury-dark/95" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-luxury-dark/30" />
      
      <ProfileStats 
        viewCount={ad.view_count || 0}
        messageCount={ad.message_count || 0}
        clickCount={ad.click_count || 0}
      />

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

          <ProfileActions 
            userId={ad.user_id} 
            onShare={handleShare}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};