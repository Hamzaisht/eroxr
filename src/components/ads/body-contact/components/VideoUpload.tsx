
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  X, 
  Play, 
  VideoIcon, 
  Loader2 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface VideoUploadProps {
  videoFile: File | null;
  onUpdateVideoFile: (value: File | null) => void;
}

export const VideoUpload = ({ videoFile, onUpdateVideoFile }: VideoUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFile(file);
  };

  const handleFile = (file: File | null) => {
    // Clean up previous preview URL if it exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    if (!file) {
      onUpdateVideoFile(null);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid video file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (100MB max)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Video file must be smaller than 100MB",
        variant: "destructive"
      });
      return;
    }

    onUpdateVideoFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent's onClick
    
    // Clean up the URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setPreviewUrl(null);
    onUpdateVideoFile(null);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        Video Profile <span className="text-red-500">*</span>
      </label>

      {videoFile && previewUrl ? (
        // Preview with video player
        <div 
          className="relative rounded-lg overflow-hidden aspect-video bg-black"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={togglePlay}
        >
          <video
            src={previewUrl}
            className="w-full h-full object-contain"
            autoPlay={isPlaying}
            controls={isPlaying}
            muted={!isPlaying}
            loop
            playsInline
          />
          
          {/* Play button overlay when not playing */}
          {!isPlaying && isHovering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Play size={48} className="text-white opacity-80" />
            </div>
          )}
          
          {/* Video info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 text-white text-sm flex justify-between items-center">
            <div className="truncate mr-2">{videoFile.name}</div>
            <div>{(videoFile.size / (1024 * 1024)).toFixed(2)}MB</div>
          </div>
          
          {/* Remove button */}
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute top-2 right-2 rounded-full opacity-90"
            onClick={handleClearFile}
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        // Upload button/area
        <div
          onClick={() => document.getElementById('video-upload')?.click()}
          className={cn(
            "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer",
            "transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/10",
            "min-h-[200px]"
          )}
        >
          <VideoIcon size={40} className="mb-2 text-gray-400" />
          <p className="text-sm text-center text-gray-500 mb-2">
            Click to upload your video profile
          </p>
          <p className="text-xs text-center text-gray-400">
            MP4, WebM, or MOV file (max 100MB)
          </p>
          <Input
            id="video-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="video/mp4,video/webm,video/quicktime"
          />
        </div>
      )}
      
      <p className="text-xs text-gray-500 mt-1">
        Upload a short video introducing yourself (max 2 minutes recommended).
      </p>
    </div>
  );
};
