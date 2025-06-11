
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Calendar, Users, Heart } from "lucide-react";
import { ProfileHeaderActions } from "../header/ProfileHeaderActions";
import { formatDistanceToNow } from "date-fns";

interface ProfileHeaderProps {
  profile: any;
  isOwnProfile: boolean;
  onMediaSuccess: (type: 'avatar' | 'banner', newUrl: string) => void;
  onEditClick: () => void;
}

export const ProfileHeader = ({ 
  profile, 
  isOwnProfile, 
  onMediaSuccess, 
  onEditClick 
}: ProfileHeaderProps) => {
  return (
    <div className="relative">
      {/* Banner Section */}
      <div className="relative h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-luxury-primary/20 to-luxury-accent/20 overflow-hidden">
        {profile.banner_url ? (
          <img 
            src={profile.banner_url} 
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-luxury-primary/10 to-luxury-accent/10 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-luxury-primary/20 rounded-full flex items-center justify-center">
                <Users className="w-12 h-12 text-luxury-primary" />
              </div>
              <p className="text-luxury-muted">Add a banner to personalize your profile</p>
            </div>
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/60 via-transparent to-transparent" />
      </div>

      {/* Profile Info Section */}
      <div className="relative -mt-20 px-6 pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative"
          >
            <div className="w-32 h-32 p-1 bg-gradient-to-br from-luxury-primary to-luxury-accent rounded-full">
              <Avatar className="w-full h-full border-4 border-luxury-dark">
                <AvatarImage 
                  src={profile.avatar_url || undefined} 
                  alt={profile.username || 'Profile'} 
                />
                <AvatarFallback className="bg-luxury-primary/20 text-luxury-primary text-3xl font-bold">
                  {(profile.username || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </motion.div>

          {/* Profile Details */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-3"
            >
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-luxury-neutral mb-2">
                  {profile.username || 'Anonymous User'}
                </h1>
                {profile.bio && (
                  <p className="text-luxury-muted text-lg max-w-2xl leading-relaxed">
                    {profile.bio}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-luxury-muted">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 pt-2">
                <div className="text-center">
                  <div className="text-xl font-bold text-luxury-neutral">0</div>
                  <div className="text-sm text-luxury-muted">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-luxury-neutral">0</div>
                  <div className="text-sm text-luxury-muted">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-luxury-neutral">0</div>
                  <div className="text-sm text-luxury-muted">Following</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Actions */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="shrink-0"
          >
            <ProfileHeaderActions
              profile={profile}
              isOwnProfile={isOwnProfile}
              onEdit={onEditClick}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
