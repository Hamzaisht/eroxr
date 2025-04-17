import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, X, AlertCircle, Check, Camera, Video as VideoIcon, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AdFormValues } from "../types";
import { useToast } from "@/hooks/use-toast";
import { getVideoDuration, validateVideoFormat, generateVideoThumbnails } from "@/utils/videoProcessing";

interface MediaUploadStepProps {
  values: AdFormValues;
  onUpdateValues: (values: Partial<AdFormValues>) => void;
}

export const MediaUploadStep = ({ values, onUpdateValues }: MediaUploadStepProps) => {
  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [videoThumbnails, setVideoThumbnails] = useState<string[]>([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingVideo, setProcessingVideo] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const handleAvatarDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingAvatar(true);
  }, []);

  const handleAvatarDragLeave = useCallback(() => {
    setIsDraggingAvatar(false);
  }, []);

  const handleAvatarDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingAvatar(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleAvatarFile(file);
    }
  }, []);

  const handleAvatarFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file for your avatar",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Avatar image must be smaller than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    onUpdateValues({ avatarFile: file });
  };

  const handleVideoDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingVideo(true);
  }, []);

  const handleVideoDragLeave = useCallback(() => {
    setIsDraggingVideo(false);
  }, []);

  const handleVideoDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingVideo(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleVideoFile(file);
    }
  }, []);

  const cleanupProgressInterval = useCallback(() => {
    if (progressIntervalRef.current !== null) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const handleVideoFile = async (file: File) => {
    setVideoError(null);
    setVideoThumbnails([]);
    setProcessingVideo(true);
    setUploadProgress(0);
    setUploadComplete(false);
    
    cleanupProgressInterval();
    
    if (!file.type.startsWith('video/')) {
      setVideoError("Please upload a video file");
      setProcessingVideo(false);
      toast({
        title: "Invalid file type",
        description: "Please upload a video file",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > 100 * 1024 * 1024) {
      setVideoError("Video must be smaller than 100MB");
      setProcessingVideo(false);
      toast({
        title: "File too large",
        description: "Video must be smaller than 100MB",
        variant: "destructive",
      });
      return;
    }

    try {
      progressIntervalRef.current = window.setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            return 95;
          } else if (prev >= 80) {
            return prev + 0.5;
          } else if (prev >= 60) {
            return prev + 1;
          } else {
            return prev + 2;
          }
        });
      }, 150);
      
      const isValidVideo = await validateVideoFormat(file);
      if (!isValidVideo) {
        cleanupProgressInterval();
        setVideoError("Invalid video format");
        setProcessingVideo(false);
        toast({
          title: "Invalid video format",
          description: "Please upload a valid video file",
          variant: "destructive",
        });
        return;
      }
      
      const duration = await getVideoDuration(file);
      setVideoDuration(duration);
      
      if (duration > 120) {
        cleanupProgressInterval();
        setVideoError("Video must be shorter than 2 minutes");
        setProcessingVideo(false);
        toast({
          title: "Video too long",
          description: "Video must be shorter than 2 minutes",
          variant: "destructive",
        });
        return;
      }
      
      const thumbnails = await generateVideoThumbnails(file);
      setVideoThumbnails(thumbnails);
      
      cleanupProgressInterval();
      setUploadProgress(100);
      setUploadComplete(true);
      
      onUpdateValues({ videoFile: file });
      setProcessingVideo(false);
      
      toast({
        title: "Video uploaded",
        description: "Your video has been successfully processed",
      });
    } catch (error: any) {
      console.error("Error processing video:", error);
      cleanupProgressInterval();
      setVideoError(error.message || "Failed to process video");
      setProcessingVideo(false);
      
      toast({
        title: "Error processing video",
        description: error.message || "Failed to process video",
        variant: "destructive",
      });
    }
  };

  const selectThumbnail = (index: number) => {
    setSelectedThumbnail(index);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h3 className="text-xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent inline-block">
          Media Upload
        </h3>
        <p className="text-sm text-muted-foreground">
          Upload your profile photo OR video. At least one media item is required to create your ad.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="space-y-2">
          <label className="text-sm font-medium">Profile Image</label>
          <div
            className={cn(
              "border-2 border-dashed rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden",
              isDraggingAvatar ? "border-luxury-primary bg-luxury-primary/10" : "border-gray-600",
              values.avatarFile ? "border-green-500 bg-black/40" : ""
            )}
            onDragOver={handleAvatarDragOver}
            onDragLeave={handleAvatarDragLeave}
            onDrop={handleAvatarDrop}
            onClick={() => avatarInputRef.current?.click()}
          >
            {values.avatarFile ? (
              <div className="relative w-full h-full">
                <img
                  src={URL.createObjectURL(values.avatarFile)}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateValues({ avatarFile: null });
                  }}
                >
                  <X size={16} />
                </Button>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-sm font-medium text-white">
                    {values.avatarFile.name}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Camera size={40} className="mb-2 text-gray-400" />
                <p className="text-sm text-center text-gray-400 px-4">
                  Drag & drop your profile image or click to upload
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG • Max 5MB
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            ref={avatarInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleAvatarFile(e.target.files[0]);
              }
            }}
          />
        </motion.div>
        
        <motion.div variants={itemVariants} className="space-y-2">
          <label className="text-sm font-medium flex justify-between items-center">
            <span>Profile Video <span className="text-red-500">*</span></span>
            {videoDuration !== null && (
              <span className="text-xs text-gray-400">
                Duration: {Math.floor(videoDuration)} seconds
              </span>
            )}
          </label>
          <div
            className={cn(
              "border-2 border-dashed rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden relative",
              isDraggingVideo ? "border-luxury-primary bg-luxury-primary/10" : "border-gray-600",
              processingVideo ? "border-yellow-500" : "",
              videoError ? "border-red-500" : "",
              values.videoFile && !processingVideo && !videoError ? "border-green-500 bg-black/40" : ""
            )}
            onDragOver={handleVideoDragOver}
            onDragLeave={handleVideoDragLeave}
            onDrop={handleVideoDrop}
            onClick={() => !processingVideo && videoInputRef.current?.click()}
          >
            {values.videoFile && !processingVideo && !videoError ? (
              <div className="relative w-full h-full">
                <video
                  src={URL.createObjectURL(values.videoFile)}
                  className="w-full h-full object-cover"
                  controls
                  ref={videoRef}
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 rounded-full z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateValues({ videoFile: null });
                    setVideoDuration(null);
                    setVideoThumbnails([]);
                    setUploadComplete(false);
                  }}
                >
                  <X size={16} />
                </Button>
              </div>
            ) : processingVideo ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative h-20 w-20">
                  <svg className="h-20 w-20 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle
                      className="opacity-75"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray="32"
                      strokeDashoffset="12"
                      fill="none"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-medium">{Math.min(Math.round(uploadProgress), 100)}%</span>
                  </div>
                </div>
                <p className="text-sm">Processing your video...</p>
              </div>
            ) : videoError ? (
              <div className="flex flex-col items-center justify-center">
                <AlertCircle size={40} className="text-red-500 mb-2" />
                <p className="text-sm text-red-500 text-center px-4">{videoError}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    setVideoError(null);
                  }}
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                <VideoIcon size={40} className="mb-2 text-gray-400" />
                <p className="text-sm text-center text-gray-400 px-4">
                  Drag & drop your video or click to upload
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  MP4, MOV • Max 100MB • Max 2 minutes
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            ref={videoInputRef}
            className="hidden"
            accept="video/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleVideoFile(e.target.files[0]);
              }
            }}
          />
          
          {uploadComplete && values.videoFile && (
            <div className="flex items-center mt-2 text-green-500 text-sm">
              <CheckCircle size={16} className="mr-2" />
              Video successfully uploaded and ready to publish
            </div>
          )}
        </motion.div>
      </div>
      
      {videoThumbnails.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="space-y-2"
        >
          <label className="text-sm font-medium">Choose thumbnail (optional)</label>
          <div className="grid grid-cols-3 gap-3">
            {videoThumbnails.map((thumbnail, index) => (
              <div
                key={index}
                className={cn(
                  "relative aspect-video rounded-lg overflow-hidden cursor-pointer transition-all duration-200",
                  selectedThumbnail === index ? "ring-2 ring-luxury-primary scale-105" : "opacity-70 hover:opacity-100"
                )}
                onClick={() => selectThumbnail(index)}
              >
                <img src={thumbnail} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                {selectedThumbnail === index && (
                  <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                    <Check size={12} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            This thumbnail will be shown before your video plays
          </p>
        </motion.div>
      )}
      
      <motion.div variants={itemVariants} className="pt-4">
        <p className="text-sm text-luxury-neutral flex items-center">
          <Check size={16} className="mr-2 text-green-500" />
          Your uploads are private and only visible to approved users
        </p>
        <p className="text-xs text-luxury-primary mt-2">
          Note: Your ad will be reviewed before it goes live
        </p>
      </motion.div>
    </motion.div>
  );
};
