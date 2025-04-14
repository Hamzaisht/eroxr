
import { useState } from "react";

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
  const [showFallback, setShowFallback] = useState(false);

  const handleImageError = () => {
    setShowFallback(true);
    if (onError) onError();
  };

  const handleImageLoad = () => {
    if (onLoad) onLoad();
  };

  if (showFallback) {
    return (
      <div 
        className={`bg-gray-900 flex items-center justify-center ${className}`}
        onClick={onClick}
      >
        <p className="text-gray-400 text-sm">Image unavailable</p>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      onLoad={handleImageLoad}
      onError={handleImageError}
      onClick={onClick}
    />
  );
};
