
import { useState, useEffect } from "react";
import { DatingAd } from "../ads/types/dating";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";
import { calculateMatchPercentage } from "./utils/matchCalculator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface SimilarProfilesProps {
  currentAd: DatingAd;
  allAds: DatingAd[];
  onSelectProfile: (ad: DatingAd) => void;
  maxItems?: number;
}

export const SimilarProfiles = ({ 
  currentAd, 
  allAds, 
  onSelectProfile,
  maxItems = 6
}: SimilarProfilesProps) => {
  const [similarProfiles, setSimilarProfiles] = useState<DatingAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!currentAd || !allAds.length) {
      setIsLoading(false);
      return;
    }
    
    // Find similar profiles based on shared attributes
    const findSimilarProfiles = () => {
      setIsLoading(true);
      
      // Calculate similarity scores
      const profilesToCompare = allAds
        .filter(ad => ad.id !== currentAd.id) // Exclude current profile
        .map(ad => {
          let score = 0;
          
          // Match by relationship status
          if (ad.relationship_status === currentAd.relationship_status) {
            score += 2;
          }
          
          // Match by looking for the same thing
          const sharedLookingFor = ad.looking_for.filter(item => 
            currentAd.looking_for.includes(item)
          );
          score += sharedLookingFor.length * 2;
          
          // Match by country/city
          if (ad.country === currentAd.country) {
            score += 1;
            if (ad.city === currentAd.city) {
              score += 2;
            }
          }
          
          // Match by interests
          if (ad.interests && currentAd.interests) {
            const sharedInterests = ad.interests.filter(interest => 
              currentAd.interests?.includes(interest)
            );
            score += sharedInterests.length;
          }
          
          // Calculate match percentage
          const matchPercentage = calculateMatchPercentage(currentAd, ad);
          
          return {
            ad,
            score,
            matchPercentage
          };
        })
        .sort((a, b) => b.score - a.score || b.matchPercentage - a.matchPercentage)
        .slice(0, maxItems)
        .map(item => item.ad);
        
      setSimilarProfiles(profilesToCompare);
      setIsLoading(false);
    };
    
    // Run with a small delay to not block rendering
    const timer = setTimeout(findSimilarProfiles, 100);
    
    return () => clearTimeout(timer);
  }, [currentAd, allAds, maxItems]);
  
  if (!currentAd || similarProfiles.length === 0) {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="my-8"
    >
      <h3 className="text-lg font-medium text-white mb-4">Similar Profiles</h3>
      
      {isLoading ? (
        <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-32">
              <Skeleton className="w-32 h-32 rounded-lg bg-luxury-primary/5" />
              <Skeleton className="w-3/4 h-4 mt-2 bg-luxury-primary/5" />
              <Skeleton className="w-1/2 h-3 mt-1 bg-luxury-primary/5" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
          {similarProfiles.map(profile => (
            <motion.div
              key={profile.id}
              className="flex-shrink-0 w-32 cursor-pointer group"
              whileHover={{ scale: 1.05 }}
              onClick={() => onSelectProfile(profile)}
            >
              <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-luxury-darker">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage 
                    src={profile.avatar_url || undefined} 
                    alt={profile.title}
                    className="object-cover w-full h-full"
                  />
                  <AvatarFallback className="w-full h-full text-2xl bg-luxury-primary/10">
                    {profile.title?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-white text-xs p-1 h-auto"
                  >
                    View Profile <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
                
                {/* Match indicator */}
                <div className="absolute bottom-2 right-2 bg-luxury-primary/90 text-white text-xs px-1.5 py-0.5 rounded">
                  {calculateMatchPercentage(currentAd, profile)}%
                </div>
              </div>
              
              <h4 className="mt-2 text-sm text-white truncate">{profile.title}</h4>
              <p className="text-xs text-luxury-neutral truncate">
                {profile.city}, {profile.relationship_status}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
