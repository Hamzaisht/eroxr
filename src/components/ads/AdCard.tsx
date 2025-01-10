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
  Heart
} from "lucide-react";
import { motion } from "framer-motion";
import type { DatingAd } from "./types/dating";
import { cn } from "@/lib/utils";

interface AdCardProps {
  ad: DatingAd;
}

export const AdCard = ({ ad }: AdCardProps) => {
  const getAgeRange = () => {
    return `${ad.age_range.lower}-${ad.age_range.upper}`;
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
    >
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-[#1A1F2C]/50 backdrop-blur-sm border-luxury-primary/10">
        <div className="p-4 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                {ad.title}
                {ad.is_premium && (
                  <Crown className="h-4 w-4 text-yellow-500" />
                )}
                {ad.is_verified && (
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                )}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>{ad.city}, {ad.country}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                ad.last_active ? "bg-green-500" : "bg-gray-500"
              )} />
              <div 
                className={cn(
                  "h-1.5 w-12 rounded-full",
                  getCompletionColor()
                )}
                title={`Profile completion: ${ad.profile_completion_score}%`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-luxury-primary/10">
                {ad.relationship_status}
              </Badge>
              <Badge variant="secondary" className="bg-luxury-primary/10">
                {getAgeRange()} years
              </Badge>
              {ad.body_type && (
                <Badge variant="secondary" className="bg-luxury-primary/10">
                  {ad.body_type}
                </Badge>
              )}
            </div>

            <p className="text-sm text-gray-300 line-clamp-2">
              {ad.description}
            </p>

            {ad.interests && ad.interests.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {ad.interests.slice(0, 3).map((interest, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="text-xs bg-luxury-primary/5"
                  >
                    {interest}
                  </Badge>
                ))}
                {ad.interests.length > 3 && (
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-luxury-primary/5"
                  >
                    +{ad.interests.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(ad.created_at || ''), { addSuffix: true })}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-luxury-primary hover:text-luxury-primary/80"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button 
                variant="default"
                size="sm"
                className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] hover:from-[#7E69AB] hover:to-[#9b87f5]"
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