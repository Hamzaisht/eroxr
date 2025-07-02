import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, Settings, User, Edit, Grid, Bookmark, 
  Heart, MessageCircle, Share, Eye, ArrowLeft, Camera,
  Users, Trophy, Star, Zap
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

interface ModernProfileViewerProps {
  profileId: string;
  onBack?: () => void;
}

export const ModernProfileViewer = ({ profileId, onBack }: ModernProfileViewerProps) => {
  const { profile, loading, error } = useProfile(profileId);
  const { user } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  
  const isOwnProfile = user?.id === profileId;

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !profile) {
    return <ProfileNotFound error={error} onBack={onBack} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back Button */}
      {onBack && (
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 py-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="hover:bg-muted/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      )}

      {/* Banner Section */}
      <ProfileBanner 
        profile={profile} 
        isOwnProfile={isOwnProfile}
        onEditClick={() => setIsEditDialogOpen(true)}
      />

      {/* Profile Content */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        {/* Profile Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <Card className="border-border/50 bg-card/95 backdrop-blur-sm shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Avatar and Basic Info */}
                <div className="flex flex-col items-center lg:items-start">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative mb-4"
                  >
                    <Avatar className="w-32 h-32 border-4 border-background shadow-2xl">
                      <AvatarImage src={profile.avatar_url || undefined} />
                      <AvatarFallback className="bg-muted text-2xl">
                        <User className="w-12 h-12" />
                      </AvatarFallback>
                    </Avatar>
                    {isOwnProfile && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute -bottom-2 -right-2 rounded-full shadow-lg"
                        onClick={() => setIsEditDialogOpen(true)}
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                  </motion.div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 w-full lg:w-auto">
                    {isOwnProfile ? (
                      <Button 
                        onClick={() => setIsEditDialogOpen(true)}
                        className="flex-1 lg:flex-none"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <FollowButton profileId={profileId} />
                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button variant="outline" size="icon">
                          <Share className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Profile Details */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {profile.username || 'Anonymous User'}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
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
                      <p className="text-foreground/80 leading-relaxed max-w-2xl">
                        {profile.bio}
                      </p>
                    )}
                  </div>

                  {/* Interests */}
                  {profile.interests && profile.interests.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Interests
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest, index) => (
                          <motion.div
                            key={interest}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Badge variant="secondary" className="hover:bg-secondary/80 transition-colors">
                              {interest}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <ProfileStats profileId={profileId} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
              <TabsTrigger value="posts" className="flex items-center gap-2">
                <Grid className="w-4 h-4" />
                <span className="hidden sm:inline">Posts</span>
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">Media</span>
              </TabsTrigger>
              <TabsTrigger value="likes" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Likes</span>
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                <span className="hidden sm:inline">Saved</span>
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="posts" className="space-y-6">
                  <ProfilePosts profileId={profileId} />
                </TabsContent>

                <TabsContent value="media" className="space-y-6">
                  <div className="text-center py-12">
                    <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Media Gallery</h3>
                    <p className="text-muted-foreground">Photos and videos will appear here</p>
                  </div>
                </TabsContent>

                <TabsContent value="likes" className="space-y-6">
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Liked Posts</h3>
                    <p className="text-muted-foreground">Posts you've liked will appear here</p>
                  </div>
                </TabsContent>

                <TabsContent value="saved" className="space-y-6">
                  <div className="text-center py-12">
                    <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Saved Posts</h3>
                    <p className="text-muted-foreground">Your saved content will appear here</p>
                  </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>

      {/* Edit Profile Dialog */}
      <ProfileEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        profileId={profileId}
      />
    </div>
  );
};

// Banner Component
const ProfileBanner = ({ 
  profile, 
  isOwnProfile, 
  onEditClick 
}: { 
  profile: any; 
  isOwnProfile: boolean; 
  onEditClick: () => void;
}) => (
  <div className="relative h-64 lg:h-80 overflow-hidden">
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
    
    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
    
    {isOwnProfile && (
      <Button
        variant="secondary"
        size="sm"
        className="absolute top-4 right-4 backdrop-blur-sm"
        onClick={onEditClick}
      >
        <Camera className="w-4 h-4 mr-2" />
        Change Banner
      </Button>
    )}
  </div>
);

// Loading Skeleton
const ProfileSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="h-80 bg-muted animate-pulse" />
    <div className="container mx-auto px-4 -mt-16 relative z-10">
      <Card className="p-6">
        <div className="flex gap-6">
          <div className="w-32 h-32 bg-muted rounded-full animate-pulse" />
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-muted rounded animate-pulse w-64" />
            <div className="h-4 bg-muted rounded animate-pulse w-96" />
            <div className="h-4 bg-muted rounded animate-pulse w-80" />
          </div>
        </div>
      </Card>
    </div>
  </div>
);

// Not Found Component
const ProfileNotFound = ({ error, onBack }: { error: string; onBack?: () => void }) => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <Card className="p-8 text-center max-w-md">
      <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">Profile not found</h3>
      <p className="text-muted-foreground mb-6">{error || 'This profile could not be loaded'}</p>
      {onBack && (
        <Button onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      )}
    </Card>
  </div>
);