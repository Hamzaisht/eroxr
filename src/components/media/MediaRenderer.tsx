
import React, { useState, useEffect, forwardRef } from 'react';
import { MediaSource, MediaType, MediaAccessLevel } from '@/utils/media/types';
import { isImageType, isVideoType, isAudioType } from '@/utils/media/mediaTypeUtils';
import { extractMediaUrl } from '@/utils/media/mediaUtils';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { validateMediaUrl } from '@/utils/media/mediaOrchestrator';
import { useMediaAccess } from '@/hooks/useMediaAccess';
import { LockedMediaOverlay } from './LockedMediaOverlay';
import { supabase } from '@/integrations/supabase/client';

interface MediaRendererProps {
  src: MediaSource;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  showWatermark?: boolean;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: (error?: any) => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  allowRetry?: boolean;
  maxRetries?: number;
}

export const MediaRenderer = forwardRef<
  HTMLVideoElement | HTMLImageElement,
  MediaRendererProps
>(({
  src,
  className = "",
  autoPlay = false,
  controls = true,
  muted = true,
  loop = false,
  poster,
  showWatermark = false,
  onClick,
  onLoad,
  onError,
  onEnded,
  onTimeUpdate,
  allowRetry = true,
  maxRetries = 2
}, ref) => {
  const [hasError, setHasError] = useState(false);
  const [retries, setRetries] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [forceRender, setForceRender] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  
  // Extract the URL from the source
  const initialUrl = extractMediaUrl(src);
  const mediaType = src.type || MediaType.UNKNOWN;
  const accessLevel = src.access_level || MediaAccessLevel.PUBLIC;
  const creatorId = src.creator_id;
  const postId = src.post_id;
  const storagePath = src.path || extractStoragePath(initialUrl);
  
  // Check if user has access to this media
  const { canAccess, isLoading: isAccessLoading, reason } = useMediaAccess({
    creatorId,
    postId,
    accessLevel
  });
  
  // Extract storage path from URL
  function extractStoragePath(url: string): string | undefined {
    if (!url) return undefined;
    
    const match = url.match(/\/storage\/v1\/object\/public\/([^?]+)/);
    return match ? match[1] : undefined;
  }
  
  // Function to refresh signed URL for restricted content
  const refreshSignedUrl = async () => {
    if (!storagePath || accessLevel === MediaAccessLevel.PUBLIC) return initialUrl;
    
    try {
      const { data, error } = await supabase.storage
        .from("media")
        .createSignedUrl(storagePath, 60 * 10); // 10 minutes expiration
        
      if (error || !data?.signedUrl) {
        console.error("Error refreshing signed URL:", error);
        return initialUrl;
      }
      
      return data.signedUrl;
    } catch (err) {
      console.error("Failed to refresh signed URL:", err);
      return initialUrl;
    }
  };
  
  // Handle unlock action
  const handleUnlock = () => {
    setForceRender(prev => !prev);
  };
  
  // Refresh URL when access changes or forced refresh
  useEffect(() => {
    const loadMediaUrl = async () => {
      if (canAccess && accessLevel !== MediaAccessLevel.PUBLIC && storagePath) {
        const freshUrl = await refreshSignedUrl();
        setMediaUrl(freshUrl);
      } else {
        setMediaUrl(initialUrl);
      }
    };
    
    loadMediaUrl();
  }, [canAccess, forceRender, accessLevel, storagePath]);
  
  // Check for valid URL early to avoid unnecessary rendering
  const url = mediaUrl || initialUrl;
  if (!validateMediaUrl(url)) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-4 bg-black/10 text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <p className="text-sm text-gray-200">Invalid media URL</p>
      </div>
    );
  }
  
  // Show locked content overlay if user doesn't have access
  if (!canAccess && !isAccessLoading && accessLevel !== MediaAccessLevel.PUBLIC) {
    return (
      <div className="relative w-full h-full">
        <LockedMediaOverlay
          accessLevel={accessLevel}
          creatorId={creatorId || ''}
          postId={postId}
          thumbnailUrl={poster}
          onUnlock={handleUnlock}
        />
      </div>
    );
  }
  
  // Reset error state on src change
  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
    setRetries(0);
  }, [url, forceRender]);
  
  // Handle load event
  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };
  
  // Handle error event
  const handleError = (error: any) => {
    console.error(`Media loading error for ${url}:`, error);
    setHasError(true);
    setIsLoading(false);
    
    if (retries < maxRetries && allowRetry) {
      const nextRetryCount = retries + 1;
      setRetries(nextRetryCount);
      console.log(`Retry ${nextRetryCount}/${maxRetries} for ${url}`);
      
      // If error is due to expired signed URL, refresh it
      if (accessLevel !== MediaAccessLevel.PUBLIC && storagePath) {
        refreshSignedUrl().then(freshUrl => {
          if (freshUrl !== url) {
            setMediaUrl(freshUrl);
          }
        });
      }
      
      // Attempt to reload after a delay
      setTimeout(() => {
        setHasError(false);
        setIsLoading(true);
      }, 1000);
    }
    
    if (onError) onError(error);
  };
  
  // Handle time update for video
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (onTimeUpdate) {
      const video = e.currentTarget;
      onTimeUpdate(video.currentTime, video.duration);
    }
  };

  // Retry media loading
  const handleRetry = async () => {
    setHasError(false);
    setIsLoading(true);
    
    // Refresh URL on manual retry
    if (accessLevel !== MediaAccessLevel.PUBLIC && storagePath) {
      const freshUrl = await refreshSignedUrl();
      setMediaUrl(freshUrl);
    }
    
    setRetries(prev => prev + 1);
  };
  
  // Loading display while checking access or loading media
  if (isAccessLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-black/10">
        <div className="w-6 h-6 border-2 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }
  
  // Error display component
  const ErrorDisplay = () => (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 bg-black/10 text-center">
      <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
      <p className="text-sm text-gray-200 mb-3">Failed to load media</p>
      {allowRetry && retries < maxRetries && (
        <button 
          onClick={handleRetry}
          className="flex items-center gap-1 px-3 py-1.5 bg-primary/90 hover:bg-primary text-white rounded-md text-sm"
        >
          <RefreshCw className="h-3 w-3" /> 
          Retry
        </button>
      )}
    </div>
  );
  
  // Loading display
  const LoadingDisplay = () => (
    <div className="flex items-center justify-center h-full w-full bg-black/10">
      <div className="w-6 h-6 border-2 border-t-primary rounded-full animate-spin" />
    </div>
  );

  // Render based on media type
  if (isImageType(mediaType)) {
    return (
      <div className="relative w-full h-full">
        {isLoading && <LoadingDisplay />}
        
        {hasError ? (
          <ErrorDisplay />
        ) : (
          <img
            src={url}
            className={className}
            onClick={onClick}
            onLoad={handleLoad}
            onError={(e) => handleError(e)}
            ref={ref as React.Ref<HTMLImageElement>}
            alt=""
          />
        )}
      </div>
    );
  } else if (isVideoType(mediaType)) {
    return (
      <div className="relative w-full h-full">
        {isLoading && <LoadingDisplay />}
        
        {hasError ? (
          <ErrorDisplay />
        ) : (
          <video
            src={url}
            className={className}
            autoPlay={autoPlay}
            controls={controls}
            muted={muted}
            loop={loop}
            poster={poster}
            onClick={onClick}
            onLoadedData={handleLoad}
            onError={(e) => handleError(e)}
            onEnded={onEnded}
            onTimeUpdate={handleTimeUpdate}
            ref={ref as React.Ref<HTMLVideoElement>}
            playsInline
          />
        )}
      </div>
    );
  } else if (isAudioType(mediaType)) {
    return (
      <div className="relative w-full">
        {isLoading && <LoadingDisplay />}
        
        {hasError ? (
          <ErrorDisplay />
        ) : (
          <audio
            src={url}
            className={className}
            autoPlay={autoPlay}
            controls={controls}
            muted={muted}
            loop={loop}
            onLoadedData={handleLoad}
            onError={(e) => handleError(e)}
            onEnded={onEnded}
          />
        )}
      </div>
    );
  }
  
  // Unknown media type
  return (
    <div className="flex items-center justify-center h-full w-full bg-black/10 text-sm text-gray-400">
      Unsupported media type
    </div>
  );
});

MediaRenderer.displayName = 'MediaRenderer';
