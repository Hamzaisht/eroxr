
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { MediaUploadDialog } from "./MediaUploadDialog";
import { ModernSubscriptionPricing } from "./ModernSubscriptionPricing";
import { StudioHeader } from "./studio-edit/StudioHeader";
import { BannerSection } from "./studio-edit/BannerSection";
import { ProfileForm } from "./studio-edit/ProfileForm";
import { 
  User, 
  Image as ImageIcon, 
  Crown, 
  Camera,
  Save,
  Loader2,
  Zap
} from "lucide-react";

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
      console.log('🔧 StudioEditDialog: Using new clean RPC function for profile update');
      
      // Use the new clean RPC function
      const { error } = await supabase.rpc('update_user_profile', {
        p_username: formData.username || null,
        p_bio: formData.bio || null,
        p_location: formData.location || null
      });

      if (error) {
        console.error('❌ StudioEditDialog: Clean RPC function error:', error);
        throw error;
      }

      console.log('✅ StudioEditDialog: Profile updated successfully with clean function');

      toast({
        title: "Divine Profile Updated",
        description: "Your essence has been captured and immortalized!",
      });

      onSuccess();
    } catch (error: any) {
      console.error('💥 StudioEditDialog: Profile update error:', error);
      toast({
        title: "The Gods Have Spoken",
        description: error.message || "The divine update failed - try again",
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
        onSuccess();
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
        <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-4xl max-h-[90vh] p-0 border-none bg-transparent overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-h-[90vh] overflow-hidden bg-gradient-to-br from-luxury-dark/98 via-luxury-darker/95 to-luxury-dark/98 backdrop-blur-2xl border border-luxury-primary/20 shadow-2xl rounded-3xl"
          >
            <StudioHeader
              onClose={handleClose}
              isLoading={isLoading}
              isUploading={isUploading}
            />

            <BannerSection
              profile={profile}
              onBannerClick={() => openMediaDialog('banner')}
              onAvatarClick={() => openMediaDialog('avatar')}
              isUploading={isUploading}
            />

            <div className="px-8 pt-16 pb-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-luxury-darker/50 rounded-2xl p-1">
                  <TabsTrigger value="profile" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-luxury-primary/20">
                    <User className="w-4 h-4" />
                    Divine Essence
                  </TabsTrigger>
                  <TabsTrigger value="media" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-luxury-accent/20">
                    <ImageIcon className="w-4 h-4" />
                    Sacred Media
                  </TabsTrigger>
                  {profile.is_verified && (
                    <TabsTrigger value="monetization" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-yellow-500/20">
                      <Crown className="w-4 h-4" />
                      Divine Commerce
                    </TabsTrigger>
                  )}
                </TabsList>

                <div className="mt-8 space-y-6 max-h-96 overflow-y-auto custom-scrollbar">
                  <TabsContent value="profile" className="space-y-6">
                    <ProfileForm
                      formData={formData}
                      onInputChange={handleInputChange}
                      isLoading={isLoading}
                    />
                  </TabsContent>

                  <TabsContent value="media" className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-2 gap-6"
                    >
                      <motion.button
                        onClick={() => openMediaDialog('avatar')}
                        disabled={isUploading}
                        className="p-6 rounded-2xl border border-luxury-primary/20 hover:border-luxury-primary/40 transition-all duration-300 text-left disabled:opacity-50 bg-gradient-to-br from-luxury-darker/30 to-luxury-dark/30 group"
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-luxury-primary/20 flex items-center justify-center group-hover:bg-luxury-primary/30 transition-colors">
                            <User className="w-5 h-5 text-luxury-primary" />
                          </div>
                          <span className="font-semibold text-luxury-neutral">Sacred Avatar</span>
                        </div>
                        <p className="text-sm text-luxury-muted">Your divine visage for all to behold</p>
                      </motion.button>

                      <motion.button
                        onClick={() => openMediaDialog('banner')}
                        disabled={isUploading}
                        className="p-6 rounded-2xl border border-luxury-accent/20 hover:border-luxury-accent/40 transition-all duration-300 text-left disabled:opacity-50 bg-gradient-to-br from-luxury-darker/30 to-luxury-dark/30 group"
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-luxury-accent/20 flex items-center justify-center group-hover:bg-luxury-accent/30 transition-colors">
                            <ImageIcon className="w-5 h-5 text-luxury-accent" />
                          </div>
                          <span className="font-semibold text-luxury-neutral">Divine Banner</span>
                        </div>
                        <p className="text-sm text-luxury-muted">Your realm's eternal backdrop of beauty</p>
                      </motion.button>
                    </motion.div>
                  </TabsContent>

                  {profile.is_verified && (
                    <TabsContent value="monetization">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-luxury-primary/10 border border-yellow-500/20"
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <Crown className="w-6 h-6 text-yellow-500" />
                          <h3 className="text-xl font-bold text-luxury-neutral">Divine Monetization</h3>
                        </div>
                        <ModernSubscriptionPricing userId={profile.id} />
                      </motion.div>
                    </TabsContent>
                  )}
                </div>
              </Tabs>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end gap-4 p-8 pt-4 border-t border-luxury-primary/10 bg-gradient-to-r from-luxury-dark/50 to-luxury-darker/50"
            >
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isLoading || isUploading}
                className="border-luxury-neutral/30 text-luxury-neutral hover:bg-luxury-neutral/10 rounded-xl px-6"
              >
                Abandon Changes
              </Button>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || isUploading}
                  className="bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-primary hover:from-luxury-primary/90 hover:via-luxury-accent/90 hover:to-luxury-primary/90 text-white rounded-xl px-8 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Ascending...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      <Zap className="w-4 h-4 mr-2" />
                      Immortalize Changes
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
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
