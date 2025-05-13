
import { useState, useRef } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { createUniqueFilePath } from '@/utils/upload/fileUtils';
import { validateFileForUpload, isImageFile, isVideoFile } from '@/utils/upload/validators';

export const useStoryUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  
  // CRITICAL: Use ref instead of state for file storage
  const fileRef = useRef<File | null>(null);
  
  const session = useSession();
  const { toast } = useToast();
  
  const resetState = () => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
    setPreviewUrl(null);
    setMediaType(null);
    fileRef.current = null;
    
    // Clean up preview URL
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
  };
  
  const handleFileSelect = async (file: File): Promise<boolean> => {
    // Reset any previous state
    setError(null);
    
    // Clean up previous preview URL
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    
    // CRITICAL: Run comprehensive file diagnostic
    if (!file) {
      console.warn('File Diagnostic: No file provided');
      return false;
    }
    
    // CRITICAL: Store file in ref, not state
    fileRef.current = file;
    
    // Determine media type
    if (isImageFile(file)) {
      setMediaType('image');
    } else if (isVideoFile(file)) {
      setMediaType('video');
    } else {
      setError(`Invalid file type: ${file.type}. Only images and videos are allowed.`);
      return false;
    }
    
    // Create preview
    try {
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
      return true;
    } catch (err) {
      console.error("Error creating preview:", err);
      setError("Failed to create file preview");
      return false;
    }
  };
  
  const uploadFile = async (file: File) => {
    if (!session?.user?.id) {
      setError("You must be logged in to upload stories");
      return;
    }
    
    // CRITICAL: Strict file validation before upload
    if (!file || !(file instanceof File) || file.size === 0) {
      console.error("❌ Invalid File passed to uploader", file);
      setError("Only raw File instances with data can be uploaded");
      return;
    }
    
    // Validate file
    const validation = validateFileForUpload(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }
    
    setIsUploading(true);
    setProgress(0);
    
    // Track progress with interval
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 300);
    
    try {
      // Create unique storage path for the file
      const path = createUniqueFilePath(session.user.id, file);
      
      // Upload to Supabase storage with explicit content type and upsert: true
      const { data, error: uploadError } = await supabase.storage
        .from('stories')
        .upload(path, file, {
          contentType: file.type,
          upsert: true,
          cacheControl: '3600'
        });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (uploadError) {
        throw new Error(uploadError.message);
      }
      
      if (!data || !data.path) {
        throw new Error("Supabase returned no path for uploaded story media");
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('stories')
        .getPublicUrl(data.path);
        
      if (!publicUrl) {
        throw new Error("Failed to get public URL for story media");
      }
      
      // Create story entry in database
      const { error: dbError } = await supabase
        .from('stories')
        .insert({
          creator_id: session.user.id,
          media_type: mediaType,
          content_type: mediaType,
          media_url: mediaType === 'image' ? publicUrl : null,
          video_url: mediaType === 'video' ? publicUrl : null,
          is_active: true,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });
      
      if (dbError) {
        throw new Error(dbError.message);
      }
      
      toast({
        title: "Story uploaded successfully",
        description: "Your story is now live"
      });
      
      // Reset after short delay
      setTimeout(() => {
        setIsUploading(false);
      }, 1000);
      
    } catch (error: any) {
      clearInterval(progressInterval);
      
      console.error("Story upload error:", error);
      setError(error.message || "An unknown error occurred");
      setIsUploading(false);
      setProgress(0);
      
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload story",
        variant: "destructive"
      });
    }
  };
  
  return {
    isUploading,
    progress,
    error,
    previewUrl,
    mediaType,
    handleFileSelect,
    uploadFile,
    resetState
  };
};
