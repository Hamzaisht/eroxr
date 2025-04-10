
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MediaContent } from "./MediaContent";
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { initializeScreenshotProtection, reportSecurityViolation } from "@/lib/security";
import { getPlayableMediaUrl, addCacheBuster } from "@/utils/media/getPlayableMediaUrl";

export interface MediaViewerProps {
  media: string | null;
  onClose: () => void;
  creatorId?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  hasMultipleItems?: boolean;
}

export const MediaViewer = ({ 
  media, 
  onClose, 
  creatorId,
  onNext,
  onPrevious,
  hasMultipleItems = false
}: MediaViewerProps) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [username, setUsername] = useState<string>("");
  const session = useSession();

  useEffect(() => {
    // Fetch username for watermark
    if (creatorId) {
      supabase
        .from('profiles')
        .select('username')
        .eq('id', creatorId)
        .single()
        .then(({ data }) => {
          if (data?.username) {
            setUsername(data.username);
          }
        });
    }
  }, [creatorId]);

  useEffect(() => {
    // Apply all security protections
    if (session?.user?.id && creatorId) {
      initializeScreenshotProtection(session.user.id, creatorId);
    }

    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Add anti-screenshot detection
    const detectScreenCapture = () => {
      if (document.visibilityState === 'hidden') {
        console.log('Possible screenshot taken');
        // Log the screenshot attempt
        if (session?.user?.id && creatorId) {
          reportSecurityViolation(session.user.id, creatorId, 'screenshot_attempt');
        }
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('visibilitychange', detectScreenCapture);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('visibilitychange', detectScreenCapture);
    };
  }, [creatorId, session]);

  if (!media) return null;

  // Use our utility to get a playable URL
  const mediaItem = { media_url: media };
  const displayUrl = addCacheBuster(getPlayableMediaUrl(mediaItem));
  
  if (!displayUrl) return null;
  
  const isVideo = displayUrl.match(/\.(mp4|webm|ogg)$/i);

  const handleMediaClick = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <Dialog open={!!media} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-transparent border-none">
        <MediaContent 
          url={displayUrl} 
          isVideo={!!isVideo} 
          creatorId={creatorId}
          username={username}
          onClose={onClose}
          onMediaClick={handleMediaClick}
          onNext={onNext}
          onPrevious={onPrevious}
          showControls={hasMultipleItems}
        />
      </DialogContent>
    </Dialog>
  );
};
