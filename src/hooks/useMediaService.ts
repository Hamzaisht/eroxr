
import { useCallback } from "react";
import { MediaSource, MediaType } from "@/utils/media/types";
import { extractMediaUrl } from "@/utils/media/mediaUtils";

// Helper function to determine if a URL is a video
const isVideoUrl = (url: string): boolean => {
  if (!url) return false;
  const videoExtensions = ["mp4", "webm", "mov", "avi"];
  const extension = url.split(".").pop()?.toLowerCase();
  return videoExtensions.includes(extension || "");
};

export const useMediaService = () => {
  // Convert any media source to a standard format
  const normalizeMediaSource = useCallback((source: any): MediaSource => {
    if (!source) return {
      url: '',
      type: MediaType.UNKNOWN
    };

    // If it's already a string, assume it's a direct URL
    if (typeof source === "string") {
      return {
        url: source,
        type: isVideoUrl(source) ? MediaType.VIDEO : MediaType.IMAGE,
      };
    }

    // If it's a MediaSource-like object, normalize it
    const mediaSource: MediaSource = { ...source };

    // Ensure there's a single URL
    if (!mediaSource.url) {
      if (mediaSource.video_url) {
        mediaSource.url = mediaSource.video_url;
        mediaSource.type = MediaType.VIDEO;
      } else if (mediaSource.media_url) {
        mediaSource.url = mediaSource.media_url;
        mediaSource.type = isVideoUrl(mediaSource.media_url)
          ? MediaType.VIDEO
          : MediaType.IMAGE;
      }
    }

    // Ensure type is set
    if (!mediaSource.type) {
      mediaSource.type = mediaSource.url ? 
        (isVideoUrl(mediaSource.url) ? MediaType.VIDEO : MediaType.IMAGE) : 
        MediaType.UNKNOWN;
    }

    return mediaSource;
  }, []);

  // Get a public display URL for an internal media source
  const getPublicMediaUrl = useCallback((source: MediaSource | string): string | null => {
    const url = extractMediaUrl(source);
    return url;
  }, []);

  // Get a usable poster image for video content
  const getVideoPosterUrl = useCallback((source: MediaSource): string | null => {
    if (!source) return null;

    // If there's an explicit poster, use it
    if (source.poster) return source.poster;

    // If there's a thumbnail, use it
    if (source.thumbnail) return source.thumbnail;
    
    // For backward compatibility
    if (source.thumbnail_url) return source.thumbnail_url;

    return null;
  }, []);

  return {
    normalizeMediaSource,
    getPublicMediaUrl,
    getVideoPosterUrl,
    isVideoUrl,
  };
};
