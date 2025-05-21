
import { useState, useRef, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Loader2,
  Info,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useMediaUpload } from "@/hooks/useMediaUpload";

interface ErosUploadFormProps {
  onUploaded?: (videoId: string) => void;
  maxFileSize?: number; // in MB
}

export function ErosUploadForm({
  onUploaded,
  maxFileSize = 100, // default 100MB
}: ErosUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [hoveringPreview, setHoveringPreview] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const session = useSession();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { upload, uploadState } = useMediaUpload({ maxSizeInMB: maxFileSize });

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle file selection
  const handleFileSelect = (file: File | null) => {
    // Revoke old preview if exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    
    // Clear any previous errors
    setValidationError(null);
    
    if (!file) {
      setSelectedFile(null);
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('video/')) {
      setValidationError("Please select a valid video file");
      return;
    }
    
    // Validate file size
    if (file.size > maxFileSize * 1024 * 1024) {
      setValidationError(`File size must be less than ${maxFileSize}MB`);
      return;
    }
    
    // Set the file and create preview
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // Handle file input change
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleFileSelect(file);
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Trigger file input click
  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  // Remove selected file
  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setSelectedFile(null);
    setPreviewUrl(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to upload videos"
      });
      return;
    }
    
    if (!selectedFile) {
      setValidationError("Please select a video file");
      return;
    }
    
    try {
      // Upload the video using our central upload utility
      const videoUrl = await upload({
        file: selectedFile,
        mediaType: 'video',
        contentCategory: 'eros-videos',
        onProgress: (progress) => {
          console.log(`Eros upload progress: ${progress}%`);
        }
      });
      
      if (!videoUrl) {
        throw new Error("Failed to upload video");
      }
      
      // Create post in the database
      const { data: videoData, error: videoError } = await supabase
        .from('posts')
        .insert({
          creator_id: session.user.id,
          content: description,
          video_urls: [videoUrl],
          tags: tags ? tags.split(',').map(tag => tag.trim().replace(/^#/, '')) : [],
          visibility: 'public',
        })
        .select('id')
        .single();
      
      if (videoError) {
        throw new Error(videoError.message);
      }
      
      // Success
      toast({
        title: "Video uploaded",
        description: "Your video has been uploaded and is being processed",
      });
      
      // Reset form
      handleRemoveFile();
      setDescription("");
      setTags("");
      
      // Callback if provided
      if (onUploaded && videoData?.id) {
        onUploaded(videoData.id);
      }
      
      // Navigate to shorts page
      navigate("/shorts");
      
    } catch (error: any) {
      console.error("Upload error:", error);
      
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload video",
        variant: "destructive"
      });
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload to Eros
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* File upload area */}
          {!selectedFile ? (
            <div
              className={`border-2 border-dashed rounded-md ${
                dragActive ? "border-luxury-primary bg-luxury-primary/10" : "border-gray-300"
              } p-8 flex flex-col items-center justify-center cursor-pointer transition-all`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={handleSelectFileClick}
            >
              <Upload className="h-10 w-10 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-1">
                Drag and drop your video here, or click to select
              </p>
              <p className="text-xs text-gray-500">
                MP4, WebM, MOV up to {maxFileSize}MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative rounded-md overflow-hidden h-80 bg-black">
              {/* Video preview */}
              <div
                className="absolute inset-0 cursor-pointer"
                onMouseEnter={() => setHoveringPreview(true)}
                onMouseLeave={() => setHoveringPreview(false)}
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
              >
                {previewUrl && (
                  <video
                    src={previewUrl}
                    className="w-full h-full object-contain"
                    autoPlay={isVideoPlaying}
                    controls={isVideoPlaying}
                    muted={!isVideoPlaying}
                  />
                )}
                
                {/* Hover overlay */}
                {hoveringPreview && !isVideoPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <Play className="h-12 w-12 text-white opacity-80" />
                  </div>
                )}
              </div>
              
              {/* Remove button */}
              <button
                type="button"
                className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black rounded-full text-white z-10"
                onClick={handleRemoveFile}
              >
                <X className="h-4 w-4" />
              </button>
              
              {/* File info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/80 text-white text-sm flex justify-between items-center">
                <div className="flex items-center">
                  <Info className="h-4 w-4 mr-1" />
                  <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                </div>
                <span>{formatFileSize(selectedFile.size)}</span>
              </div>
            </div>
          )}
          
          {/* Upload progress */}
          {uploadState.isUploading && (
            <div className="space-y-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Uploading...</span>
                <span>{uploadState.progress}%</span>
              </div>
              <Progress value={uploadState.progress} className="h-2" />
            </div>
          )}
          
          {/* Error message */}
          {(uploadState.error || validationError) && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-800">{uploadState.error || validationError}</span>
            </div>
          )}
          
          {/* Upload complete message */}
          {uploadState.isComplete && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-800">Upload complete!</span>
            </div>
          )}
          
          {/* Description */}
          <div className="space-y-1">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Describe your video..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              disabled={uploadState.isUploading}
            />
          </div>
          
          {/* Tags */}
          <div className="space-y-1">
            <label htmlFor="tags" className="text-sm font-medium">
              Tags (comma separated)
            </label>
            <Input
              id="tags"
              placeholder="fun, funny, dance"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              disabled={uploadState.isUploading}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={uploadState.isUploading}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            disabled={!selectedFile || uploadState.isUploading}
          >
            {uploadState.isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Uploading... {uploadState.progress}%
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
