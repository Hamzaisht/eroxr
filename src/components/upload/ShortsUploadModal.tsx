import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDropzone } from "react-dropzone";
import { 
  Upload, 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Film, 
  Sparkles,
  Hash,
  AtSign,
  Eye,
  Users,
  Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface ShortsUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: () => void;
}

export const ShortsUploadModal = ({ isOpen, onClose, onUploadComplete }: ShortsUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Auto-generate title from filename
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      setTitle(fileName);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a video file",
        variant: "destructive",
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.webm', '.ogg', '.mov']
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload video to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Real-time progress simulation for better UX
      setUploadProgress(20);
      
      // Simulate upload progress more smoothly
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 85) {
            clearInterval(progressInterval);
            return 85;
          }
          return prev + Math.random() * 5 + 2;
        });
      }, 150);

      // Complete progress after successful upload
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      // Create video record
      const { error: insertError } = await supabase
        .from('videos')
        .insert({
          title: title || 'Untitled Video',
          description: description,
          video_url: publicUrl,
          creator_id: user.id,
          visibility: visibility,
          like_count: 0,
          view_count: 0,
          share_count: 0,
          comment_count: 0
        });

      if (insertError) throw insertError;

      toast({
        title: "Success! 🎉",
        description: "Your video has been uploaded successfully",
      });

      // Reset form
      setSelectedFile(null);
      setPreviewUrl("");
      setTitle("");
      setDescription("");
      setHashtags("");
      setUploadProgress(0);
      
      onUploadComplete?.();
      onClose();

    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setTitle("");
    setUploadProgress(0);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const formatHashtags = (input: string) => {
    return input.split(/[\s,]+/)
      .filter(tag => tag.length > 0)
      .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
      .join(' ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] p-0 bg-black border-primary/20 overflow-hidden">
        <div className="flex h-full max-h-[95vh]">
          {/* Video Preview Section */}
          <div className="flex-1 bg-black relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!selectedFile ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex items-center justify-center"
                >
                  <div
                    {...getRootProps()}
                    className={`w-full h-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                      isDragActive ? 'bg-primary/10 border-primary' : 'bg-gray-900/50 border-gray-700'
                    } border-2 border-dashed m-4 rounded-2xl relative overflow-hidden`}
                  >
                    <input {...getInputProps()} />
                    
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
                    
                    <motion.div
                      animate={{ 
                        scale: isDragActive ? 1.1 : 1,
                        rotate: isDragActive ? 5 : 0 
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="flex flex-col items-center space-y-6 z-10"
                    >
                      <div className="relative">
                        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/30">
                          <Film className="w-12 h-12 text-primary" />
                        </div>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-primary to-blue-500 rounded-full flex items-center justify-center"
                        >
                          <Sparkles className="w-4 h-4 text-white" />
                        </motion.div>
                      </div>
                      
                      <div className="text-center space-y-2">
                        <h3 className="text-2xl font-bold text-white">
                          {isDragActive ? "Drop your video here!" : "Upload your short"}
                        </h3>
                        <p className="text-gray-400 max-w-md">
                          Drag and drop your video file or click to browse. 
                          <span className="block text-sm mt-1">Supports MP4, WebM, MOV (max 100MB)</span>
                        </p>
                      </div>
                      
                      <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold">
                        <Upload className="w-5 h-5 mr-2" />
                        Choose File
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="h-full relative bg-black flex items-center justify-center"
                >
                  <video
                    ref={videoRef}
                    src={previewUrl}
                    className="max-w-full max-h-full object-contain rounded-lg"
                    muted={isMuted}
                    loop
                    playsInline
                    onLoadedData={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = 0;
                      }
                    }}
                  />
                  
                  {/* Video Controls Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="flex space-x-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={togglePlayPause}
                        className="w-16 h-16 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                      >
                        {isPlaying ? (
                          <Pause className="w-8 h-8 text-white" />
                        ) : (
                          <Play className="w-8 h-8 text-white ml-1" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMute}
                        className="w-16 h-16 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                      >
                        {isMuted ? (
                          <VolumeX className="w-8 h-8 text-white" />
                        ) : (
                          <Volume2 className="w-8 h-8 text-white" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={removeFile}
                    className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 hover:bg-red-500/50 backdrop-blur-sm"
                  >
                    <X className="w-5 h-5 text-white" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Form Section */}
          <div className="w-96 bg-gray-900/95 backdrop-blur-xl border-l border-gray-800 p-6 overflow-y-auto fade-scrollbar max-h-[95vh]">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Sparkles className="w-6 h-6 mr-2 text-primary" />
                  Create Short
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your video a catchy title..."
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-primary"
                  maxLength={100}
                />
                <div className="text-xs text-gray-500 text-right">{title.length}/100</div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell your story... What's this video about?"
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-primary resize-none"
                  rows={4}
                  maxLength={500}
                />
                <div className="text-xs text-gray-500 text-right">{description.length}/500</div>
              </div>

              {/* Hashtags */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center">
                  <Hash className="w-4 h-4 mr-1" />
                  Hashtags
                </label>
                <Input
                  value={hashtags}
                  onChange={(e) => setHashtags(formatHashtags(e.target.value))}
                  placeholder="#viral #shorts #fyp"
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-primary"
                />
                <div className="text-xs text-gray-500">Separate hashtags with spaces</div>
              </div>

              {/* Visibility */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">Who can see this?</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setVisibility("public")}
                    className={`w-full p-3 rounded-lg border transition-all ${
                      visibility === "public"
                        ? "border-primary bg-primary/10 text-white"
                        : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center">
                      <Eye className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Public</div>
                        <div className="text-xs opacity-70">Everyone can see this video</div>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setVisibility("private")}
                    className={`w-full p-3 rounded-lg border transition-all ${
                      visibility === "private"
                        ? "border-primary bg-primary/10 text-white"
                        : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center">
                      <Lock className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Private</div>
                        <div className="text-xs opacity-70">Only you can see this video</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Uploading...</span>
                    <span className="text-primary">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading || !title.trim()}
                className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white font-semibold py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                ) : (
                  <Sparkles className="w-5 h-5 mr-2" />
                )}
                {isUploading ? 'Uploading...' : 'Publish Short'}
              </Button>

              {/* Tips */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-primary flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Pro Tips
                </h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Keep videos under 60 seconds for maximum engagement</li>
                  <li>• Use trending hashtags to reach more viewers</li>
                  <li>• Add captions for better accessibility</li>
                  <li>• Post when your audience is most active</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};