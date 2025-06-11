
import { useState } from "react";
import { motion } from "framer-motion";
import { Edit3, MapPin, Calendar, Shield, Crown, DollarSign, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileAvatarImage } from "../avatar/AvatarImage";
import { StudioEditDialog } from "../StudioEditDialog";
import { useToast } from "@/hooks/use-toast";

interface ProfileHeaderProps {
  profile: any;
  isOwnProfile: boolean;
  onMediaSuccess: (type: 'avatar' | 'banner', newUrl: string) => void;
  onEditClick: () => void;
}

export const ProfileHeader = ({ profile, isOwnProfile, onMediaSuccess, onEditClick }: ProfileHeaderProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleTip = () => {
    toast({
      title: "Tip Feature",
      description: "Tip functionality will be implemented soon!",
    });
  };

  const handleSubscribe = () => {
    toast({
      title: "Subscribe Feature", 
      description: "Subscription functionality will be implemented soon!",
    });
  };

  const handleEditSuccess = async () => {
    await onMediaSuccess('avatar', ''); // Trigger refresh
    setEditDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  // Check if banner URL is a video
  const isVideoUrl = (url: string) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.mov'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  return (
    <>
      <div className="relative">
        {/* Banner Section with Video Support */}
        <div className="relative h-80 bg-gradient-to-br from-luxury-primary/20 via-luxury-accent/10 to-luxury-dark overflow-hidden rounded-b-3xl">
          {profile.banner_url ? (
            isVideoUrl(profile.banner_url) ? (
              <video
                src={profile.banner_url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.9)' }}
              />
            ) : (
              <img 
                src={profile.banner_url} 
                alt="Profile banner"
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.9)' }}
              />
            )
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-luxury-primary/30 via-luxury-accent/20 to-luxury-dark" />
          )}
          
          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/90 via-luxury-dark/30 to-transparent" />
          
          {/* Subtle animated overlay for videos */}
          {profile.banner_url && isVideoUrl(profile.banner_url) && (
            <div className="absolute inset-0 bg-gradient-to-r from-luxury-primary/5 via-transparent to-luxury-accent/5 animate-pulse" />
          )}
        </div>

        {/* Profile Info Section */}
        <div className="relative px-8 pb-8">
          {/* Enhanced Avatar with Shadow */}
          <div className="absolute -top-24 left-8">
            <div className="relative">
              <ProfileAvatarImage
                src={profile.avatar_url}
                username={profile.username}
              />
              {/* Avatar glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-luxury-primary/20 to-luxury-accent/20 blur-xl -z-10 scale-110" />
            </div>
          </div>

          {/* Action Buttons - Enhanced Design */}
          <div className="absolute -top-16 right-8 flex items-center gap-3">
            {!isOwnProfile ? (
              <>
                {/* Enhanced Subscribe Button */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleSubscribe}
                    className="bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-primary/90 hover:to-luxury-accent/90 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl backdrop-blur-sm"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Subscribe
                  </Button>
                </motion.div>

                {/* Enhanced Tip Button */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleTip}
                    variant="outline"
                    className="border-luxury-primary/40 bg-luxury-dark/60 text-luxury-primary hover:bg-luxury-primary/10 px-8 py-3 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-xl shadow-lg hover:shadow-xl"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Tip
                  </Button>
                </motion.div>
              </>
            ) : (
              /* Enhanced Edit Button for Own Profile */
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => setEditDialogOpen(true)}
                  className="bg-gradient-to-r from-luxury-primary/90 to-luxury-accent/90 hover:from-luxury-primary hover:to-luxury-accent text-white border border-luxury-primary/30 hover:border-luxury-primary/50 px-8 py-3 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-xl shadow-xl hover:shadow-2xl"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </motion.div>
            )}
          </div>

          {/* Profile Details with Enhanced Spacing */}
          <div className="pt-32 space-y-8">
            {/* Name and Verification with Better Visual Hierarchy */}
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-5xl font-bold text-luxury-neutral tracking-tight">
                {profile.username || 'Anonymous User'}
              </h1>
              <div className="flex items-center gap-2">
                {profile.is_verified && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <Shield className="h-7 w-7 text-luxury-primary drop-shadow-lg" />
                  </motion.div>
                )}
                {profile.is_paying_customer && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <Crown className="h-7 w-7 text-yellow-500 drop-shadow-lg" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Bio with Better Typography */}
            {profile.bio && (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-luxury-muted leading-relaxed max-w-3xl"
              >
                {profile.bio}
              </motion.p>
            )}

            {/* Meta Information with Enhanced Icons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-8 text-luxury-muted"
            >
              {profile.location && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-luxury-primary/20 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-luxury-primary" />
                  </div>
                  <span className="text-lg">{profile.location}</span>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-luxury-accent/20 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-luxury-accent" />
                </div>
                <span className="text-lg">Joined {formatDate(profile.created_at)}</span>
              </div>
            </motion.div>

            {/* Enhanced Stats Row */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-12 pt-6"
            >
              {[
                { label: 'Posts', value: '0' },
                { label: 'Followers', value: '0' },
                { label: 'Following', value: '0' }
              ].map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  whileHover={{ scale: 1.1 }}
                  className="text-center cursor-pointer"
                >
                  <div className="text-3xl font-bold text-luxury-neutral">{stat.value}</div>
                  <div className="text-sm text-luxury-muted uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <StudioEditDialog
        profile={profile}
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSuccess={handleEditSuccess}
      />
    </>
  );
};
