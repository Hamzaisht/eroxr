import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvailabilityIndicator, AvailabilityStatus } from "@/components/ui/availability-indicator";
import { motion } from "framer-motion";
import { Profile } from "@/integrations/supabase/types/profile";

interface UserProfileSectionProps {
  profile: Profile | null;
  isExpanded: boolean;
  onProfileClick: () => void;
  onStatusChange: (status: AvailabilityStatus) => void;
}

export const UserProfileSection = ({ 
  profile, 
  isExpanded, 
  onProfileClick,
  onStatusChange 
}: UserProfileSectionProps) => {
  return (
    <motion.div 
      className="px-4 mb-8 cursor-pointer"
      animate={{ opacity: isExpanded ? 1 : 0.5 }}
      onClick={onProfileClick}
    >
      <div className="relative group">
        <Avatar className="w-12 h-12 ring-2 ring-luxury-primary/20 transition-all duration-200 group-hover:ring-luxury-primary/40">
          <AvatarImage 
            src={profile?.avatar_url} 
            alt={profile?.username || "User"} 
          />
          <AvatarFallback className="bg-luxury-darker text-luxury-primary">
            {profile?.username?.[0]?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1">
          <AvailabilityIndicator 
            status={profile?.status || "offline"}
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(profile?.status === 'online' ? 'offline' : 'online');
            }}
          />
        </div>
      </div>
      
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3"
        >
          <p className="text-sm font-medium text-luxury-neutral">
            {profile?.username || "Guest"}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};