
import { useState, useRef, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { Upload, X, Play, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface VideoUploadFormProps {
  onComplete: (videoId: string) => void;
  onCancel: () => void;
  maxSizeInMB?: number;
  userId?: string;
}

export function VideoUploadForm({
  onComplete,
  onCancel,
  maxSizeInMB = 100,
  userId
}: VideoUploadFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const session = useSession();
  const { toast } = useToast();
  const { upload, uploadState } = useMediaUpload({ maxSizeInMB });
  
  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };
  
  const handleFileSelect = (file: File | null) => {
    // Clear previous preview
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
    
    setValidationError(null);
    
    if (!file) {
      setVideoFile(null);
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith("video/")) {
      setValidationError("Please select a valid video file");
      return;
    }
    
    // Validate file size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      setValidationError(`File size must be less than ${maxSizeInMB}MB`);
      return;
    }
    
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };
  
  const handleClearVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoFile(null);
    setVideoPreview(null);
    setIsPreviewPlaying(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Ensure we have a user ID
    const effectiveUserId = userId || session?.user?.id;
    
    if (!effectiveUserId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload videos",
        variant: "destructive"
      });
      return;
    }
    
    if (!videoFile) {
      setValidationError("Please select a video file");
      return;
    }
    
    if (!title.trim()) {
      setValidationError("Please enter a title");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setValidationError(null);
      
      // Upload video using our centralized upload hook
      const videoUrl = await upload({
        file: videoFile,
        mediaType: 'video',
        contentCategory: 'videos',
        onProgress: (progress) => {
          console.log(`Upload progress: ${progress}%`);
        }
      });
      
      if (!videoUrl) {
        throw new Error("Failed to upload video");
      }
      
      // Create video in database
      const { data, error } = await supabase
        .from('posts')
        .insert({
          creator_id: effectiveUserId,
          content: title,
          content_extended: description,
          video_urls: [videoUrl],
          visibility: 'public',
        })
        .select("id")
        .single();
      
      if (error) throw error;
      
      if (!data?.id) throw new Error("Failed to create video post");
      
      toast({
        title: "Upload successful",
        description: "Your video has been uploaded successfully"
      });
      
      onComplete(data.id);
      
    } catch (error: any) {
      console.error("Video upload error:", error);
      setValidationError(error.message || "Failed to upload video");
      
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload video",
        variant: "destructive"
      });
      
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const togglePreviewPlayback = () => {
    setIsPreviewPlaying(!isPreviewPlaying);
  };
  
  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Upload Video</h2>
          <p className="text-sm text-gray-500 mb-6">
            Share your video with the community
          </p>
        </div>
        
        {/* Video upload section */}
        <div className="space-y-2">
          <Label htmlFor="video">Video File</Label>
          
          {!videoFile ? (
            <div
              className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/10"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-10 w-10 text-gray-400 mb-4" />
              <p className="text-sm text-center text-gray-600 mb-1">
                Click to select a video
              </p>
              <p className="text-xs text-center text-gray-500">
                MP4, WebM, MOV up to {maxSizeInMB}MB
              </p>
              <Input
                ref={fileInputRef}
                id="video"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden aspect-video bg-black">
              <div
                className="absolute inset-0"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={togglePreviewPlayback}
              >
                <video
                  src={videoPreview || undefined}
                  className="w-full h-full object-contain"
                  controls={isPreviewPlaying}
                  autoPlay={isPreviewPlaying}
                  muted={!isPreviewPlaying}
                />
                
                {/* Play button overlay */}
                {!isPreviewPlaying && isHovering && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Play className="h-16 w-16 text-white opacity-80" />
                  </div>
                )}
              </div>
              
              {/* File info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/70 text-white text-sm flex justify-between items-center">
                <div className="truncate max-w-[300px]">
                  {videoFile.name}
                </div>
                <div>
                  {(videoFile.size / (1024 * 1024)).toFixed(2)}MB
                </div>
              </div>
              
              {/* Remove button */}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 rounded-full"
                onClick={handleClearVideo}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Upload progress */}
        {uploadState.isUploading && (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadState.progress}%</span>
            </div>
            <Progress value={uploadState.progress} />
          </div>
        )}
        
        {/* Validation error */}
        {(validationError || uploadState.error) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
            {validationError || uploadState.error}
          </div>
        )}
        
        {/* Video details */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              disabled={isSubmitting || uploadState.isUploading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your video"
              rows={4}
              disabled={isSubmitting || uploadState.isUploading}
            />
          </div>
        </div>
        
        {/* Form actions */}
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting || uploadState.isUploading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={!videoFile || !title.trim() || isSubmitting || uploadState.isUploading}
          >
            {isSubmitting || uploadState.isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {uploadState.isUploading 
                  ? `Uploading (${uploadState.progress}%)`
                  : "Processing..."}
              </>
            ) : (
              "Upload Video"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
