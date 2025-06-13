
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, User, Settings, Palette } from 'lucide-react';
import { MediaUploader } from './MediaUploader';
import { ProfileEditor } from './ProfileEditor';
import { useStudioProfile } from '@/hooks/useStudioProfile';
import type { StudioProfile } from './types';

interface ProfileStudioProps {
  profileId: string;
  onClose: () => void;
}

export const ProfileStudio = ({ profileId, onClose }: ProfileStudioProps) => {
  const { profile, isLoading, updateProfile, isUpdating } = useStudioProfile(profileId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-luxury-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-luxury-muted">Profile not found</p>
      </div>
    );
  }

  const handleMediaUploadSuccess = (url: string, type: 'avatar' | 'banner') => {
    // The upload hook already updates the profile via RPC
    // We just need to invalidate the query to refetch
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-4xl mx-auto bg-gradient-to-br from-luxury-dark/95 to-luxury-darker/95 backdrop-blur-xl border border-luxury-primary/20 rounded-3xl overflow-hidden"
    >
      {/* Header */}
      <div className="relative h-48 bg-gradient-to-r from-luxury-primary/20 to-luxury-accent/20 overflow-hidden">
        {profile.banner_url && (
          <div className="absolute inset-0">
            {profile.banner_url.includes('.mp4') || profile.banner_url.includes('.webm') ? (
              <video
                src={profile.banner_url}
                className="w-full h-full object-cover"
                muted
                loop
                autoPlay
              />
            ) : (
              <img
                src={profile.banner_url}
                alt="Profile banner"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}
        
        <div className="absolute bottom-6 left-6 flex items-end gap-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 bg-luxury-darker">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-luxury-primary/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-luxury-primary" />
                </div>
              )}
            </div>
          </div>
          
          <div className="text-white">
            <h1 className="text-2xl font-bold">{profile.username || 'Unnamed Artist'}</h1>
            <p className="text-white/80">{profile.location || 'Location not set'}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <Tabs defaultValue="media" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-luxury-darker/50 rounded-2xl p-1">
            <TabsTrigger value="media" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-luxury-primary/20">
              <Camera className="w-4 h-4" />
              Media
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-luxury-accent/20">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-yellow-500/20">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="media" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-luxury-neutral flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Profile Avatar
                  </h3>
                  <p className="text-luxury-muted text-sm">
                    Your profile picture represents you across the platform
                  </p>
                  <MediaUploader
                    type="avatar"
                    userId={profileId}
                    currentUrl={profile.avatar_url}
                    onUploadSuccess={(url) => handleMediaUploadSuccess(url, 'avatar')}
                    className="mx-auto"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-luxury-neutral flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Profile Banner
                  </h3>
                  <p className="text-luxury-muted text-sm">
                    Showcase your artistic style with a banner image or video
                  </p>
                  <MediaUploader
                    type="banner"
                    userId={profileId}
                    currentUrl={profile.banner_url}
                    onUploadSuccess={(url) => handleMediaUploadSuccess(url, 'banner')}
                  />
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="profile">
              <ProfileEditor
                profile={profile}
                onUpdate={updateProfile}
                isUpdating={isUpdating}
              />
            </TabsContent>

            <TabsContent value="settings">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <Settings className="w-16 h-16 mx-auto text-luxury-muted mb-4" />
                <h3 className="text-xl font-semibold text-luxury-neutral mb-2">Settings Coming Soon</h3>
                <p className="text-luxury-muted">Advanced profile settings will be available here</p>
              </motion.div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </motion.div>
  );
};
