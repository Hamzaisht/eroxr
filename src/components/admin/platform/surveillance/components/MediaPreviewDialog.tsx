
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LiveSession } from "../types";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalMedia } from "@/components/media/UniversalMedia";
import { MediaType } from "@/utils/media/types";

interface MediaPreviewDialogProps {
  session: LiveSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MediaPreviewDialog = ({
  session,
  open,
  onOpenChange,
}: MediaPreviewDialogProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!session) return null;

  const mediaUrls = Array.isArray(session.media_url)
    ? session.media_url
    : session.media_url
    ? [session.media_url]
    : [];

  const hasMultipleMedia = mediaUrls.length > 1;

  const handleNext = () => {
    if (currentIndex < mediaUrls.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Get current media URL
  const currentMedia = mediaUrls[currentIndex] || "";

  // Check if it's a video call or has a video property
  const videoUrl = (session as any).video_url;
  
  // Determine the media type
  const determineMediaType = () => {
    if (session.type === "call" || videoUrl) {
      return MediaType.VIDEO;
    }
    if (session.content_type === "audio") {
      return MediaType.AUDIO;
    }
    if (session.content_type === "video") {
      return MediaType.VIDEO;
    }
    return MediaType.IMAGE;
  };
  
  const mediaItem = {
    video_url: videoUrl || (session.type === "call" ? currentMedia : null),
    media_url: session.type !== "call" ? currentMedia : null,
    content_type: session.content_type,
    media_type: determineMediaType()
  };

  const renderMediaPreview = () => {
    // Check if it's a call or has a video
    if (session.type === "call" || videoUrl) {
      return (
        <UniversalMedia
          item={mediaItem}
          className="w-full rounded-md max-h-[70vh] object-contain"
          autoPlay={true}
          controls={true}
        />
      );
    }

    // Otherwise handle regular media
    if (currentMedia) {
      return (
        <UniversalMedia
          item={mediaItem}
          className="w-full rounded-md max-h-[70vh] object-contain"
          autoPlay={mediaItem.media_type === MediaType.VIDEO}
          controls={mediaItem.media_type === MediaType.VIDEO}
        />
      );
    }

    return (
      <div className="flex items-center justify-center h-64 bg-gray-900 rounded-md">
        <p className="text-gray-400">No media available</p>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>
            {session.content_type === "audio" ? "Audio Preview" : "Media Preview"}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="relative">
          {renderMediaPreview()}

          {hasMultipleMedia && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {mediaUrls.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentIndex
                      ? "bg-white"
                      : "bg-white/50"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        {hasMultipleMedia && (
          <div className="flex justify-between mt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleNext}
              disabled={currentIndex === mediaUrls.length - 1}
            >
              Next
            </Button>
          </div>
        )}

        <div className="text-sm text-gray-400 mt-2">
          {session.username && (
            <p>
              <span className="font-medium text-gray-300">Username:</span>{" "}
              {session.username}
            </p>
          )}
          {session.content && (
            <p>
              <span className="font-medium text-gray-300">Content:</span>{" "}
              {session.content}
            </p>
          )}
          <p>
            <span className="font-medium text-gray-300">Type:</span>{" "}
            {session.content_type || session.type}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
