
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileAvatarImage } from "./avatar/AvatarImage";
import { AvatarUploadModal } from "./avatar/AvatarUploadModal";
import { BannerUploadDialog } from "./banner/BannerUploadDialog";
import { SubscriptionPricingForm } from "./subscription/SubscriptionPricingForm";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { motion, AnimatePresence } from "framer-motion";
import { User, FileText, MapPin, Crown, Camera, Image as ImageIcon, CheckCircle } from "lucide-react";

interface ProfileEditDialogProps {
  profile: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProfileEditDialog = ({ profile, isOpen, onClose, onSuccess }: ProfileEditDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('🔧 ProfileEditDialog: Using RPC bypass function for profile update');
      
      // Use the RPC function instead of direct update to avoid RLS issues
      const { error } = await supabase.rpc('update_profile_bypass_rls', {
        p_user_id: profile.id,
        p_username: formData.username || null,
        p_bio: formData.bio || null,
        p_location: formData.location || null
      });

      if (error) {
        console.error('❌ ProfileEditDialog: RPC function error:', error);
        throw error;
      }

      console.log('✅ ProfileEditDialog: Profile updated successfully');

      toast({
        title: "Success",
        description: "Profile updated successfully!",
        action: <CheckCircle className="w-4 h-4 text-green-500" />
      });

      onSuccess();
    } catch (error: any) {
      console.error('💥 ProfileEditDialog: Profile update error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadAvatar(file, profile.id);
    if (result) {
      setAvatarModalOpen(false);
      onSuccess(); // Refresh profile data
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadBanner(file, profile.id);
    if (result) {
      setBannerModalOpen(false);
      onSuccess(); // Refresh profile data
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-luxury-dark to-luxury-darker border border-luxury-primary/20 shadow-2xl">
          {/* Header */}
          <DialogHeader className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-luxury-primary/5 to-luxury-accent/5 rounded-t-lg" />
            <DialogTitle className="relative text-3xl font-bold text-luxury-neutral text-center py-6">
              <User className="w-8 h-8 inline mr-3 text-luxury-primary" />
              Edit Profile
            </DialogTitle>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            {/* Banner Section */}
            <div className="relative h-48 bg-gradient-to-br from-luxury-primary/20 via-luxury-accent/10 to-luxury-dark rounded-xl overflow-hidden mb-8">
              {profile.banner_url ? (
                <img 
                  src={profile.banner_url} 
                  alt="Profile banner"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-luxury-primary/30 via-luxury-accent/20 to-luxury-dark" />
              )}
              
              {/* Banner Edit Button */}
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20 rounded-xl backdrop-blur-sm border border-white/20"
                  onClick={() => setBannerModalOpen(true)}
                >
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Change Banner
                </Button>
              </div>
            </div>

            {/* Avatar Section */}
            <div className="flex justify-center -mt-16 mb-8">
              <ProfileAvatarImage
                src={profile.avatar_url}
                username={profile.username}
                size="xl"
                onImageClick={() => setAvatarModalOpen(true)}
                className="border-4 border-luxury-dark shadow-2xl"
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 px-6">
              {/* Basic Info Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6 p-6 rounded-xl bg-luxury-darker/30 border border-luxury-primary/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-5 h-5 text-luxury-primary" />
                  <h3 className="text-xl font-semibold text-luxury-neutral">Basic Information</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username" className="text-luxury-neutral text-sm font-medium">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="bg-luxury-darker border-luxury-primary/20 text-luxury-neutral h-12 text-lg"
                      placeholder="Enter your username"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-luxury-neutral text-sm font-medium">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-4 h-5 w-5 text-luxury-neutral/50" />
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="pl-11 bg-luxury-darker border-luxury-primary/20 text-luxury-neutral h-12"
                        placeholder="Where are you located?"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Bio Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6 p-6 rounded-xl bg-luxury-darker/30 border border-luxury-primary/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-5 h-5 text-luxury-primary" />
                  <h3 className="text-xl font-semibold text-luxury-neutral">About You</h3>
                </div>

                <div>
                  <Label htmlFor="bio" className="text-luxury-neutral text-sm font-medium">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="bg-luxury-darker border-luxury-primary/20 text-luxury-neutral min-h-[120px] text-lg leading-relaxed"
                    placeholder="Tell your fans about yourself..."
                    maxLength={500}
                  />
                  <div className="text-xs text-luxury-muted text-right mt-2">
                    {formData.bio.length}/500 characters
                  </div>
                </div>
              </motion.div>

              {/* Verified Creator Pricing */}
              {profile.is_verified && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-6 rounded-xl bg-gradient-to-br from-yellow-500/10 to-luxury-primary/10 border border-yellow-500/20"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Crown className="w-6 h-6 text-yellow-500" />
                      <h3 className="text-xl font-semibold text-luxury-neutral">Creator Monetization</h3>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowPricing(!showPricing)}
                      className="border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
                    >
                      {showPricing ? 'Hide' : 'Setup'} Pricing
                    </Button>
                  </div>

                  <p className="text-luxury-muted text-sm mb-4">
                    As a verified creator, you can set up subscription tiers for your content.
                  </p>

                  <SubscriptionPricingForm 
                    userId={profile.id} 
                    isVisible={showPricing}
                  />
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-end gap-4 pt-6 border-t border-luxury-primary/20"
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-luxury-primary/30 text-luxury-primary hover:bg-luxury-primary/10 px-8 py-3"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-primary/90 hover:to-luxury-accent/90 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Upload Modals */}
      <AvatarUploadModal
        isOpen={avatarModalOpen}
        onOpenChange={setAvatarModalOpen}
        isUploading={isUploading}
        onFileChange={handleAvatarUpload}
      />

      <BannerUploadDialog
        isOpen={bannerModalOpen}
        onOpenChange={setBannerModalOpen}
        isUploading={isUploading}
        onFileChange={handleBannerUpload}
      />
    </>
  );
};
