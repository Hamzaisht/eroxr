import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, Video, Crown, Sparkles } from 'lucide-react';
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

  const safeProfileUpdate = useCallback(async (url: string) => {
    try {
      console.log(`🎨 MediaUploader: Updating ${type} URL:`, url);
      
      // Use the safe profile update function with correct parameters
      const updateParams = {
        p_user_id: userId,
        p_username: null,
        p_bio: null,
        p_location: null,
        p_avatar_url: type === 'avatar' ? url : null,
        p_banner_url: type === 'banner' ? url : null,
        p_interests: null,
        p_profile_visibility: null,
        p_status: null,
      };

      const { data: safeResult, error: rpcError } = await supabase.rpc('safe_profile_update', updateParams);

      if (!rpcError && safeResult?.success) {
        console.log('✅ MediaUploader: Profile updated via safe function');
        return true;
      }

      console.warn('⚠️ MediaUploader: Safe update failed, trying fallback:', rpcError || safeResult?.error);
      
      // Fallback: Direct update
      const updateData = {
        [type === 'avatar' ? 'avatar_url' : 'banner_url']: url,
        updated_at: new Date().toISOString()
      };

      const { error: directError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      if (directError) {
        console.error('❌ MediaUploader: Direct update failed:', directError);
        throw new Error(`Failed to update profile: ${directError.message}`);
      }

      console.log('✅ MediaUploader: Profile updated via fallback');
      return true;
    } catch (error: any) {
      console.error('💥 MediaUploader: Profile update failed:', error);
      throw error;
    }
  }, [type, userId]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      console.log(`🎨 MediaUploader: Starting ${type} upload`, { fileName: file.name, size: file.size });

      // Validate file
      const maxSize = type === 'avatar' ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error(`File too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB`);
      }

      const allowedTypes = type === 'avatar' 
        ? ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        : ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
      
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`);
      }

      // Generate unique filename with proper path structure
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${type}_${Date.now()}.${fileExt}`;
      const bucket = type === 'avatar' ? 'studio-avatars' : 'studio-banners';

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      console.log(`🎨 MediaUploader: Uploading to bucket: ${bucket}, path: ${fileName}`);

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      clearInterval(progressInterval);

      if (uploadError) {
        console.error('❌ MediaUploader: Storage upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      setUploadProgress(95);

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      console.log('🎨 MediaUploader: Generated public URL:', publicUrl);

      // Update profile using safe method
      await safeProfileUpdate(publicUrl);
      
      setUploadProgress(100);
      onUploadSuccess(publicUrl);
      
      toast({
        title: "Upload Complete",
        description: `Your ${type} has been updated successfully!`,
      });

    } catch (error: any) {
      console.error('💥 MediaUploader: Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload media. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [type, userId, onUploadSuccess, toast, safeProfileUpdate]);

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
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-gradient-to-r from-purple-500/50 to-cyan-500/50 bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-xl shadow-2xl">
              {currentUrl ? (
                <img
                  src={currentUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500/20 via-cyan-500/10 to-slate-800/30 flex items-center justify-center relative overflow-hidden">
                  <Camera className="w-12 h-12 text-cyan-400" />
                  {/* Floating particles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                      style={{
                        left: `${20 + (i * 10)}%`,
                        top: `${30 + (i % 2) * 40}%`,
                      }}
                      animate={{
                        scale: [0.5, 1.5, 0.5],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 2 + (i * 0.2),
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {!isUploading && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-transparent to-cyan-900/70 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                <div className="text-center text-white">
                  <Upload className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-sm font-semibold">Upload Avatar</span>
                </div>
              </div>
            )}
            
            {isUploading && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 to-cyan-900/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="text-center text-white">
                  <motion.div
                    className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mb-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="text-sm font-bold">{uploadProgress}%</span>
                </div>
              </div>
            )}

            {/* Divine glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-xl -z-10"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>
        ) : (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-gradient-to-r from-purple-500/50 to-cyan-500/50 bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-xl shadow-2xl"
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
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500/20 via-cyan-500/10 to-slate-800/30 flex items-center justify-center relative overflow-hidden">
                <div className="text-center text-cyan-400">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <Video className="w-12 h-12" />
                    <Crown className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-lg font-bold mb-2">Upload Banner</p>
                  <p className="text-sm text-slate-400">Image or Video</p>
                </div>
                
                {/* Cosmic background effects */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full"
                    style={{
                      left: `${10 + (i * 7)}%`,
                      top: `${20 + (i % 3) * 20}%`,
                    }}
                    animate={{
                      scale: [0.5, 1.5, 0.5],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 2.5 + (i * 0.1),
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            )}
            
            {!isUploading && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-transparent to-cyan-900/70 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                <div className="text-center text-white">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Upload className="w-8 h-8" />
                    <Sparkles className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="text-lg font-bold">Upload New Banner</span>
                </div>
              </div>
            )}
            
            {isUploading && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 to-cyan-900/90 flex items-center justify-center backdrop-blur-sm">
                <div className="text-center text-white">
                  <motion.div
                    className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mb-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="text-lg font-bold">{uploadProgress}%</span>
                  <p className="text-sm text-purple-300 mt-2">Uploading...</p>
                </div>
              </div>
            )}

            {/* Divine aura effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 blur-xl -z-10"
              animate={{ 
                background: [
                  "linear-gradient(45deg, rgba(168,85,247,0.1), rgba(6,182,212,0.1))",
                  "linear-gradient(135deg, rgba(6,182,212,0.1), rgba(168,85,247,0.1))",
                  "linear-gradient(45deg, rgba(168,85,247,0.1), rgba(6,182,212,0.1))"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </motion.div>
        )}
      </label>
    </div>
  );
};
