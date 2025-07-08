
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MessageCircle, Share2, MapPin, Calendar, User } from 'lucide-react';
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DatingAd } from '../types/dating';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface FullscreenAdViewerProps {
  videoUrl?: string | null;
  onClose: () => void;
  ad: DatingAd;
}

const VideoPlayer = ({ url, ...props }: any) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('ended', props.onEnded);
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('ended', props.onEnded);
      }
    };
  }, [props.onEnded]);

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <video
      ref={videoRef}
      src={url}
      {...props}
    />
  );
};

export const FullscreenAdViewer = ({ videoUrl, ad, onClose }: FullscreenAdViewerProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Handle the case where we're passing in an ad object
  const videoToDisplay = videoUrl || (ad?.video_url || ad?.videoUrl || null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const handleVideoEnded = () => {
    if (!isMobile) {
      handleClose();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleClose}
    >
      <motion.div
        className="relative w-full max-w-6xl max-h-screen mx-4 flex flex-col lg:flex-row gap-6"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ duration: 0.4 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <motion.button
          className="absolute -top-12 right-0 z-50 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
          onClick={handleClose}
          whileTap={{ scale: 0.9 }}
        >
          <X className="h-6 w-6" />
        </motion.button>

        {/* Video Section */}
        <div className="flex-1 lg:w-2/3">
          <div className="bg-luxury-dark/90 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10">
            {videoToDisplay ? (
              <VideoPlayer
                url={videoToDisplay}
                className="w-full aspect-video object-cover"
                autoPlay={true}
                muted={false}
                loop={true}
                controls={true}
                onEnded={handleVideoEnded}
              />
            ) : (
              <div className="w-full aspect-video flex items-center justify-center bg-gradient-to-br from-luxury-primary/30 to-luxury-secondary/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-white/70" />
                  </div>
                  <p className="text-white/70 text-lg">Profile Preview</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="lg:w-1/3 flex flex-col">
          <div className="bg-luxury-dark/90 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-6">
            {/* Profile Header */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-luxury-primary/30">
                <AvatarImage src={ad.avatarUrl || ad.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${ad.title}&backgroundColor=6366f1`} />
                <AvatarFallback className="bg-luxury-darker text-luxury-neutral text-lg">
                  {ad.title?.charAt(0).toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{ad.title}</h3>
                <div className="flex items-center text-luxury-neutral text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{ad.city}, {ad.country}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-white/80 leading-relaxed">{ad.description}</p>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div className="flex items-center text-luxury-neutral text-sm">
                <User className="w-4 h-4 mr-2" />
                <span>{ad.age} years old • {ad.gender}</span>
              </div>
              {ad.created_at && (
                <div className="flex items-center text-luxury-neutral text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Member since {new Date(ad.created_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Looking For */}
            {ad.looking_for && ad.looking_for.length > 0 && (
              <div>
                <h4 className="text-white font-medium mb-2">Looking for:</h4>
                <div className="flex flex-wrap gap-1">
                  {ad.looking_for.map((item, index) => (
                    <Badge key={index} variant="outline" className="bg-luxury-primary/10 text-luxury-primary border-luxury-primary/30">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {ad.tags && ad.tags.length > 0 && (
              <div>
                <h4 className="text-white font-medium mb-2">Interests:</h4>
                <div className="flex flex-wrap gap-1">
                  {ad.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-white/5 text-white/70 border-white/20">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <motion.button
                className="flex-1 bg-luxury-primary hover:bg-luxury-primary/80 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="w-5 h-5" />
                <span>Like</span>
              </motion.button>
              <motion.button
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="w-5 h-5" />
                <span>Message</span>
              </motion.button>
              <motion.button
                className="bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
