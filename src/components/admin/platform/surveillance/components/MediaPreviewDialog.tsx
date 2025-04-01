
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MediaPreviewDialogProps } from "../types";

export const MediaPreviewDialog = ({ session, onOpenChange, open }: MediaPreviewDialogProps) => {
  if (!session) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Content Preview - {session.type}</DialogTitle>
          <DialogDescription>
            {session.username}'s {session.type} content
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {session.type === 'stream' && (
            <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Stream preview would appear here</p>
              {/* In a real implementation, you would embed the stream here */}
            </div>
          )}
          
          {session.type === 'chat' && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Message Content:</h3>
              <div className="p-3 bg-gray-900 rounded-lg">
                {session.content ? (
                  <p className="text-gray-300">{session.content}</p>
                ) : (
                  <p className="text-gray-500 italic">No text content</p>
                )}
              </div>
              
              {session.media_url && session.media_url.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Media:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {session.media_url.map((url, index) => (
                      <img 
                        key={index}
                        src={url} 
                        alt={`Media ${index}`} 
                        className="w-full h-32 object-cover rounded-md"
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {session.video_url && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Video:</h3>
                  <div className="aspect-video bg-black rounded-lg">
                    <video 
                      src={session.video_url} 
                      controls
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          
          {session.type === 'bodycontact' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">About:</h3>
                <p className="text-gray-300 mt-1">{session.about_me || session.description || 'No description provided'}</p>
              </div>
              
              {session.tags && session.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium">Tags:</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {session.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium">Location:</h3>
                <p className="text-gray-300 mt-1">{session.location || 'Unknown location'}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
