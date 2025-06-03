
import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, Loader2, Video, Image as ImageIcon, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ImageCropDialog } from "./ImageCropDialog";

interface BannerUploadProps {
  currentBannerUrl?: string;
  profileId: string;
  onSuccess: (newBannerUrl: string) => void;
}

export const BannerUpload = ({ 
  currentBannerUrl, 
  profileId, 
  onSuccess 
}: BannerUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const isVideo = currentBannerUrl?.includes('.mp4') || currentBannerUrl?.includes('.webm');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Selected file:", file);

    // Validate file size (50MB max for videos, 10MB for images)
    const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: `Please upload a ${file.type.startsWith('video/') ? 'video' : 'image'} smaller than ${file.type.startsWith('video/') ? '50MB' : '10MB'}`,
      });
      return;
    }

    // Validate file type
    const isValidImage = file.type.startsWith('image/');
    const isValidVideo = file.type.startsWith('video/');
    
    if (!isValidImage && !isValidVideo) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image (JPG, PNG, GIF, WebP) or video (MP4, WebM) file",
      });
      return;
    }

    setSelectedFile(file);

    if (isValidImage) {
      // Show crop dialog for images
      setTempImageUrl(URL.createObjectURL(file));
      setShowCropDialog(true);
    } else {
      // Direct upload for videos
      uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(10);

      console.log("Starting upload...");

      // Delete old banner if exists
      if (currentBannerUrl) {
        const urlParts = currentBannerUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `${profileId}/${fileName}`;
        
        console.log("Deleting old banner:", filePath);
        await supabase.storage
          .from('banners')
          .remove([filePath]);
      }
      setUploadProgress(30);

      // Upload new banner
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop() || 'bin';
      const filePath = `${profileId}/${timestamp}.${fileExt}`;

      console.log("Uploading to path:", filePath);

      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      setUploadProgress(70);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(filePath);

      console.log("Generated public URL:", publicUrl);

      setUploadProgress(90);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          banner_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', profileId);

      if (updateError) {
        console.error("Profile update error:", updateError);
        throw updateError;
      }

      setUploadProgress(100);
      onSuccess(publicUrl);
      toast({
        title: "Success",
        description: "Banner updated successfully!",
      });

    } catch (error: any) {
      console.error('Error uploading banner:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to update banner",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    if (!selectedFile) return;

    const croppedFile = new File([croppedImageBlob], selectedFile.name, {
      type: 'image/jpeg'
    });

    setShowCropDialog(false);
    await uploadFile(croppedFile);
    
    if (tempImageUrl) {
      URL.revokeObjectURL(tempImageUrl);
      setTempImageUrl("");
    }
  };

  return (
    <>
      <div className="relative group w-full h-48 md:h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-pink-500/10 backdrop-blur-xl border border-white/10">
        {/* Banner Display */}
        {currentBannerUrl ? (
          <>
            {isVideo ? (
              <video
                src={currentBannerUrl}
                autoPlay
                muted
                loop
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <img
                src={currentBannerUrl}
                alt="Banner"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm"
              >
                <Camera className="w-8 h-8 text-white/60" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">Add a banner</h3>
              <p className="text-white/60 text-sm mb-3">Image or video supported</p>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-1 text-white/50 text-xs">
                  <ImageIcon className="w-3 h-3" />
                  <span>Images</span>
                </div>
                <div className="flex items-center gap-1 text-white/50 text-xs">
                  <Video className="w-3 h-3" />
                  <span>Videos</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center cursor-pointer transition-opacity duration-300"
          onClick={() => document.getElementById('banner-upload')?.click()}
        >
          {isUploading ? (
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
              <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                />
              </div>
              <p className="text-white text-sm font-medium">Uploading... {uploadProgress}%</p>
            </div>
          ) : (
            <div className="text-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
              >
                <Upload className="w-6 h-6 text-white" />
              </motion.div>
              <p className="text-white text-lg font-bold mb-2">Upload Banner</p>
              <div className="flex items-center justify-center gap-4 text-white/70 text-sm">
                <div className="flex items-center gap-1">
                  <ImageIcon className="w-4 h-4" />
                  <span>Images</span>
                </div>
                <div className="flex items-center gap-1">
                  <Video className="w-4 h-4" />
                  <span>Videos</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Hidden File Input */}
        <input
          id="banner-upload"
          type="file"
          accept="image/*,video/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
        />

        {/* Floating Upload Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => document.getElementById('banner-upload')?.click()}
          disabled={isUploading}
          className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-white/20 shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 disabled:opacity-50 z-10"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : (
            <Plus className="w-4 h-4 text-white" />
          )}
        </motion.button>
      </div>

      {/* Crop Dialog */}
      <ImageCropDialog
        isOpen={showCropDialog}
        onClose={() => {
          setShowCropDialog(false);
          if (tempImageUrl) {
            URL.revokeObjectURL(tempImageUrl);
            setTempImageUrl("");
          }
        }}
        imageUrl={tempImageUrl}
        onCropComplete={handleCropComplete}
        aspectRatio={16/9}
        isCircular={false}
      />
    </>
  );
};
