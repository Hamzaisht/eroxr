
import { useState, useEffect, RefObject } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { useShortPostSubmit } from "./useShortPostSubmit";
import { useNavigate } from "react-router-dom";

export interface VideoFormState {
  selectedFile: File | null;
  previewUrl: string | null;
  title: string;
  description: string;
  isPremium: boolean;
  validationError: string | null;
  previewError: string | null;
  isPreviewLoading: boolean;
  uploadComplete: boolean;
}

export const useVideoDialogState = (open: boolean, onOpenChange: (open: boolean) => void) => {
  // Form state
  const [state, setState] = useState<VideoFormState>({
    selectedFile: null,
    previewUrl: null,
    title: "",
    description: "",
    isPremium: false,
    validationError: null,
    previewError: null,
    isPreviewLoading: false,
    uploadComplete: false
  });

  // Utility hooks
  const { toast } = useToast();
  const session = useSession();
  const navigate = useNavigate();
  
  const { 
    submitShortPost, 
    isUploading, 
    uploadProgress, 
    error,
    isSubmitting,
    resetUploadState,
    isError,
    errorMessage
  } = useShortPostSubmit();

  // Constants
  const maxFileSize = 100 * 1024 * 1024; // 100MB
  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];

  // Reset form on open/close
  useEffect(() => {
    if (open) {
      setState({
        selectedFile: null,
        previewUrl: null,
        title: "",
        description: "",
        isPremium: false,
        validationError: null,
        previewError: null,
        isPreviewLoading: false,
        uploadComplete: false
      });
      
      // Reset upload state if that function is available
      if (resetUploadState) {
        resetUploadState();
      }
    }
  }, [open, resetUploadState]);

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (state.previewUrl) {
        URL.revokeObjectURL(state.previewUrl);
      }
    };
  }, [state.previewUrl]);

  // Form field updaters
  const updateState = (newState: Partial<VideoFormState>) => {
    setState(current => ({ ...current, ...newState }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateState({ title: e.target.value });
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateState({ description: e.target.value });
  };

  const handleIsPremiumChange = (value: boolean) => {
    updateState({ isPremium: value });
  };

  // Video handling
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    console.log("Selected file:", file.name, file.type, file.size);

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      updateState({ 
        validationError: `Please upload a video file (MP4, WebM, or MOV). Selected type: ${file.type}`
      });
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      updateState({ 
        validationError: `Video size must be less than 100MB. Selected size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
      });
      return;
    }

    updateState({ 
      validationError: null,
      previewError: null,
      selectedFile: file,
      isPreviewLoading: true
    });
    
    // Create and set preview URL
    try {
      const objectUrl = URL.createObjectURL(file);
      updateState({ previewUrl: objectUrl });
      
      // Show a toast when file is valid and selected
      toast({
        title: "Video selected",
        description: "Preview is being prepared...",
      });
      
      console.log("Created preview URL:", objectUrl);
    } catch (error) {
      console.error("Error creating preview URL:", error);
      updateState({ 
        previewError: "Could not generate video preview",
        isPreviewLoading: false
      });
    }
  };

  // Video preview handlers
  const handleVideoLoad = () => {
    console.log("Video preview loaded successfully");
    updateState({ isPreviewLoading: false });
    
    toast({
      title: "Video preview ready",
      description: "You can now add details and upload",
    });
  };

  const handleVideoError = () => {
    console.error("Video preview failed to load");
    
    updateState({
      isPreviewLoading: false,
      previewError: "Failed to preview video. The format may be unsupported."
    });
    
    if (state.previewUrl) {
      URL.revokeObjectURL(state.previewUrl);
      updateState({ previewUrl: null });
    }
  };

  // Clear selected video
  const clearVideo = () => {
    if (state.previewUrl) {
      URL.revokeObjectURL(state.previewUrl);
      updateState({
        previewUrl: null,
        selectedFile: null,
        previewError: null
      });
    }
  };

  // Upload the video
  const handleUpload = async () => {
    if (!session?.user?.id || !state.selectedFile) return;
    
    if (!state.title.trim()) {
      updateState({ validationError: "Please enter a title for your video" });
      return;
    }

    try {
      console.log("Starting upload process with file:", state.selectedFile.name, state.selectedFile.type);
      
      // Use the title as the caption, and description if available
      const caption = state.description.trim() 
        ? `${state.title}\n\n${state.description}` 
        : state.title;
      
      // Pass video file and caption to submitShortPost
      // Use isPremium to determine visibility
      const visibility = state.isPremium ? 'subscribers_only' : 'public';
      
      const result = await submitShortPost(
        state.selectedFile,
        caption,
        visibility
      );

      if (result.success) {
        updateState({ uploadComplete: true });
        
        toast({
          title: "Upload successful",
          description: "Your Eros video is now being processed and will be available soon.",
        });
        
        // Navigate to shorts feed after successful upload with a slight delay
        setTimeout(() => {
          onOpenChange(false);
          navigate('/shorts');
        }, 1500);
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error?.message || "There was a problem uploading your video. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle dialog cancel
  const handleCancel = () => {
    if (state.previewUrl) {
      URL.revokeObjectURL(state.previewUrl);
    }
    updateState({
      selectedFile: null,
      previewUrl: null
    });
    onOpenChange(false);
  };

  return {
    state,
    isSubmitting,
    uploadProgress,
    isUploading,
    isError,
    errorMessage,
    uploadComplete: state.uploadComplete,
    handleFileSelect,
    handleTitleChange,
    handleDescriptionChange,
    handleIsPremiumChange,
    handleVideoLoad,
    handleVideoError,
    handleUpload,
    handleCancel,
    clearVideo
  };
};
