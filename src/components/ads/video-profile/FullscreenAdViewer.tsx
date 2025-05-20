
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Video } from 'lucide-react';
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DatingAd } from '../types/dating';

interface FullscreenAdViewerProps {
  videoUrl?: string | null;
  onClose: () => void;
  ad?: DatingAd;
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative w-full max-w-4xl max-h-screen"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          onClick={handleClose}
          whileTap={{ scale: 0.9 }}
        >
          <X className="h-6 w-6" />
        </motion.button>

        {videoToDisplay ? (
          <VideoPlayer
            url={videoToDisplay}
            className="h-full w-full object-cover"
            autoPlay={true}
            muted={false}
            loop={true}
            controls={true}
            onEnded={handleVideoEnded}
          />
        ) : (
          <div className="h-96 w-full flex items-center justify-center text-white text-lg">
            No video available
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
