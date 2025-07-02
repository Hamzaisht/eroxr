import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, Settings, User, Edit, Grid, Bookmark, 
  Heart, MessageCircle, Share, Eye, ArrowLeft, Camera,
  Users, Trophy, Star, Zap, Sparkles, Crown, Globe,
  Play, Music, Image, Video
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { ProfilePosts } from '../container/ProfilePosts';
import { ProfileStats } from '../stats/ProfileStats';
import { FollowButton } from '../FollowButton';
import { ProfileEditDialog } from './ProfileEditDialog';

interface QuantumProfileViewerProps {
  profileId: string;
  onBack?: () => void;
}

export const QuantumProfileViewer = ({ profileId, onBack }: QuantumProfileViewerProps) => {
  const { profile, loading, error } = useProfile(profileId);
  const { user } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const isOwnProfile = user?.id === profileId;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (loading) {
    return <QuantumProfileSkeleton />;
  }

  if (error || !profile) {
    return <QuantumProfileNotFound error={error} onBack={onBack} />;
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="fixed inset-0 opacity-[0.02]">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation Header */}
      {onBack && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl"
        >
          <div className="container mx-auto px-8 py-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="text-white/60 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </motion.div>
      )}

      {/* Hero Banner Section */}
      <div className="relative h-[60vh] overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-br from-black via-primary/5 to-black" />
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Profile Content - Seamless Layout */}
      <div className="relative -mt-32 z-30">
        <div className="max-w-7xl mx-auto px-8">
          {/* Profile Header */}
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row items-start gap-8 mb-16"
          >
            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <div className="w-48 h-48 rounded-full overflow-hidden bg-black/20 backdrop-blur-xl border border-white/10">
                <Avatar className="w-full h-full">
                  <AvatarImage src={profile.avatar_url || undefined} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-4xl">
                    <User className="w-20 h-20 text-primary" />
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Status */}
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center border-4 border-black">
                <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
              </div>
              
              {isOwnProfile && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setIsEditDialogOpen(true)}
                  className="absolute top-4 right-4 w-12 h-12 bg-black/60 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-primary/20 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </motion.button>
              )}
            </motion.div>

            {/* Profile Info */}
            <div className="flex-1 lg:mt-4">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-6xl font-light text-white mb-2 tracking-tight"
              >
                {profile.username || 'Anonymous'}
              </motion.h1>
              
              {profile.bio && (
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl text-white/60 mb-6 max-w-2xl leading-relaxed"
                >
                  {profile.bio}
                </motion.p>
              )}

              {/* Meta Info */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-6 text-white/40 mb-8"
              >
                {profile.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(profile.created_at).getFullYear()}</span>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-4"
              >
                {isOwnProfile ? (
                  <button
                    onClick={() => setIsEditDialogOpen(true)}
                    className="px-8 py-3 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-colors"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <FollowButton profileId={profileId} />
                    <button className="px-8 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors">
                      Message
                    </button>
                    <button className="p-3 bg-white/10 backdrop-blur-xl text-white rounded-full hover:bg-white/20 transition-colors">
                      <Share className="w-5 h-5" />
                    </button>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-16"
          >
            <ProfileStats profileId={profileId} />
          </motion.div>
        </div>
      </div>

      {/* Content Tabs - Borderless Design */}
      <div className="max-w-7xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <div className="flex justify-center mb-12">
            <div className="flex gap-1 bg-white/5 backdrop-blur-xl rounded-full p-2">
              {['posts', 'media', 'likes', 'saved'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-full transition-all capitalize ${
                    activeTab === tab 
                      ? 'bg-primary text-white' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[400px]"
            >
              {activeTab === 'posts' && <ProfilePosts profileId={profileId} />}
              {activeTab === 'media' && (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {/* Media grid placeholder */}
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-white/5 rounded-lg" />
                  ))}
                </div>
              )}
              {activeTab === 'likes' && (
                <div className="text-center py-20">
                  <Heart className="w-16 h-16 text-primary/40 mx-auto mb-4" />
                  <p className="text-white/40 text-lg">No liked content yet</p>
                </div>
              )}
              {activeTab === 'saved' && (
                <div className="text-center py-20">
                  <Bookmark className="w-16 h-16 text-primary/40 mx-auto mb-4" />
                  <p className="text-white/40 text-lg">No saved content yet</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Profile Edit Dialog */}
      <ProfileEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        profileId={profileId}
      />
    </div>
  );
};

// Floating Quantum Elements Component
const FloatingQuantumElements = () => {
  const elements = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: Math.random() * 20 + 10,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
  }));

  return (
    <div className="floating-elements">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="floating-element"
          style={{
            width: element.size,
            height: element.size,
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          animate={{
            y: [-20, -40, -20],
            x: [-10, 10, -10],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Quantum Banner Component
const QuantumBanner = ({ 
  profile, 
  isOwnProfile, 
  onEditClick 
}: { 
  profile: any; 
  isOwnProfile: boolean; 
  onEditClick: () => void;
}) => (
  <div className="relative h-80 lg:h-96 quantum-banner">
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
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
    )}
    
    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
    
    {isOwnProfile && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-6 right-6 neural-button backdrop-blur-md"
        onClick={onEditClick}
      >
        <Camera className="w-4 h-4 mr-2" />
        Change Banner
      </motion.button>
    )}
  </div>
);

// Quantum Empty State Component
const QuantumEmptyState = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: any; 
  title: string; 
  description: string;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="holographic-card p-12 text-center"
  >
    <motion.div
      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 4, repeat: Infinity }}
      className="inline-block mb-6"
    >
      <Icon className="w-16 h-16 text-primary/60" />
    </motion.div>
    <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
    <p className="text-white/60 text-lg">{description}</p>
  </motion.div>
);

// Quantum Loading Skeleton
const QuantumProfileSkeleton = () => (
  <div className="min-h-screen quantum-profile-container">
    <div className="neural-mesh" />
    <div className="h-96 bg-gradient-to-br from-primary/10 to-secondary/10 animate-pulse" />
    <div className="container mx-auto px-6 -mt-20 relative z-10">
      <div className="holographic-card p-8">
        <div className="flex gap-8">
          <div className="w-40 h-40 bg-primary/20 rounded-3xl animate-pulse" />
          <div className="flex-1 space-y-6">
            <div className="h-12 bg-primary/20 rounded-lg animate-pulse w-80" />
            <div className="h-6 bg-primary/10 rounded animate-pulse w-96" />
            <div className="h-6 bg-primary/10 rounded animate-pulse w-72" />
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 bg-primary/10 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Quantum Not Found Component
const QuantumProfileNotFound = ({ error, onBack }: { error: string; onBack?: () => void }) => (
  <div className="min-h-screen quantum-profile-container flex items-center justify-center">
    <div className="neural-mesh" />
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="holographic-card p-12 text-center max-w-md relative z-10"
    >
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="inline-block mb-6"
      >
        <User className="w-20 h-20 text-primary/60" />
      </motion.div>
      <h3 className="text-2xl font-bold text-white mb-3">Profile Lost in Space</h3>
      <p className="text-white/60 mb-8">{error || 'This profile exists in another dimension'}</p>
      {onBack && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="neural-button"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Return to Reality
        </motion.button>
      )}
    </motion.div>
  </div>
);