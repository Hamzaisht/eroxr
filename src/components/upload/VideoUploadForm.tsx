
import { useState, useRef, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Upload,
  X,
  Play,
  Pause,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { createFilePreview } from "@/utils/upload";
import { supabase } from "@/integrations/supabase/client";

interface VideoUploadFormProps {
  onComplete?: (videoId: string) => void;
  onCancel?: () => void;
  maxSizeInMB?: number;
}

export function VideoUploadForm({
  onComplete,
  onCancel,
  maxSizeInMB = 100, // default 100MB
}: VideoUploadFormProps) {
  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  
  // Upload state
  const [uploadState, setUploadState] = useState<{
    isUploading: boolean;
    progress: number;
    error: string | null;
    isComplete: boolean;
    isProcessing: boolean;
  }>({
    isUploading: false,
    progress: 0,
    error: null,
    isComplete: false,
    isProcessing: false
  });
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Hooks
  const session = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Clean up preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, []);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Clean up previous preview if exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    
    // Check file type
    if (!file.type.startsWith('video/')) {
      setUploadState(prev => ({
        ...prev,
        error: "Please select a valid video file"
      }));
      return;
    }
    
    // Check file size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      setUploadState(prev => ({
        ...prev,
        error: `File size must be less than ${maxSizeInMB}MB`
      }));
      return;
    }
    
    // Set the file and create preview
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Auto-generate title from filename if empty
    if (!title) {
      const fileName = file.name.split('.')[0];
      const formattedName = fileName
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
      setTitle(formattedName);
    }
    
    // Reset any previous errors
    setUploadState(prev => ({
      ...prev,
      error: null
    }));
  };

  // Toggle video playback
  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPreviewPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPreviewPlaying(!isPreviewPlaying);
    }
  };

  // Handle video load event
  const handleVideoLoad = () => {
    console.log("Video loaded successfully");
  };

  // Handle video error
  const handleVideoError = () => {
    console.error("Error loading video preview");
    setUploadState(prev => ({
      ...prev,
      error: "Failed to preview video. The format may not be supported."
    }));
  };

  // Clear selected video
  const clearVideo = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsPreviewPlaying(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Upload the video
  const handleUpload = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to upload videos",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (!selectedFile) {
      setUploadState(prev => ({
        ...prev,
        error: "Please select a video file"
      }));
      return;
    }
    
    if (!title.trim()) {
      setUploadState(prev => ({
        ...prev,
        error: "Please enter a title for your video"
      }));
      return;
    }
    
    try {
      // Start uploading
      setUploadState({
        isUploading: true,
        progress: 0,
        error: null,
        isComplete: false,
        isProcessing: false
      });
      
      // Generate a unique file path
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${session.user.id}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      // Upload the file to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from('shorts')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (uploadError) {
        throw new Error(uploadError.message);
      }
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('shorts')
        .getPublicUrl(filePath);
      
      const videoUrl = publicUrlData.publicUrl;
      
      // Set to processing state
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        isProcessing: true,
        progress: 100
      }));
      
      // Create post in the database
      const visibility = isPremium ? 'subscribers_only' : 'public';
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert({
          creator_id: session.user.id,
          title: title,
          content: description || title,
          video_urls: [videoUrl],
          visibility: visibility,
          meta: {
            is_short: true,
            original_filename: selectedFile.name
          }
        })
        .select('id')
        .single();
      
      if (postError) {
        throw new Error(postError.message);
      }
      
      // Success
      setUploadState({
        isUploading: false,
        progress: 100,
        error: null,
        isComplete: true,
        isProcessing: false
      });
      
      toast({
        title: "Upload successful",
        description: "Your video has been uploaded successfully",
      });
      
      // Call the completion callback if provided
      if (onComplete && postData?.id) {
        onComplete(postData.id);
      } else {
        // Navigate to shorts feed
        setTimeout(() => {
          navigate("/shorts");
        }, 1000);
      }
      
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error.message || "Failed to upload video",
        isComplete: false,
        isProcessing: false
      });
      
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload video",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Video
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Video selector or preview */}
        {!selectedFile ? (
          <div 
            className="border-2 border-dashed rounded-md border-gray-300 hover:border-primary p-8 flex flex-col items-center justify-center cursor-pointer transition-all"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="h-10 w-10 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-1">
              Click to select a video
            </p>
            <p className="text-xs text-gray-500">
              MP4, WebM, MOV up to {maxSizeInMB}MB
            </p>
          </div>
        ) : (
          <div className="relative rounded-md overflow-hidden aspect-video bg-black">
            {/* Video preview */}
            {previewUrl && (
              <video
                ref={videoRef}
                src={previewUrl}
                className="w-full h-full object-contain"
                onLoadedData={handleVideoLoad}
                onError={handleVideoError}
                onClick={togglePlayback}
              />
            )}
            
            {/* Play/pause button overlay */}
            <button
              type="button"
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
              onClick={togglePlayback}
            >
              {isPreviewPlaying ? (
                <Pause className="h-12 w-12 text-white opacity-70" />
              ) : (
                <Play className="h-12 w-12 text-white opacity-70" />
              )}
            </button>
            
            {/* Remove button */}
            <button
              type="button"
              className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black rounded-full text-white"
              onClick={clearVideo}
            >
              <X className="h-4 w-4" />
            </button>
            
            {/* File name */}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/70 text-white text-xs flex justify-between">
              <span className="truncate max-w-[80%]">{selectedFile.name}</span>
              <span>{Math.round(selectedFile.size / 1024 / 1024)}MB</span>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {uploadState.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-800">{uploadState.error}</span>
          </div>
        )}
        
        {/* Title input */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a title to your video"
            disabled={uploadState.isUploading || uploadState.isProcessing}
            className="bg-card"
          />
        </div>
        
        {/* Description textarea */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your video..."
            disabled={uploadState.isUploading || uploadState.isProcessing}
            className="resize-none bg-card"
          />
        </div>
        
        {/* Premium toggle */}
        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="premium"
            checked={isPremium}
            onCheckedChange={setIsPremium}
            disabled={uploadState.isUploading || uploadState.isProcessing}
          />
          <Label htmlFor="premium">Premium content (subscribers only)</Label>
        </div>
        
        {/* Upload progress */}
        {uploadState.isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadState.progress}%</span>
            </div>
            <Progress value={uploadState.progress} />
          </div>
        )}
        
        {/* Processing message */}
        {uploadState.isProcessing && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-md">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            <span className="text-sm text-blue-700">Processing your video...</span>
          </div>
        )}
        
        {/* Success message */}
        {uploadState.isComplete && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-md">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-700">Video uploaded successfully</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={onCancel || (() => navigate(-1))}
          disabled={uploadState.isUploading || uploadState.isProcessing}
        >
          Cancel
        </Button>
        
        <Button
          onClick={handleUpload}
          disabled={
            !selectedFile || 
            !title || 
            uploadState.isUploading || 
            uploadState.isProcessing ||
            uploadState.isComplete
          }
        >
          {uploadState.isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : uploadState.isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : uploadState.isComplete ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
