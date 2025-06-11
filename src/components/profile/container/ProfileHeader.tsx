
import { useState } from "react";
import { motion } from "framer-motion";
import { Edit3, MapPin, Calendar, Shield, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileAvatarImage } from "../avatar/AvatarImage";
import { AvatarUploadModal } from "../avatar/AvatarUploadModal";
import { MediaUploader } from "@/components/upload/MediaUploader";
import { useToast } from "@/hooks/use-toast";

interface ProfileHeaderProps {
  profile: any;
  isOwnProfile: boolean;
  onMediaSuccess: (type: 'avatar' | 'banner', newUrl: string) => void;
  onEditClick: () => void;
}

export const ProfileHeader = ({ profile, isOwnProfile, onMediaSuccess, onEditClick }: ProfileHeaderProps) => {
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const { toast } = useToast();

  console.log('ProfileHeader Debug:', {
    isOwnProfile,
    profileId: profile?.id,
    profileUsername: profile?.username
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Handle avatar upload logic here
    toast({
      title: "Upload started",
      description: "Your avatar is being uploaded...",
    });
  };

  const handleBannerUpload = async (urls: string[]) => {
    if (urls.length > 0) {
      await onMediaSuccess('banner', urls[0]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="relative">
      {/* Banner Section */}
      <div className="relative h-80 bg-gradient-to-br from-luxury-primary/20 via-luxury-accent/10 to-luxury-dark overflow-hidden">
        {profile.banner_url ? (
          <img 
            src={profile.banner_url} 
            alt="Profile banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-luxury-primary/30 via-luxury-accent/20 to-luxury-dark" />
        )}
        
        {/* Banner Upload Overlay for Own Profile */}
        {isOwnProfile && (
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <MediaUploader
              onUploadComplete={handleBannerUpload}
              maxFiles={1}
              acceptedTypes={['image/*']}
              category="banners"
            >
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20 rounded-xl backdrop-blur-sm border border-white/20"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Change Banner
              </Button>
            </MediaUploader>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/80 via-transparent to-transparent" />
      </div>

      {/* Profile Info Section */}
      <div className="relative px-8 pb-8">
        {/* Avatar */}
        <div className="absolute -top-24 left-8">
          <ProfileAvatarImage
            src={profile.avatar_url}
            username={profile.username}
            onImageClick={() => setAvatarModalOpen(true)}
            onFileSelect={isOwnProfile ? handleAvatarUpload : undefined}
          />
        </div>

        {/* Edit Button - Positioned in top right */}
        {isOwnProfile && (
          <div className="absolute -top-16 right-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={onEditClick}
                className="bg-luxury-primary/90 hover:bg-luxury-primary text-white border border-luxury-primary/30 hover:border-luxury-primary/50 px-6 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </motion.div>
          </div>
        )}

        {/* Profile Details */}
        <div className="pt-28 space-y-6">
          {/* Name and Verification */}
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-4xl font-bold text-luxury-neutral">
              {profile.username || 'Anonymous User'}
            </h1>
            {profile.is_verified && (
              <Shield className="h-6 w-6 text-luxury-primary" />
            )}
            {profile.is_paying_customer && (
              <Crown className="h-6 w-6 text-yellow-500" />
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-lg text-luxury-muted leading-relaxed max-w-2xl">
              {profile.bio}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex items-center gap-6 text-luxury-muted">
            {profile.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-luxury-primary" />
                <span>{profile.location}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-luxury-primary" />
              <span>Joined {formatDate(profile.created_at)}</span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-8 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-luxury-neutral">0</div>
              <div className="text-sm text-luxury-muted">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-luxury-neutral">0</div>
              <div className="text-sm text-luxury-muted">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-luxury-neutral">0</div>
              <div className="text-sm text-luxury-muted">Following</div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Upload Modal */}
      <AvatarUploadModal
        isOpen={avatarModalOpen}
        onOpenChange={setAvatarModalOpen}
        isUploading={false}
        onFileChange={handleAvatarUpload}
      />
    </div>
  );
};
