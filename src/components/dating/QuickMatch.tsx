
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DatingAd } from '@/components/ads/types/dating';
import { VideoProfileCard } from '@/components/ads/video-profile-card';
import { Button } from '@/components/ui/button';
import { Shuffle, Heart, X, MessageCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { calculateMatchPercentage } from './utils/matchCalculator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { useMediaQuery } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface QuickMatchProps {
  ads: DatingAd[];
  userProfile: DatingAd | null;
}

export const QuickMatch = ({ ads, userProfile }: QuickMatchProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAd, setCurrentAd] = useState<DatingAd | null>(null);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const { toast } = useToast();
  const session = useSession();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTouchDevice = useMediaQuery('(pointer: coarse)');
  
  // Touch handling for swipe gestures
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Filter ads to only show ones that match user's preferences
  useEffect(() => {
    if (!ads || ads.length === 0) return;
    
    // Get compatible ads based on preferences
    const compatibleAds = filterCompatibleAds(ads, userProfile);
    
    // Shuffle the array for random matching
    const shuffledAds = [...compatibleAds].sort(() => Math.random() - 0.5);
    
    if (shuffledAds.length > 0) {
      setCurrentAd(shuffledAds[currentIndex]);
    }
  }, [ads, currentIndex, userProfile]);
  
  const filterCompatibleAds = (ads: DatingAd[], userProfile: DatingAd | null): DatingAd[] => {
    if (!userProfile) return ads;
    
    return ads.filter(ad => {
      // Don't show user's own profile
      if (ad.user_id === userProfile.user_id) return false;
      
      // Filter based on basic compatibility
      const isCompatible = 
        // Check if relationship preference matches
        (userProfile.looking_for.includes(ad.relationship_status) || 
         userProfile.looking_for.includes('any')) &&
        // Check if age range overlaps
        (ad.age_range.lower <= (userProfile.preferred_age_range?.upper || 80) &&
         ad.age_range.upper >= (userProfile.preferred_age_range?.lower || 18));
         
      return isCompatible;
    });
  };
  
  const handleSwipe = async (liked: boolean) => {
    if (!currentAd || !session || isAnimating) return;
    
    setDirection(liked ? 'right' : 'left');
    setIsAnimating(true);
    
    // Save to favorites if liked
    if (liked) {
      try {
        const { error } = await supabase
          .from('profile_favorites')
          .insert([
            { 
              user_id: session.user.id,
              favorite_profile_id: currentAd.id,
              created_at: new Date().toISOString()
            }
          ]);
        
        if (error) throw error;
        
        toast({
          title: "Added to favorites",
          description: `${currentAd.title} has been added to your favorites`,
        });
      } catch (error) {
        console.error('Error saving favorite:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save to favorites",
        });
      }
    }
    
    // Add current index to history
    setHistory(prev => [...prev, currentIndex]);
    
    // Wait for animation to complete then go to next profile
    setTimeout(() => {
      setDirection(null);
      setIsAnimating(false);
      setCurrentIndex(prevIndex => (prevIndex + 1) % ads.length);
    }, 500);
  };
  
  const handlePrevious = () => {
    if (history.length === 0 || isAnimating) return;
    
    setIsAnimating(true);
    setDirection('left');
    
    // Go back to previous index
    const prevIndex = history[history.length - 1];
    
    // Remove the last item from history
    setHistory(prev => prev.slice(0, -1));
    
    // Wait for animation to complete then go to previous profile
    setTimeout(() => {
      setDirection(null);
      setIsAnimating(false);
      setCurrentIndex(prevIndex);
    }, 500);
  };
  
  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    
    if (distance > minSwipeDistance) {
      // Swiped left
      handleSwipe(false);
    } else if (distance < -minSwipeDistance) {
      // Swiped right
      handleSwipe(true);
    }
  };
  
  const handleMessage = () => {
    if (!currentAd || !session) return;
    
    toast({
      title: "Message sent",
      description: `You've started a conversation with ${currentAd.title}`,
      duration: 2000,
    });
  };
  
  if (!currentAd) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-96 bg-black/20 rounded-xl">
        <Shuffle className="h-12 w-12 text-luxury-primary/40 mb-4" />
        <h3 className="text-xl font-bold text-luxury-primary mb-2">No Matches Available</h3>
        <p className="text-luxury-neutral/60 max-w-md text-center">
          We couldn't find any profiles matching your preferences right now. Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }
  
  const matchPercentage = calculateMatchPercentage(userProfile, currentAd);
  
  return (
    <div 
      className="relative w-full max-w-lg mx-auto h-[650px] overflow-hidden flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <h2 className="text-xl font-semibold text-luxury-primary mb-4 text-center">Quick Match</h2>
      
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAd.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
              rotate: direction === 'left' ? -10 : direction === 'right' ? 10 : 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <VideoProfileCard ad={currentAd} isActive={true} />
              
              {/* Match percentage badge */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-luxury-primary to-luxury-accent text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-glow z-20">
                {matchPercentage}% Match
              </div>
              
              {/* Swipe instructions for mobile */}
              {isMobile && !isAnimating && (
                <motion.div 
                  className="absolute inset-x-0 bottom-20 text-center text-white text-sm pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  exit={{ opacity: 0 }}
                >
                  <p>Swipe right to like, left to skip</p>
                  <div className="flex justify-center items-center gap-8 mt-2">
                    <ArrowLeft className="h-4 w-4 text-red-400" />
                    <ArrowRight className="h-4 w-4 text-green-400" />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center justify-center gap-6 py-6">
        {/* Previous button - only show when history exists */}
        {history.length > 0 && (
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={handlePrevious} 
              disabled={isAnimating}
              size="lg"
              variant="outline"
              className={cn(
                "h-12 w-12 rounded-full border-2 border-amber-500 bg-transparent hover:bg-amber-500/10 text-amber-500",
                isMobile ? "hidden" : "flex"
              )}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
        
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button 
            onClick={() => handleSwipe(false)} 
            disabled={isAnimating}
            size="lg"
            variant="outline"
            className="h-16 w-16 rounded-full border-2 border-red-500 bg-transparent hover:bg-red-500/10 text-red-500"
          >
            <X className="h-8 w-8" />
          </Button>
        </motion.div>
        
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button 
            onClick={handleMessage}
            disabled={isAnimating}
            size="lg"
            variant="outline"
            className={cn(
              "h-14 w-14 rounded-full border-2 border-blue-500 bg-transparent hover:bg-blue-500/10 text-blue-500",
              isMobile ? "hidden" : "flex"
            )}
          >
            <MessageCircle className="h-7 w-7" />
          </Button>
        </motion.div>
        
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button 
            onClick={() => handleSwipe(true)}
            disabled={isAnimating}
            size="lg"
            className="h-16 w-16 rounded-full bg-gradient-to-r from-luxury-primary to-luxury-accent hover:opacity-90"
          >
            <Heart className="h-8 w-8" />
          </Button>
        </motion.div>
      </div>
      
      {/* Profile completion progress */}
      {ads.length > 0 && (
        <div className="w-full px-4">
          <div className="w-full bg-luxury-dark/50 h-1 rounded-full overflow-hidden">
            <div 
              className="h-full bg-luxury-primary transition-all duration-300"
              style={{ width: `${(currentIndex / ads.length) * 100}%` }}
            />
          </div>
          <div className="text-center text-xs text-luxury-neutral/60 mt-2">
            Profile {currentIndex + 1} of {ads.length}
          </div>
        </div>
      )}
    </div>
  );
};
