import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AdFormValues } from "../types";
import { Upload, Image as ImageIcon, Video, Check, AlertCircle, Play, Pause, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaUploadStepProps {
  values: AdFormValues;
  onUpdateValues: (values: Partial<AdFormValues>) => void;
}

export const MediaUploadStep = ({ values, onUpdateValues }: MediaUploadStepProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState("video");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    
    if (file) {
      setIsUploading(true);
      
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        setUploadError("File too large. Maximum size is 50MB.");
        setIsUploading(false);
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('video/')) {
        setUploadError("Please upload a valid video file.");
        setIsUploading(false);
        return;
      }
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          setTimeout(() => {
            setIsUploading(false);
            onUpdateValues({ videoFile: file });
            
            // Generate fake thumbnails
            generateThumbnails(file);
          }, 500);
        }
        setUploadProgress(progress);
      }, 200);
    }
  };

  const generateThumbnails = (file: File) => {
    // This would typically be done server-side, but for the demo we'll just use the video file
    // to create a fake video element and capture frames
    const videoElement = document.createElement('video');
    videoElement.preload = 'metadata';
    
    videoElement.onloadedmetadata = () => {
      const duration = videoElement.duration;
      
      // Generate 3 thumbnails at different points in the video
      const thumbnailTimes = [
        duration * 0.25, 
        duration * 0.5, 
        duration * 0.75
      ];
      
      // For demo purposes, we'll just use the same preview 3 times since we can't actually
      // generate real thumbnails on the client
      const fakeUrl = URL.createObjectURL(file);
      setThumbnails([fakeUrl, fakeUrl, fakeUrl]);
    };
    
    videoElement.src = URL.createObjectURL(file);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setUploadError("Avatar file too large. Maximum size is 5MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        onUpdateValues({ avatarFile: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    
    if (isVideoPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(error => {
        console.error('Video playback error:', error);
        setUploadError("Unable to play video. Please try another file.");
      });
    }
    
    setIsVideoPlaying(!isVideoPlaying);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      if (selectedTab === "video") {
        // Manually trigger file input change
        if (fileInputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(files[0]);
          fileInputRef.current.files = dataTransfer.files;
          
          // Trigger change event
          const event = new Event('change', { bubbles: true });
          fileInputRef.current.dispatchEvent(event);
        }
      } else {
        // Handle avatar drop
        if (avatarInputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(files[0]);
          avatarInputRef.current.files = dataTransfer.files;
          
          // Trigger change event
          const event = new Event('change', { bubbles: true });
          avatarInputRef.current.dispatchEvent(event);
        }
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <Tabs defaultValue="video" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <motion.div variants={itemVariants}>
          <TabsList className="w-full grid grid-cols-2 bg-black/30 border border-luxury-primary/10">
            <TabsTrigger 
              value="video" 
              className="data-[state=active]:bg-luxury-primary/20 data-[state=active]:text-luxury-primary"
            >
              <Video className="mr-2 h-4 w-4" />
              Video Upload
            </TabsTrigger>
            <TabsTrigger 
              value="avatar"
              className="data-[state=active]:bg-luxury-primary/20 data-[state=active]:text-luxury-primary"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Profile Photo
            </TabsTrigger>
          </TabsList>
        </motion.div>

        <TabsContent value="video" className="mt-6">
          <motion.div 
            variants={itemVariants}
            className="space-y-4"
          >
            <Label className="text-luxury-neutral text-md font-medium">Video Profile <span className="text-red-500">*</span></Label>
            
            {/* Video upload area */}
            <div 
              className={`relative border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-all duration-300
                ${values.videoFile ? 'border-luxury-primary/40 bg-luxury-primary/5' : 'border-muted-foreground/30 hover:border-luxury-primary/30'}
                ${isUploading ? 'bg-luxury-primary/5' : ''}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
                id="video-upload"
                disabled={isUploading}
              />

              {!values.videoFile && !isUploading && (
                <motion.div variants={itemVariants} className="text-center">
                  <Video className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload Your Video</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md">
                    Drag and drop your video here, or click to browse. Maximum size: 50MB. Recommended length: 30-60 seconds.
                  </p>
                  <Label
                    htmlFor="video-upload"
                    className="inline-flex items-center gap-2 cursor-pointer bg-luxury-primary/10 hover:bg-luxury-primary/20 
                      text-luxury-primary px-4 py-2 rounded-md transition-all duration-300"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Video
                  </Label>
                </motion.div>
              )}

              {isUploading && (
                <motion.div 
                  variants={itemVariants}
                  className="w-full max-w-md text-center"
                >
                  <div className="relative mb-4">
                    <svg className="w-20 h-20 mx-auto animate-spin text-muted-foreground/50" viewBox="0 0 100 100">
                      <circle
                        className="opacity-25"
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <circle
                        className="opacity-75"
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        fill="none"
                        style={{
                          strokeDasharray: 283,
                          strokeDashoffset: 283 - (uploadProgress / 100) * 283,
                          stroke: 'var(--color-primary)',
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-medium">{Math.round(uploadProgress)}%</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Uploading Video...</h3>
                  <p className="text-sm text-muted-foreground">Please wait while we process your video.</p>
                </motion.div>
              )}

              {values.videoFile && !isUploading && (
                <motion.div variants={itemVariants} className="w-full">
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-4 max-w-2xl mx-auto">
                    <video
                      ref={videoRef}
                      src={values.videoFile ? URL.createObjectURL(values.videoFile) : undefined}
                      className="w-full h-full object-cover"
                      onPlay={() => setIsVideoPlaying(true)}
                      onPause={() => setIsVideoPlaying(false)}
                      onEnded={() => setIsVideoPlaying(false)}
                      loop
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-16 w-16 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50"
                        onClick={toggleVideoPlay}
                      >
                        {isVideoPlaying ? (
                          <Pause className="h-8 w-8 text-white" />
                        ) : (
                          <Play className="h-8 w-8 text-white" />
                        )}
                      </Button>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-white bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                        <Check className="h-4 w-4 text-green-400" />
                        <span>
                          {values.videoFile.name.length > 20 
                            ? values.videoFile.name.substring(0, 20) + '...' 
                            : values.videoFile.name} 
                          ({(values.videoFile.size / (1024 * 1024)).toFixed(1)} MB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm rounded-full px-3"
                        onClick={() => {
                          setIsVideoPlaying(false);
                          onUpdateValues({ videoFile: null });
                          if (videoRef.current) {
                            videoRef.current.pause();
                          }
                        }}
                      >
                        Change Video
                      </Button>
                    </div>
                  </div>
                  
                  {/* Thumbnails selection - would be generated server-side in real implementation */}
                  {thumbnails.length > 0 && (
                    <motion.div 
                      variants={itemVariants}
                      className="mt-6 space-y-2"
                    >
                      <Label className="text-luxury-neutral">Select Thumbnail</Label>
                      <div className="flex gap-3 justify-center">
                        {thumbnails.map((thumb, index) => (
                          <button
                            key={index}
                            className="relative aspect-video w-[160px] rounded-md overflow-hidden border-2 border-transparent 
                              hover:border-luxury-primary transition-all duration-300 focus:outline-none"
                            onClick={() => {
                              // In a real implementation, this would select the thumbnail to use
                              toast({
                                title: "Thumbnail Selected",
                                description: `Using thumbnail ${index + 1} for your video`,
                              });
                            }}
                          >
                            <img 
                              src={thumb} 
                              alt={`Thumbnail ${index + 1}`} 
                              className="w-full h-full object-cover" 
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                              <Check className="h-6 w-6 text-white" />
                            </div>
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Choose a thumbnail that best represents your video
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
            
            {uploadError && (
              <motion.div 
                variants={itemVariants}
                className="flex items-center text-sm text-red-500 mt-1"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                {uploadError}
              </motion.div>
            )}
            
            <motion.p variants={itemVariants} className="text-sm text-muted-foreground">
              <span className="text-red-500">Required.</span> Maximum size: 50MB. Recommended length: 30-60 seconds.
            </motion.p>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="avatar" className="mt-6">
          <motion.div 
            variants={itemVariants}
            className="space-y-4"
          >
            <Label className="text-luxury-neutral text-md font-medium">Profile Photo</Label>
            
            <div 
              className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-all duration-300
                border-muted-foreground/30 hover:border-luxury-primary/30"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="relative group">
                <Avatar className="h-32 w-32 border-2 border-luxury-primary/30 shadow-[0_0_15px_rgba(155,135,245,0.3)]
                  transition-all duration-500 group-hover:shadow-[0_0_25px_rgba(155,135,245,0.6)]">
                  <AvatarImage src={avatarPreview} />
                  <AvatarFallback>
                    <User className="h-16 w-16 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="avatar-upload"
                />
              </div>
              
              <div className="mt-6 text-center">
                <h3 className="text-lg font-medium mb-2">Upload Profile Picture</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md">
                  This will be displayed alongside your ad. Choose a clear, appealing image.
                </p>
                <Label
                  htmlFor="avatar-upload"
                  className="inline-flex items-center gap-2 cursor-pointer bg-luxury-primary/10 hover:bg-luxury-primary/20
                    text-luxury-primary px-4 py-2 rounded-md transition-all duration-300"
                >
                  <ImageIcon className="h-4 w-4" />
                  {values.avatarFile ? "Change Photo" : "Select Photo"}
                </Label>
              </div>
            </div>
            
            <motion.p variants={itemVariants} className="text-sm text-muted-foreground">
              Maximum size: 5MB. Recommended format: JPG or PNG. Square images work best.
            </motion.p>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};
