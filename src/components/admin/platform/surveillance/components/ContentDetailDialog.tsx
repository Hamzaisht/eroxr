import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SurveillanceContentItem } from "../../types";
import { useCallback, useEffect, useState } from "react";
import { useModerationActions } from "../../hooks/useModerationActions";

interface ContentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: SurveillanceContentItem | null;
}

export function ContentDetailDialog({
  open,
  onOpenChange,
  session
}: ContentDetailDialogProps) {
  const contentId = session?.id || null;
  const { handleModeration } = useModerationActions();
  const [contentInteractions, setContentInteractions] = useState<{
    viewers: any[];
    likers: any[];
    buyers: any[];
  }>({
    viewers: [],
    likers: [],
    buyers: []
  });
  
  // Function to handle content interactions
  const fetchContentInteractions = useCallback(async (contentId: string, contentType: string) => {
    try {
      // Mock implementation - would be replaced with real fetch
      console.log(`Fetching interactions for ${contentType} with ID ${contentId}`);
      setContentInteractions({
        viewers: [],
        likers: [],
        buyers: []
      });
    } catch (error) {
      console.error("Error fetching content interactions:", error);
    }
  }, []);
  
  useEffect(() => {
    if (session && open && contentId) {
      fetchContentInteractions(contentId, session.type);
    }
  }, [session, open, contentId, fetchContentInteractions]);
  
  if (!session) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Content Details</DialogTitle>
          <DialogDescription>
            Detailed information about the selected content.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Creator</h3>
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.avatar_url || undefined} alt={session.username} />
                  <AvatarFallback>{session.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{session.username}</p>
                  <p className="text-xs text-gray-500">ID: {session.creator_id}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Content Info</h3>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Type:</span> {session.content_type}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Created:</span> {format(new Date(session.created_at), 'MMM d, yyyy h:mm a')}
                </p>
                {session.visibility && (
                  <p className="text-sm">
                    <span className="font-medium">Visibility:</span> {session.visibility}
                  </p>
                )}
                {session.status && (
                  <p className="text-sm">
                    <span className="font-medium">Status:</span> <Badge variant="secondary">{session.status}</Badge>
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Content details */}
          <div>
            <h3 className="text-sm font-medium mb-2">Content</h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Title:</span> {session.title}
              </p>
              <p className="text-sm">
                <span className="font-medium">Description:</span> {session.description}
              </p>
            </div>
          </div>
          
          {/* Media gallery */}
          {session.media_url && (
            <div className="grid grid-cols-2 gap-2 mt-4">
              {Array.isArray(session.media_url) ? (
                session.media_url.map((url, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-md">
                    <img 
                      src={url} 
                      alt={`Media ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="aspect-square overflow-hidden rounded-md">
                  <img 
                    src={session.media_url} 
                    alt="Media content" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          )}
          
          {/* Interactions (mock data for now) */}
          <div>
            <h3 className="text-sm font-medium mb-2">Interactions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium">Viewers</p>
                <p className="text-sm">{contentInteractions.viewers.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Likes</p>
                <p className="text-sm">{contentInteractions.likers.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Buyers</p>
                <p className="text-sm">{contentInteractions.buyers.length}</p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="submit">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Content
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
