import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, User, X, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '../hooks/useProfile';
import { SimpleMediaUploader } from '../core/SimpleMediaUploader';

interface ProfileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: string;
}

export const ProfileEditDialog = ({ isOpen, onClose, profileId }: ProfileEditDialogProps) => {
  const { profile, updateProfile, loading } = useProfile(profileId);
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    location: '',
    interests: [] as string[]
  });
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        bio: profile.bio || '',
        location: profile.location || '',
        interests: profile.interests || []
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      await updateProfile(formData);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully!",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleAvatarUpload = (url: string) => {
    toast({
      title: "Avatar Updated",
      description: "Your profile picture has been updated!",
    });
  };

  const handleBannerUpload = (url: string) => {
    toast({
      title: "Banner Updated", 
      description: "Your profile banner has been updated!",
    });
  };

  if (loading || !profile) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="media">Photos & Media</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Profile Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={profile.avatar_url || undefined} />
                      <AvatarFallback>
                        <User className="w-8 h-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        {formData.username || 'Your Name'}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {formData.bio || 'Your bio will appear here...'}
                      </p>
                      {formData.location && (
                        <p className="text-muted-foreground text-xs">
                          📍 {formData.location}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Basic Information */}
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Username
                  </label>
                  <Input
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    maxLength={50}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Bio
                  </label>
                  <Textarea
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.bio.length}/500 characters
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Location
                  </label>
                  <Input
                    placeholder="Where are you based?"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    maxLength={100}
                  />
                </div>

                {/* Interests */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Interests & Skills
                  </label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Add an interest..."
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                      maxLength={30}
                    />
                    <Button type="button" onClick={addInterest} variant="outline" size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {formData.interests.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.interests.map((interest) => (
                        <motion.div
                          key={interest}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="relative group"
                        >
                          <Badge 
                            variant="secondary" 
                            className="pr-8 cursor-pointer hover:bg-secondary/80"
                          >
                            {interest}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => removeInterest(interest)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Add up to 10 interests that describe you
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating} className="flex-1">
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Avatar Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Profile Picture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SimpleMediaUploader
                    type="avatar"
                    userId={profileId}
                    currentUrl={profile.avatar_url}
                    onUploadSuccess={handleAvatarUpload}
                  />
                </CardContent>
              </Card>

              {/* Banner Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Cover Banner
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SimpleMediaUploader
                    type="banner"
                    userId={profileId}
                    currentUrl={profile.banner_url}
                    onUploadSuccess={handleBannerUpload}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Advanced profile settings coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};