
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LiveSession, MediaSource } from "@/types/surveillance";

interface MediaPreviewDialogProps {
  session: LiveSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type MediaType = 'image' | 'video' | 'audio' | 'text';

export function MediaPreviewDialog({ session, open, onOpenChange }: MediaPreviewDialogProps) {
  const [media, setMedia] = useState<MediaSource | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session && open) {
      setIsLoading(true);
      setError(null);
      
      try {
        // Determine media type
        // Handle media_url as either string or string[]
        const mediaUrlArray = session.media_url 
          ? Array.isArray(session.media_url) 
            ? session.media_url 
            : [session.media_url] 
          : [];
          
        let mediaUrl = mediaUrlArray.length > 0 ? mediaUrlArray[0] : null;
        const videoUrl = session.video_url || null;
        
        if (!mediaUrl && !videoUrl) {
          setError("No media available for preview");
          setIsLoading(false);
          return;
        }
        
        // Determine media type from URL or content_type
        let detectedType: MediaType = 'image';
        
        if (session.content_type) {
          if (session.content_type.includes('video')) detectedType = 'video';
          else if (session.content_type.includes('audio')) detectedType = 'audio';
          else if (session.content_type.includes('image')) detectedType = 'image';
          else detectedType = 'text';
        } else {
          // Try to determine from URL
          const url = mediaUrl || videoUrl;
          if (url) {
            if (url.match(/\.(mp4|mov|avi|wmv|flv|webm)$/i)) detectedType = 'video';
            else if (url.match(/\.(mp3|wav|ogg|m4a)$/i)) detectedType = 'audio';
            else if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) detectedType = 'image';
            else detectedType = 'text';
          }
        }
        
        setMediaType(detectedType);
        
        // Create media source object
        const mediaSource: MediaSource = {
          url: videoUrl || mediaUrl,
          type: detectedType,
          content_type: session.content_type
        };
        
        setMedia(mediaSource);
      } catch (err) {
        console.error("Error processing media:", err);
        setError("Failed to process media for preview");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Reset state when dialog is closed
      setMedia(null);
      setError(null);
    }
  }, [session, open]);

  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Media Preview - Session {session.id.substring(0, 8)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => onOpenChange(false)}>Close</Button>
            </div>
          ) : media ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Media Preview */}
              <div className="flex-1 flex items-center justify-center bg-black/50 rounded-md overflow-hidden">
                {mediaType === 'image' && media.url && (
                  <img 
                    src={media.url} 
                    alt="Media preview" 
                    className="max-h-full max-w-full object-contain"
                    onError={() => setError("Failed to load image")}
                  />
                )}
                
                {mediaType === 'video' && media.url && (
                  <video 
                    src={media.url} 
                    controls 
                    autoPlay 
                    className="max-h-full max-w-full"
                    onError={() => setError("Failed to load video")}
                  />
                )}
                
                {mediaType === 'audio' && media.url && (
                  <audio 
                    src={media.url} 
                    controls 
                    className="w-full" 
                    onError={() => setError("Failed to load audio")}
                  />
                )}
                
                {mediaType === 'text' && (
                  <div className="p-4 overflow-auto w-full h-full bg-muted/20">
                    <pre className="whitespace-pre-wrap">{session.content || "No content available"}</pre>
                  </div>
                )}
              </div>
              
              {/* Media Information */}
              <div className="mt-4 bg-muted/20 p-4 rounded-md overflow-auto max-h-40">
                <h3 className="text-lg font-semibold mb-2">Media Information</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p><strong>Type:</strong> {mediaType}</p>
                    <p><strong>Content Type:</strong> {media.content_type || 'Unknown'}</p>
                    <p><strong>URL:</strong> {media.url ? `${media.url.substring(0, 40)}...` : 'None'}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>No media available</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
