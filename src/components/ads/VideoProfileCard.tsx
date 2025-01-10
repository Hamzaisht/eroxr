import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { DatingAd } from './types/dating';
import { VideoControls } from './video-profile/VideoControls';
import { ProfileHeader } from './video-profile/ProfileHeader';
import { ProfileTags } from './video-profile/ProfileTags';
import { ProfileActions } from './video-profile/ProfileActions';
import { Eye, MessageCircle, MousePointer } from 'lucide-react';

interface VideoProfileCardProps {
  ad: DatingAd;
  isActive: boolean;
}

export const VideoProfileCard = ({ ad, isActive }: VideoProfileCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive && !isPlaying) {
        videoRef.current.play().catch(console.error);
        setIsPlaying(true);
      } else if (!isActive) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
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
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-luxury-dark/95" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-luxury-dark/30" />
      
      {/* Video Controls */}
      <VideoControls
        isPlaying={isPlaying}
        onPlayToggle={togglePlay}
        hasVideo={!!ad.video_url}
      />

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

          <ProfileActions interests={ad.interests} />
        </motion.div>
      </div>
    </motion.div>
  );
};