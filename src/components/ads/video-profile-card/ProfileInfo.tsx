
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Shield, Award, Clock, Map, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DatingAd } from '../types/dating';
import { ProfileTags } from './ProfileTags';
import { ProfileQuickPreview } from '../profile-preview/ProfileQuickPreview';

interface ProfileInfoProps {
  ad: DatingAd;
  isPreviewMode?: boolean;
}

export const ProfileInfo = ({ ad, isPreviewMode = false }: ProfileInfoProps) => {
  // Format age range for display
  const ageRangeDisplay = `${ad.age_range.lower}-${ad.age_range.upper}`;
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  
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
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 text-sm text-white/80">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {ad.relationship_status}
            </span>
            {!isPreviewMode && (
              <>
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
              </>
            )}
          </div>
          
          {!isPreviewMode && (
            <p className="text-white/70 line-clamp-2 max-w-2xl">{ad.description}</p>
          )}
          
          {/* Tags - Show fewer tags in preview mode */}
          <ProfileTags ad={ad} maxTags={isPreviewMode ? 3 : undefined} />
        </div>
        
        {/* Profile Image with Quick Preview */}
        {ad.avatar_url && (
          <div className="relative">
            <motion.div 
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(155, 135, 245, 0.5)" }}
              className="w-16 h-16 rounded-full overflow-hidden border-2 border-luxury-primary cursor-pointer"
              onHoverStart={() => setShowProfilePreview(true)}
              onHoverEnd={() => setShowProfilePreview(false)}
            >
              <img 
                src={ad.avatar_url} 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <div className="absolute bottom-full right-0 mb-2">
              <ProfileQuickPreview 
                userId={ad.user_id}
                avatarUrl={ad.avatar_url}
                username={ad.user?.username}
                location={`${ad.city}, ${ad.country}`}
                relationshipStatus={ad.relationship_status}
                isVisible={showProfilePreview}
                onClose={() => setShowProfilePreview(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
