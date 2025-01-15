interface VideoPreviewProps {
  videoUrl: string;
  previewUrl: string | null;
  className?: string;
}

export const VideoPreview = ({ videoUrl, previewUrl, className }: VideoPreviewProps) => {
  if (previewUrl) {
    return (
      <img 
        src={previewUrl} 
        alt="Video preview" 
        className={className}
      />
    );
  }

  return (
    <video
      src={videoUrl}
      className={className}
      preload="metadata"
      playsInline
      muted
    />
  );
};