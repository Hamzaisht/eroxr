
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UploadCloud, X, PlayCircle, PauseCircle, Scissors, CheckCircle, AlertCircle, VideoIcon } from "lucide-react";
import { motion } from "framer-motion";
import { createFilePreview, revokeFilePreview } from "@/utils/upload/fileUtils";
import { validateVideoFormat, getVideoDuration } from "@/utils/videoProcessing";
import { supabase } from "@/integrations/supabase/client";

const ShortsUpload = () => {
  // State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPremiumContent, setIsPremiumContent] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
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
    isProcessing: false,
  });
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Hooks
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();
  
  // Check if user is authenticated
  useEffect(() => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload videos",
        variant: "destructive",
      });
      navigate("/shorts");
    }
    
    // Set page title
    document.title = "Upload Short Video";
  }, [session, navigate, toast]);
  
  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        revokeFilePreview(previewUrl);
      }
    };
  }, [previewUrl]);
  
  // Handle file selection
  const handleFileSelect = async (file: File | null) => {
    // Clean up previous preview
    if (previewUrl) {
      revokeFilePreview(previewUrl);
      setPreviewUrl(null);
    }
    
    setUploadStatus(prev => ({ ...prev, error: null }));
    
    if (!file) {
      setSelectedFile(null);
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('video/')) {
      setUploadStatus(prev => ({ 
        ...prev, 
        error: "Please select a valid video file (MP4, WebM, or MOV)" 
      }));
      return;
    }
    
    // Validate file size (100MB max)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadStatus(prev => ({ 
        ...prev, 
        error: `File size must be less than 100MB (selected: ${(file.size / (1024 * 1024)).toFixed(2)}MB)` 
      }));
      return;
    }
    
    try {
      // Validate video format
      const isValidFormat = await validateVideoFormat(file);
      if (!isValidFormat) {
        setUploadStatus(prev => ({
          ...prev,
          error: "Invalid video format. Please select a different video."
        }));
        return;
      }
      
      // Get duration
      const duration = await getVideoDuration(file);
      if (duration > 180) { // 3 minutes max
        setUploadStatus(prev => ({
          ...prev,
          error: `Video is too long (${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}). Maximum length is 3 minutes.`
        }));
        return;
      }
      
      // Create preview URL
      const url = createFilePreview(file);
      
      // Set state
      setSelectedFile(file);
      setPreviewUrl(url);
      
      toast({
        title: "Video selected",
        description: "Preview is ready. You can now add details and upload."
      });
    } catch (error) {
      console.error("Error processing video:", error);
      setUploadStatus(prev => ({
        ...prev,
        error: "Failed to process video. Please try another file."
      }));
    }
  };
  
  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
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
  
  // Toggle play/pause
  const togglePlayback = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Handle tag input
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      addTag();
    }
  };
  
  const addTag = () => {
    const tag = currentTag.trim().replace(/^#/, '');
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag]);
      setCurrentTag('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Reset form
  const resetForm = () => {
    if (previewUrl) {
      revokeFilePreview(previewUrl);
    }
    
    setSelectedFile(null);
    setPreviewUrl(null);
    setTitle("");
    setDescription("");
    setTags([]);
    setCurrentTag("");
    setIsPremiumContent(false);
    setUploadStatus({
      isUploading: false,
      progress: 0,
      error: null,
      isComplete: false,
      isProcessing: false,
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Handle upload
  const handleUpload = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload videos",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedFile) {
      setUploadStatus(prev => ({
        ...prev,
        error: "Please select a video file"
      }));
      return;
    }
    
    if (!title.trim()) {
      setUploadStatus(prev => ({
        ...prev,
        error: "Please enter a title for your video"
      }));
      return;
    }
    
    setUploadStatus({
      isUploading: true,
      progress: 0,
      error: null,
      isComplete: false,
      isProcessing: false,
    });
    
    try {
      // Generate a unique file path with the user ID as the folder
      const fileExt = selectedFile.name.split('.').pop() || 'mp4';
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 10);
      const filePath = `${session.user.id}/${timestamp}-${randomId}.${fileExt}`;
      
      // Start progress simulation
      const progressInterval = setInterval(() => {
        setUploadStatus(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 2, 95)
        }));
      }, 300);
      
      // Upload the file
      const { data, error } = await supabase.storage
        .from('eros-videos')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });
      
      clearInterval(progressInterval);
      
      if (error) {
        console.error("Upload error:", error);
        throw new Error(error.message);
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('eros-videos')
        .getPublicUrl(filePath);
      
      setUploadStatus(prev => ({
        ...prev,
        isUploading: false,
        progress: 100,
        isProcessing: true
      }));
      
      // Create a post with the video URL
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          creator_id: session.user.id,
          content: title,
          description: description,
          video_urls: [publicUrl],
          visibility: isPremiumContent ? 'subscribers_only' : 'public',
          tags: tags.length > 0 ? tags : undefined,
          video_processing_status: 'completed',
          video_thumbnail_url: null // We'll update this later when thumbnails are generated
        })
        .select('id')
        .single();
      
      if (postError) {
        throw new Error(postError.message);
      }
      
      setUploadStatus(prev => ({
        ...prev,
        isProcessing: false,
        isComplete: true
      }));
      
      toast({
        title: "Video uploaded successfully",
        description: "Your short video has been uploaded and is now available"
      });
      
      // Navigate to the shorts page after a short delay
      setTimeout(() => {
        navigate(`/shorts/${post.id}`);
      }, 2000);
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadStatus(prev => ({
        ...prev,
        isUploading: false,
        isProcessing: false,
        error: error.message || "Failed to upload video"
      }));
      
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload video",
        variant: "destructive"
      });
    }
  };
  
  // Calculate file size display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // If not authenticated, don't render the form
  if (!session) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-black text-white p-4 pt-16 pb-24">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8 text-center">Upload Short Video</h1>
          
          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Upload to Shorts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Video Upload Area */}
              {!selectedFile ? (
                <div
                  className={`border-2 border-dashed rounded-xl ${
                    dragActive ? "border-luxury-primary bg-luxury-primary/10" : "border-zinc-700"
                  } p-10 flex flex-col items-center justify-center cursor-pointer transition-all`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="h-16 w-16 text-zinc-500 mb-4" />
                  <p className="text-lg text-zinc-300 mb-2">
                    Drag and drop your video here
                  </p>
                  <p className="text-sm text-zinc-500 mb-4">
                    MP4, WebM or MOV (max 100MB)
                  </p>
                  <Button variant="secondary">Select Video</Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Video Preview */}
                  <div className="relative rounded-xl overflow-hidden bg-black aspect-[9/16] max-h-[500px]">
                    {previewUrl && (
                      <video
                        ref={videoRef}
                        src={previewUrl}
                        className="w-full h-full object-contain"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={() => setIsPlaying(false)}
                      />
                    )}
                    
                    {/* Play/Pause Button */}
                    <button
                      type="button"
                      className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                      onClick={togglePlayback}
                    >
                      {isPlaying ? (
                        <PauseCircle className="h-16 w-16 text-white/90" />
                      ) : (
                        <PlayCircle className="h-16 w-16 text-white/90" />
                      )}
                    </button>
                    
                    {/* Remove Button */}
                    <button
                      type="button"
                      className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black/90 rounded-full text-white"
                      onClick={() => handleFileSelect(null)}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* File Info */}
                  <div className="bg-zinc-800/70 rounded-md p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <VideoIcon className="h-5 w-5 text-zinc-400" />
                      <span className="text-zinc-300">{selectedFile.name}</span>
                    </div>
                    <span className="text-zinc-400 text-sm">
                      {formatFileSize(selectedFile.size)}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Error Message */}
              {uploadStatus.error && (
                <div className="bg-red-950/30 border border-red-900 text-red-200 rounded-md p-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <p>{uploadStatus.error}</p>
                </div>
              )}
              
              {/* Video Details */}
              {selectedFile && (
                <div className="space-y-4">
                  <Separator className="bg-zinc-800" />
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input 
                        id="title"
                        placeholder="Add a title to your video"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        disabled={uploadStatus.isUploading || uploadStatus.isProcessing}
                        maxLength={100}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description"
                        placeholder="Tell viewers about your video (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-white resize-none min-h-[100px]"
                        disabled={uploadStatus.isUploading || uploadStatus.isProcessing}
                        maxLength={500}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {tags.map(tag => (
                          <Badge 
                            key={tag} 
                            variant="secondary"
                            className="pl-2 pr-1 py-1 flex items-center gap-1 bg-luxury-primary/20"
                          >
                            #{tag}
                            <button 
                              type="button" 
                              className="ml-1 text-white/70 hover:text-white"
                              onClick={() => removeTag(tag)}
                              disabled={uploadStatus.isUploading || uploadStatus.isProcessing}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <Input 
                        id="tags"
                        placeholder="Add tags (press Enter to add)"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        onBlur={addTag}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        disabled={uploadStatus.isUploading || uploadStatus.isProcessing || tags.length >= 10}
                      />
                      <p className="text-xs text-zinc-500">
                        {tags.length}/10 tags added. Tags help viewers find your content.
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="premium-content"
                        checked={isPremiumContent}
                        onCheckedChange={setIsPremiumContent}
                        disabled={uploadStatus.isUploading || uploadStatus.isProcessing}
                      />
                      <Label htmlFor="premium-content" className="cursor-pointer">
                        Premium Content (Subscribers Only)
                      </Label>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Upload Progress */}
              {(uploadStatus.isUploading || uploadStatus.isProcessing || uploadStatus.isComplete) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-300">
                      {uploadStatus.isProcessing ? "Processing video..." : 
                       uploadStatus.isComplete ? "Upload complete!" : 
                       "Uploading..."}
                    </span>
                    {uploadStatus.isUploading && (
                      <span className="text-sm font-medium text-zinc-300">
                        {Math.round(uploadStatus.progress)}%
                      </span>
                    )}
                  </div>
                  <Progress 
                    value={uploadStatus.progress} 
                    className="h-2 bg-zinc-800" 
                    indicatorClassName="bg-luxury-primary" 
                  />
                  
                  {uploadStatus.isComplete && (
                    <div className="flex items-center gap-2 text-green-400 bg-green-950/20 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5" />
                      <span>Video uploaded successfully! Redirecting...</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigate("/shorts")}
                disabled={uploadStatus.isUploading || uploadStatus.isProcessing}
              >
                Cancel
              </Button>
              {selectedFile && (
                <Button 
                  onClick={handleUpload}
                  disabled={
                    !selectedFile || 
                    !title.trim() || 
                    uploadStatus.isUploading || 
                    uploadStatus.isProcessing || 
                    uploadStatus.isComplete
                  }
                  className="bg-luxury-primary hover:bg-luxury-primary/90 text-white"
                >
                  {uploadStatus.isUploading ? "Uploading..." :
                   uploadStatus.isProcessing ? "Processing..." :
                   uploadStatus.isComplete ? "Uploaded!" :
                   "Upload Video"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ShortsUpload;
