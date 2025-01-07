import { motion } from "framer-motion";
import { useState } from "react";
import { Image, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Profile } from "@/integrations/supabase/types/profile";

interface ProfileBannerProps {
  profile: Profile;
  getMediaType: (url: string) => 'video' | 'gif' | 'image';
  isOwnProfile?: boolean;
}

export const ProfileBanner = ({ profile, getMediaType, isOwnProfile }: ProfileBannerProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { toast } = useToast();
  const bannerMediaType = getMediaType(profile?.banner_url || '');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
      });
      return;
    }

    // Validate dimensions for images
    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      await new Promise((resolve) => {
        img.onload = () => {
          URL.revokeObjectURL(img.src);
          if (img.width < 1500 || img.height < 500) {
            toast({
              variant: "destructive",
              title: "Image too small",
              description: "Banner image should be at least 1500x500 pixels",
            });
            resolve(false);
          }
          resolve(true);
        };
      });
    }

    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}/banner.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ banner_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Banner updated successfully",
      });

      setShowUploadModal(false);

    } catch (error) {
      console.error('Error uploading banner:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update banner. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <motion.div 
        className="h-[60vh] w-full overflow-hidden relative cursor-pointer group"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        onClick={() => isOwnProfile && setShowUploadModal(true)}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-gradient-from via-luxury-gradient-via to-luxury-gradient-to opacity-90 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(155,135,245,0.1)_0%,transparent_70%)] animate-pulse z-20" />
        
        {bannerMediaType === 'video' ? (
          <video
            src={profile?.banner_url || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"}
            className={`w-full h-full object-cover transform transition-transform duration-700 ${
              isHovering ? 'scale-105' : 'scale-100'
            }`}
            autoPlay={isHovering}
            loop
            muted
            playsInline
          />
        ) : (
          <img
            src={profile?.banner_url || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"}
            alt="Profile Banner"
            className={`w-full h-full object-cover transform transition-transform duration-700 ${
              isHovering ? 'scale-105' : 'scale-100'
            }`}
          />
        )}

        {isOwnProfile && isHovering && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-luxury-darker/80 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 text-white hover:bg-luxury-darker/90"
            >
              <Image className="w-5 h-5" />
              <span className="text-sm font-medium">
                {isUploading ? "Uploading..." : "Edit Banner"}
              </span>
            </motion.div>
          </div>
        )}
      </motion.div>

      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Banner</DialogTitle>
            <DialogDescription>
              Upload a new banner image or video. For best results:
              <ul className="list-disc pl-4 mt-2 space-y-1">
                <li>Minimum dimensions: 1500x500 pixels</li>
                <li>Maximum file size: 10MB</li>
                <li>Supported formats: JPG, PNG, GIF, MP4</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <input
                type="file"
                id="banner-upload"
                className="hidden"
                accept="image/*,video/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <label
                htmlFor="banner-upload"
                className="cursor-pointer bg-luxury-primary/10 hover:bg-luxury-primary/20 text-luxury-primary px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
              >
                <Image className="w-4 h-4" />
                <span>{isUploading ? "Uploading..." : "Choose File"}</span>
              </label>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};