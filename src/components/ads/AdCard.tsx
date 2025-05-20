
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  MessageCircle, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Crown,
  Heart,
  User
} from "lucide-react";
import { motion } from "framer-motion";
import type { DatingAd } from "@/types/dating";
import { cn } from "@/lib/utils";
import { formatAgeRange } from "@/utils/dating/ageRangeHelper";

interface AdCardProps {
  ad: DatingAd;
}

export const AdCard = ({ ad }: AdCardProps) => {
  const getAgeRange = () => {
    if (!ad.age_range) return "Not specified";
    return formatAgeRange(ad.age_range);
  };

  const getCompletionColor = () => {
    if (!ad.profile_completion_score) return "bg-gray-200";
    if (ad.profile_completion_score >= 80) return "bg-green-500";
    if (ad.profile_completion_score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Card className="relative overflow-hidden transition-all duration-300 bg-[#1A1F2C]/50 backdrop-blur-sm border-luxury-primary/10 hover:shadow-luxury hover:border-luxury-primary/30">
        <div className="absolute inset-0 bg-neon-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                {ad.title}
                {ad.is_premium && (
                  <Crown className="h-5 w-5 text-yellow-500 animate-pulse" />
                )}
                {ad.is_verified && (
                  <CheckCircle2 className="h-5 w-5 text-luxury-primary" />
                )}
              </h3>
              <div className="flex items-center gap-2 text-sm text-luxury-neutral">
                <MapPin className="h-4 w-4 text-luxury-primary" />
                <span>{ad.city}, {ad.country}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className={cn(
                "w-3 h-3 rounded-full animate-pulse",
                ad.last_active ? "bg-green-500" : "bg-gray-500"
              )} />
              <div 
                className={cn(
                  "h-1.5 w-16 rounded-full transition-all duration-300",
                  getCompletionColor()
                )}
                title={`Profile completion: ${ad.profile_completion_score}%`}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-luxury-primary/10 text-luxury-primary">
                {ad.relationship_status}
              </Badge>
              <Badge variant="secondary" className="bg-luxury-primary/10 text-luxury-primary">
                {getAgeRange()} years
              </Badge>
              {ad.body_type && (
                <Badge variant="secondary" className="bg-luxury-primary/10 text-luxury-primary">
                  {ad.body_type}
                </Badge>
              )}
            </div>

            <p className="text-sm text-luxury-neutral line-clamp-2">
              {ad.description}
            </p>

            {ad.interests && ad.interests.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {ad.interests.slice(0, 3).map((interest, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="text-xs bg-luxury-primary/5 border-luxury-primary/20 text-luxury-neutral"
                  >
                    {interest}
                  </Badge>
                ))}
                {ad.interests.length > 3 && (
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-luxury-primary/5 border-luxury-primary/20 text-luxury-neutral"
                  >
                    +{ad.interests.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-luxury-primary/10">
            <div className="text-xs text-luxury-neutral flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(ad.created_at || ''), { addSuffix: true })}
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
        </div>
      </Card>
    </motion.div>
  );
};
