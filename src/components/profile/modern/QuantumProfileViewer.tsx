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
    <div className="min-h-screen quantum-profile-container relative">
      {/* Neural Mesh Background */}
      <div className="neural-mesh" />
      
      {/* Floating Quantum Elements */}
      <FloatingQuantumElements />

      {/* Interactive Cursor Glow */}
      <motion.div
        className="fixed w-96 h-96 rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.03) 0%, transparent 70%)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Navigation Header */}
      {onBack && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-50 glass-morphism-extreme backdrop-blur-md border-b border-white/10"
        >
          <div className="container mx-auto px-6 py-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="neural-button text-white/80 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Discovery
            </Button>
          </div>
        </motion.div>
      )}

      {/* Quantum Banner Section */}
      <QuantumBanner 
        profile={profile} 
        isOwnProfile={isOwnProfile}
        onEditClick={() => setIsEditDialogOpen(true)}
      />

      {/* Main Profile Content */}
      <div className="container mx-auto px-6 -mt-20 relative z-20">
        {/* Holographic Profile Card */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          className="mb-12"
        >
          <div className="holographic-card p-8">
            <div className="flex flex-col xl:flex-row gap-8">
              {/* Quantum Avatar Section */}
              <div className="flex flex-col items-center xl:items-start">
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="relative mb-6"
                >
                  <div className="quantum-avatar w-40 h-40 rounded-3xl overflow-hidden">
                    <Avatar className="w-full h-full">
                      <AvatarImage src={profile.avatar_url || undefined} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-3xl">
                        <User className="w-16 h-16" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {/* Online Status Indicator */}
                  <motion.div
                    className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-background"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  {isOwnProfile && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute -bottom-3 -right-3 neural-button p-3 rounded-full"
                      onClick={() => setIsEditDialogOpen(true)}
                    >
                      <Camera className="w-5 h-5" />
                    </motion.button>
                  )}
                </motion.div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 w-full max-w-md justify-center xl:justify-start">
                  {isOwnProfile ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsEditDialogOpen(true)}
                      className="neural-button flex-1 xl:flex-none min-w-[140px]"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </motion.button>
                  ) : (
                    <>
                      <FollowButton profileId={profileId} />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="neural-button px-6"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="stats-orb p-3 rounded-full"
                      >
                        <Share className="w-4 h-4" />
                      </motion.button>
                    </>
                  )}
                </div>
              </div>

              {/* Profile Information */}
              <div className="flex-1 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Name and Verification */}
                  <div className="flex items-center gap-3 mb-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                      {profile.username || 'Anonymous User'}
                    </h1>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Crown className="w-8 h-8 text-yellow-400" />
                    </motion.div>
                  </div>
                  
                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-6 text-white/60 mb-6">
                    {profile.location && (
                      <motion.div 
                        className="flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                      >
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </motion.div>
                    )}
                    <motion.div 
                      className="flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Globe className="w-4 h-4" />
                      <span>Online</span>
                    </motion.div>
                  </div>

                  {/* Bio */}
                  {profile.bio && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="mb-6"
                    >
                      <p className="text-lg text-white/80 leading-relaxed max-w-3xl">
                        {profile.bio}
                      </p>
                    </motion.div>
                  )}

                  {/* Interests */}
                  {profile.interests && profile.interests.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="space-y-3"
                    >
                      <h3 className="font-semibold text-white/60 uppercase tracking-wide text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Interests & Expertise
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {profile.interests.map((interest, index) => (
                          <motion.div
                            key={interest}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.6 }}
                            whileHover={{ scale: 1.05 }}
                            className="interest-tag cursor-pointer"
                          >
                            <span className="relative z-10 text-white/90 font-medium">{interest}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Enhanced Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <ProfileStats profileId={profileId} />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quantum Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="flex justify-center">
              <div className="quantum-tabs">
                <TabsList className="bg-transparent p-2">
                  <TabsTrigger value="posts" className="quantum-tab flex items-center gap-2">
                    <Grid className="w-4 h-4" />
                    <span className="hidden sm:inline">Posts</span>
                  </TabsTrigger>
                  <TabsTrigger value="media" className="quantum-tab flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    <span className="hidden sm:inline">Media</span>
                  </TabsTrigger>
                  <TabsTrigger value="likes" className="quantum-tab flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span className="hidden sm:inline">Likes</span>
                  </TabsTrigger>
                  <TabsTrigger value="saved" className="quantum-tab flex items-center gap-2">
                    <Bookmark className="w-4 h-4" />
                    <span className="hidden sm:inline">Saved</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="posts" className="space-y-6">
                  <ProfilePosts profileId={profileId} />
                </TabsContent>

                <TabsContent value="media" className="space-y-6">
                  <QuantumEmptyState
                    icon={Image}
                    title="Media Galaxy"
                    description="Your visual universe awaits discovery"
                  />
                </TabsContent>

                <TabsContent value="likes" className="space-y-6">
                  <QuantumEmptyState
                    icon={Heart}
                    title="Liked Cosmos"
                    description="Your appreciation constellation"
                  />
                </TabsContent>

                <TabsContent value="saved" className="space-y-6">
                  <QuantumEmptyState
                    icon={Bookmark}
                    title="Saved Dimensions"
                    description="Your curated collection"
                  />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>

      {/* Quantum Edit Dialog */}
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