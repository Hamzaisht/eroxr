
import { useState, useRef, useEffect } from 'react';
import { DatingAd } from '../types/dating';
import { CarouselContainer } from './CarouselContainer';
import { CarouselNavigation } from './CarouselNavigation';
import { CarouselProgressIndicator } from './CarouselProgressIndicator';
import { VideoControls } from '../video-profile-card/VideoControls';
import { useMediaQuery } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { UniversalMedia } from '@/components/media/UniversalMedia';
import { MediaType } from '@/utils/media/types';
import { Maximize2, Minimize2 } from 'lucide-react';

interface VideoProfileCarouselProps {
  ads: DatingAd[];
}

export const VideoProfileCarousel = ({ ads }: VideoProfileCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Handle keyboard navigation and controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm') {
        toggleMute();
      } else if (e.key === 'f') {
        toggleFullscreen();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, ads.length, isPlaying, isFullscreen]);

  // Auto-hide controls after inactivity
  useEffect(() => {
    if (!isActive) return;
    
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [isActive]);

  const handleNext = () => {
    if (currentIndex < ads.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsPlaying(false);
    }
  };

  const handleGoToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setShowControls(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setShowControls(true);
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setShowControls(true);
  };

  // Show controls when mouse moves
  const handleMouseMove = () => {
    setIsActive(true);
    setShowControls(true);
  };

  if (!ads || ads.length === 0) {
    return (
      <div className="relative w-full h-[85vh] overflow-hidden rounded-2xl bg-gradient-to-br from-luxury-dark/80 to-luxury-darker/80 backdrop-blur-xl flex items-center justify-center">
        <p className="text-luxury-neutral">No profiles available at this time</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative w-full ${isFullscreen ? 'h-screen fixed inset-0 z-50' : 'h-[85vh]'} 
        overflow-hidden rounded-2xl bg-gradient-to-br from-luxury-dark/80 to-luxury-darker/80 backdrop-blur-xl`}
    >
      <div className="absolute inset-0 bg-neon-glow opacity-10"></div>
      
      <div 
        ref={containerRef}
        className="relative h-full flex items-center"
        onMouseEnter={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
        onMouseMove={handleMouseMove}
      >
        <CarouselContainer 
          ads={ads} 
          currentIndex={currentIndex} 
          isActive={isActive} 
        />

        {showControls && (
          <>
            <CarouselNavigation 
              onPrev={handlePrev} 
              onNext={handleNext} 
              hasPrev={currentIndex > 0} 
              hasNext={currentIndex < ads.length - 1} 
            />

            <CarouselProgressIndicator 
              totalSlides={ads.length} 
              currentIndex={currentIndex} 
              onSlideChange={handleGoToSlide} 
            />
            
            {/* Fullscreen toggle button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-luxury-dark/50 backdrop-blur-md border border-luxury-primary/20 text-luxury-primary hover:text-white transition-colors"
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </motion.button>
          </>
        )}

        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute bottom-4 left-4 z-20 pointer-events-auto">
            <VideoControls 
              isHovered={showControls}
              isPlaying={isPlaying}
              isMuted={isMuted}
              togglePlay={togglePlay}
              toggleMute={toggleMute}
            />
          </div>
        </div>

        {/* Video in background - hidden but handles actual playback */}
        <div className="absolute inset-0 opacity-0 pointer-events-none">
          {ads[currentIndex]?.video_url && (
            <UniversalMedia
              item={{
                video_url: ads[currentIndex].video_url,
                media_type: MediaType.VIDEO
              }}
              autoPlay={isPlaying}
              muted={isMuted}
              controls={false}
              loop={true}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};
