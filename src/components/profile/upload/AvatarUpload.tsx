
import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, Loader2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ImageCropDialog } from "./ImageCropDialog";

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  profileId: string;
  onSuccess: (newAvatarUrl: string) => void;
  size?: number;
}

export const AvatarUpload = ({ 
  currentAvatarUrl, 
  profileId, 
  onSuccess,
  size = 240 
}: AvatarUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const setupStorageIfNeeded = async () => {
    try {
      // Check if buckets exist
      const { data: buckets } = await supabase.storage.listBuckets();
      const avatarBucket = buckets?.find(b => b.id === 'avatars');
      
      if (!avatarBucket) {
        // Create bucket via RPC call to avoid direct storage schema access
        const { error: bucketError } = await supabase.rpc('create_storage_bucket', {
          bucket_name: 'avatars',
          is_public: true
        });
        
        if (bucketError) {
          console.warn('Could not create bucket, it may already exist:', bucketError);
        }
      }
    } catch (error) {
      console.warn('Storage setup check failed:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, GIF, WebP)",
      });
      return;
    }

    setSelectedFile(file);
    setTempImageUrl(URL.createObjectURL(file));
    setShowCropDialog(true);
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setShowCropDialog(false);
      setUploadProgress(10);

      // Setup storage if needed
      await setupStorageIfNeeded();
      setUploadProgress(20);

      // Create new file from cropped blob
      const croppedFile = new File([croppedImageBlob], selectedFile.name, {
        type: 'image/jpeg'
      });

      // Delete old avatar if exists
      if (currentAvatarUrl) {
        const urlParts = currentAvatarUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `${profileId}/${fileName}`;
        
        await supabase.storage
          .from('avatars')
          .remove([filePath]);
      }
      setUploadProgress(40);

      // Upload new avatar
      const timestamp = new Date().getTime();
      const fileExt = 'jpg'; // Always save as JPG after cropping
      const filePath = `${profileId}/${timestamp}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, croppedFile, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (uploadError) throw uploadError;
      setUploadProgress(70);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setUploadProgress(90);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', profileId);

      if (updateError) throw updateError;

      setUploadProgress(100);
      onSuccess(publicUrl);
      toast({
        title: "Success",
        description: "Profile picture updated successfully!",
      });

    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to update profile picture",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (tempImageUrl) {
        URL.revokeObjectURL(tempImageUrl);
        setTempImageUrl("");
      }
    }
  };

  return (
    <>
      <div className="relative group">
        {/* Avatar Display */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 p-1.5 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500"
          style={{ width: size, height: size }}
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-gray-900 relative">
            {currentAvatarUrl ? (
              <img 
                src={currentAvatarUrl} 
                alt="Profile"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <Camera className="w-16 h-16 text-gray-400" />
              </div>
            )}
            
            {/* Upload Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center cursor-pointer"
              onClick={() => document.getElementById('avatar-upload')?.click()}
            >
              {isUploading ? (
                <div className="text-center">
                  <Loader2 className="w-10 h-10 text-white animate-spin mb-2" />
                  <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-white" />
                  <span className="text-xs text-white font-medium">Upload</span>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Hidden File Input */}
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
        />

        {/* Upload Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => document.getElementById('avatar-upload')?.click()}
          disabled={isUploading}
          className="absolute -bottom-3 -right-3 w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center border-4 border-gray-900 shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Plus className="w-6 h-6 text-white" />
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
        aspectRatio={1}
        isCircular={true}
      />
    </>
  );
};
