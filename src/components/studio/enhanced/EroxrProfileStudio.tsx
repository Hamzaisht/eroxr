
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, User, Settings, Palette, Crown, Sparkles, Star, Zap } from 'lucide-react';
import { MediaUploader } from '../MediaUploader';
import { ProfileEditor } from '../ProfileEditor';
import { useStudioProfile } from '@/hooks/useStudioProfile';
import type { StudioProfile } from '../types';

interface EroxrProfileStudioProps {
  profileId: string;
  onClose: () => void;
}

export const EroxrProfileStudio = ({ profileId, onClose }: EroxrProfileStudioProps) => {
  const { profile, isLoading, updateProfile, isUpdating } = useStudioProfile(profileId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <Crown className="w-16 h-16 mx-auto text-luxury-muted mb-4" />
        <p className="text-luxury-muted text-xl">Divine profile not found</p>
      </div>
    );
  }

  const handleMediaUploadSuccess = (url: string, type: 'avatar' | 'banner') => {
    // Upload already updates profile via RPC, just need to refresh
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-6xl mx-auto bg-gradient-to-br from-luxury-dark/95 to-luxury-darker/95 backdrop-blur-xl border border-yellow-400/30 rounded-3xl overflow-hidden relative"
    >
      {/* Greek Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><path d=\"M50 0L60 40L100 50L60 60L50 100L40 60L0 50L40 40Z\" fill=\"%23D4AF37\"/></svg>')] bg-repeat bg-[length:40px_40px]" />
      </div>

      {/* Divine Header */}
      <div className="relative h-56 bg-gradient-to-r from-yellow-400/20 via-luxury-primary/20 to-yellow-600/20 overflow-hidden">
        {profile.banner_url && (
          <div className="absolute inset-0">
            {profile.banner_url.includes('.mp4') || profile.banner_url.includes('.webm') ? (
              <video
                src={profile.banner_url}
                className="w-full h-full object-cover opacity-60"
                muted
                loop
                autoPlay
              />
            ) : (
              <img
                src={profile.banner_url}
                alt="Divine banner"
                className="w-full h-full object-cover opacity-60"
              />
            )}
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
        
        {/* Sparkling Effects */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              style={{
                left: `${15 + (i * 10)}%`,
                top: `${20 + (i % 2) * 30}%`,
              }}
              animate={{
                scale: [0.5, 1.5, 0.5],
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: 3 + (i * 0.2),
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        
        <div className="absolute bottom-6 left-8 flex items-end gap-6 z-10">
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-yellow-400/60 bg-luxury-darker shadow-2xl">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Divine avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-luxury-primary/30 to-yellow-500/30 flex items-center justify-center">
                  <Crown className="w-10 h-10 text-yellow-400" />
                </div>
              )}
            </div>
          </div>
          
          <div className="text-white">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              {profile.username || 'Divine Creator'}
            </h1>
            <p className="text-white/80 text-lg">{profile.location || 'Mount Olympus'}</p>
          </div>
        </div>
      </div>

      {/* Studio Content */}
      <div className="p-8 relative z-10">
        <Tabs defaultValue="media" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-2xl grid-cols-3 bg-luxury-darker/50 backdrop-blur-xl rounded-2xl p-2 border border-yellow-400/20">
              <TabsTrigger 
                value="media" 
                className="flex items-center gap-2 rounded-xl py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400/20 data-[state=active]:to-luxury-primary/20 data-[state=active]:text-yellow-400"
              >
                <Camera className="w-4 h-4" />
                Divine Media
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="flex items-center gap-2 rounded-xl py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400/20 data-[state=active]:to-luxury-primary/20 data-[state=active]:text-yellow-400"
              >
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="flex items-center gap-2 rounded-xl py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400/20 data-[state=active]:to-luxury-primary/20 data-[state=active]:text-yellow-400"
              >
                <Settings className="w-4 h-4" />
                Divine Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-8">
            <TabsContent value="media" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12"
              >
                {/* Avatar Section */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Crown className="w-6 h-6 text-yellow-400" />
                      <h3 className="text-2xl font-bold text-luxury-neutral">Divine Avatar</h3>
                    </div>
                    <p className="text-luxury-muted">
                      Your celestial representation across the realm
                    </p>
                  </motion.div>
                  
                  <div className="flex justify-center">
                    <MediaUploader
                      type="avatar"
                      userId={profileId}
                      currentUrl={profile.avatar_url}
                      onUploadSuccess={(url) => handleMediaUploadSuccess(url, 'avatar')}
                      className="relative"
                    />
                  </div>
                </div>

                {/* Banner Section */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Sparkles className="w-6 h-6 text-yellow-400" />
                      <h3 className="text-2xl font-bold text-luxury-neutral">Divine Banner</h3>
                    </div>
                    <p className="text-luxury-muted">
                      Showcase your divine essence with a celestial backdrop
                    </p>
                  </motion.div>
                  
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
                className="text-center py-16"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl"
                >
                  <Zap className="w-12 h-12 text-white" />
                </motion.div>
                
                <h3 className="text-3xl font-bold text-luxury-neutral mb-4">
                  Divine Settings Coming Soon
                </h3>
                <p className="text-luxury-muted text-lg max-w-md mx-auto">
                  Advanced divine powers and celestial controls will be available here
                </p>
              </motion.div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </motion.div>
  );
};
