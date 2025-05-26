
import { useState } from "react";
import { AlertCircle, ImageIcon } from "lucide-react";
import { MediaWatermark } from "../MediaWatermark";
import { AccessControlOverlay } from "../AccessControlOverlay";
import { MediaRendererProps } from "@/utils/media/types";
import { useMediaAccess } from "@/hooks/useMediaAccess";
import { useSecureMediaUrl } from "@/hooks/useSecureMediaUrl";
import { shouldBlurMedia } from "@/utils/media/urlUtils";

export const ImageRenderer = ({
  media,
  className = "",
  showWatermark = true,
  onError,
  onAccessRequired
}: MediaRendererProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { canAccess, isLoading: accessLoading } = useMediaAccess({
    creatorId: media.creatorId,
    postId: media.postId,
    accessLevel: media.accessLevel
  });

  const { url: secureUrl, isLoading: urlLoading } = useSecureMediaUrl({
    url: media.url,
    accessLevel: media.accessLevel
  });

  const shouldBlur = shouldBlurMedia(media.accessLevel, canAccess);
  const isLoading = accessLoading || urlLoading;

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const handleAccessAction = (type: 'subscription' | 'purchase' | 'login') => {
    onAccessRequired?.(type);
  };

  if (isLoading) {
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
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={secureUrl}
        alt={media.alt || "Media content"}
        className={`w-full h-full object-cover transition-all duration-300 ${
          shouldBlur ? 'filter blur-xl scale-110' : ''
        } ${!isLoaded ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
      />

      {/* Watermark */}
      {showWatermark && isLoaded && !shouldBlur && (
        <MediaWatermark creatorHandle={media.creatorHandle} />
      )}

      {/* Access Control Overlay */}
      {!canAccess && (
        <AccessControlOverlay
          accessLevel={media.accessLevel}
          creatorHandle={media.creatorHandle}
          ppvAmount={media.ppvAmount}
          isBlurred={shouldBlur}
          onSubscribe={() => handleAccessAction('subscription')}
          onPurchase={() => handleAccessAction('purchase')}
          onUnlock={() => handleAccessAction('login')}
        />
      )}
    </div>
  );
};
