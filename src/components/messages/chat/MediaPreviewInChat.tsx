import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Play, FileText, Music, Image, Video, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaPreviewInChatProps {
  mediaBlob: Blob;
  mediaType: 'snax' | 'media';
  duration?: number;
  onRemove: () => void;
  className?: string;
}

export const MediaPreviewInChat = ({ 
  mediaBlob, 
  mediaType, 
  duration, 
  onRemove, 
  className 
}: MediaPreviewInChatProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaUrl = URL.createObjectURL(mediaBlob);
  const isVideo = mediaBlob.type.startsWith('video/');
  const isImage = mediaBlob.type.startsWith('image/');
  const isAudio = mediaBlob.type.startsWith('audio/');
  const isDocument = !isVideo && !isImage && !isAudio;

  const getIcon = () => {
    if (isVideo) return Video;
    if (isImage) return Image;
    if (isAudio) return Music;
    return FileText;
  };

  const Icon = getIcon();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      className={cn(
        "relative group rounded-2xl overflow-hidden border-2 bg-background/95 backdrop-blur-sm",
        mediaType === 'snax' 
          ? "border-gradient-to-r from-purple-500 to-pink-500 bg-gradient-to-br from-purple-500/10 to-pink-500/10" 
          : "border-border/50",
        className
      )}
    >
      {/* Media Content */}
      <div className="relative">
        {isImage && (
          <div className="w-full h-32 relative overflow-hidden rounded-t-xl">
            <img
              src={mediaUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        {isVideo && (
          <div className="w-full h-32 relative overflow-hidden rounded-t-xl">
            <video
              src={mediaUrl}
              className="w-full h-full object-cover"
              muted
              loop
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <button 
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors"
              onClick={() => {
                const video = document.querySelector('video') as HTMLVideoElement;
                if (video) {
                  if (video.paused) {
                    video.play();
                  } else {
                    video.pause();
                  }
                }
              }}
            >
              <Play className="h-8 w-8 text-white" />
            </button>
          </div>
        )}

        {(isAudio || isDocument) && (
          <div className="w-full h-32 flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted/30 rounded-t-xl">
            <div className="text-center">
              <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {isAudio ? 'Audio File' : 'Document'}
              </p>
            </div>
          </div>
        )}

        {/* Snax indicator */}
        {mediaType === 'snax' && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Snax
          </div>
        )}
      </div>

      {/* Info Bar */}
      <div className="p-3 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {isVideo ? 'Video' : isImage ? 'Image' : isAudio ? 'Audio' : 'Document'}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {mediaBlob.size && (
                <span>{formatFileSize(mediaBlob.size)}</span>
              )}
              {mediaType === 'snax' && duration && (
                <>
                  <span>•</span>
                  <span>{duration}s disappearing</span>
                </>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Futuristic glow effect for Snax */}
      {mediaType === 'snax' && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse pointer-events-none" />
      )}
    </motion.div>
  );
};