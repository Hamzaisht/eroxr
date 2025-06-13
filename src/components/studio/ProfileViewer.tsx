
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStudioProfile } from '@/hooks/useStudioProfile';
import { useAuth } from '@/contexts/AuthContext';
import type { StudioProfile } from './types';

interface ProfileViewerProps {
  profileId: string;
  onEditClick?: () => void;
}

export const ProfileViewer = ({ profileId, onEditClick }: ProfileViewerProps) => {
  const { profile, isLoading } = useStudioProfile(profileId);
  const { user } = useAuth();
  
  const isOwnProfile = user?.id === profileId;

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

  return (
    <div className="min-h-screen bg-luxury-gradient">
      {/* Banner Section */}
      <div className="relative h-80 overflow-hidden">
        {profile.banner_url ? (
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
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-luxury-primary/20 to-luxury-accent/20" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Profile Info Overlay */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-end gap-6">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 bg-luxury-darker shadow-2xl">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-luxury-primary/20 flex items-center justify-center">
                    <Users className="w-12 h-12 text-luxury-primary" />
                  </div>
                )}
              </div>
              {profile.is_verified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </motion.div>

            {/* Profile Details */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex-1 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    {profile.username || 'Unnamed Artist'}
                  </h1>
                  
                  <div className="flex items-center gap-4 text-white/80 mb-4">
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {profile.bio && (
                    <p className="text-white/90 text-lg max-w-2xl leading-relaxed">
                      {profile.bio}
                    </p>
                  )}
                </div>

                {isOwnProfile && onEditClick && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={onEditClick}
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Interests Section */}
      {profile.interests && profile.interests.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="px-8 py-6 bg-luxury-darker/50 backdrop-blur-sm"
        >
          <div className="max-w-6xl mx-auto">
            <h3 className="text-luxury-neutral font-semibold mb-4">Interests & Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
                <motion.div
                  key={interest}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge
                    variant="secondary"
                    className="bg-luxury-primary/10 text-luxury-primary border-luxury-primary/20 px-3 py-1"
                  >
                    {interest}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Content Section */}
      <div className="px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center py-12"
          >
            <h3 className="text-2xl font-semibold text-luxury-neutral mb-4">
              Welcome to {profile.username || 'this artist'}'s studio
            </h3>
            <p className="text-luxury-muted max-w-2xl mx-auto">
              This is where creative content and portfolio work will be displayed. 
              The studio is currently in setup mode.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
