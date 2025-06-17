
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, Video, X, Check, Crown, Sparkles } from 'lucide-react';
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
        title: "Divine Upload Complete",
        description: `Your ${type} has been blessed by the gods!`,
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "The gods have rejected this offering. Please try again.",
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
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-gradient-to-r from-purple-500/50 to-cyan-500/50 bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-xl shadow-2xl">
              {currentUrl ? (
                <img
                  src={currentUrl}
                  alt="Divine avatar"
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
                  <span className="text-sm font-semibold">Upload Divine Avatar</span>
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
                  alt="Divine banner"
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
                  <p className="text-lg font-bold mb-2">Upload Divine Banner</p>
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
                  <span className="text-lg font-bold">Upload New Divine Banner</span>
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
                  <p className="text-sm text-purple-300 mt-2">Ascending to divine realms...</p>
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
