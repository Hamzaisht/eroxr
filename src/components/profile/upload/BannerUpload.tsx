
import { useRef, useState } from "react";
import { Camera, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BannerUploadProps {
  currentBannerUrl?: string;
  profileId: string;
  onSuccess: (url: string) => void;
}

export const BannerUpload = ({ currentBannerUrl, profileId, onSuccess }: BannerUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type - support all image and video types
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image or video file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (100MB max for videos, 50MB for images)
    const maxSize = file.type.startsWith('video/') ? 100 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `Please select a file smaller than ${file.type.startsWith('video/') ? '100MB' : '50MB'}`,
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      console.log('🎯 Starting banner upload to banners bucket');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${profileId}/banner_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(fileName);

      console.log('📞 Updating profile banner using direct update');

      // Use direct table update instead of RPC
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ banner_url: publicUrl })
        .eq('id', profileId);

      if (updateError) {
        console.error('❌ Profile update error:', updateError);
        throw updateError;
      }

      console.log('✅ Banner updated successfully');
      onSuccess(publicUrl);
      
      toast({
        title: "Success",
        description: "Banner updated successfully!",
      });
    } catch (error: any) {
      console.error('💥 Banner upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload banner",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full h-full bg-premium-gradient relative overflow-hidden group cursor-pointer" onClick={handleClick}>
      {currentBannerUrl ? (
        currentBannerUrl.includes('.mp4') || currentBannerUrl.includes('.webm') || currentBannerUrl.includes('.mov') ? (
          <video
            src={currentBannerUrl}
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={currentBannerUrl}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        )
      ) : (
        <div className="w-full h-full bg-premium-gradient flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="w-32 h-32 bg-luxury-primary/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-luxury-primary/30"
          >
            <Camera className="w-16 h-16 text-luxury-primary" />
          </motion.div>
        </div>
      )}
      
      {/* Upload Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-black/50 flex items-center justify-center"
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
            <span className="text-white font-medium">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-luxury-primary/80 backdrop-blur-xl rounded-full flex items-center justify-center">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <div className="text-white font-medium mb-1">Change Banner</div>
              <div className="text-white/70 text-sm">Upload image or video</div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Luxury cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark via-luxury-dark/50 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-luxury-dark/30 via-transparent to-luxury-dark/30 pointer-events-none" />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
};
