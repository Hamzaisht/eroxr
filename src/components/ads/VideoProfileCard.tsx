import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DatingAd } from './types/dating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Crown, CheckCircle2, Heart, MapPin, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const getUserTypeLabel = (userType: string) => {
    const types: Record<string, string> = {
      'couple_mf': 'Couple (M+F)',
      'couple_ff': 'Couple (F+F)',
      'couple_mm': 'Couple (M+M)',
      'male': 'Male',
      'female': 'Female',
      'other': 'Other',
      'ota': 'Open to All'
    };
    return types[userType] || userType;
  };

  return (
    <motion.div
      className={cn(
        "relative w-full max-w-3xl h-full rounded-xl overflow-hidden",
        "group cursor-pointer transform-gpu",
        "transition-transform duration-500"
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
    >
      {ad.video_url ? (
        <video
          ref={videoRef}
          src={ad.video_url}
          className="h-full w-full object-cover"
          loop
          muted={isMuted}
          playsInline
        />
      ) : (
        <div className="h-full w-full bg-luxury-dark flex items-center justify-center">
          <p className="text-luxury-neutral">No video available</p>
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-luxury-dark/90" />
      
      <div className="absolute top-4 right-4 flex gap-2">
        {ad.video_url && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="bg-luxury-dark/50 hover:bg-luxury-dark/70"
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-luxury-dark/50 hover:bg-luxury-dark/70"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
          </>
        )}
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {ad.title}
                {ad.is_premium && (
                  <Crown className="h-5 w-5 text-yellow-500 animate-pulse" />
                )}
                {ad.is_verified && (
                  <CheckCircle2 className="h-5 w-5 text-luxury-primary" />
                )}
              </h2>
              <div className="flex items-center gap-2 text-luxury-neutral mt-1">
                <MapPin className="h-4 w-4 text-luxury-primary" />
                <span>{ad.city}, {ad.country}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-luxury-primary/10 text-luxury-primary">
              {getUserTypeLabel(ad.user_type)}
            </Badge>
            <Badge variant="secondary" className="bg-luxury-primary/10 text-luxury-primary">
              {ad.relationship_status}
            </Badge>
            <Badge variant="secondary" className="bg-luxury-primary/10 text-luxury-primary">
              {ad.age_range.lower}-{ad.age_range.upper} years
            </Badge>
            {ad.body_type && (
              <Badge variant="secondary" className="bg-luxury-primary/10 text-luxury-primary">
                {ad.body_type}
              </Badge>
            )}
          </div>

          <p className="text-luxury-neutral line-clamp-2">
            {ad.description}
          </p>

          <div className="flex items-center justify-between pt-4">
            <div className="flex gap-2">
              {ad.interests?.slice(0, 3).map((interest, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="bg-luxury-primary/5 border-luxury-primary/20 text-luxury-neutral"
                >
                  {interest}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-luxury-primary hover:text-luxury-primary/80 hover:bg-luxury-primary/10"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button 
                variant="default"
                size="sm"
                className="bg-gradient-to-r from-luxury-primary to-luxury-secondary hover:from-luxury-secondary hover:to-luxury-primary text-white"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Contact
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};