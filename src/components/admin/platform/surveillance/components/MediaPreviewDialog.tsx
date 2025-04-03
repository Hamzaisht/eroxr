
import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { LiveSession, SurveillanceContentItem } from "../types";
import { AudioPlayer } from "./AudioPlayer";
import { useModerationActions } from "@/hooks/useModerationActions";

interface MediaPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: LiveSession | null;
}

export function MediaPreviewDialog({ open, onOpenChange, session }: MediaPreviewDialogProps) {
  const { handleModeration } = useModerationActions();
  const [userInteractions, setUserInteractions] = useState({
    views: [],
    likes: [],
    comments: [],
    shares: []
  });
  
  // Mock implementation of fetchContentInteractions
  const fetchContentInteractions = useCallback(async (id: string, type: string) => {
    console.log(`Fetching interactions for ${type} content with ID ${id}`);
    // Mock data - in a real implementation, this would fetch from an API
    setUserInteractions({
      views: [],
      likes: [],
      comments: [],
      shares: []
    });
  }, []);
  
  useEffect(() => {
    if (session && open) {
      fetchContentInteractions(session.id, session.type);
    }
  }, [session, open, fetchContentInteractions]);
  
  if (!session) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Media Preview</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Video Content */}
          {session.video_url && (
            <div className="w-full aspect-video overflow-hidden rounded-lg bg-black">
              <video 
                src={session.video_url} 
                controls 
                className="w-full h-full object-contain"
              />
            </div>
          )}
          
          {/* Image Gallery */}
          {session.media_url && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Array.isArray(session.media_url) ? session.media_url.map((url, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg">
                  <img 
                    src={url} 
                    alt={`Media ${index + 1}`}
                    className="w-full h-full object-cover" 
                  />
                </div>
              )) : (
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img 
                    src={session.media_url} 
                    alt="Media"
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
            </div>
          )}
          
          {/* Audio Content */}
          {session.type === 'audio' && (
            <AudioPlayer url={session.media_url as string} title={session.title || 'Audio'} />
          )}
          
          {/* Content Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Content Info</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Created:</span> {format(new Date(session.created_at || session.started_at || ''), 'PPpp')}
                </p>
                
                <p className="text-sm">
                  <span className="font-medium">Last Updated:</span> {session.started_at ? format(new Date(session.started_at), 'PPpp') : 'N/A'}
                </p>
                
                {session.location && (
                  <p className="text-sm">
                    <span className="font-medium">Location:</span> {session.location}
                  </p>
                )}
                
                {session.tags && session.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-sm font-medium mr-1">Tags:</span>
                    {session.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Status</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Type:</span> {session.content_type || session.type}
                </p>
                
                <p className="text-sm">
                  <span className="font-medium">Status:</span> <Badge>{session.status || 'active'}</Badge>
                </p>
                
                {session.metadata && (
                  <div className="space-y-1">
                    {session.metadata.visibility && (
                      <p className="text-sm">
                        <span className="font-medium">Visibility:</span> {session.metadata.visibility}
                      </p>
                    )}
                    
                    {session.metadata.view_count && (
                      <p className="text-sm">
                        <span className="font-medium">Views:</span> {session.metadata.view_count}
                      </p>
                    )}
                    
                    {session.metadata.like_count && (
                      <p className="text-sm">
                        <span className="font-medium">Likes:</span> {session.metadata.like_count}
                      </p>
                    )}
                    
                    {session.metadata.comment_count && (
                      <p className="text-sm">
                        <span className="font-medium">Comments:</span> {session.metadata.comment_count || 0}
                      </p>
                    )}
                    
                    {session.metadata.duration && (
                      <p className="text-sm">
                        <span className="font-medium">Duration:</span> {session.metadata.duration} seconds
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Content Description */}
          {(session.about_me || session.description) && (
            <div>
              <h3 className="text-sm font-medium mb-2">Description</h3>
              <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded">
                {session.about_me || session.description || 'No description provided.'}
              </p>
            </div>
          )}
          
          {/* User Interactions */}
          <div>
            <h3 className="text-sm font-medium mb-2">User Interactions</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-muted p-3 rounded text-center">
                <div className="text-xl font-semibold">{userInteractions.views.length}</div>
                <div className="text-xs text-muted-foreground">Views</div>
              </div>
              <div className="bg-muted p-3 rounded text-center">
                <div className="text-xl font-semibold">{userInteractions.likes.length}</div>
                <div className="text-xs text-muted-foreground">Likes</div>
              </div>
              <div className="bg-muted p-3 rounded text-center">
                <div className="text-xl font-semibold">{userInteractions.comments.length}</div>
                <div className="text-xs text-muted-foreground">Comments</div>
              </div>
              <div className="bg-muted p-3 rounded text-center">
                <div className="text-xl font-semibold">{userInteractions.shares.length}</div>
                <div className="text-xs text-muted-foreground">Shares</div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          
          <Button
            variant="destructive"
            onClick={() => {
              handleModeration(session, 'delete');
              onOpenChange(false);
            }}
          >
            Delete
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => {
              handleModeration(session, 'flag');
              onOpenChange(false);
            }}
          >
            Flag Content
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
