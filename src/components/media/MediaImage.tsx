
import { useState, useEffect } from "react";
import { Image } from "lucide-react";
import { WatermarkOverlay } from "@/components/media/WatermarkOverlay";

interface MediaImageProps {
  url: string | null;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  showWatermark?: boolean;
  creatorId?: string;
  onClick?: () => void;
}

export const MediaImage = ({
  url,
  alt,
  className = "",
  onLoad,
  onError,
  showWatermark = false,
  creatorId,
  onClick
}: MediaImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Reset state when URL changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [url]);

  // Handle successful load
  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    if (onLoad) onLoad();
  };

  // Handle load error
  const handleError = () => {
    setHasError(true);
    console.error("Image load error for URL:", url);
    if (onError) onError();
  };

  // If no URL provided, show placeholder
  if (!url) {
    return (
      <div className={`flex items-center justify-center bg-luxury-darker/70 ${className}`}>
        <Image className="h-12 w-12 text-luxury-neutral/30" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-luxury-darker/30">
          <Image className="h-8 w-8 text-luxury-neutral/30" />
        </div>
      )}
      
      <img
        src={url}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={handleLoad}
        onError={handleError}
        onClick={onClick}
        style={{ cursor: onClick ? "pointer" : "default" }}
        loading="lazy"
      />
      
      {showWatermark && isLoaded && creatorId && (
        <WatermarkOverlay creatorId={creatorId} />
      )}
    </div>
  );
};
