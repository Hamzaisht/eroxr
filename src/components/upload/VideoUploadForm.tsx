
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
  AlertCircle,
  CheckCircle,
  Loader2,
  Trash2,
  Upload,
  Video,
  Play,
  Pause,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  
  // Upload state
  const [uploadState, setUploadState] = useState({
    isUploading: false,
    progress: 0,
    error: null as string | null,
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

  // Clean up preview URL when component unmounts
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
    processSelectedFile(file);
  };

  // Process the selected file
  const processSelectedFile = (file?: File) => {
    if (!file) return;
    
    // Clean up previous preview if exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    
    // Validate file type
    if (!file.type.startsWith('video/')) {
      setUploadState(prev => ({
        ...prev,
        error: "Please select a valid video file"
      }));
      return;
    }
    
    // Validate file size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      setUploadState(prev => ({
        ...prev,
        error: `Video size must be less than ${maxSizeInMB}MB`
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

    // Show success toast
    toast({
      title: "Video selected",
      description: "Preview ready. Add details and click upload when ready.",
    });
  };

  // Handle drag events
  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, isDragActive: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isDragActive);
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // Toggle video playback
  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Clear selected video
  const clearVideo = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsPlaying(false);
    setTitle("");
    setDescription("");
    setUploadState(prev => ({
      ...prev,
      error: null
    }));
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Format bytes to human-readable size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Upload the video
  const handleUpload = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to upload videos",
        variant: "destructive",
      });
      navigate("/login", { state: { from: "/shorts/upload" } });
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
      
      // Upload progress simulation
      let progressInterval = setInterval(() => {
        setUploadState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 5, 90)
        }));
      }, 300);
      
      // Upload the file to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from('shorts')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });
      
      clearInterval(progressInterval);
      
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
        }, 1500);
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
    <div className="max-w-xl mx-auto bg-black text-white rounded-xl overflow-hidden shadow-lg p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <Video className="h-6 w-6 text-luxury-primary" />
        <h2 className="text-xl font-bold">Upload Short Video</h2>
      </div>
      
      {!selectedFile ? (
        <div
          className={`border-2 ${
            isDragging ? "border-luxury-primary bg-luxury-primary/10" : "border-gray-700"
          } border-dashed rounded-lg flex flex-col items-center justify-center h-56 cursor-pointer transition-all duration-200 hover:border-luxury-primary/70 hover:bg-luxury-primary/5`}
          onDragEnter={(e) => handleDragEvents(e, true)}
          onDragOver={(e) => handleDragEvents(e, true)}
          onDragLeave={(e) => handleDragEvents(e, false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-base text-gray-300 mb-2">
            {isDragging ? "Drop your video here" : "Drag & drop or click to upload"}
          </p>
          <p className="text-xs text-gray-500">
            MP4, WebM, MOV up to {maxSizeInMB}MB
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Video preview */}
          <div className="relative rounded-lg overflow-hidden aspect-video bg-black border border-gray-800">
            {previewUrl && (
              <video
                ref={videoRef}
                src={previewUrl}
                className="w-full h-full object-contain"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                onClick={togglePlayback}
              />
            )}
            
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
              onClick={togglePlayback}
            >
              {isPlaying ? (
                <Pause className="h-16 w-16 text-white/90" />
              ) : (
                <Play className="h-16 w-16 text-white/90" />
              )}
            </div>
            
            <button
              type="button"
              onClick={clearVideo}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
              title="Remove video"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 text-xs flex justify-between items-center">
              <span className="truncate max-w-[70%]">{selectedFile.name}</span>
              <span className="text-luxury-primary">{formatFileSize(selectedFile.size)}</span>
            </div>
          </div>
          
          {/* Video details form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-200 mb-1.5 block">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a title to your video"
                disabled={uploadState.isUploading || uploadState.isProcessing}
                className="border-gray-700 bg-gray-900 text-white focus:ring-luxury-primary"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-gray-200 mb-1.5 block">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell viewers about your video..."
                disabled={uploadState.isUploading || uploadState.isProcessing}
                className="resize-none border-gray-700 bg-gray-900 text-white focus:ring-luxury-primary min-h-[80px]"
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="premium"
                checked={isPremium}
                onCheckedChange={setIsPremium}
                disabled={uploadState.isUploading || uploadState.isProcessing}
                className="data-[state=checked]:bg-luxury-primary"
              />
              <Label htmlFor="premium" className="text-gray-200">Premium content (subscribers only)</Label>
            </div>
          </div>
        </div>
      )}
      
      {/* Error message */}
      <AnimatePresence>
        {uploadState.error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-3 mt-6 bg-red-950/40 border border-red-800/50 rounded-md text-red-200"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
            <p className="text-sm">{uploadState.error}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Upload progress */}
      <AnimatePresence>
        {uploadState.isUploading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 space-y-2"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Uploading...</span>
              <span className="text-luxury-primary font-medium">{Math.round(uploadState.progress)}%</span>
            </div>
            <Progress 
              value={uploadState.progress} 
              className="h-2 bg-gray-800" 
              indicatorClassName="bg-gradient-to-r from-luxury-primary to-luxury-primary/80"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Processing message */}
      <AnimatePresence>
        {uploadState.isProcessing && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-3 mt-6 bg-blue-950/30 border border-blue-800/40 rounded-md text-blue-200"
          >
            <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
            <span className="text-sm">Processing your video...</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Success message */}
      <AnimatePresence>
        {uploadState.isComplete && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-3 mt-6 bg-green-950/30 border border-green-800/40 rounded-md text-green-200"
          >
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-sm">Video uploaded successfully</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6">
        <Button
          variant="outline"
          onClick={onCancel || (() => navigate(-1))}
          disabled={uploadState.isUploading || uploadState.isProcessing}
          className="text-gray-300 border-gray-700 hover:bg-gray-800 hover:text-white"
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
          className="bg-luxury-primary hover:bg-luxury-primary/90 text-white"
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
              Complete
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
