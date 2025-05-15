
import React, { useState, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { useShortPostSubmit } from "@/components/home/hooks/short-post";
import { Progress } from "@/components/ui/progress";
import { Camera, Video, X, Upload, CheckCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";

interface StoryUploaderProps {
  onComplete?: () => void;
  className?: string;
}

export const StoryUploader: React.FC<StoryUploaderProps> = ({
  onComplete,
  className = "",
}) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const session = useSession();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const {
    submitShortPost,
    isUploading,
    uploadProgress,
    isSubmitting,
    error,
    resetUploadState,
  } = useShortPostSubmit();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Check if file is a video
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size (limit to 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Video size should be less than 100MB",
        variant: "destructive",
      });
      return;
    }
    
    // Create object URL for preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setVideoFile(file);
    
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': []
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleSubmit = async () => {
    if (!videoFile) {
      toast({
        title: "No video selected",
        description: "Please select a video to upload",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const result = await submitShortPost(
        videoFile,
        caption,
        'public',
        []
      );
      
      if (result.success) {
        toast({
          title: "Story uploaded",
          description: "Your story has been posted successfully",
        });
        
        // Reset state
        setVideoFile(null);
        setPreviewUrl(null);
        setCaption("");
        
        // Call completion callback
        onComplete?.();
      }
    } catch (err) {
      console.error("Error uploading story:", err);
    }
  };

  const handleRemoveVideo = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setVideoFile(null);
    setPreviewUrl(null);
    resetUploadState();
  };

  if (!session) {
    return (
      <div className="text-center p-4">
        <p className="mb-2">Sign in to upload stories</p>
        <Button variant="outline">Sign In</Button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {!videoFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary/60 bg-primary/10"
              : "border-muted-foreground/20 hover:border-primary/40 hover:bg-muted/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="flex flex-row gap-2">
              <Video className="h-8 w-8 text-muted-foreground" />
              <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Drag & drop video here, or click to select
              </p>
              <p className="text-xs text-muted-foreground">
                MP4, MOV or WebM format, max 100MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden bg-black aspect-[9/16] max-h-[50vh]">
          <video
            ref={videoRef}
            src={previewUrl || undefined}
            className="w-full h-full object-contain"
            controls
            muted
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
            onClick={handleRemoveVideo}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {videoFile && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="caption"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Caption (optional)
            </label>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="flex h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Add a caption to your story"
              maxLength={150}
            />
            <div className="text-xs text-muted-foreground text-right">
              {caption.length}/150
            </div>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting || isUploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Post Story
              </>
            )}
          </Button>

          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}
        </div>
      )}
    </div>
  );
};
