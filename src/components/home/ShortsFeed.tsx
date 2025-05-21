
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ShortVideoPlayer } from "./components/ShortVideoPlayer";
import { LoadingState } from "@/components/ui/LoadingState";
import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaType } from "@/utils/media/types";
import { isValidMediaUrl } from "@/utils/media/mediaOrchestrator";

interface ShortsFeedProps {
  specificShortId: string | null;
}

// Debug helper to visualize the media source structure
const MediaDebug = ({ src }: { src: any }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!src) return (
    <div className="fixed top-4 right-4 bg-red-500/90 text-white p-2 rounded-md z-50">
      <AlertCircle className="h-4 w-4" />
      <span className="text-xs">No Media Source</span>
    </div>
  );
  
  // Extract the most important pieces of information
  const mediaInfo = {
    id: src.id,
    mediaType: src.mediaType,
    videoUrl: src.videoUrl,
    thumbnailUrl: src.thumbnailUrl,
    creator: src.creator ? { id: src.creator.id } : undefined,
    isValidUrl: isValidMediaUrl(src.videoUrl)
  };
  
  return (
    <div className="fixed top-4 right-4 bg-black/90 text-white p-2 rounded-md z-50 max-w-xs">
      <div className="flex items-center justify-between">
        <span className="font-bold text-xs">Media Debug</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-5 w-5 p-0 text-white" 
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      {expanded && (
        <pre className="text-xs mt-2 overflow-auto max-h-40">
          {JSON.stringify(mediaInfo, null, 2)}
        </pre>
      )}
    </div>
  );
};

export const ShortsFeed = ({ specificShortId }: ShortsFeedProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [shorts, setShorts] = useState<any[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  
  // Mock shorts data for demonstration (replace with actual data fetching)
  useEffect(() => {
    // Simulating data fetching
    setTimeout(() => {
      const mockShorts = [
        {
          id: "short1",
          videoUrl: "https://example.com/video1.mp4",
          thumbnailUrl: "https://example.com/thumb1.jpg",
          mediaType: MediaType.VIDEO,
          creator: { id: "creator1", name: "Creator One" }
        },
        {
          id: "short2",
          videoUrl: "https://example.com/video2.mp4", 
          thumbnailUrl: "https://example.com/thumb2.jpg",
          mediaType: MediaType.VIDEO,
          creator: { id: "creator2", name: "Creator Two" }
        }
      ];
      
      setShorts(mockShorts);
      setIsLoading(false);
      
      // If specificShortId is provided, find and set the current index
      if (specificShortId) {
        const index = mockShorts.findIndex(short => short.id === specificShortId);
        if (index !== -1) {
          setCurrentIndex(index);
        }
      }
    }, 1000);
  }, [specificShortId]);

  // Create a stable reference to the current short to prevent re-renders
  const currentShort = useMemo(() => {
    return shorts[currentIndex] || null;
  }, [shorts, currentIndex]);

  // Validate video URL
  const isValidVideo = currentShort && isValidMediaUrl(currentShort.videoUrl);

  const handleError = useCallback((index: number) => {
    console.error(`Error loading short at index ${index}`);
  }, []);

  const toggleDebug = useCallback(() => {
    setShowDebug(prev => !prev);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <LoadingState />
      </div>
    );
  }

  if (shorts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <AlertCircle className="h-12 w-12 mb-4" />
        <h2 className="text-2xl font-bold">No shorts available</h2>
        <p className="text-gray-400 mt-2">Check back later for new content</p>
      </div>
    );
  }

  return (
    <>
      {showDebug && currentShort && <MediaDebug src={currentShort} />}
      
      <Button 
        onClick={toggleDebug} 
        className="fixed top-4 left-4 z-50 bg-black/50 hover:bg-black/70"
        size="sm"
      >
        {showDebug ? "Hide Debug" : "Show Debug"}
      </Button>
      
      <div className="h-screen w-full bg-black">
        <div className="relative h-full w-full">
          {isValidVideo ? (
            <ShortVideoPlayer
              videoUrl={currentShort.videoUrl}
              thumbnailUrl={currentShort.thumbnailUrl}
              creatorId={currentShort.creator?.id}
              isCurrentVideo={true}
              onError={() => handleError(currentIndex)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full bg-black text-white">
              <AlertCircle className="h-12 w-12 mb-4 text-red-500" />
              <h2 className="text-xl font-bold">Video unavailable</h2>
              <p className="text-gray-400 mt-2">This video cannot be played</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
