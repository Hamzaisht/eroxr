
import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, Loader2, Video, Image as ImageIcon } from "lucide-react";
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

    // Validate file size (20MB max)
    if (file.size > 20 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload a file smaller than 20MB",
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
        description: "Please upload an image or video file",
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
      setUploadProgress(0);

      // Delete old banner if exists
      if (currentBannerUrl) {
        const oldPath = currentBannerUrl.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('banners')
            .remove([`${profileId}/${oldPath}`]);
        }
      }

      // Upload new banner
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop() || 'bin';
      const filePath = `${profileId}/${timestamp}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          banner_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', profileId);

      if (updateError) throw updateError;

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
      <div className="relative group w-full h-72 md:h-96 rounded-3xl overflow-hidden">
        {/* Banner Display */}
        {currentBannerUrl ? (
          <>
            {isVideo ? (
              <video
                src={currentBannerUrl}
                autoPlay
                muted
                loop
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <img
                src={currentBannerUrl}
                alt="Banner"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-500/30 via-purple-500/20 to-pink-500/30 backdrop-blur-xl border border-white/20 flex items-center justify-center">
            <div className="text-center">
              <Camera className="w-16 h-16 text-white/60 mx-auto mb-4" />
              <p className="text-white/80 text-lg font-medium">Add a banner</p>
              <p className="text-white/60 text-sm">Image or video supported</p>
            </div>
          </div>
        )}

        {/* Upload Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center cursor-pointer transition-opacity duration-300"
          onClick={() => document.getElementById('banner-upload')?.click()}
        >
          {isUploading ? (
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
              <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                />
              </div>
              <p className="text-white text-sm mt-2">Uploading... {uploadProgress}%</p>
            </div>
          ) : (
            <div className="text-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl"
              >
                <Upload className="w-8 h-8 text-white" />
              </motion.div>
              <p className="text-white text-lg font-semibold mb-2">Upload Banner</p>
              <div className="flex items-center justify-center gap-4 text-white/80">
                <div className="flex items-center gap-1">
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-sm">Image</span>
                </div>
                <div className="flex items-center gap-1">
                  <Video className="w-4 h-4" />
                  <span className="text-sm">Video</span>
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

        {/* Upload Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => document.getElementById('banner-upload')?.click()}
          disabled={isUploading}
          className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : (
            <Camera className="w-5 h-5 text-white" />
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
