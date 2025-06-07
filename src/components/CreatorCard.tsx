
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Users, CheckCircle, User } from 'lucide-react';

interface CreatorCardProps {
  creatorId: string;
  username: string;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  bio?: string | null;
  subscriberCount?: number;
  isVerified?: boolean;
  location?: string;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({
  creatorId,
  username,
  avatarUrl,
  bannerUrl,
  bio,
  subscriberCount = 0,
  isVerified = false,
  location
}) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/profile/${username}`);
  };

  const formatSubscriberCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Card className="bg-luxury-card border-luxury-primary/10 hover:border-luxury-primary/30 transition-all duration-300 overflow-hidden h-full">
        {/* Banner */}
        <div className="relative h-32 bg-gradient-to-br from-luxury-primary/20 via-luxury-accent/20 to-luxury-secondary/20">
          {bannerUrl ? (
            <img
              src={bannerUrl}
              alt={`${username}'s banner`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-luxury-primary/30 via-luxury-accent/30 to-luxury-secondary/30" />
          )}
          
          {/* Avatar positioned over banner */}
          <div className="absolute -bottom-8 left-4">
            <Avatar className="w-16 h-16 border-4 border-luxury-card shadow-lg">
              <AvatarImage src={avatarUrl || undefined} alt={username} />
              <AvatarFallback className="bg-gradient-to-br from-luxury-primary to-luxury-accent text-white font-bold text-lg">
                {username ? username.slice(0, 2).toUpperCase() : <User className="h-6 w-6" />}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <CardContent className="pt-12 pb-4 px-4">
          {/* Username and verification */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-white text-lg truncate">
              @{username}
            </h3>
            {isVerified && (
              <CheckCircle className="h-5 w-5 text-luxury-primary flex-shrink-0" />
            )}
          </div>

          {/* Bio */}
          {bio && (
            <p className="text-luxury-muted text-sm mb-3 line-clamp-2">
              {bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-1 text-luxury-muted">
              <Users className="h-4 w-4" />
              <span>{formatSubscriberCount(subscriberCount)} followers</span>
            </div>
            
            {location && (
              <div className="flex items-center gap-1 text-luxury-muted">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{location}</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button
            onClick={handleViewProfile}
            className="w-full bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary transition-all duration-300 text-white font-medium"
            size="sm"
          >
            View Profile
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
