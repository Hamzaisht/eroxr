import { useState, useEffect } from "react";

interface VideoPreviewProps {
  videoUrl: string;
  className?: string;
}

export const VideoPreview = ({ videoUrl, className }: VideoPreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.onloadeddata = () => {
      setIsLoading(false);
    };
  }, [videoUrl]);

  return (
    <video
      src={videoUrl}
      className={className}
      preload="metadata"
      playsInline
      muted
      poster={`${videoUrl}?x-oss-process=video/snapshot,t_1000,m_fast`}
    />
  );
};