
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MediaUploaderProps {
  type: 'avatar' | 'banner';
  userId: string;
  currentUrl?: string | null;
  onUploadSuccess: (url: string) => void;
}

export const MediaUploader = ({ type, userId, currentUrl, onUploadSuccess }: MediaUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${type}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      if (data.publicUrl) {
        // Update profile using RLS-bypass function to prevent stack depth issues
        const { data: result, error: rpcError } = await supabase.rpc('rls_bypass_profile_update', {
          p_user_id: userId,
          p_username: null,
          p_bio: null,
          p_location: null,
          p_avatar_url: type === 'avatar' ? data.publicUrl : null,
          p_banner_url: type === 'banner' ? data.publicUrl : null,
          p_interests: null,
          p_profile_visibility: null,
          p_status: null,
        });

        if (rpcError || !result?.success) {
          throw new Error(`Profile update failed: ${rpcError?.message || result?.error || 'Unknown error'}`);
        }

        onUploadSuccess(data.publicUrl);
        setPreviewUrl(null);
        
        toast({
          title: "Upload successful",
          description: `Your ${type} has been updated!`,
        });
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || `Failed to upload ${type}`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
      uploadFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.mov']
    },
    maxFiles: 1,
    disabled: uploading
  });

  const currentMediaUrl = previewUrl || currentUrl;
  const isVideo = currentMediaUrl && (currentMediaUrl.includes('.mp4') || currentMediaUrl.includes('.webm'));

  return (
    <div className="space-y-4">
      {/* Current Media Display */}
      {currentMediaUrl && (
        <div className="relative">
          <div className={`relative overflow-hidden rounded-lg ${type === 'avatar' ? 'w-32 h-32 mx-auto' : 'w-full h-48'}`}>
            {isVideo ? (
              <video
                src={currentMediaUrl}
                className="w-full h-full object-cover"
                muted
                loop
                autoPlay
              />
            ) : (
              <img
                src={currentMediaUrl}
                alt={`Current ${type}`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-slate-400 bg-slate-800/50' : 'border-slate-600 hover:border-slate-500'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {uploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400" />
          ) : (
            <Upload className="w-8 h-8 text-slate-400" />
          )}
          <p className="text-slate-300 text-sm">
            {uploading 
              ? `Uploading ${type}...`
              : isDragActive 
                ? `Drop ${type} here...`
                : `Click or drag to upload ${type}`
            }
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Image className="w-3 h-3" />
            <span>Images</span>
            <Video className="w-3 h-3" />
            <span>Videos</span>
          </div>
        </div>
      </div>
    </div>
  );
};
