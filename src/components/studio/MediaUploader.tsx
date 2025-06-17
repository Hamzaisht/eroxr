
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, Video, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MediaUploaderProps {
  type: 'avatar' | 'banner';
  userId: string;
  currentUrl?: string | null;
  onUploadSuccess: (url: string) => void;
  className?: string;
}

export const MediaUploader = ({ 
  type, 
  userId, 
  currentUrl, 
  onUploadSuccess,
  className = ""
}: MediaUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const bucket = type === 'avatar' ? 'studio-avatars' : 'studio-banners';
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      // Update profile with new URL
      await supabase.rpc('studio_update_profile', {
        [type === 'avatar' ? 'p_avatar_url' : 'p_banner_url']: publicUrl
      });

      onUploadSuccess(publicUrl);
      
      toast({
        title: "Upload Successful",
        description: `Your ${type} has been updated successfully!`,
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [type, userId, onUploadSuccess, toast]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        accept={type === 'avatar' ? 'image/*' : 'image/*,video/*'}
        onChange={handleFileSelect}
        className="hidden"
        id={`${type}-upload-${userId}`}
        disabled={isUploading}
      />
      
      <label 
        htmlFor={`${type}-upload-${userId}`}
        className="cursor-pointer block"
      >
        {type === 'avatar' ? (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-32 h-32 mx-auto"
          >
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-yellow-400/30 bg-luxury-darker/50 backdrop-blur-xl shadow-2xl">
              {currentUrl ? (
                <img
                  src={currentUrl}
                  alt="Current avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-yellow-400/20 to-luxury-primary/20 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-yellow-400" />
                </div>
              )}
            </div>
            
            {!isUploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center text-white">
                  <Upload className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-sm">Upload</span>
                </div>
              </div>
            )}
            
            {isUploading && (
              <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mb-2" />
                  <span className="text-sm">{uploadProgress}%</span>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-yellow-400/30 bg-luxury-darker/50 backdrop-blur-xl"
          >
            {currentUrl ? (
              currentUrl.includes('.mp4') || currentUrl.includes('.webm') ? (
                <video
                  src={currentUrl}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  autoPlay
                />
              ) : (
                <img
                  src={currentUrl}
                  alt="Current banner"
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-yellow-400/20 to-luxury-primary/20 flex items-center justify-center">
                <div className="text-center text-yellow-400">
                  <Video className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg font-semibold">Upload Divine Banner</p>
                  <p className="text-sm text-luxury-muted">Image or Video</p>
                </div>
              </div>
            )}
            
            {!isUploading && (
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center text-white">
                  <Upload className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-lg">Upload New Banner</span>
                </div>
              </div>
            )}
            
            {isUploading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4" />
                  <span className="text-lg">{uploadProgress}%</span>
                  <p className="text-sm text-luxury-muted">Uploading divine content...</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </label>
    </div>
  );
};
