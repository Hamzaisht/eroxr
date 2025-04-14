
import { useCallback } from "react";
import { motion } from "framer-motion";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { StoryUploadButton } from "./components/StoryUploadButton";
import { UploadingIndicator } from "./components/UploadingIndicator";
import { UploadErrorState } from "./components/UploadErrorState";

export const StoryUploader = () => {
  const session = useSession();
  const { toast } = useToast();
  
  // Use our media upload hook with story-specific options
  const { 
    uploadMedia,
    uploadState: {
      isUploading,
      progress,
      error,
      success
    },
    validateFile
  } = useMediaUpload({
    contentCategory: 'story',
    maxSizeInMB: 100,
    allowedTypes: [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'
    ],
    autoResetOnCompletion: true,
    resetDelay: 3000
  });

  const onFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    
    const file = event.target.files?.[0];
    if (!file || !session?.user?.id) return;

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      toast({
        title: "Invalid file",
        description: validation.message || "The selected file cannot be used for stories",
        variant: "destructive",
      });
      return;
    }

    // Upload the file
    const result = await uploadMedia(file);
    
    if (result.success && result.url) {
      // Refresh stories data on successful upload
      window.dispatchEvent(new CustomEvent('story-uploaded'));
      
      toast({
        title: "Story uploaded successfully",
        description: "Your story is now live",
      });
    } else {
      toast({
        title: "Upload failed",
        description: result.error || "There was a problem uploading your story",
        variant: "destructive",
      });
    }
  }, [session?.user?.id, toast, uploadMedia, validateFile]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative w-24 h-36 group"
    >
      <input
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime,video/x-msvideo"
        onChange={onFileSelect}
        className="hidden"
        id="story-upload"
        disabled={isUploading}
      />
      <label
        htmlFor="story-upload"
        className="cursor-pointer w-full h-full flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-luxury-primary/10 to-luxury-accent/10 border-2 border-dashed border-luxury-primary/30 group-hover:border-luxury-accent/50 transition-all duration-300"
      >
        {isUploading ? (
          <UploadingIndicator progress={progress} />
        ) : error ? (
          <UploadErrorState />
        ) : (
          <StoryUploadButton />
        )}
      </label>
    </motion.div>
  );
};
