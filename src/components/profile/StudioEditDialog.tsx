
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { MediaUploadDialog } from "./MediaUploadDialog";
import { ModernSubscriptionPricing } from "./ModernSubscriptionPricing";
import { 
  X, 
  User, 
  Image as ImageIcon, 
  Crown, 
  Camera,
  Save,
  MapPin,
  FileText,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StudioEditDialogProps {
  profile: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const StudioEditDialog = ({ profile, isOpen, onClose, onSuccess }: StudioEditDialogProps) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [mediaType, setMediaType] = useState<'avatar' | 'banner'>('avatar');
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    location: '',
  });

  const { uploadAvatar, uploadBanner, isUploading } = useAvatarUpload();
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        bio: profile.bio || '',
        location: profile.location || '',
      });
    }
  }, [profile]);

  const handleSubmit = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          bio: formData.bio,
          location: formData.location,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully!",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMediaUpload = async (file: File) => {
    try {
      const result = mediaType === 'avatar' 
        ? await uploadAvatar(file, profile.id)
        : await uploadBanner(file, profile.id);
      
      if (result.success) {
        onSuccess(); // Refresh profile data
      }
    } catch (error) {
      console.error('Media upload error:', error);
    }
  };

  const openMediaDialog = (type: 'avatar' | 'banner') => {
    setMediaType(type);
    setMediaDialogOpen(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    if (!isLoading && !isUploading) {
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent 
          className="sm:max-w-2xl max-h-[90vh] overflow-hidden bg-luxury-dark/95 backdrop-blur-xl border border-luxury-primary/20 shadow-2xl"
          style={{ 
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90vw',
            maxWidth: '42rem'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-0 border-b border-luxury-primary/10">
            <h2 className="text-2xl font-bold text-luxury-neutral">Edit Profile</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isLoading || isUploading}
              className="text-luxury-muted hover:text-luxury-neutral"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Media Banner */}
          <div className="relative h-32 mx-6 mt-4 rounded-lg overflow-hidden group">
            {profile.banner_url ? (
              profile.banner_url.includes('.mp4') || profile.banner_url.includes('.webm') || profile.banner_url.includes('.mov') ? (
                <video 
                  src={profile.banner_url} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover" 
                />
              ) : (
                <img src={profile.banner_url} alt="Banner" className="w-full h-full object-cover" />
              )
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-luxury-primary/20 to-luxury-accent/20" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="ghost"
                onClick={() => openMediaDialog('banner')}
                disabled={isUploading}
                className="text-white hover:bg-white/20"
              >
                <Camera className="w-5 h-5 mr-2" />
                Change Banner
              </Button>
            </div>
            
            {/* Avatar */}
            <div className="absolute -bottom-8 left-6 group/avatar">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-luxury-dark">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-luxury-primary/30 flex items-center justify-center">
                    <User className="w-6 h-6 text-luxury-neutral/60" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                     onClick={() => openMediaDialog('avatar')}>
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 pt-12">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-luxury-darker/50">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="media" className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Media
                </TabsTrigger>
                {profile.is_verified && (
                  <TabsTrigger value="monetization" className="flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Pricing
                  </TabsTrigger>
                )}
              </TabsList>

              <div className="mt-6 space-y-6 max-h-96 overflow-y-auto">
                <TabsContent value="profile" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username" className="text-luxury-neutral flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Username
                      </Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="bg-luxury-darker/50 border-luxury-primary/20 text-luxury-neutral"
                        placeholder="Enter your username"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="location" className="text-luxury-neutral flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="bg-luxury-darker/50 border-luxury-primary/20 text-luxury-neutral"
                        placeholder="Where are you located?"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio" className="text-luxury-neutral flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className="bg-luxury-darker/50 border-luxury-primary/20 text-luxury-neutral min-h-[100px]"
                        placeholder="Tell your audience about yourself..."
                        maxLength={500}
                        disabled={isLoading}
                      />
                      <div className="text-xs text-luxury-muted text-right mt-1">
                        {formData.bio.length}/500
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => openMediaDialog('avatar')}
                      disabled={isUploading}
                      className="p-4 rounded-lg border border-luxury-primary/20 hover:border-luxury-primary/40 transition-colors text-left disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <User className="w-5 h-5 text-luxury-primary" />
                        <span className="font-medium text-luxury-neutral">Avatar</span>
                      </div>
                      <p className="text-sm text-luxury-muted">Update your profile picture</p>
                    </button>

                    <button
                      onClick={() => openMediaDialog('banner')}
                      disabled={isUploading}
                      className="p-4 rounded-lg border border-luxury-primary/20 hover:border-luxury-primary/40 transition-colors text-left disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <ImageIcon className="w-5 h-5 text-luxury-primary" />
                        <span className="font-medium text-luxury-neutral">Banner</span>
                      </div>
                      <p className="text-sm text-luxury-muted">Update your cover image or video</p>
                    </button>
                  </div>
                </TabsContent>

                {profile.is_verified && (
                  <TabsContent value="monetization">
                    <ModernSubscriptionPricing userId={profile.id} />
                  </TabsContent>
                )}
              </div>
            </Tabs>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 pt-4 border-t border-luxury-primary/10">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading || isUploading}
              className="border-luxury-neutral/30 text-luxury-neutral"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || isUploading}
              className="bg-luxury-primary hover:bg-luxury-primary/90 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <MediaUploadDialog
        isOpen={mediaDialogOpen}
        onClose={() => setMediaDialogOpen(false)}
        type={mediaType}
        currentUrl={mediaType === 'avatar' ? profile.avatar_url : profile.banner_url}
        onUpload={handleMediaUpload}
        isUploading={isUploading}
      />
    </>
  );
};
