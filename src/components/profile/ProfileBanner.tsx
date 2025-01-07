import { motion } from "framer-motion";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Profile } from "@/integrations/supabase/types/profile";
import { BannerMedia } from "./banner/BannerMedia";
import { BannerEditButton } from "./banner/BannerEditButton";
import { BannerPreview } from "./banner/BannerPreview";
import { ImageCropDialog } from "./ImageCropDialog";

interface ProfileBannerProps {
  profile: Profile;
  getMediaType: (url: string) => 'video' | 'gif' | 'image';
  isOwnProfile?: boolean;
}

export const ProfileBanner = ({ profile, getMediaType, isOwnProfile }: ProfileBannerProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tempImageUrl, setTempImageUrl] = useState<string>('');
  const { toast } = useToast();

  const defaultVideoUrl = "https://cdn.pixabay.com/vimeo/505772711/fashion-66214.mp4?width=1280&hash=4adbad56c39a522787b3563a2b65439c2c8b3766";
  const bannerUrl = profile?.banner_url || defaultVideoUrl;
  const bannerMediaType = profile?.banner_url ? getMediaType(profile.banner_url) : 'video';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
      });
      return;
    }

    if (file.type.startsWith('image/')) {
      setSelectedFile(file);
      setTempImageUrl(URL.createObjectURL(file));
      setShowCropDialog(true);
      setShowUploadModal(false);
    } else {
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
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

      window.location.reload();

    } catch (error) {
      console.error('Error uploading banner:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update banner. Please try again.",
      });
    } finally {
      setIsUploading(false);
      setShowUploadModal(false);
    }
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    const file = new File([croppedImageBlob], selectedFile?.name || 'banner.jpg', {
      type: 'image/jpeg'
    });
    await handleUpload(file);
  };

  return (
    <>
      <motion.div 
        className="h-[60vh] w-full overflow-hidden relative cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        onClick={() => setShowPreview(true)}
      >
        <BannerMedia 
          mediaUrl={bannerUrl}
          mediaType={bannerMediaType}
          isHovering={isHovering}
        />

        {isOwnProfile && isHovering && (
          <BannerEditButton 
            onClick={(e) => {
              e.stopPropagation();
              setShowUploadModal(true);
            }}
          />
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
              <span>{isUploading ? "Uploading..." : "Choose File"}</span>
            </label>
          </div>
        </DialogContent>
      </Dialog>

      <BannerPreview
        isOpen={showPreview}
        onOpenChange={setShowPreview}
        mediaUrl={bannerUrl}
        mediaType={bannerMediaType}
      />

      {showCropDialog && tempImageUrl && (
        <ImageCropDialog
          isOpen={showCropDialog}
          onClose={() => {
            setShowCropDialog(false);
            setTempImageUrl('');
            setSelectedFile(null);
          }}
          imageUrl={tempImageUrl}
          onCropComplete={handleCropComplete}
          aspectRatio={3}
          isCircular={false}
        />
      )}
    </>
  );
};