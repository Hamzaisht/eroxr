
import { Loader2, AlertCircle, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefObject } from "react";

interface VideoPreviewProps {
  previewUrl: string | null;
  videoRef: RefObject<HTMLVideoElement>;
  isPreviewLoading: boolean;
  previewError: string | null;
  onVideoLoad: () => void;
  onVideoError: () => void;
  onClear: () => void;
}

export const VideoPreview = ({
  previewUrl,
  videoRef,
  isPreviewLoading,
  previewError,
  onVideoLoad,
  onVideoError,
  onClear
}: VideoPreviewProps) => {
  if (!previewUrl) return null;

  return (
    <div className="relative bg-luxury-darker rounded-lg overflow-hidden aspect-[9/16] max-h-[300px]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {isPreviewLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-luxury-darker/80 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
          </div>
        )}
        
        {previewError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4">
            <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
            <p className="text-sm text-white/90 text-center">{previewError}</p>
            <Button
              onClick={onClear}
              variant="outline"
              className="mt-4"
              size="sm"
            >
              Select Another Video
            </Button>
          </div>
        ) : (
          <video 
            ref={videoRef}
            src={previewUrl} 
            className="w-full h-full object-contain"
            controls
            onLoadedData={onVideoLoad}
            onError={onVideoError}
          />
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full p-1.5"
          onClick={onClear}
        >
          <X className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
};
