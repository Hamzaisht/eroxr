
import React, { useState, useEffect, forwardRef } from 'react';
import { determineMediaType, extractMediaUrl, getPlayableMediaUrl } from '@/utils/mediaUtils';
import { MediaSource, MediaOptions, MediaType } from '@/utils/media/types';

export interface MediaProps extends MediaOptions {
  source: MediaSource | string;
}

export const Media = forwardRef<HTMLVideoElement | HTMLImageElement, MediaProps>((props, ref) => {
  const { 
    source, 
    className = "",
    autoPlay = false,
    controls = true,
    muted = true,
    loop = false,
    poster,
    onClick,
    onLoad,
    onError,
    onEnded,
    onTimeUpdate
  } = props;

  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [mediaType, setMediaType] = useState<MediaType>("unknown");
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Process media source into a playable URL and determine its type
  useEffect(() => {
    try {
      // Extract the base URL from the source
      const rawUrl = extractMediaUrl(source);
      
      // Process the URL to make it playable
      const processedUrl = getPlayableMediaUrl(rawUrl);
      
      // Determine the media type
      const type = determineMediaType(source);
      
      console.log(`Media component processing: ${rawUrl} -> ${processedUrl} (type: ${type})`);
      
      setMediaUrl(processedUrl);
      setMediaType(type);
      setError(null);
    } catch (err: any) {
      console.error("Error processing media source:", err);
      setError(err.message || "Failed to process media source");
      if (onError) onError();
    }
  }, [source]);

  const handleMediaLoad = () => {
    setHasLoaded(true);
    if (onLoad) onLoad();
  };

  const handleMediaError = (e: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement, Event>) => {
    console.error(`Media load error for: ${mediaUrl}`, e);
    setError(`Failed to load media: ${mediaUrl}`);
    if (onError) onError();
  };

  // Render the appropriate media element based on the type
  if (mediaType === 'image') {
    return (
      <img
        ref={ref as React.ForwardedRef<HTMLImageElement>}
        src={mediaUrl}
        className={className}
        onClick={onClick}
        onLoad={handleMediaLoad}
        onError={handleMediaError}
        alt="Media content"
      />
    );
  } else if (mediaType === 'video') {
    return (
      <video
        ref={ref as React.ForwardedRef<HTMLVideoElement>}
        src={mediaUrl}
        className={className}
        autoPlay={autoPlay}
        controls={controls}
        muted={muted}
        loop={loop}
        poster={poster}
        onClick={onClick}
        onLoadedData={handleMediaLoad}
        onError={handleMediaError}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
        playsInline
      />
    );
  } else if (mediaType === 'audio') {
    return (
      <audio
        src={mediaUrl}
        className={className}
        autoPlay={autoPlay}
        controls={controls}
        muted={muted}
        loop={loop}
        onLoadedData={handleMediaLoad}
        onError={handleMediaError}
        onEnded={onEnded}
      />
    );
  }

  // Fallback for unknown media type or loading state
  return (
    <div 
      className={`${className} flex items-center justify-center bg-luxury-darker/40 rounded text-luxury-neutral`}
      onClick={onClick}
    >
      {error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : (
        <p className="text-sm">Loading media...</p>
      )}
    </div>
  );
});

Media.displayName = "Media";
