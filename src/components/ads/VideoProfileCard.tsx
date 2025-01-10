import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { DatingAd } from './types/dating';
import { VideoControls } from './video-profile/VideoControls';
import { ProfileHeader } from './video-profile/ProfileHeader';
import { ProfileTags } from './video-profile/ProfileTags';
import { ProfileActions } from './video-profile/ProfileActions';

interface VideoProfileCardProps {
  ad: DatingAd;
  isActive: boolean;
}

export const VideoProfileCard = ({ ad, isActive }: VideoProfileCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
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

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.div
      className="relative w-full max-w-4xl h-full rounded-xl overflow-hidden group cursor-pointer transform-gpu bg-luxury-dark/50 backdrop-blur-xl"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
    >
      {/* Video Background */}
      {ad.video_url ? (
        <video
          ref={videoRef}
          src={ad.video_url}
          className="h-full w-full object-cover opacity-90"
          loop
          muted={isMuted}
          playsInline
        />
      ) : (
        <div className="h-full w-full bg-luxury-dark/50 backdrop-blur-xl flex items-center justify-center">
          <p className="text-luxury-neutral">No video available</p>
        </div>
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-luxury-dark/95" />
      
      {/* Video Controls */}
      <VideoControls
        isPlaying={isPlaying}
        isMuted={isMuted}
        onPlayToggle={togglePlay}
        onMuteToggle={toggleMute}
        hasVideo={!!ad.video_url}
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

          <ProfileActions interests={ad.interests} />
        </motion.div>
      </div>
    </motion.div>
  );
};