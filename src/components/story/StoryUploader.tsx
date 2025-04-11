import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const StoryUploader = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const session = useSession();
  const { toast } = useToast();
  const MAX_RETRIES = 2;
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
  const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  const getUrlWithCacheBuster = (baseUrl: string) => {
    const timestamp = Date.now();
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}t=${timestamp}`;
  };

  const validateFile = (file: File): { valid: boolean; message?: string } => {
    if (file.size > MAX_FILE_SIZE) {
      return { 
        valid: false, 
        message: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      };
    }

    const isVideo = SUPPORTED_VIDEO_TYPES.includes(file.type);
    const isImage = SUPPORTED_IMAGE_TYPES.includes(file.type);

    if (!isVideo && !isImage) {
      return { 
        valid: false, 
        message: `Unsupported file type. Please upload an image (JPG, PNG, GIF, WEBP) or video (MP4, WEBM, MOV, AVI)`
      };
    }

    return { valid: true };
  };

  // Helper function to check if a column exists in a table
  const checkColumnExists = async (table: string, column: string): Promise<boolean> => {
    try {
      // Simple check by selecting from the table with the column
      const { data, error } = await supabase
        .from(table)
        .select(column)
        .limit(1);

      if (error && error.message.includes(`column "${column}" does not exist`)) {
        return false;
      }
      
      return true;
    } catch (err) {
      console.warn(`Error in checkColumnExists for ${column}:`, err);
      return false;
    }
  };

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !session?.user?.id) return;

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      toast({
        title: "Invalid file",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }

    setUploadError(null);
    
    try {
      setIsUploading(true);
      setUploadProgress(10); // Show initial progress
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      console.log("Uploading story file:", file.type, filePath);

      // Track upload progress
      const uploadWithProgress = () => {
        return new Promise<{ error?: any, data?: any }>((resolve) => {
          // Simulate progress updates
          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
              const newProgress = prev + Math.floor(Math.random() * 10);
              return newProgress > 90 ? 90 : newProgress;
            });
          }, 300);

          // Start the upload with explicit content type
          supabase.storage
            .from('stories')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: true, // Changed to true for reliability
              contentType: file.type // Explicitly set content type
            })
            .then(({ data, error }) => {
              clearInterval(progressInterval);
              resolve({ data, error });
            })
            .catch((error) => {
              clearInterval(progressInterval);
              resolve({ error });
            });
        });
      };

      // Attempt upload
      let { error: uploadError, data: uploadData } = await uploadWithProgress();

      if (uploadError) {
        console.error('Upload error:', uploadError);
        
        // Try again if we haven't reached max retries
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          toast({
            title: "Retrying upload",
            description: "First attempt failed, trying again...",
          });
          
          // Retry with a different file path
          const retryFileName = `retry_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
          const retryFilePath = `${session.user.id}/${retryFileName}`;
          
          console.log("Retrying upload with path:", retryFilePath);
          
          const { error: retryError, data: retryData } = await supabase.storage
            .from('stories')
            .upload(retryFilePath, file, {
              cacheControl: '3600',
              upsert: true,
              contentType: file.type // Explicitly set content type
            });
          
          if (retryError) {
            console.error("Retry upload failed:", retryError);
            throw retryError;
          }
          
          console.log("Retry upload succeeded");
          uploadData = retryData;
        } else {
          throw uploadError;
        }
      }

      if (!uploadData || !uploadData.path) {
        throw new Error("Upload completed but no file path returned");
      }

      setUploadProgress(95); // Almost done

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('stories')
        .getPublicUrl(uploadData.path);

      if (!publicUrl) {
        throw new Error("Failed to get public URL for uploaded file");
      }
      
      console.log("Story public URL:", publicUrl);
      
      // Add a cache buster to ensure the URL is fresh
      const cacheBustedUrl = getUrlWithCacheBuster(publicUrl);
      
      setUploadProgress(98); // Final step
      
      // Determine if this is a video or image based on file type
      const isVideo = SUPPORTED_VIDEO_TYPES.includes(file.type);
      const contentType = isVideo ? 'video' : 'image';
      
      // Check for required and optional columns in stories table
      const hasContentType = await checkColumnExists('stories', 'content_type');
      const hasMediaType = await checkColumnExists('stories', 'media_type');
      const hasIsPublic = await checkColumnExists('stories', 'is_public');
      
      // Prepare the story data with required fields first
      const storyData: any = {
        creator_id: session.user.id,
        duration: isVideo ? 30 : 10,
        is_active: true,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h from now
      };
      
      // Add content based on file type
      if (isVideo) {
        storyData.video_url = cacheBustedUrl;
      } else {
        storyData.media_url = cacheBustedUrl;
      }
      
      // Add optional fields if the columns exist
      if (hasContentType) {
        storyData.content_type = contentType;
      }
      
      if (hasMediaType) {
        storyData.media_type = contentType;
      }
      
      if (hasIsPublic) {
        storyData.is_public = true;
      }
      
      console.log("Inserting story with data:", storyData);
      
      // Insert the story record
      const { error: storyError } = await supabase
        .from('stories')
        .insert([storyData]);

      if (storyError) {
        console.error("Story DB insert error:", storyError);
        throw storyError;
      }

      setUploadProgress(100);
      
      toast({
        title: "Story uploaded successfully",
        description: "Your story is now live",
      });
      
      // Force a page refresh to show the new story
      window.location.reload();
      
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message || "Failed to upload story");
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload story",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setRetryCount(0);
    }
  }, [session?.user?.id, toast, retryCount]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative w-24 h-36 group"
    >
      <input
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime,video/x-msvideo"
        onChange={handleFileSelect}
        className="hidden"
        id="story-upload"
        disabled={isUploading}
      />
      <label
        htmlFor="story-upload"
        className="cursor-pointer w-full h-full flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-luxury-primary/10 to-luxury-accent/10 border-2 border-dashed border-luxury-primary/30 group-hover:border-luxury-accent/50 transition-all duration-300"
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-luxury-primary/80 animate-spin" />
            <span className="text-xs text-white/60 mt-2">
              {uploadProgress > 0 ? `${uploadProgress}%` : "Uploading..."}
            </span>
            <div className="w-16 h-1 bg-luxury-dark/40 rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-luxury-primary/70 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : uploadError ? (
          <div className="flex flex-col items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <span className="text-xs text-red-400 mt-1 text-center px-2">
              Upload failed
            </span>
            <span className="text-[10px] text-red-400/80 mt-1 text-center">
              Tap to try again
            </span>
          </div>
        ) : (
          <>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-luxury-primary to-luxury-accent opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-300" />
              <Plus className="w-8 h-8 text-white/80 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-xs text-white/60 mt-2 group-hover:text-white/80 transition-colors duration-300">
              Add Story
            </span>
          </>
        )}
      </label>
    </motion.div>
  );
};
