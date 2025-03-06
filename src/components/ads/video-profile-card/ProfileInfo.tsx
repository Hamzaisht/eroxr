
import { motion } from 'framer-motion';
import { Shield, Info, Award, Clock, Map, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ModerationBadge } from '../body-contact/components/ModerationBadge';
import { DatingAd } from '../types/dating';
import { ProfileTags } from './ProfileTags';

interface ProfileInfoProps {
  ad: DatingAd;
}

export const ProfileInfo = ({ ad }: ProfileInfoProps) => {
  // Format age range for display
  const ageRangeDisplay = `${ad.age_range.lower}-${ad.age_range.upper}`;
  
  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-bold text-white">{ad.title}</h2>
            
            {/* Status Badges */}
            <div className="flex gap-1.5">
              {ad.is_verified && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge className="bg-blue-500 text-white flex items-center gap-1">
                        <Shield className="w-3 h-3" /> Verified
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>ID Verified User</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {ad.is_premium && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge className="bg-gradient-to-r from-purple-500 to-purple-700 text-white flex items-center gap-1">
                        <Award className="w-3 h-3" /> Premium
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Premium User</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {/* Moderation Status - Show only for pending ads */}
              {ad.moderation_status === 'pending' && (
                <ModerationBadge status="pending" />
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 text-sm text-white/80">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {ad.relationship_status}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {ageRangeDisplay}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Map className="w-3.5 h-3.5" />
              {ad.city}, {ad.country}
            </span>
          </div>
          
          <p className="text-white/70 line-clamp-2 max-w-2xl">{ad.description}</p>
          
          {/* Tags */}
          <ProfileTags ad={ad} />
        </div>
        
        {/* Profile Image */}
        {ad.avatar_url && (
          <motion.div 
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(155, 135, 245, 0.5)" }}
            className="w-16 h-16 rounded-full overflow-hidden border-2 border-luxury-primary"
          >
            <img 
              src={ad.avatar_url} 
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};
