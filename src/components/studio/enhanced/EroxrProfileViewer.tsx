
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Users, Settings, Crown, Sparkles, Heart, Eye, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStudioProfile } from '@/hooks/useStudioProfile';
import { useAuth } from '@/contexts/AuthContext';
import { ProfilePosts } from '@/components/profile/container/ProfilePosts';
import { ProfileStudioButton } from './ProfileStudioButton';
import { EroxrProfileStats } from './EroxrProfileStats';
import { EroxrSubscriptionTier } from './EroxrSubscriptionTier';
import type { StudioProfile } from '../types';

interface EroxrProfileViewerProps {
  profileId: string;
  onEditClick?: () => void;
}

export const EroxrProfileViewer = ({ profileId, onEditClick }: EroxrProfileViewerProps) => {
  const { profile, isLoading } = useStudioProfile(profileId);
  const { user } = useAuth();
  
  const isOwnProfile = user?.id === profileId;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-luxury-gradient flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-luxury-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-luxury-gradient flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Crown className="w-16 h-16 mx-auto text-luxury-muted mb-4" />
          <h2 className="text-2xl font-bold text-luxury-neutral mb-2">Profile Not Found</h2>
          <p className="text-luxury-muted">This divine creator doesn't exist in our realm</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-gradient relative overflow-hidden">
      {/* Greek Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0 bg-repeat bg-[length:60px_60px]" 
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 0L60 40L100 50L60 60L50 100L40 60L0 50L40 40Z" fill="#D4AF37"/></svg>')}")`
          }}
        />
      </div>

      {/* Divine Banner Section */}
      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          {profile.banner_url ? (
            profile.banner_url.includes('.mp4') || profile.banner_url.includes('.webm') ? (
              <video
                src={profile.banner_url}
                className="w-full h-full object-cover"
                muted
                loop
                autoPlay
                playsInline
              />
            ) : (
              <img
                src={profile.banner_url}
                alt="Divine banner"
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-luxury-primary/30 via-yellow-500/20 to-luxury-accent/30" />
          )}
        </div>
        
        {/* Divine Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Sparkling Effects */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                left: `${20 + (i * 7)}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
              animate={{
                scale: [0.5, 1.2, 0.5],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2 + (i * 0.1),
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Profile Content */}
        <div className="absolute bottom-8 left-8 right-8 z-10">
          <div className="flex items-end gap-8">
            {/* Divine Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative group"
            >
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-yellow-400/60 bg-luxury-darker shadow-2xl relative">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Divine avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-luxury-primary/30 to-yellow-500/30 flex items-center justify-center">
                    <Crown className="w-16 h-16 text-yellow-400" />
                  </div>
                )}
                
                {/* Divine Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              {profile.is_verified && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
                >
                  <Crown className="w-5 h-5 text-white" />
                </motion.div>
              )}
            </motion.div>

            {/* Profile Info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex-1 text-white"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                    {profile.username || 'Divine Creator'}
                  </h1>
                  
                  <div className="flex items-center gap-6 text-white/80 mb-4">
                    {profile.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        <span className="text-lg">{profile.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span className="text-lg">Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {profile.bio && (
                    <p className="text-white/90 text-xl max-w-3xl leading-relaxed font-light">
                      {profile.bio}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  {isOwnProfile ? (
                    <ProfileStudioButton onEditClick={onEditClick} />
                  ) : (
                    <>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-primary/90 hover:to-luxury-accent/90 text-white px-8 py-3 rounded-2xl font-semibold text-lg shadow-luxury">
                          <Heart className="w-5 h-5 mr-2" />
                          Follow
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="outline" 
                          className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 px-8 py-3 rounded-2xl font-semibold text-lg backdrop-blur-sm"
                        >
                          <Zap className="w-5 h-5 mr-2" />
                          Tip
                        </Button>
                      </motion.div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <EroxrProfileStats profileId={profileId} />

      {/* Interests/Skills Section */}
      {profile.interests && profile.interests.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="px-8 py-8 bg-luxury-darker/30 backdrop-blur-xl border-y border-yellow-400/20"
        >
          <div className="max-w-7xl mx-auto">
            <h3 className="text-luxury-neutral font-semibold mb-6 text-xl flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              Divine Skills & Interests
            </h3>
            <div className="flex flex-wrap gap-3">
              {profile.interests.map((interest, index) => (
                <motion.div
                  key={interest}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-yellow-400/10 to-luxury-primary/10 text-yellow-400 border-yellow-400/30 px-4 py-2 text-sm font-medium rounded-xl"
                  >
                    {interest}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Subscription Tier (for non-own profiles) */}
      {!isOwnProfile && <EroxrSubscriptionTier profileId={profileId} />}

      {/* Content Tabs */}
      <div className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="posts" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-luxury-darker/50 backdrop-blur-xl rounded-2xl p-2 border border-yellow-400/20">
                <TabsTrigger 
                  value="posts" 
                  className="flex items-center gap-2 rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400/20 data-[state=active]:to-luxury-primary/20 data-[state=active]:text-yellow-400"
                >
                  <Star className="w-4 h-4" />
                  Divine Creations
                </TabsTrigger>
                <TabsTrigger 
                  value="about" 
                  className="flex items-center gap-2 rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400/20 data-[state=active]:to-luxury-primary/20 data-[state=active]:text-yellow-400"
                >
                  <Crown className="w-4 h-4" />
                  About
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="posts" className="space-y-8">
              <ProfilePosts profileId={profileId} />
            </TabsContent>

            <TabsContent value="about" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-luxury-darker/30 backdrop-blur-xl rounded-3xl p-12 border border-yellow-400/20"
              >
                <div className="text-center">
                  <Crown className="w-16 h-16 mx-auto text-yellow-400 mb-6" />
                  <h3 className="text-3xl font-bold text-luxury-neutral mb-4">About {profile.username}</h3>
                  <p className="text-luxury-muted text-lg max-w-2xl mx-auto leading-relaxed">
                    {profile.bio || "This divine creator hasn't shared their story yet..."}
                  </p>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
