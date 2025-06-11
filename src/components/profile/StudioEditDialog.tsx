
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
  Loader2,
  Heart,
  Sparkles,
  Zap
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
        title: "Divine Profile Updated",
        description: "Your essence has been captured and immortalized!",
      });

      onSuccess();
    } catch (error: any) {
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-luxury-dark/98 via-luxury-darker/95 to-luxury-dark/98 backdrop-blur-2xl border border-luxury-primary/20 shadow-2xl rounded-3xl"
          >
            {/* Mythological Header with Divine Energy */}
            <div className="relative overflow-hidden">
              {/* Animated Background with Golden Ratio Spirals */}
              <div className="absolute inset-0 bg-gradient-to-br from-luxury-primary/10 via-luxury-accent/5 to-luxury-primary/10" />
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  background: [
                    "radial-gradient(circle at 20% 80%, #f472b6 0%, transparent 50%)",
                    "radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%)",
                    "radial-gradient(circle at 40% 40%, #00f5ff 0%, transparent 50%)",
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Header Content */}
              <div className="relative p-8 pb-6">
                <div className="flex items-center justify-between">
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4"
                  >
                    <div className="relative">
                      <motion.div
                        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-luxury-primary/30 to-luxury-accent/30 backdrop-blur-sm flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Heart className="w-7 h-7 text-luxury-primary" />
                      </motion.div>
                      <motion.div
                        className="absolute -top-1 -right-1 w-4 h-4 bg-luxury-accent rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    <div>
                      <motion.h2 
                        className="text-3xl font-bold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-primary bg-clip-text text-transparent"
                        animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        Divine Profile Studio
                      </motion.h2>
                      <p className="text-luxury-muted">Craft your divine essence in the realm of Eros</p>
                    </div>
                  </motion.div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    disabled={isLoading || isUploading}
                    className="text-luxury-muted hover:text-luxury-neutral rounded-xl hover:bg-luxury-primary/10"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Divine Media Banner with Greek Aesthetics */}
            <div className="relative mx-8 mb-6">
              <motion.div 
                className="relative h-40 rounded-2xl overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
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
                    <img src={profile.banner_url} alt="Divine Banner" className="w-full h-full object-cover" />
                  )
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-luxury-primary/20 via-luxury-accent/10 to-luxury-primary/20 relative">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                )}
                
                {/* Divine Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/60 via-transparent to-luxury-dark/20" />
                
                {/* Change Banner Button */}
                <motion.div 
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
                  whileHover={{ backdropFilter: "blur(8px)" }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => openMediaDialog('banner')}
                    disabled={isUploading}
                    className="text-white hover:bg-white/20 rounded-xl backdrop-blur-sm border border-white/20 px-6 py-3"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Change Divine Banner
                  </Button>
                </motion.div>
                
                {/* Divine Avatar */}
                <motion.div 
                  className="absolute -bottom-8 left-6 group/avatar"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-luxury-dark shadow-2xl">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="Divine Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-luxury-primary/30 to-luxury-accent/30 flex items-center justify-center">
                        <User className="w-8 h-8 text-luxury-neutral/60" />
                      </div>
                    )}
                    <motion.div 
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      onClick={() => openMediaDialog('avatar')}
                      whileHover={{ backdropFilter: "blur(4px)" }}
                    >
                      <Camera className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                  {/* Avatar Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-luxury-primary/30 blur-xl -z-10"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* Sacred Tabs */}
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
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6 p-6 rounded-2xl bg-gradient-to-br from-luxury-darker/40 to-luxury-dark/40 border border-luxury-primary/10 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="w-5 h-5 text-luxury-accent" />
                        <h3 className="text-xl font-bold text-luxury-neutral">Your Divine Identity</h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="username" className="text-luxury-neutral flex items-center gap-2 mb-2">
                            <User className="w-4 h-4" />
                            Sacred Name
                          </Label>
                          <Input
                            id="username"
                            value={formData.username}
                            onChange={(e) => handleInputChange('username', e.target.value)}
                            className="bg-luxury-darker/50 border-luxury-primary/20 text-luxury-neutral rounded-xl h-12 focus:border-luxury-primary/40"
                            placeholder="Your divine moniker..."
                            disabled={isLoading}
                          />
                        </div>

                        <div>
                          <Label htmlFor="location" className="text-luxury-neutral flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4" />
                            Realm of Origin
                          </Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            className="bg-luxury-darker/50 border-luxury-primary/20 text-luxury-neutral rounded-xl h-12 focus:border-luxury-primary/40"
                            placeholder="From which realm do you hail?"
                            disabled={isLoading}
                          />
                        </div>

                        <div>
                          <Label htmlFor="bio" className="text-luxury-neutral flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4" />
                            Divine Chronicles
                          </Label>
                          <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            className="bg-luxury-darker/50 border-luxury-primary/20 text-luxury-neutral min-h-[120px] rounded-xl focus:border-luxury-primary/40"
                            placeholder="Tell your divine story to mortals and gods alike..."
                            maxLength={500}
                            disabled={isLoading}
                          />
                          <div className="text-xs text-luxury-muted text-right mt-2">
                            {formData.bio.length}/500 divine characters
                          </div>
                        </div>
                      </div>
                    </motion.div>
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

            {/* Divine Action Footer */}
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
