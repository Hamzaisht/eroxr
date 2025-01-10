import { useState } from 'react';
import { motion } from 'framer-motion';
import { DatingAd } from './types/dating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Crown, CheckCircle2, Heart, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoProfileCardProps {
  ad: DatingAd;
  isActive: boolean;
}

export const VideoProfileCard = ({ ad, isActive }: VideoProfileCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

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
      {/* Placeholder for video - you'll need to implement actual video playback */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-luxury-dark/90" />
      
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