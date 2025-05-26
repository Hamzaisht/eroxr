
import { useState } from "react";
import { AlertCircle, ImageIcon } from "lucide-react";
import { MediaWatermark } from "../MediaWatermark";
import { AccessGate } from "../AccessGate";
import { MediaRendererProps } from "@/utils/media/types";
import { useSecureMediaUrl } from "@/hooks/useSecureMediaUrl";

export const ImageRenderer = ({
  media,
  className = "",
  showWatermark = true,
  onError
}: MediaRendererProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { url: secureUrl, isLoading: urlLoading } = useSecureMediaUrl({
    url: media.url,
    accessLevel: media.accessLevel
  });

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (urlLoading) {
    return (
      <div className={`relative flex items-center justify-center bg-gray-900 ${className}`}>
        <ImageIcon className="w-8 h-8 text-gray-400 animate-pulse" />
      </div>
    );
  }

  if (hasError || !secureUrl) {
    return (
      <div className={`relative flex items-center justify-center bg-gray-900 ${className}`}>
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Failed to load image</p>
        </div>
      </div>
    );
  }

  return (
    <AccessGate
      creatorId={media.creatorId}
      creatorHandle={media.creatorHandle}
      contentId={media.postId}
      accessLevel={media.accessLevel}
      ppvAmount={media.ppvAmount}
      className={className}
    >
      <div className="relative w-full h-full">
        <img
          src={secureUrl}
          alt={media.alt || "Media content"}
          className={`w-full h-full object-cover transition-all duration-300 ${
            !isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
        />

        {/* Watermark */}
        {showWatermark && isLoaded && (
          <MediaWatermark creatorHandle={media.creatorHandle} />
        )}
      </div>
    </AccessGate>
  );
};
