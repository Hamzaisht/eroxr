import { forwardRef, Ref } from 'react';

interface ImageProps {
  src: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
}

const Image = forwardRef<HTMLImageElement, ImageProps>(({
  src,
  alt = "Media content",
  className = '',
  onClick,
  onLoad,
  onError,
}, ref) => {
  const handleLoad = () => {
    if (onLoad) {
      onLoad();
    }
  };

  const handleError = () => {
    if (onError) {
      onError();
    }
  };

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={className}
      onClick={onClick}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
});

Image.displayName = 'Image';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
  showWatermark?: boolean;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({
  src,
  poster,
  autoPlay = false,
  controls = true,
  muted = true,
  loop = false,
  className = '',
  showWatermark = false,
  onClick,
  onLoad,
  onError,
  onEnded,
  onTimeUpdate,
}, ref) => {
  const handleLoad = () => {
    if (onLoad) {
      onLoad();
    }
  };

  const handleError = () => {
    if (onError) {
      onError();
    }
  };

  const handleEnded = () => {
    if (onEnded) {
      onEnded();
    }
  };

  // Handle time update event correctly
  const handleTimeUpdate = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    if (onTimeUpdate) {
      onTimeUpdate(event.currentTarget.currentTime);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        controls={controls}
        muted={muted}
        loop={loop}
        onLoadedData={handleLoad}
        onError={handleError}
        onEnded={handleEnded}
        onClick={onClick}
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-full"
        playsInline
      />
      {showWatermark && (
        <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-1.5 py-0.5 rounded">
          eroxr
        </div>
      )}
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

interface MediaProps {
  source: string | MediaSource | null | undefined;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  showWatermark?: boolean;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  ref?: Ref<HTMLVideoElement | HTMLImageElement>;
}

export const Media = forwardRef<HTMLVideoElement | HTMLImageElement, MediaProps>(({
  source,
  className = '',
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
}, ref) => {
  if (!source) {
    return null;
  }

  if (typeof source === 'string') {
    if (source.match(/\.(mp4|webm|ogg)$/i)) {
      return (
        <VideoPlayer
          ref={ref as Ref<HTMLVideoElement>}
          src={source}
          poster={poster}
          autoPlay={autoPlay}
          controls={controls}
          muted={muted}
          loop={loop}
          className={className}
          showWatermark={showWatermark}
          onClick={onClick}
          onLoad={onLoad}
          onError={onError}
          onEnded={onEnded}
          onTimeUpdate={onTimeUpdate}
        />
      );
    } else if (source.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return (
        <Image
          ref={ref as Ref<HTMLImageElement>}
          src={source}
          alt="Media content"
          className={className}
          onClick={onClick}
          onLoad={onLoad}
          onError={onError}
        />
      );
    } else {
      return <p>Unsupported media format</p>;
    }
  } else if (typeof source === 'object' && source !== null) {
    if (source.video_url) {
      return (
        <VideoPlayer
          ref={ref as Ref<HTMLVideoElement>}
          src={source.video_url}
          poster={poster || source.thumbnail_url}
          autoPlay={autoPlay}
          controls={controls}
          muted={muted}
          loop={loop}
          className={className}
          showWatermark={showWatermark}
          onClick={onClick}
          onLoad={onLoad}
          onError={onError}
          onEnded={onEnded}
          onTimeUpdate={onTimeUpdate}
        />
      );
    } else if (source.media_url) {
      return (
        <Image
          ref={ref as Ref<HTMLImageElement>}
          src={source.media_url}
          alt={source.description || "Media content"}
          className={className}
          onClick={onClick}
          onLoad={onLoad}
          onError={onError}
        />
      );
    } else {
      return <p>No media URL provided</p>;
    }
  } else {
    return <p>Invalid media source</p>;
  }
});

Media.displayName = 'Media';
