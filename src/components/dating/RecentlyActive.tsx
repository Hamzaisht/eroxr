
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { DatingAd } from "@/components/ads/types/dating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { differenceInMinutes, formatDistanceToNow } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RecentlyActiveProps {
  ads: DatingAd[];
  onSelectProfile: (ad: DatingAd) => void;
}

export const RecentlyActive = ({ ads, onSelectProfile }: RecentlyActiveProps) => {
  const [recentUsers, setRecentUsers] = useState<DatingAd[]>([]);
  
  useEffect(() => {
    // Filter for users active in the last 24 hours
    const activeUsers = ads
      .filter(ad => ad.last_active && differenceInMinutes(new Date(), new Date(ad.last_active)) < 1440)
      .sort((a, b) => {
        const dateA = a.last_active ? new Date(a.last_active).getTime() : 0;
        const dateB = b.last_active ? new Date(b.last_active).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 10);
      
    setRecentUsers(activeUsers);
  }, [ads]);
  
  if (recentUsers.length === 0) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <h3 className="text-lg font-medium text-luxury-primary mb-4">Recently Active</h3>
      <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar">
        {recentUsers.map(user => (
          <TooltipProvider key={user.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative cursor-pointer flex-shrink-0"
                  onClick={() => onSelectProfile(user)}
                >
                  <Avatar className="h-16 w-16 border-2 border-luxury-primary">
                    <AvatarImage src={user.avatar_url || undefined} alt={user.title} />
                    <AvatarFallback>
                      {user.title?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-luxury-dark animate-pulse" />
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-luxury-dark border-luxury-primary/30">
                <div className="text-center">
                  <p className="font-semibold text-white">{user.title}</p>
                  <p className="text-xs text-luxury-neutral">
                    {user.last_active ? (
                      `Active ${formatDistanceToNow(new Date(user.last_active), { addSuffix: true })}`
                    ) : "Recently active"}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </motion.div>
  );
};
