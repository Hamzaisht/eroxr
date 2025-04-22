
import { useState } from 'react';
import { motion } from 'framer-motion';
import { DatingAd } from '../../../types/dating';
import { AdActions } from './AdActions';
import { UserInfo } from './UserInfo';
import { AdStats } from './AdStats';
import { AdTags } from './AdTags';
import { VideoThumbnail } from '../VideoThumbnail';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Crown, Shield, MessageCircle } from 'lucide-react';
import { calculateMatchPercentage, getMatchLabel } from '@/components/dating/utils/matchCalculator';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useRef } from 'react';

interface AdCardProps {
  ad: DatingAd;
  onSelect: (ad: DatingAd) => void;
  isMobile: boolean;
  userProfile?: DatingAd | null;
}

export const AdCard = ({ ad, onSelect, isMobile, userProfile }: AdCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const session = useSession();
  const [isViewTracked, setIsViewTracked] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Calculate match percentage
  const matchPercentage = calculateMatchPercentage(userProfile || null, ad);
  const matchInfo = getMatchLabel(matchPercentage);
  const isHighMatch = matchPercentage > 85;

  // Track view when card becomes visible
  useEffect(() => {
    if (isViewTracked || !session) return;
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Track view in database
        (async () => {
          try {
            await supabase.from('dating_ads').update({ 
              view_count: (ad.view_count || 0) + 1 
            }).eq('id', ad.id);
            setIsViewTracked(true);
          } catch (error) {
            console.error('Error tracking view:', error);
          }
        })();
        
        // Disconnect after tracking
        observer.disconnect();
      }
    }, { threshold: 0.6 });
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [ad.id, isViewTracked, session, ad.view_count]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative overflow-hidden rounded-xl",
        "bg-luxury-dark/40 backdrop-blur-sm",
        "border border-luxury-primary/10",
        "transition-all duration-300",
        "hover:border-luxury-primary/30",
        "hover:shadow-[0_0_20px_rgba(155,135,245,0.15)]"
      )}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onClick={() => onSelect(ad)}
    >
      <div className="relative aspect-video">
        <VideoThumbnail 
          videoUrl={ad.video_url} 
          isHovered={isHovered}
          isMobile={isMobile}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Premium badge */}
        {ad.is_premium && (
          <div className="absolute top-2 left-2 z-20">
            <Badge className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white border-0 flex items-center gap-1 px-2 py-1 shadow-glow">
              <Crown className="h-3 w-3" />
              <span className="text-xs">Premium</span>
            </Badge>
          </div>
        )}
        
        {/* Verified badge */}
        {ad.is_verified && (
          <div className="absolute top-2 right-2 z-20">
            <Badge className="bg-gradient-to-r from-luxury-primary to-luxury-secondary text-white border-0 flex items-center gap-1 px-2 py-1">
              <Shield className="h-3 w-3" />
              <span className="text-xs">Verified</span>
            </Badge>
          </div>
        )}
        
        {/* Match percentage */}
        <div className="absolute bottom-2 left-2 z-20">
          <Badge className={cn(
            "border-0 flex items-center gap-1 px-2 py-1",
            isHighMatch 
              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white" 
              : `bg-gradient-to-r from-blue-500 to-indigo-600 text-white ${isHighMatch ? 'animate-pulse' : ''}`
          )}>
            <span className="text-xs font-medium">{matchPercentage}% {isHighMatch ? 'Perfect Match' : 'Match'}</span>
          </Badge>
        </div>

        <AdActions ad={ad} />
      </div>

      <div className="p-4 space-y-3">
        <UserInfo ad={ad} />
        <AdStats ad={ad} />
        <AdTags ad={ad} />
        
        {/* Last active indicator */}
        {ad.last_active && (
          <div className="flex items-center gap-1.5 text-xs text-luxury-neutral mt-1">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>Active recently</span>
          </div>
        )}
        
        {/* Quick message button that appears on hover */}
        <motion.div 
          className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black to-transparent p-4 pt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
        >
          <button 
            className="w-full py-2 rounded-lg bg-luxury-primary/90 hover:bg-luxury-primary text-white flex items-center justify-center gap-2 text-sm transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Message functionality would go here
            }}
          >
            <MessageCircle className="h-4 w-4" />
            Quick Message
          </button>
        </motion.div>
      </div>

      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-luxury-dark to-transparent opacity-0",
        "group-hover:opacity-100 transition-opacity duration-300"
      )} />
      
      {/* Pulsing animation on hover */}
      <div className={cn(
        "absolute inset-0 bg-luxury-primary/5 opacity-0 rounded-xl",
        "group-hover:opacity-100 group-hover:animate-pulse"
      )} />
    </motion.div>
  );
};
