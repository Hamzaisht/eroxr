
import { useState, useEffect } from "react";
import { MediaError } from "./MediaError";
import { MediaLoading } from "./MediaLoading";

interface MediaImageProps {
  url: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  onClick?: () => void;
}

export const MediaImage = ({
  url,
  alt,
  className = "",
  onLoad,
  onError,
  onClick
}: MediaImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [url]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
    if (onLoad) onLoad();
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
    if (onError) onError();
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setIsLoading(true);
    setHasError(false);
  };

  if (hasError) {
    return (
      <MediaError 
        message="Failed to load image"
        onRetry={retryCount < 3 ? handleRetry : undefined}
      />
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && <MediaLoading />}
      <img
        src={url}
        alt={alt}
        className={`${className} ${isLoading ? 'invisible' : 'visible'}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        onClick={onClick}
      />
    </div>
  );
};
