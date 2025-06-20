
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Image, Video, User, Crown } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${type}_${Date.now()}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(uploadData.path);

      const publicUrl = urlData.publicUrl;

      // Update profile via RLS-bypass function
      console.log(`🔒 MediaUploader: Updating ${type} via RLS-bypass:`, publicUrl);
      
      const { data: result, error: rpcError } = await supabase.rpc('rls_bypass_profile_update', {
        p_user_id: userId,
        p_username: null,
        p_bio: null,
        p_location: null,
        p_avatar_url: type === 'avatar' ? publicUrl : null,
        p_banner_url: type === 'banner' ? publicUrl : null,
        p_interests: null,
        p_profile_visibility: null,
        p_status: null,
      });

      if (rpcError || !result?.success) {
        console.error(`❌ MediaUploader: RLS-bypass ${type} update failed:`, rpcError || result?.error);
        throw new Error(rpcError?.message || result?.error || `Failed to update ${type}`);
      }

      console.log(`✅ MediaUploader: ${type} updated successfully via RLS-bypass`);
      
      onUploadSuccess(publicUrl);
      setPreviewUrl(publicUrl);
      
      toast({
        title: "Upload Successful",
        description: `Your ${type} has been updated successfully!`,
      });
    } catch (error: any) {
      console.error(`💥 MediaUploader: ${type} upload error:`, error);
      toast({
        title: "Upload Failed",
        description: error.message || `Failed to upload ${type}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [type, userId, onUploadSuccess, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.mov']
    },
    maxFiles: 1,
    disabled: isUploading
  });

  const displayUrl = previewUrl || currentUrl;
  const isVideo = displayUrl?.includes('.mp4') || displayUrl?.includes('.webm') || displayUrl?.includes('.mov');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative ${className}`}
    >
      <div
        {...getRootProps()}
        className={`
          relative group cursor-pointer border-2 border-dashed rounded-2xl transition-all duration-300
          ${isDragActive 
            ? 'border-slate-400 bg-slate-800/50' 
            : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/30'
          }
          ${type === 'avatar' ? 'aspect-square max-w-xs mx-auto' : 'aspect-video w-full'}
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {displayUrl ? (
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            {isVideo ? (
              <video
                src={displayUrl}
                className="w-full h-full object-cover"
                muted
                loop
                autoPlay
              />
            ) : (
              <img
                src={displayUrl}
                alt={`${type} preview`}
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-center text-white">
                <Upload className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">
                  {isUploading ? 'Uploading...' : `Change ${type}`}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="mb-4">
              {type === 'avatar' ? (
                <Crown className="w-16 h-16 text-slate-400 mx-auto" />
              ) : (
                <Image className="w-16 h-16 text-slate-400 mx-auto" />
              )}
            </div>
            
            <div className="space-y-2">
              <p className="text-slate-200 font-medium text-lg">
                {isUploading ? 'Uploading...' : `Upload ${type === 'avatar' ? 'Divine Avatar' : 'Divine Banner'}`}
              </p>
              <p className="text-slate-400 text-sm">
                {isDragActive ? 'Drop your file here' : 'Drag & drop or click to browse'}
              </p>
              <p className="text-slate-500 text-xs">
                Supports: JPG, PNG, GIF, MP4, WebM
              </p>
            </div>
          </div>
        )}
        
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
            <div className="text-center text-white">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm font-medium">Uploading...</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
