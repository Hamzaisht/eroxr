
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MediaContent } from "./MediaContent";
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

export interface MediaViewerProps {
  media: string | null;
  onClose: () => void;
  creatorId?: string;
}

export const MediaViewer = ({ media, onClose, creatorId }: MediaViewerProps) => {
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
          supabase.from('security_violations').insert({
            violator_id: session.user.id,
            content_owner_id: creatorId,
            violation_type: 'screenshot'
          });
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

  const isVideo = media.match(/\.(mp4|webm|ogg)$/i);

  const handleMediaClick = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <Dialog open={!!media} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-transparent border-none">
        <MediaContent 
          url={media} 
          isVideo={!!isVideo} 
          creatorId={creatorId}
          username={username}
          onClose={onClose}
          onMediaClick={handleMediaClick}
        />
      </DialogContent>
    </Dialog>
  );
};
