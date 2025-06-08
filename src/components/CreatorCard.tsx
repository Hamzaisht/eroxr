
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
    // Navigate to profile using username, not creatorId
    if (username) {
      navigate(`/profile/${username}`);
    } else {
      console.error('Username is required for navigation');
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
      <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/30 hover:border-blue-500/30 transition-all duration-500 overflow-hidden h-full shadow-2xl hover:shadow-blue-500/10">
        {/* Enhanced Banner */}
        <div className="relative h-36 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 overflow-hidden">
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
            <div className="w-full h-full bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-cyan-500/30" />
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
          
          {/* Avatar positioned over banner */}
          <div className="absolute -bottom-10 left-6">
            <div className="relative">
              {/* Avatar glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-sm opacity-50" />
              <Avatar className="relative w-20 h-20 border-4 border-slate-800/80 shadow-2xl">
                <AvatarImage src={avatarUrl || undefined} alt={username} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xl">
                  {username ? username.slice(0, 2).toUpperCase() : <User className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
              
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-3 border-slate-800 rounded-full animate-pulse" />
            </div>
          </div>
          
          {/* Verification badge */}
          {isVerified && (
            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/90 backdrop-blur-sm rounded-lg">
                <CheckCircle className="h-3 w-3 text-white" />
                <span className="text-xs font-medium text-white">VERIFIED</span>
              </div>
            </div>
          )}
        </div>

        <CardContent className="pt-14 pb-6 px-6">
          {/* Username and verification */}
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-bold text-white text-xl truncate">
              @{username}
            </h3>
            {isVerified && (
              <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
            )}
          </div>

          {/* Bio */}
          {bio && (
            <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
              {bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-6 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <div className="text-white font-semibold">{formatSubscriberCount(subscriberCount)}</div>
                <div className="text-slate-500 text-xs">followers</div>
              </div>
            </div>
            
            {location && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-slate-400 text-xs truncate max-w-20">{location}</div>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button
            onClick={handleViewProfile}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25"
            size="sm"
          >
            View Profile
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
