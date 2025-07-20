import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Eye, Heart, DollarSign, Users, Play } from "lucide-react";

interface Creator {
  id: string;
  name: string;
  avatar: string;
  followers: number;
  monthlyEarnings: number;
  totalLikes: number;
  isLive: boolean;
  preview: string;
  bio: string;
  verified: boolean;
}

interface CreatorMiniProfileProps {
  creator: Creator;
  delay?: number;
}

export const CreatorMiniProfile = ({ creator, delay = 0 }: CreatorMiniProfileProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Base Card */}
      <div className="relative w-64 h-80 rounded-xl overflow-hidden bg-gradient-to-br from-background/50 to-background/80 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-all duration-300">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={creator.preview}
            alt={creator.name}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        {/* Live Indicator */}
        {creator.isLive && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-destructive px-2 py-1 rounded-full text-xs font-medium">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            LIVE
          </div>
        )}

        {/* Quick Stats */}
        <div className="absolute top-3 right-3 flex gap-1">
          <div className="bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {creator.followers > 1000 ? `${(creator.followers / 1000).toFixed(1)}K` : creator.followers}
          </div>
        </div>

        {/* Creator Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-start gap-3">
            <div className="relative">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-12 h-12 rounded-full border-2 border-primary/30"
              />
              {creator.verified && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{creator.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{creator.bio}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {creator.totalLikes > 1000 ? `${(creator.totalLikes / 1000).toFixed(1)}K` : creator.totalLikes}
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                {creator.monthlyEarnings > 1000 ? `$${(creator.monthlyEarnings / 1000).toFixed(1)}K` : `$${creator.monthlyEarnings}`}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-medium transition-colors"
            >
              View Page
            </motion.button>
          </div>
        </div>
      </div>

      {/* Expanded Hover Card */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-80 z-10"
          >
            <div className="bg-background/95 backdrop-blur-xl border border-primary/30 rounded-xl p-4 shadow-2xl">
              {/* Enhanced Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground">{creator.followers.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-accent">${creator.monthlyEarnings.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Monthly</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{creator.totalLikes.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Likes</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Follow
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Preview
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};