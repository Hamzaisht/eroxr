
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
    console.log('handleViewProfile called for creatorId:', creatorId);
    // Navigate to profile using creatorId
    if (creatorId) {
      navigate(`/new-profile/${creatorId}`);
    } else {
      console.error('CreatorId is required for navigation');
    }
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
      whileHover={{ scale: 1.02, y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group"
    >
      <Card className="bg-luxury-dark/60 backdrop-blur-xl border border-luxury-primary/20 hover:border-luxury-primary/40 transition-all duration-500 overflow-hidden h-full shadow-luxury hover:shadow-luxury-hover">
        {/* Enhanced Banner */}
        <div className="relative h-36 bg-premium-gradient overflow-hidden">
          {bannerUrl ? (
            <img
              src={bannerUrl}
              alt={`${username}'s banner`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full bg-premium-gradient" />
          )}
          
          {/* Luxury overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/60 to-transparent" />
          
          {/* Avatar positioned over banner */}
          <div className="absolute -bottom-10 left-6">
            <div className="relative">
              {/* Avatar luxury glow */}
              <div className="absolute inset-0 bg-button-gradient rounded-full blur-sm opacity-50" />
              <Avatar className="relative w-20 h-20 border-4 border-luxury-dark/80 shadow-luxury">
                <AvatarImage src={avatarUrl || undefined} alt={username} />
                <AvatarFallback className="bg-button-gradient text-white font-bold text-xl">
                  {username ? username.slice(0, 2).toUpperCase() : <User className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
              
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-luxury-success border-3 border-luxury-dark rounded-full animate-pulse" />
            </div>
          </div>
          
          {/* Verification badge */}
          {isVerified && (
            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-1 px-2 py-1 bg-luxury-primary/90 backdrop-blur-sm rounded-lg">
                <CheckCircle className="h-3 w-3 text-white" />
                <span className="text-xs font-medium text-white">VERIFIED</span>
              </div>
            </div>
          )}
        </div>

        <CardContent className="pt-14 pb-6 px-6">
          {/* Username and verification */}
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-bold text-luxury-neutral text-xl truncate">
              @{username}
            </h3>
            {isVerified && (
              <CheckCircle className="h-5 w-5 text-luxury-primary flex-shrink-0" />
            )}
          </div>

          {/* Bio */}
          {bio && (
            <p className="text-luxury-muted text-sm mb-4 line-clamp-2 leading-relaxed">
              {bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-6 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-luxury-primary/20 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-luxury-primary" />
              </div>
              <div>
                <div className="text-luxury-neutral font-semibold">{formatSubscriberCount(subscriberCount)}</div>
                <div className="text-luxury-muted text-xs">followers</div>
              </div>
            </div>
            
            {location && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-luxury-accent/20 rounded-lg flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-luxury-accent" />
                </div>
                <div>
                  <div className="text-luxury-muted text-xs truncate max-w-20">{location}</div>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button
            onClick={handleViewProfile}
            className="w-full bg-button-gradient hover:bg-hover-gradient text-white font-semibold py-3 rounded-xl shadow-button transition-all duration-300 hover:scale-105 hover:shadow-button-hover"
            size="sm"
          >
            View Profile
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
